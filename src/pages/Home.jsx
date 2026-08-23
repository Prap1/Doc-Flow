import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  File,
  BookOpen,
  FileSpreadsheet,
  Image,
  MessageSquare,
  ArrowRight,
  Sparkles,
  UploadCloud,
  Book,
  PenTool,
  Pencil,
  Eraser,
  Palette,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import Logo from "../assets/Logo";
import { showToast } from "../components/Toast";

const modules = [
  {
    path: "/pdf",
    emoji: "📄",
    label: "PDF Tools",
    desc: "Edit · Merge · Split · Convert",
    color: "#FF6B9D",
    bg: "rgba(255,107,157,0.08)",
  },
  {
    path: "/word",
    emoji: "📝",
    label: "Word Tools",
    desc: "Edit · Merge · Split · Convert",
    color: "#00D9FF",
    bg: "rgba(0,217,255,0.08)",
  },
  // { path: '/docs',  emoji: '📃', label: 'Docs Tools',  desc: 'Edit · Merge · Split · Convert',  color: '#00FFB3', bg: 'rgba(0,255,179,0.08)' },
  {
    path: "/excel",
    emoji: "📊",
    label: "Excel Tools",
    desc: "Edit · Split · Merge Sheets",
    color: "#FF8C42",
    bg: "rgba(255,140,66,0.08)",
  },
  {
    path: "/image",
    emoji: "🖼️",
    label: "Image Tools",
    desc: "Edit · Crop · Merge · Filters",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.08)",
  },
  {
    path: "/chat",
    emoji: "💬",
    label: "Chat Studio",
    desc: "Create · Edit · Share · Voice",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.08)",
    badge: "✨ New",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function Home() {
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const [showMeaningPopup, setShowMeaningPopup] = useState(false);
  const [symbolInput, setSymbolInput] = useState("**");
  const [meaningInput, setMeaningInput] = useState("");
  const [savedRange, setSavedRange] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = file.name.toLowerCase();

      if (name.endsWith(".pdf")) {
        navigate("/pdf/edit", { state: { importedFile: file } });
      } else if (name.endsWith(".docx") || name.endsWith(".doc")) {
        navigate("/word/edit", { state: { importedFile: file } });
      } else if (
        name.endsWith(".xlsx") ||
        name.endsWith(".xls") ||
        name.endsWith(".csv")
      ) {
        navigate("/excel/edit", { state: { importedFile: file } });
      } else if (name.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
        navigate("/image/edit", { state: { importedFile: file } });
      } else {
        showToast(`File "${file.name}" loaded into memory.`, "success");
      }

      // Reset input so the same file can be selected again
      e.target.value = null;
    }
  };

  return (
    <div className="page-body" style={{ paddingTop: 80 }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative"
      >
        {/* Glow orbs */}
        <div className="absolute -top-16 left-[20%] w-72 h-72 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(108,99,255,0.15)_0%,transparent_70%)]" />
        <div className="absolute -top-10 right-[20%] w-64 h-64 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(0,217,255,0.1)_0%,transparent_70%)]" />

        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="inline-block mb-5"
        >
          <Logo size={72} />
        </motion.div>
        <h1 className="font-outfit font-black leading-tight mb-4 text-[clamp(36px,5vw,64px)]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            ApniPDFs
          </span>
          <br />
          <span className="text-white/75 font-semibold text-[55%]">
            Your All-in-One Document Suite
          </span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto mb-7">
          Edit, merge, split and convert PDFs, Word docs, Spreadsheets, Images
          and create viral content — all in one beautiful workspace.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/pdf">
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all">
              <Sparkles size={18} /> Get Started
            </button>
          </Link>
          <Link to="/chat">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-semibold transition-all">
              <MessageSquare size={18} /> Chat Studio
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Custom Upload Section (Polished UI) */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex justify-center mb-12 w-full"
      >
        <motion.div
          variants={item}
          className="flex flex-col items-center w-full max-w-5xl px-4"
        >
          <div className="flex flex-col lg:flex-row w-full gap-8 mb-8">
            {/* Left side: Upload/Dropzone & Select file */}
            <div className="flex-1 flex flex-col gap-5 p-8 rounded-3xl bg-white shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 min-h-[180px] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 transition-all duration-300 cursor-pointer hover:bg-gray-100 hover:border-indigo-400"
              >
                <UploadCloud size={48} className="text-indigo-500 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2 text-center">
                  Create Your Own Things....
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Drag and drop or click to upload
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-6 rounded-xl border-2 border-yellow-500 text-yellow-600 font-bold text-lg flex justify-center transition-all hover:bg-yellow-50"
              >
                Select your file
              </button>
            </div>

            {/* Right side: Typing area */}
            <div className="flex-1 flex flex-col p-8 rounded-3xl bg-white shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-colors">
              <div className="w-full flex flex-col h-full">
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-1.5 p-2 bg-gray-100 rounded-t-xl border border-gray-200 border-b-0 items-center overflow-x-auto"
                  >
                    <button
                      title="Bold"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("bold", false, null);
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      title="Italic"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("italic", false, null);
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      title="Underline"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("underline", false, null);
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <Underline size={16} />
                    </button>

                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />

                    <button
                      title="Align Left"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("justifyLeft", false, null);
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      title="Align Center"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("justifyCenter", false, null);
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      title="Align Right"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("justifyRight", false, null);
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <AlignRight size={16} />
                    </button>

                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />

                    <button
                      title="Notebook Font"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand(
                          "fontName",
                          false,
                          "Comic Sans MS",
                        );
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <Book size={16} />
                    </button>
                    <button
                      title="Pen (Blue)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("foreColor", false, "#3b82f6");
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <PenTool size={16} />
                    </button>
                    <button
                      title="Pencil (Highlight)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("hiliteColor", false, "#fef08a");
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="Eraser (Clear)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        document.execCommand("removeFormat", false, null);
                      }}
                      className="p-1 bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900"
                    >
                      <Eraser size={16} />
                    </button>

                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />

                    <label className="flex items-center cursor-pointer">
                      <Palette size={16} className="text-gray-600 mr-1" />
                      <input
                        title="Color Selection"
                        type="color"
                        onInput={(e) =>
                          document.execCommand(
                            "foreColor",
                            false,
                            e.target.value,
                          )
                        }
                        className="w-5 h-5 border-none bg-transparent cursor-pointer p-0"
                      />
                    </label>

                    <div className="flex items-center">
                      <Type size={16} className="text-gray-600 mr-1" />
                      <select
                        title="Font Size"
                        onChange={(e) =>
                          document.execCommand(
                            "fontSize",
                            false,
                            e.target.value,
                          )
                        }
                        className="border border-gray-300 rounded p-0.5 text-black text-xs bg-white"
                      >
                        <option value="2">Small</option>
                        <option value="3" selected>
                          Normal
                        </option>
                        <option value="4">Large</option>
                        <option value="5">Huge</option>
                      </select>
                    </div>

                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />

                    <button
                      title="Add Meaning"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const sel = window.getSelection();
                        if (sel.rangeCount > 0)
                          setSavedRange(sel.getRangeAt(0));
                        setShowMeaningPopup(true);
                      }}
                      className="bg-gray-200 border border-gray-300 rounded-md cursor-pointer px-2 py-1 text-xs font-bold text-gray-700 hover:bg-gray-300"
                    >
                      **
                    </button>
                  </motion.div>
                )}

                <div
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => setIsTyping(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.textContent.trim()) {
                      setIsTyping(false);
                    }
                  }}
                  className={`w-full flex-1 p-6 text-[15px] outline-none transition-all text-left bg-gray-50 text-gray-900 ${isTyping ? "border border-indigo-500 rounded-b-xl min-h-[calc(100%-44px)]" : "border border-gray-200 rounded-2xl min-h-[180px] hover:border-gray-300"}`}
                >
                  {!isTyping && (
                    <span className="text-gray-400 pointer-events-none">
                      Typing...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Link to="/chat" className="no-underline">
            <div className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 flex items-center gap-3 cursor-pointer transition-transform hover:scale-105">
              <span className="text-lg">✨</span>
              <span className="font-medium text-white/90 tracking-wide">
                Chat / Story / Post
              </span>
              <span className="text-lg">✨</span>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Modules grid */}
      <div className="section">
        <div className="section-title" style={{ fontSize: 20 }}>
          <Sparkles size={18} color="#8B84FF" /> All Tools
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="tool-grid tool-grid-3"
        >
          {modules.map((module, index) => (
            <motion.div key={module.path} variants={item}>
              <Link to={module.path} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{
                    y: -4,
                    boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 40px ${module.color}20`,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="tool-card card"
                  style={{
                    background: module.bg,
                    borderColor: `${module.color}20`,
                    borderRadius: 20,
                    padding: 24,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Background glow */}
                  <div
                    style={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      background: `radial-gradient(circle, ${module.color}20 0%, transparent 70%)`,
                      borderRadius: "50%",
                    }}
                  />

                  {module.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 99,
                        background: `${module.color}20`,
                        color: module.color,
                        border: `1px solid ${module.color}30`,
                      }}
                    >
                      {module.badge}
                    </span>
                  )}

                  <div style={{ fontSize: 42, marginBottom: 12 }}>
                    {module.emoji}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: 18,
                        marginBottom: 4,
                        color: "rgba(255,255,255,0.9)",
                        fontWeight: 600,
                      }}
                    >
                      {module.label}
                    </h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                      {module.desc}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      color: module.color,
                      marginTop: 16,
                    }}
                  >
                    Open Tools <ArrowRight size={14} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Feature highlight */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
        style={{
          padding: 32,
          background:
            "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,217,255,0.05))",
          borderColor: "rgba(108,99,255,0.2)",
          marginTop: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 48 }}>🎤</div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Voice-Powered Chat Studio
            </h2>
            <p style={{ color: "rgba(240,240,255,0.55)", fontSize: 14 }}>
              Create engaging posts, stories & chats — record voice messages
              that recipients can play back directly. Share with one click.
            </p>
          </div>
          <Link to="/chat">
            <button className="btn btn-primary">
              <MessageSquare size={16} /> Try Chat Studio
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Meaning Popup */}
      {showMeaningPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "#13132B",
              padding: 32,
              borderRadius: 20,
              width: 400,
              border: "1px solid rgba(139, 92, 246, 0.5)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <h3 style={{ marginBottom: 16, fontSize: 20, color: "#fff" }}>
              Add Custom Meaning
            </h3>

            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              Enter symbol (e.g. *, **, ***):
            </p>
            <input
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              placeholder="e.g. **"
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: 15,
                marginBottom: 16,
                outline: "none",
              }}
            />

            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              Enter meaning or reason:
            </p>
            <input
              autoFocus
              value={meaningInput}
              onChange={(e) => setMeaningInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (savedRange) {
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(savedRange);
                  }
                  if (meaningInput && symbolInput) {
                    document.execCommand(
                      "insertText",
                      false,
                      ` ${symbolInput} (Meaning: ${meaningInput}) `,
                    );
                  }
                  setShowMeaningPopup(false);
                  setMeaningInput("");
                  setSymbolInput("**");
                }
              }}
              placeholder="e.g. Very important..."
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: 15,
                marginBottom: 24,
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn"
                onClick={() => {
                  setShowMeaningPopup(false);
                  setMeaningInput("");
                  setSymbolInput("**");
                }}
                style={{
                  flex: 1,
                  padding: 14,
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  justifyContent: "center",
                }}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={() => {
                  if (savedRange) {
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(savedRange);
                  }
                  if (meaningInput && symbolInput) {
                    document.execCommand(
                      "insertText",
                      false,
                      ` ${symbolInput} (Meaning: ${meaningInput}) `,
                    );
                  }
                  setShowMeaningPopup(false);
                  setMeaningInput("");
                  setSymbolInput("**");
                }}
                style={{
                  flex: 1,
                  padding: 14,
                  background: "#8B5CF6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 600,
                  justifyContent: "center",
                }}
              >
                Insert
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
