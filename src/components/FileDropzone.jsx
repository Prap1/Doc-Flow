import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, File } from "lucide-react";

export default function FileDropzone({
  onFiles,
  accept,
  multiple = true,
  label,
  sublabel,
  icon,
  color = "#6C63FF",
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (onFiles) onFiles(acceptedFiles);
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`dropzone ${isDragActive ? "active" : ""}`}
      style={{
        borderColor: isDragActive ? color : undefined,
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={{ y: isDragActive ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ fontSize: 52, marginBottom: 12 }}
      >
        {icon || "📁"}
      </motion.div>
      <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
        {isDragActive ? "Drop files here…" : label || "Drag & drop files here"}
      </h3>
      <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
        {sublabel || "or click to browse from your computer"}
      </p>
      <button
        className="btn btn-secondary btn-sm"
        style={{ borderColor: color + "40", color }}
      >
        <Upload size={14} /> Choose File{multiple ? "s" : ""}
      </button>
    </motion.div>
  );
}
