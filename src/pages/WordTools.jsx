import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";
import mammoth from "mammoth";
import FileDropzone from "../components/FileDropzone";
import RichEditor from "../components/RichEditor";
import FilePreviewModal from "../components/FilePreviewModal";
import { showToast } from "../components/Toast";
import { Trash2, Download, RefreshCw, Merge, Scissors } from "lucide-react";

import { useWordMergeMutation, useWordSplitMutation } from "../store/apiSlice";

const TOOLS = [
  {
    id: 0,
    action: "edit",
    title: "Edit Document",
    desc: "Extract & edit text",
    icon: "📝",
    color: "#00D9FF",
  },
  {
    id: 1,
    action: "merge",
    title: "Merge Docs",
    desc: "Combine multiple files",
    icon: "🔗",
    color: "#8B5CF6",
  },
  {
    id: 2,
    action: "split",
    title: "Split Doc",
    desc: "Separate sections",
    icon: "✂️",
    color: "#FF6B9D",
  },
  {
    id: 3,
    action: "convert",
    title: "Convert Doc",
    desc: "To PDF or HTML",
    icon: "🔄",
    color: "#00FFB3",
  },
];

function formatBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

export default function WordTools() {
  const location = useLocation();
  const { action } = useParams();
  const navigate = useNavigate();

  const activeTool = action
    ? (TOOLS.find((t) => t.action === action)?.id ?? null)
    : null;

  const [editFile, setEditFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [splitSections, setSplitSections] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  const [wordMerge, { isLoading: isMerging }] = useWordMergeMutation();
  const [wordSplit, { isLoading: isSplitting }] = useWordSplitMutation();

  const processing = isMerging || isSplitting;
  const toolColor = "#00D9FF";

  const [isExtracting, setIsExtracting] = useState(false);

  const loadDocx = async (file) => {
    setIsExtracting(true);
    setEditFile(file);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (e) {
      showToast("Failed to read document", "error");
    }
    setIsExtracting(false);
  };

  useEffect(() => {
    if (location.state?.importedFile) {
      loadDocx(location.state.importedFile);
      navigate("/word/edit");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const downloadEdited = () => {
    if (!htmlContent) return showToast("Nothing to save", "error");
    const blob = new Blob(
      [
        `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6;}</style></head><body>${htmlContent}</body></html>`,
      ],
      { type: "text/html" },
    );
    setPreviewFile({
      blob,
      filename: `edited_${editFile?.name || "document"}.html`,
    });
    showToast("Document ready for preview", "success");
  };

  const handleMerge = async () => {
    if (mergeFiles.length < 2)
      return showToast("Add at least 2 DOCX files", "error");
    try {
      const fd = new FormData();
      mergeFiles.forEach((f) => fd.append("files", f));
      const blob = await wordMerge(fd).unwrap();
      setPreviewFile({ blob, filename: "merged_document.docx" });
      showToast("Documents merged via server!", "success");
    } catch (e) {
      showToast(`Merge failed: ${e.message || "Server error"}`, "error");
    }
  };

  const handleSplit = async () => {
    if (!splitFile) return showToast("Upload a DOCX file first", "error");
    try {
      const fd = new FormData();
      fd.append("file", splitFile);
      if (splitSections) fd.append("sections", splitSections);
      const blob = await wordSplit(fd).unwrap();
      setPreviewFile({ blob, filename: "split_document.zip" });
      showToast("Document split successfully into ZIP!", "success");
    } catch (e) {
      showToast(`Split failed: ${e.message || "Server error"}`, "error");
    }
  };

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
              {activeTool !== null ? TOOLS[activeTool].icon : "📝"}
            </span>
            <div>
              <h1
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                {activeTool !== null ? TOOLS[activeTool].title : "Word Tools"}
              </h1>
              <p style={{ color: "rgba(240,240,255,0.5)", fontSize: 15 }}>
                {activeTool !== null
                  ? TOOLS[activeTool].desc
                  : "Edit, Merge, Split & Convert Word documents"}
              </p>
            </div>
          </div>
          <div
            className="badge"
            style={{
              background: "white",
              color: "#00D9FF",
              border: "1px solid #00D9FF",
            }}
          >
            DOCX Suite
          </div>
        </div>

        {activeTool === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
            {TOOLS.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate("/word/" + tool.action)}
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
                navigate("/word");
                setEditFile(null);
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

            {/* Edit */}
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
                      Extracting document contents...
                    </p>
                  </div>
                ) : !editFile ? (
                  <FileDropzone
                    onFiles={(f) => loadDocx(f[0])}
                    accept={{
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                        [".docx"],
                    }}
                    multiple={false}
                    label="Drop your DOCX here to edit"
                    icon="📝"
                    color={toolColor}
                  />
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="file-item" style={{ marginBottom: 16 }}>
                      <div
                        className="file-item-icon"
                        style={{
                          background: "rgba(0,217,255,0.15)",
                          color: toolColor,
                        }}
                      >
                        📝
                      </div>
                      <div className="file-item-info">
                        <div className="file-item-name">{editFile.name}</div>
                        <div className="file-item-size">
                          {formatBytes(editFile.size)}
                        </div>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditFile(null);
                          setHtmlContent("");
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <RichEditor
                      value={htmlContent}
                      onChange={setHtmlContent}
                      placeholder="Edit your document…"
                      minHeight={320}
                      showEmoji
                    />
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <button className="btn btn-cyan" onClick={downloadEdited}>
                        <Download size={15} /> Preview & Save Document
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Merge */}
            {activeTool === 1 && (
              <div className="tool-content">
                <FileDropzone
                  onFiles={(f) => setMergeFiles((p) => [...p, ...f])}
                  accept={{
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [".docx"],
                  }}
                  label="Add Word documents to merge"
                  icon="🔗"
                  color={toolColor}
                />
                {mergeFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: 20 }}
                  >
                    <div className="file-list">
                      {mergeFiles.map((f, i) => (
                        <div key={i} className="file-item">
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: "rgba(0,217,255,0.15)",
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
                        className="btn btn-cyan"
                        onClick={handleMerge}
                        disabled={processing}
                      >
                        {processing ? (
                          <RefreshCw className="animate-spin" size={15} />
                        ) : (
                          <Merge size={15} />
                        )}{" "}
                        {processing ? "Merging…" : "Merge & Preview Documents"}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setMergeFiles([])}
                      >
                        <Trash2 size={13} /> Clear
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Split */}
            {activeTool === 2 && (
              <div className="tool-content">
                <FileDropzone
                  onFiles={(f) => setSplitFile(f[0])}
                  accept={{
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [".docx"],
                  }}
                  multiple={false}
                  label="Drop DOCX to split"
                  icon="✂️"
                  color={toolColor}
                />
                {splitFile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: 16 }}
                  >
                    <div className="file-item" style={{ marginBottom: 16 }}>
                      <div
                        className="file-item-icon"
                        style={{
                          background: "rgba(0,217,255,0.15)",
                          color: toolColor,
                        }}
                      >
                        📝
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
                        Sections to extract (e.g. 1, 3, 5) — blank = all
                        sections (splits by headings)
                      </label>
                      <input
                        className="input"
                        value={splitSections}
                        onChange={(e) => setSplitSections(e.target.value)}
                        placeholder="1, 2, 3 …"
                      />
                    </div>
                    <button
                      className="btn btn-cyan"
                      onClick={handleSplit}
                      disabled={processing}
                    >
                      {processing ? (
                        <RefreshCw className="animate-spin" size={15} />
                      ) : (
                        <Scissors size={15} />
                      )}{" "}
                      {processing ? "Splitting…" : "Split & Preview Document"}
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Convert */}
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
                      label: "Word → Google Docs",
                      emoji: "📃",
                      color: "#00FFB3",
                    },
                    { label: "Word → PDF", emoji: "📄", color: "#FF6B9D" },
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
                          marginBottom: 8,
                          color: opt.color,
                        }}
                      >
                        {opt.label}
                      </h3>
                      <FileDropzone
                        onFiles={(f) => {
                          showToast(`Converting ${f[0].name}…`, "info");
                          setTimeout(
                            () =>
                              showToast(
                                "Conversion complete! (Demo)",
                                "success",
                              ),
                            1500,
                          );
                        }}
                        accept={{
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                            [".docx"],
                        }}
                        multiple={false}
                        label="Drop .docx"
                        sublabel=""
                        icon="📝"
                        color={opt.color}
                      />
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
