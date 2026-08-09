import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";
import FileDropzone from "../components/FileDropzone";
import PdfCanvasEditor from "../components/PdfCanvasEditor";
import FilePreviewModal from "../components/FilePreviewModal";
import { showToast } from "../components/Toast";
import {
  Trash2,
  Download,
  Scissors,
  Merge,
  FileText,
  RefreshCw,
  Server,
  Cpu,
} from "lucide-react";
import {
  usePdfAnnotateMutation,
  usePdfInfoMutation,
  usePdfMergeMutation,
  usePdfSplitMutation,
  usePdfToDocxMutation,
  usePdfToHtmlMutation,
  useHtmlToPdfMutation,
} from "../store/apiSlice";

const TOOLS = [
  {
    id: 0,
    action: "edit",
    title: "Edit PDF",
    desc: "Extract & edit text",
    icon: "📝",
    color: "#FF6B9D",
  },
  {
    id: 1,
    action: "merge",
    title: "Merge PDFs",
    desc: "Combine multiple files",
    icon: "🔗",
    color: "#8B5CF6",
  },
  {
    id: 2,
    action: "split",
    title: "Split PDF",
    desc: "Separate pages",
    icon: "✂️",
    color: "#00D9FF",
  },
  {
    id: 3,
    action: "convert",
    title: "Convert PDF",
    desc: "To Word or Docs",
    icon: "🔄",
    color: "#00FFB3",
  },
];

function formatBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

export default function PdfTools() {
  const location = useLocation();
  const { action } = useParams();
  const navigate = useNavigate();

  const activeTool = action
    ? (TOOLS.find((t) => t.action === action)?.id ?? null)
    : null;

  const [files, setFiles] = useState([]);
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [splitPage, setSplitPage] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [useServer, setUseServer] = useState(true);
  const [pageInfo, setPageInfo] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const [pdfInfoReq] = usePdfInfoMutation();
  const [pdfMerge, { isLoading: isMerging }] = usePdfMergeMutation();
  const [pdfSplit, { isLoading: isSplitting }] = usePdfSplitMutation();
  const [pdfToDocx, { isLoading: isConvertingToDocx }] = usePdfToDocxMutation();
  const [pdfToHtml] = usePdfToHtmlMutation();
  const [htmlToPdf, { isLoading: isConvertingToPdf }] = useHtmlToPdfMutation();

  const [isExtracting, setIsExtracting] = useState(false);
  const processing = isMerging || isSplitting || isConvertingToPdf;
  const toolColor = "#FF6B9D";

  useEffect(() => {
    if (location.state?.importedFile) {
      const file = location.state.importedFile;
      setFiles([file]);
      navigate("/pdf/edit");

      const fd = new FormData();
      fd.append("file", file);
      pdfInfoReq(fd)
        .unwrap()
        .then((info) => setPageInfo({ page_count: info.pages }))
        .catch(() => setPageInfo(null));

      pdfToHtml(fd)
        .unwrap()
        .then((html) => {
          setHtmlContent(html);
        })
        .catch(() => showToast("Could not extract layout from PDF", "error"));

      window.history.replaceState({}, document.title);
    }
  }, [location.state, pdfInfoReq, pdfToHtml]);

  const loadPdfForEditing = async (f) => {
    setFiles([f]);
    const fd = new FormData();
    fd.append("file", f);
    pdfInfoReq(fd)
      .unwrap()
      .then((info) => setPageInfo({ page_count: info.pages }))
      .catch(() => {});
  };

  const handleSavePdf = async () => {
    if (!htmlContent) return showToast("Nothing to save", "error");
    try {
      const fd = new FormData();
      fd.append("html", htmlContent);
      const blob = await htmlToPdf(fd).unwrap();
      setPreviewFile({
        blob,
        filename: `edited_${files[0]?.name || "document"}.pdf`,
      });
      showToast("PDF ready for preview!", "success");
    } catch (e) {
      showToast(`Save failed: ${e.message}`, "error");
    }
  };

  /* ── MERGE ── */
  const handleMerge = async () => {
    if (mergeFiles.length < 2) return showToast("Add at least 2 PDFs", "error");
    try {
      if (useServer) {
        const fd = new FormData();
        mergeFiles.forEach((f) => fd.append("files", f));
        const blob = await pdfMerge(fd).unwrap();
        setPreviewFile({ blob, filename: "merged_apnipdfs.pdf" });
        showToast("PDFs merged via server!", "success");
      } else {
        const { PDFDocument } = await import("pdf-lib");
        const merged = await PDFDocument.create();
        for (const f of mergeFiles) {
          const bytes = await f.arrayBuffer();
          const src = await PDFDocument.load(bytes);
          const copied = await merged.copyPages(src, src.getPageIndices());
          copied.forEach((p) => merged.addPage(p));
        }
        const out = await merged.save();
        setPreviewFile({
          blob: new Blob([out], { type: "application/pdf" }),
          filename: "merged_apnipdfs.pdf",
        });
        showToast("PDFs merged (client-side)!", "success");
      }
    } catch (e) {
      showToast(`Merge failed: ${e.message || "Server error"}`, "error");
    }
  };

  /* ── SPLIT ── */
  const handleSplit = async () => {
    if (!splitFile) return showToast("Upload a PDF to split", "error");
    try {
      if (useServer) {
        const fd = new FormData();
        fd.append("file", splitFile);
        if (splitPage) fd.append("pages", splitPage);
        const blob = await pdfSplit(fd).unwrap();
        setPreviewFile({ blob, filename: `split_${splitFile.name}.zip` });
        showToast("PDF split via server!", "success");
      } else {
        const { PDFDocument } = await import("pdf-lib");
        const bytes = await splitFile.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const total = src.getPageCount();
        const pageNums = splitPage
          ? splitPage
              .split(",")
              .map((p) => parseInt(p.trim()) - 1)
              .filter((n) => n >= 0 && n < total)
          : src.getPageIndices();
        for (const idx of pageNums) {
          const single = await PDFDocument.create();
          const [pg] = await single.copyPages(src, [idx]);
          single.addPage(pg);
          const out = await single.save();
          saveAs(
            new Blob([out], { type: "application/pdf" }),
            `page_${idx + 1}.pdf`,
          );
        }
        showToast(`Split into ${pageNums.length} page(s)!`, "success");
      }
    } catch (e) {
      showToast(`Split failed: ${e.message || "Server error"}`, "error");
    }
  };

  const ServerToggle = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        background: useServer
          ? "rgba(108,99,255,0.1)"
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${useServer ? "rgba(108,99,255,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 10,
        marginBottom: 20,
        cursor: "pointer",
      }}
      onClick={() => setUseServer((u) => !u)}
    >
      {useServer ? (
        <Server size={15} color="#8B84FF" />
      ) : (
        <Cpu size={15} color="rgba(240,240,255,0.4)" />
      )}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: useServer ? "#8B84FF" : "rgba(240,240,255,0.4)",
        }}
      >
        {useServer
          ? "🟢 Using FastAPI Server"
          : "🔵 Using Client-Side (offline)"}
      </span>
      <span
        style={{
          marginLeft: "auto",
          fontSize: 11,
          color: "rgba(240,240,255,0.4)",
        }}
      >
        click to toggle
      </span>
    </div>
  );

  return (
    <div className="page-body">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 40 }}>
              {activeTool !== null ? TOOLS[activeTool].icon : "📄"}
            </span>
            <div>
              <h1
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                {activeTool !== null ? TOOLS[activeTool].title : "PDF Tools"}
              </h1>
              <p style={{ color: "rgba(240,240,255,0.5)", fontSize: 15 }}>
                {activeTool !== null
                  ? TOOLS[activeTool].desc
                  : "Edit, Merge, Split & Convert your PDFs"}
              </p>
            </div>
          </div>
          <div
            className="badge"
            style={{
              background: "white",
              color: "red",
              border: "1px solid red",
            }}
          >
            PDF Suite
          </div>
        </div>

        {activeTool === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
            {TOOLS.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate("/pdf/" + tool.action)}
                className="bg-white/5 border rounded-2xl p-6 cursor-pointer flex flex-col gap-3 relative overflow-hidden transition-colors hover:border-white/20"
                style={{ borderColor: `${tool.color}30` }}
              >
                <div className="absolute -top-5 -right-5 text-[80px] opacity-5 pointer-events-none">
                  {tool.icon}
                </div>
                <div className="text-3xl">{tool.icon}</div>
                <div>
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: tool.color }}
                  >
                    {tool.title}
                  </h3>
                  <p className="text-[13px] text-white/50">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="section"
            style={{ marginTop: 24 }}
          >
            <button
              onClick={() => {
                navigate("/pdf");
                setFiles([]);
                setMergeFiles([]);
                setSplitFile(null);
                setHtmlContent("");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(240,240,255,0.6)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 20,
                fontSize: 14,
              }}
            >
              ← Back to Tools
            </button>

            {/* Tab: Edit */}
            {activeTool === 0 && (
              <div className="tool-content">
                {isExtracting ? (
                  <div
                    className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl border-white/20 bg-white/5"
                    style={{ minHeight: 200 }}
                  >
                    <RefreshCw
                      className="animate-spin mb-4"
                      size={32}
                      color={toolColor}
                    />
                    <p className="text-white/70">
                      Extracting PDF layout and text...
                    </p>
                  </div>
                ) : !files[0] ? (
                  <FileDropzone
                    onFiles={(f) => loadPdfForEditing(f[0])}
                    accept={{ "application/pdf": [".pdf"] }}
                    multiple={false}
                    label="Drop your PDF here to visually edit"
                    icon="📄"
                    color={toolColor}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 20 }}
                  >
                    <PdfCanvasEditor
                      file={files[0]}
                      onCancel={() => {
                        setFiles([]);
                        setPageInfo(null);
                      }}
                      onSave={(blob, filename) =>
                        setPreviewFile({ blob, filename })
                      }
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Tab: Merge */}
            {activeTool === 1 && (
              <div className="tool-content">
                <ServerToggle />
                <FileDropzone
                  onFiles={(f) => setMergeFiles((prev) => [...prev, ...f])}
                  accept={{ "application/pdf": [".pdf"] }}
                  label="Add PDFs to merge"
                  icon="🔗"
                  color={toolColor}
                />
                {mergeFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: 20 }}
                  >
                    <div className="section-title">
                      Files to Merge ({mergeFiles.length})
                    </div>
                    <div className="file-list">
                      {mergeFiles.map((f, i) => (
                        <div key={i} className="file-item">
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: "rgba(255,107,157,0.2)",
                              color: toolColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {i + 1}
                          </div>
                          <div className="file-item-info">
                            <div className="file-item-name">{f.name}</div>
                            <div className="file-item-size">
                              {formatBytes(f.size)}
                            </div>
                          </div>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setMergeFiles((p) => p.filter((_, j) => j !== i))
                            }
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-accent"
                        onClick={handleMerge}
                        disabled={processing}
                      >
                        {processing ? (
                          <RefreshCw className="animate-spin" size={15} />
                        ) : (
                          <Merge size={15} />
                        )}{" "}
                        {processing
                          ? "Merging…"
                          : `Merge & Preview ${mergeFiles.length} PDFs`}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setMergeFiles([])}
                      >
                        <Trash2 size={15} /> Clear All
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Tab: Split */}
            {activeTool === 2 && (
              <div className="tool-content">
                <ServerToggle />
                <FileDropzone
                  onFiles={(f) => setSplitFile(f[0])}
                  accept={{ "application/pdf": [".pdf"] }}
                  multiple={false}
                  label="Drop PDF to split"
                  icon="✂️"
                  color={toolColor}
                />
                {splitFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 20 }}
                  >
                    <div className="file-item" style={{ marginBottom: 16 }}>
                      <div
                        className="file-item-icon"
                        style={{
                          background: "rgba(255,107,157,0.15)",
                          color: toolColor,
                        }}
                      >
                        📄
                      </div>
                      <div className="file-item-info">
                        <div className="file-item-name">{splitFile.name}</div>
                        <div className="file-item-size">
                          {formatBytes(splitFile.size)}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label
                        style={{
                          fontSize: 13,
                          color: "rgba(240,240,255,0.6)",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Pages to extract (e.g. 1, 3, 5) — blank = all pages
                      </label>
                      <input
                        className="input"
                        value={splitPage}
                        onChange={(e) => setSplitPage(e.target.value)}
                        placeholder="1, 2, 3 …"
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-accent"
                        onClick={handleSplit}
                        disabled={processing}
                      >
                        {processing ? (
                          <RefreshCw className="animate-spin" size={15} />
                        ) : (
                          <Scissors size={15} />
                        )}{" "}
                        {processing ? "Splitting…" : "Split & Preview PDF"}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setSplitFile(null)}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Tab: Convert */}
            {activeTool === 3 && (
              <div className="tool-content">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      label: "PDF → Word (.docx)",
                      emoji: "📝",
                      desc: "Convert your PDF to an editable Word document",
                      color: "#00D9FF",
                    },
                    {
                      label: "PDF → Google Docs",
                      emoji: "📃",
                      desc: "Convert to Docs-compatible format (.docx)",
                      color: "#00FFB3",
                    },
                  ].map((opt, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -3 }}
                      className="card"
                      style={{
                        padding: 24,
                        background: "white",
                        borderColor: `${opt.color}40`,
                        boxShadow: `0 8px 32px ${opt.color}15`,
                      }}
                    >
                      <div style={{ fontSize: 36, marginBottom: 12 }}>
                        {opt.emoji}
                      </div>
                      <h3
                        style={{
                          fontWeight: 700,
                          marginBottom: 6,
                          color: opt.color,
                        }}
                      >
                        {opt.label}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#555",
                          marginBottom: 16,
                        }}
                      >
                        {opt.desc}
                      </p>

                      {convertedFile?.index === i ? (
                        <div
                          style={{
                            padding: 16,
                            background: `${opt.color}10`,
                            borderRadius: 12,
                            border: `1px solid ${opt.color}30`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 16,
                            }}
                          >
                            <span style={{ fontSize: 24 }}>✅</span>
                            <div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#333",
                                }}
                              >
                                Conversion Complete
                              </div>
                              <div style={{ fontSize: 12, color: "#666" }}>
                                {convertedFile.name}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              className="btn btn-primary btn-sm"
                              style={{
                                flex: 1,
                                background: opt.color,
                                borderColor: opt.color,
                                color: "white",
                              }}
                              onClick={() => {
                                setPreviewFile({
                                  blob: convertedFile.blob,
                                  filename: convertedFile.name,
                                });
                                showToast("Generating preview...", "success");
                              }}
                            >
                              <Download size={14} /> Preview & Download
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ flex: 1 }}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  "https://apnipdfs.com/share/" +
                                    Math.random().toString(36).substring(7),
                                );
                                showToast(
                                  "Share link copied to clipboard!",
                                  "success",
                                );
                              }}
                            >
                              🔗 Share
                            </button>
                          </div>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ width: "100%", marginTop: 8 }}
                            onClick={() => setConvertedFile(null)}
                          >
                            <RefreshCw size={14} /> Convert Another
                          </button>
                        </div>
                      ) : isConvertingToDocx ? (
                        <div
                          className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl border-black/10 bg-black/5"
                          style={{ minHeight: 200 }}
                        >
                          <RefreshCw
                            className="animate-spin mb-4"
                            size={32}
                            color={opt.color}
                          />
                          <p className="text-black/70">
                            Converting your PDF...
                          </p>
                        </div>
                      ) : (
                        <FileDropzone
                          onFiles={async (f) => {
                            showToast(`Converting ${f[0].name}…`, "info");
                            try {
                              const fd = new FormData();
                              fd.append("file", f[0]);
                              let blob;
                              let ext = "";
                              if (i === 0) {
                                blob = await pdfToDocx(fd).unwrap();
                                ext = ".docx";
                              } else {
                                blob = await pdfToDocx(fd).unwrap();
                                ext = ".docx";
                              }
                              setConvertedFile({
                                index: i,
                                name: `converted_${f[0].name.replace(".pdf", ext)}`,
                                blob,
                              });
                              showToast("Conversion complete!", "success");
                            } catch (e) {
                              showToast(
                                `Conversion failed: ${e.message || "Server error"}`,
                                "error",
                              );
                            }
                          }}
                          accept={{ "application/pdf": [".pdf"] }}
                          multiple={false}
                          label="Drop PDF"
                          sublabel=""
                          icon="📄"
                          color={opt.color}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
