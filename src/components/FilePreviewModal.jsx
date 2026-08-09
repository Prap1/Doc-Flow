import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  X,
  FileText,
  Image as ImageIcon,
  FileArchive,
  Table,
} from "lucide-react";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import JSZip from "jszip";

function formatBytes(b) {
  if (!b) return "0 B";
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

export default function FilePreviewModal({ previewFile, onClose }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [zipContents, setZipContents] = useState([]);

  useEffect(() => {
    if (previewFile?.blob) {
      const url = URL.createObjectURL(previewFile.blob);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [previewFile]);

  const blob = previewFile?.blob;
  const filename = previewFile?.filename || "";
  const type = blob?.type || "";
  const size = blob?.size || 0;

  const isPdf =
    type === "application/pdf" || filename.toLowerCase().endsWith(".pdf");
  const isImage =
    type.startsWith("image/") || filename.match(/\.(png|jpe?g|webp|gif)$/i);
  const isHtml =
    type === "text/html" || filename.toLowerCase().endsWith(".html");
  const isZip =
    type === "application/zip" || filename.toLowerCase().endsWith(".zip");
  const isExcel =
    type.includes("spreadsheetml") || filename.toLowerCase().endsWith(".xlsx");
  const isWord =
    type.includes("wordprocessingml") ||
    filename.toLowerCase().endsWith(".docx");

  useEffect(() => {
    if (isZip && blob) {
      JSZip.loadAsync(blob)
        .then((zip) => {
          const files = [];
          zip.forEach((relativePath, zipEntry) => {
            if (!zipEntry.dir) files.push(relativePath);
          });
          setZipContents(files);
        })
        .catch((e) => console.error("Error reading zip", e));
    } else {
      setZipContents([]);
    }
  }, [isZip, blob]);

  const handleDownload = () => {
    saveAs(blob, filename);
    onClose();
  };

  const renderVisualPreview = () => {
    if (isPdf || isHtml) {
      return (
        <object
          data={objectUrl}
          type={isPdf ? "application/pdf" : "text/html"}
          title="Preview"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "white",
          }}
        >
          <p>
            Unable to display preview.{" "}
            <a href={objectUrl} target="_blank" rel="noopener noreferrer">
              Download here
            </a>
            .
          </p>
        </object>
      );
    }
    if (isImage) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
          }}
        >
          <img
            src={objectUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      );
    }
    return null;
  };

  const renderGenericPreview = () => {
    let Icon = FileText;
    let color = "#3b82f6";

    if (isZip) {
      Icon = FileArchive;
      color = "#eab308";
    } else if (isExcel) {
      Icon = Table;
      color = "#10b981";
    } else if (isWord) {
      Icon = FileText;
      color = "#0ea5e9";
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Icon size={40} color={color} />
        </div>
        <h3
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "white",
            marginBottom: 8,
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          {filename}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>
          {formatBytes(size)} • Ready to download
        </p>

        {isZip && zipContents.length > 0 && (
          <div
            style={{
              marginTop: 24,
              background: "rgba(0,0,0,0.2)",
              padding: "16px 24px",
              borderRadius: 12,
              width: "80%",
              maxWidth: 400,
              maxHeight: 150,
              overflowY: "auto",
            }}
          >
            <h4
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                textTransform: "uppercase",
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              Contents
            </h4>
            {zipContents.map((file, i) => (
              <div
                key={i}
                style={{
                  color: "white",
                  fontSize: 14,
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FileText size={14} color="rgba(255,255,255,0.5)" /> {file}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {previewFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#12121a",
              borderRadius: 24,
              width: "100%",
              maxWidth: 1000,
              height: "80vh",
              maxHeight: 800,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "white",
                  margin: 0,
                }}
              >
                File Preview
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  color: "white",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              {isPdf || isHtml || isImage
                ? renderVisualPreview()
                : renderGenericPreview()}
            </div>

            <div
              style={{
                padding: "20px 24px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                style={{
                  padding: "10px 24px",
                  borderRadius: 12,
                  background: "white",
                  color: "black",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Download size={16} /> Download
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
