import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Type,
  Palette,
  Eraser,
  PenTool,
  Pencil,
  Book,
  MousePointer2,
  Image as ImageIcon,
  Trash2,
  SmilePlus,
} from "lucide-react";

const EMOJIS = [
  "😊",
  "🔥",
  "💡",
  "⭐",
  "🚀",
  "❤️",
  "✅",
  "📌",
  "🎯",
  "💪",
  "🌟",
  "👋",
];
const COLORS = [
  "#FF8A8A",
  "#FFB26B",
  "#FFD56F",
  "#85FF7A",
  "#60FFDB",
  "#59C1FF",
  "#4579FF",
  "#7C4DFF",
  "#000000",
  "#FFFFFF",
];

export default function RichEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  minHeight = 200,
  showEmoji = false,
}) {
  const [activeFormats, setActiveFormats] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [activeTool, setActiveTool] = useState("text");
  const [selectedColor, setSelectedColor] = useState("#000000");

  const [showMeaningPopup, setShowMeaningPopup] = useState(false);
  const [symbolInput, setSymbolInput] = useState("**");
  const [meaningInput, setMeaningInput] = useState("");
  const [savedRange, setSavedRange] = useState(null);

  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (!isInternalChange.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
      isInternalChange.current = false;
    }
  }, [value]);

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    setActiveFormats((prev) =>
      prev.includes(cmd) ? prev.filter((f) => f !== cmd) : [...prev, cmd],
    );
    editorRef.current?.focus();
  };

  const insertEmoji = (emoji) => {
    document.execCommand("insertText", false, emoji);
    editorRef.current?.focus();
  };

  const handleColorChange = (c) => {
    setSelectedColor(c);
    if (activeTool === "pencil") {
      execCmd("hiliteColor", c);
    } else {
      execCmd("foreColor", c);
    }
  };

  const ToolBtn = ({ id, icon: Icon, label, disabled, onClick }) => (
    <button
      className={`w-full flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-colors ${activeTool === id ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" : "text-gray-600 hover:bg-gray-100"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        if (disabled) return;
        if (onClick) onClick();
        setActiveTool(id);
      }}
      title={label}
    >
      <Icon size={22} strokeWidth={activeTool === id ? 2.5 : 2} />
      <span className="text-[10px] font-medium hidden md:block text-center">
        {label}
      </span>
    </button>
  );

  return (
    <div className="flex h-[85vh] border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 text-gray-800 shadow-xl font-sans w-full">
      {/* Left Sidebar Toolbar */}
      <div className="w-20 md:w-24 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2 z-20 shadow-sm overflow-y-auto shrink-0">
        <ToolBtn
          id="text"
          icon={Type}
          label="Text"
          onClick={() => execCmd("removeFormat")}
        />
        <div className="w-12 h-[1px] bg-gray-100 my-1 shrink-0" />
        <ToolBtn
          id="pen"
          icon={PenTool}
          label="Pen"
          onClick={() => execCmd("foreColor", "#3b82f6")}
        />
        <ToolBtn
          id="pencil"
          icon={Pencil}
          label="Highlight"
          onClick={() => execCmd("hiliteColor", "#fef08a")}
        />
        <ToolBtn
          id="eraser"
          icon={Eraser}
          label="Eraser"
          onClick={() => execCmd("removeFormat")}
        />
        <div className="w-12 h-[1px] bg-gray-100 my-1 shrink-0" />
        <ToolBtn
          id="meaning"
          icon={Book}
          label="Add Meaning"
          onClick={() => {
            const sel = window.getSelection();
            if (sel.rangeCount > 0) setSavedRange(sel.getRangeAt(0));
            setShowMeaningPopup(true);
          }}
        />
        <ToolBtn
          id="list"
          icon={List}
          label="List"
          onClick={() => execCmd("insertUnorderedList")}
        />
      </div>

      {/* Center Document Workspace */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-100/50">
        <div className="flex-1 overflow-auto flex justify-center py-10 px-4">
          <div className="bg-white shadow-2xl rounded-sm w-full max-w-[800px] min-h-[1056px] relative flex flex-col border border-gray-200">
            {/* Editor area - simulating an A4 page */}
            <div
              ref={editorRef}
              contentEditable={true}
              suppressContentEditableWarning
              onInput={(e) => {
                isInternalChange.current = true;
                if (onChange) onChange(e.currentTarget.innerHTML);
              }}
              data-placeholder={placeholder}
              className="flex-1 outline-none p-12 text-[#111] leading-relaxed cursor-text"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: "Inter, sans-serif",
                userSelect: "text",
                pointerEvents: "auto",
                minHeight: "100%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar Properties Panel */}
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col p-5 gap-6 z-20 shadow-sm shrink-0 overflow-y-auto">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Properties
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Color</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleColorChange(c);
                }}
                className="w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  ringColor: selectedColor === c ? "#3b82f6" : "transparent",
                  ringWidth: selectedColor === c ? "2px" : "0",
                }}
              />
            ))}
          </div>
        </div>

        <div className="h-[1px] w-full bg-gray-100" />

        <div>
          <span className="text-sm font-medium text-gray-700 mb-2 block">
            Typography
          </span>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-1 mb-2">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                execCmd("bold");
              }}
              className={`flex-1 p-2 rounded ${activeFormats.includes("bold") ? "bg-white shadow-sm font-bold text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
            >
              B
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                execCmd("italic");
              }}
              className={`flex-1 p-2 rounded italic ${activeFormats.includes("italic") ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
            >
              I
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                execCmd("underline");
              }}
              className={`flex-1 p-2 rounded underline ${activeFormats.includes("underline") ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
            >
              U
            </button>
          </div>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-1">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                execCmd("justifyLeft");
              }}
              className={`flex-1 p-2 flex justify-center rounded ${activeFormats.includes("justifyLeft") ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
            >
              <AlignLeft size={16} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                execCmd("justifyCenter");
              }}
              className={`flex-1 p-2 flex justify-center rounded ${activeFormats.includes("justifyCenter") ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
            >
              <AlignCenter size={16} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                execCmd("justifyRight");
              }}
              className={`flex-1 p-2 flex justify-center rounded ${activeFormats.includes("justifyRight") ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-800"}`}
            >
              <AlignRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Font Size</span>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setFontSize(Math.max(8, fontSize - 2))}
              className="p-1 hover:bg-gray-100 bg-gray-50 text-gray-600 w-8"
            >
              -
            </button>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-10 text-center text-sm outline-none border-x border-gray-200 text-gray-700"
            />
            <button
              onClick={() => setFontSize(fontSize + 2)}
              className="p-1 hover:bg-gray-100 bg-gray-50 text-gray-600 w-8"
            >
              +
            </button>
          </div>
        </div>

        {showEmoji && (
          <>
            <div className="h-[1px] w-full bg-gray-100" />
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <SmilePlus size={16} /> Emojis
              </span>
              <div className="grid grid-cols-4 gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onMouseDown={(ev) => {
                      ev.preventDefault();
                      insertEmoji(e);
                    }}
                    className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {showMeaningPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#13132B] p-8 rounded-2xl w-[400px] border border-purple-500/50 shadow-2xl"
          >
            <h3 className="mb-4 text-xl text-white font-bold">
              Add Custom Meaning
            </h3>

            <p className="text-white/60 text-sm mb-2">
              Enter symbol (e.g. *, **, ***):
            </p>
            <input
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              placeholder="e.g. **"
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm mb-4 outline-none focus:border-purple-500 transition-colors"
            />

            <p className="text-white/60 text-sm mb-2">
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
                  const selectedText = savedRange ? savedRange.toString() : "";

                  if (selectedText) {
                    document.execCommand(
                      "insertText",
                      false,
                      `${symbolInput}${selectedText}${symbolInput}`,
                    );
                  } else if (meaningInput && symbolInput) {
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
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm mb-6 outline-none focus:border-purple-500 transition-colors"
            />
            <div className="flex gap-3">
              <button
                className="flex-1 p-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-medium"
                onClick={() => {
                  setShowMeaningPopup(false);
                  setMeaningInput("");
                  setSymbolInput("**");
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                onClick={() => {
                  if (savedRange) {
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(savedRange);
                  }
                  const selectedText = savedRange ? savedRange.toString() : "";

                  if (selectedText) {
                    document.execCommand(
                      "insertText",
                      false,
                      `${symbolInput}${selectedText}${symbolInput}`,
                    );
                  } else if (meaningInput && symbolInput) {
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
