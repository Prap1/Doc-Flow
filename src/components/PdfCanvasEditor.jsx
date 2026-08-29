import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Undo,
  Redo,
  MousePointer2,
  FileEdit,
  PenLine,
  Type,
  Eraser,
  Highlighter,
  Image as ImageIcon,
  MoveUpRight,
  PenTool,
  X,
  Check,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { showToast } from "./Toast";
import { motion } from "framer-motion";

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

// Offscreen canvas used to measure text the same way pdf-lib's Helvetica will render it,
// so on-screen text boxes match the saved PDF instead of guessing width from character count.
let _measureCanvas;
function measureTextWidth(text, fontSize, bold, italic) {
  if (!_measureCanvas) _measureCanvas = document.createElement("canvas");
  const ctx = _measureCanvas.getContext("2d");
  ctx.font = `${italic ? "italic " : ""}${bold ? "bold " : ""}${fontSize || 16}px Helvetica, Arial, sans-serif`;
  return ctx.measureText(text && text.length ? text : " ").width;
}

// When zoom changes (or the page re-renders at a different size) every placed element's
// pixel coordinates need to scale with it, or annotations drift off the content they mark.
function scaleElementCoords(el, ratio) {
  const scaled = { ...el };
  [
    "x",
    "y",
    "width",
    "height",
    "startX",
    "startY",
    "endX",
    "endY",
    "size",
    "canvasWidth",
    "canvasHeight",
  ].forEach((k) => {
    if (typeof scaled[k] === "number") scaled[k] = scaled[k] * ratio;
  });
  if (scaled.originalRect) {
    scaled.originalRect = {
      x: scaled.originalRect.x * ratio,
      y: scaled.originalRect.y * ratio,
      width: scaled.originalRect.width * ratio,
      height: scaled.originalRect.height * ratio,
    };
  }
  if (scaled.path)
    scaled.path = scaled.path.map((p) => ({ x: p.x * ratio, y: p.y * ratio }));
  return scaled;
}

export default function PdfCanvasEditor({ file, onCancel, onSave }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [activeTool, setActiveTool] = useState("selection");
  const [selectedColor, setSelectedColor] = useState("#FFD56F");
  const [selectedOpacity] = useState(0.5);
  const [zoom, setZoom] = useState(1);

  const [textSize, setTextSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");

  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasRef = useRef(null);
  const elementsRef = useRef([]);
  const prevCanvasWidthRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [startPoint, setStartPoint] = useState(null);

  const [selectedElementId, setSelectedElementId] = useState(null);

  // Image Upload State
  const fileInputRef = useRef(null);
  const [pendingImage, setPendingImage] = useState(null);

  // Signature pad state
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const sigCanvasRef = useRef(null);
  const sigDrawingRef = useRef(false);
  const sigLastPointRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Keep placed annotations glued to the content they mark when zoom or page size changes.
  const handlePageRenderSuccess = () => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const newWidth = canvasEl.getBoundingClientRect().width;
    const prevWidth = prevCanvasWidthRef.current;
    if (prevWidth && Math.abs(newWidth - prevWidth) > 1) {
      const ratio = newWidth / prevWidth;
      setElements((prev) => {
        const scaled = prev.map((el) => scaleElementCoords(el, ratio));
        elementsRef.current = scaled;
        return scaled;
      });
    }
    prevCanvasWidthRef.current = newWidth;
  };

  useEffect(() => {
    const wrapper = canvasRef.current?.parentElement;
    if (!wrapper) return;

    const handleDelegatedClick = (e) => {
      if (activeTool !== "edit") return;
      const span = e.target.closest(".react-pdf__Page__textContent span");
      if (!span) return;

      e.preventDefault();
      e.stopPropagation();

      const text = span.textContent;
      if (!text || text.trim() === "") return;

      const rect = span.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = rect.left - canvasRect.left;
      const y = rect.top - canvasRect.top;

      const newId = Date.now();
      const fontSize = parseFloat(window.getComputedStyle(span).fontSize) || 16;
      const newEl = {
        id: newId,
        type: "text",
        x,
        y,
        text,
        page: pageNumber,
        color: "#000000",
        size: fontSize,
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        isReplacement: true,
        originalRect: { x, y, width: rect.width, height: rect.height },
        originalText: text,
        canvasWidth: canvasRect.width,
        canvasHeight: canvasRect.height,
      };

      saveHistory([...elements, newEl]);
      setSelectedElementId(newId);

      // Forcefully blur to prevent mobile keyboard from popping up automatically
      setTimeout(() => {
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
          document.activeElement.blur();
        }
      }, 50);
    };

    wrapper.addEventListener("click", handleDelegatedClick);
    return () => wrapper.removeEventListener("click", handleDelegatedClick);
  }, [activeTool, elements, pageNumber, history, historyIndex, saveHistory]);

  // Text layer interactivity per tool. 'highlight' now behaves like 'selection' (native text
  // selection) so highlighting can grab real text instead of a blind rectangle drag.
  useEffect(() => {
    const styleId = "pdf-edit-mode-styles";
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    if (activeTool === "edit") {
      styleEl.innerHTML = `
        .react-pdf__Page__textContent { pointer-events: auto !important; user-select: none !important; }
        .react-pdf__Page__textContent span { cursor: text !important; }
        .react-pdf__Page__textContent span:hover { background-color: rgba(0, 120, 255, 0.1) !important; outline: 1px dashed blue; }
      `;
    } else if (activeTool === "selection" || activeTool === "highlight") {
      styleEl.innerHTML = `
        .react-pdf__Page__textContent { pointer-events: auto !important; user-select: text !important; }
        .react-pdf__Page__textContent span { cursor: text !important; user-select: text !important; }
      `;
    } else {
      styleEl.innerHTML = `.react-pdf__Page__textContent { pointer-events: none !important; }`;
    }
  }, [activeTool]);

  useEffect(() => {
    const hideReplacedText = () => {
      const textLayer = document.querySelector(".react-pdf__Page__textContent");
      if (!textLayer || !canvasRef.current) return;
      const spans = textLayer.querySelectorAll("span");
      const replacements = elements.filter(
        (el) => el.page === pageNumber && el.isReplacement,
      );

      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = rect.left - canvasRect.left;
        const y = rect.top - canvasRect.top;
        const isReplaced = replacements.some(
          (rep) =>
            rep.originalText.trim() === span.textContent.trim() &&
            Math.abs(rep.originalRect.x - x) < 30 &&
            Math.abs(rep.originalRect.y - y) < 30,
        );
        if (isReplaced) {
          span.style.opacity = "0";
          span.style.pointerEvents = "none";
        } else {
          span.style.opacity = "1";
          span.style.pointerEvents = "auto";
        }
      });
    };
    hideReplacedText();
    const textLayerContainer = document.querySelector(".react-pdf__Document");
    if (!textLayerContainer) return;
    const observer = new MutationObserver(() => hideReplacedText());
    observer.observe(textLayerContainer, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [elements, pageNumber]);

  // Real text-selection highlighting: select text with the mouse while the Highlight tool is
  // active, and on release turn the selection's line rects into highlight boxes.
  useEffect(() => {
    if (activeTool !== "highlight") return;
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0)
        return;
      const range = selection.getRangeAt(0);
      const rects = Array.from(range.getClientRects()).filter(
        (r) => r.width > 1 && r.height > 1,
      );
      if (rects.length === 0) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newHighlights = rects.map((r) => ({
        id: Date.now() + Math.random(),
        type: "highlight",
        startX: r.left - canvasRect.left,
        startY: r.top - canvasRect.top,
        endX: r.right - canvasRect.left,
        endY: r.bottom - canvasRect.top,
        page: pageNumber,
        color: selectedColor,
        opacity: selectedOpacity,
        canvasWidth: canvasRect.width,
        canvasHeight: canvasRect.height,
      }));
      saveHistory([...elements, ...newHighlights]);
      selection.removeAllRanges();
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [activeTool, elements, pageNumber, selectedColor, selectedOpacity, history, historyIndex, saveHistory]);

  // Keyboard shortcuts: Delete/Backspace removes the selected element, Escape deselects,
  // Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redoes.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedElementId != null
      ) {
        e.preventDefault();
        deleteElement(selectedElementId);
      } else if (e.key === "Escape") {
        setSelectedElementId(null);
        setActiveTool("selection");
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, elements, history, historyIndex, deleteElement, handleRedo, handleUndo]);

  function saveHistory(newElements) {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setElements(newElements);
    elementsRef.current = newElements;
  }

  function handleUndo() {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setElements(prev);
      elementsRef.current = prev;
      setSelectedElementId(null);
    }
  }

  function handleRedo() {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setElements(next);
      elementsRef.current = next;
      setSelectedElementId(null);
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setActiveTool("selection");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingImage(ev.target.result);
      showToast("Click anywhere on the document to place the image", "info");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCanvasMouseDown = (e) => {
    if (
      e.target.closest(".interactive-element") ||
      e.target.closest(".mini-toolbar")
    )
      return;

    if (activeTool === "selection") {
      setSelectedElementId(null);
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "draw") {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    } else if (activeTool === "arrow") {
      setIsDrawing(true);
      setStartPoint({ x, y });
    } else if (activeTool === "erase") {
      const elToErase = elements.findLast((el) => {
        if (el.page !== pageNumber) return false;
        let minX = 0,
          maxX = 0,
          minY = 0,
          maxY = 0;
        if (el.type === "highlight") {
          minX = Math.min(el.startX, el.endX);
          maxX = Math.max(el.startX, el.endX);
          minY = Math.min(el.startY, el.endY);
          maxY = Math.max(el.startY, el.endY);
        } else if (el.type === "text") {
          minX = el.x;
          maxX = el.x + 100;
          minY = el.y;
          maxY = el.y + 30;
        } else if (el.type === "image") {
          minX = el.x;
          maxX = el.x + el.width;
          minY = el.y;
          maxY = el.y + el.height;
        } else if (el.type === "draw" || el.type === "sign") {
          if (!el.path || el.path.length === 0) return false;
          minX = Math.min(...el.path.map((p) => p.x));
          maxX = Math.max(...el.path.map((p) => p.x));
          minY = Math.min(...el.path.map((p) => p.y));
          maxY = Math.max(...el.path.map((p) => p.y));
        } else if (el.type === "cross" || el.type === "check") {
          minX = el.x - 15;
          maxX = el.x + 15;
          minY = el.y - 15;
          maxY = el.y + 15;
        } else if (el.type === "arrow") {
          minX = Math.min(el.startX, el.endX) - 10;
          maxX = Math.max(el.startX, el.endX) + 10;
          minY = Math.min(el.startY, el.endY) - 10;
          maxY = Math.max(el.startY, el.endY) + 10;
        }
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      });
      if (elToErase)
        saveHistory(elements.filter((el) => el.id !== elToErase.id));
    }
  };

  const handleCanvasClick = (e) => {
    if (
      e.target.closest(".interactive-element") ||
      e.target.closest(".mini-toolbar")
    )
      return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "text") {
      const newId = Date.now();
      const newEl = {
        id: newId,
        type: "text",
        x,
        y,
        text: "",
        page: pageNumber,
        color: selectedColor,
        size: textSize,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        align: textAlign,
        canvasWidth: rect.width,
        canvasHeight: rect.height,
      };
      saveHistory([...elements, newEl]);
      setSelectedElementId(newId);
      // We focus manually in a slight timeout to ensure the browser has finished processing the click event
      setTimeout(() => {
        const input = document.getElementById(`text-input-${newId}`);
        if (input) input.focus();
      }, 10);
    } else if (activeTool === "image" && pendingImage) {
      const newId = Date.now();
      saveHistory([
        ...elements,
        {
          id: newId,
          type: "image",
          x,
          y,
          width: 200,
          height: 200,
          src: pendingImage,
          page: pageNumber,
          canvasWidth: rect.width,
          canvasHeight: rect.height,
        },
      ]);
      setPendingImage(null);
      setActiveTool("selection");
      setSelectedElementId(newId);
    } else if (activeTool === "cross" || activeTool === "check") {
      const newId = Date.now();
      saveHistory([
        ...elements,
        {
          id: newId,
          type: activeTool,
          x,
          y,
          page: pageNumber,
          color: selectedColor,
          canvasWidth: rect.width,
          canvasHeight: rect.height,
        },
      ]);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "draw") {
      setCurrentPath([...currentPath, { x, y }]);
    } else if (activeTool === "arrow") {
      setCurrentPath([
        { x: startPoint.x, y: startPoint.y },
        { x, y },
      ]);
    }
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (activeTool === "draw" && currentPath.length > 1) {
      saveHistory([
        ...elements,
        {
          id: Date.now(),
          type: "draw",
          path: currentPath,
          page: pageNumber,
          color: selectedColor,
          canvasWidth: canvasRef.current?.getBoundingClientRect().width,
          canvasHeight: canvasRef.current?.getBoundingClientRect().height,
        },
      ]);
    } else if (activeTool === "arrow" && currentPath.length === 2) {
      saveHistory([
        ...elements,
        {
          id: Date.now(),
          type: "arrow",
          startX: currentPath[0].x,
          startY: currentPath[0].y,
          endX: currentPath[1].x,
          endY: currentPath[1].y,
          page: pageNumber,
          color: selectedColor,
          canvasWidth: canvasRef.current?.getBoundingClientRect().width,
          canvasHeight: canvasRef.current?.getBoundingClientRect().height,
        },
      ]);
    }
    setCurrentPath([]);
  };

  const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0, g: 0, b: 0 };
  };

  const handleSave = async () => {
    try {
      showToast("Saving PDF...", "info");
      const currentElements = elementsRef.current;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const fontBoldItalic = await pdfDoc.embedFont(
        StandardFonts.HelveticaBoldOblique,
      );

      for (const el of currentElements) {
        if (el.type === "text" && !el.text && !el.isReplacement) continue;
        const page = pdfDoc.getPage(el.page - 1);
        const { width: pdfW, height: pdfH } = page.getSize();
        const scaleX = el.canvasWidth ? pdfW / el.canvasWidth : 1;
        const scaleY = el.canvasHeight ? pdfH / el.canvasHeight : 1;
        const { r, g, b } = hexToRgb(el.color || "#000000");

        if (el.type === "text") {
          const fontSize = (el.size || 16) * scaleY;
          if (el.isReplacement && el.originalRect) {
            const rx = el.originalRect.x * scaleX,
              ry = pdfH - (el.originalRect.y + el.originalRect.height) * scaleY;
            const rw = el.originalRect.width * scaleX,
              rh = el.originalRect.height * scaleY;
            page.drawRectangle({
              x: rx - 1,
              y: ry - 2,
              width: rw + 2,
              height: rh + 4,
              color: rgb(1, 1, 1),
            });
          }
          let font = fontRegular;
          if (el.bold && el.italic) font = fontBoldItalic;
          else if (el.bold) font = fontBold;
          else if (el.italic) font = fontItalic;

          const tx = el.x * scaleX;
          const ty = pdfH - el.y * scaleY - fontSize;
          if (el.text) {
            page.drawText(el.text, {
              x: tx,
              y: ty,
              size: fontSize,
              font: font,
              color: rgb(r, g, b),
            });
            if (el.underline) {
              const textWidth = font.widthOfTextAtSize(el.text, fontSize);
              page.drawLine({
                start: { x: tx, y: ty - 2 },
                end: { x: tx + textWidth, y: ty - 2 },
                thickness: Math.max(1, fontSize * 0.05),
                color: rgb(r, g, b),
              });
            }
          }
        } else if (el.type === "image") {
          const imageBytes = await fetch(el.src).then((res) =>
            res.arrayBuffer(),
          );
          let pdfImage;
          if (el.src.startsWith("data:image/png")) {
            pdfImage = await pdfDoc.embedPng(imageBytes);
          } else {
            pdfImage = await pdfDoc.embedJpg(imageBytes);
          }
          page.drawImage(pdfImage, {
            x: el.x * scaleX,
            y: pdfH - (el.y + el.height) * scaleY,
            width: el.width * scaleX,
            height: el.height * scaleY,
          });
        } else if (el.type === "draw" || el.type === "sign") {
          if (el.path.length > 1) {
            const sx = pdfW / (el.canvasWidth || pdfW),
              sy = pdfH / (el.canvasHeight || pdfH);
            for (let i = 0; i < el.path.length - 1; i++) {
              page.drawLine({
                start: { x: el.path[i].x * sx, y: pdfH - el.path[i].y * sy },
                end: {
                  x: el.path[i + 1].x * sx,
                  y: pdfH - el.path[i + 1].y * sy,
                },
                thickness: 2,
                color: rgb(r, g, b),
              });
            }
          }
        } else if (el.type === "arrow") {
          const sx = pdfW / (el.canvasWidth || pdfW),
            sy = pdfH / (el.canvasHeight || pdfH);
          const start = { x: el.startX * sx, y: pdfH - el.startY * sy },
            end = { x: el.endX * sx, y: pdfH - el.endY * sy };
          page.drawLine({ start, end, thickness: 2, color: rgb(r, g, b) });
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          const headlen = 10;
          page.drawLine({
            start: end,
            end: {
              x: end.x - headlen * Math.cos(angle - Math.PI / 6),
              y: end.y - headlen * Math.sin(angle - Math.PI / 6),
            },
            thickness: 2,
            color: rgb(r, g, b),
          });
          page.drawLine({
            start: end,
            end: {
              x: end.x - headlen * Math.cos(angle + Math.PI / 6),
              y: end.y - headlen * Math.sin(angle + Math.PI / 6),
            },
            thickness: 2,
            color: rgb(r, g, b),
          });
        } else if (el.type === "check" || el.type === "cross") {
          const sx = pdfW / (el.canvasWidth || pdfW),
            sy = pdfH / (el.canvasHeight || pdfH);
          const cx = el.x * sx,
            cy = pdfH - el.y * sy,
            size = 15;
          if (el.type === "check") {
            page.drawLine({
              start: { x: cx - size / 2, y: cy },
              end: { x: cx - size / 6, y: cy - size / 2 },
              thickness: 2,
              color: rgb(r, g, b),
            });
            page.drawLine({
              start: { x: cx - size / 6, y: cy - size / 2 },
              end: { x: cx + size / 2, y: cy + size / 2 },
              thickness: 2,
              color: rgb(r, g, b),
            });
          } else {
            page.drawLine({
              start: { x: cx - size / 2, y: cy - size / 2 },
              end: { x: cx + size / 2, y: cy + size / 2 },
              thickness: 2,
              color: rgb(r, g, b),
            });
            page.drawLine({
              start: { x: cx - size / 2, y: cy + size / 2 },
              end: { x: cx + size / 2, y: cy - size / 2 },
              thickness: 2,
              color: rgb(r, g, b),
            });
          }
        } else if (el.type === "highlight") {
          const sx = pdfW / (el.canvasWidth || pdfW),
            sy = pdfH / (el.canvasHeight || pdfH);
          const rectX = Math.min(el.startX, el.endX) * sx,
            rectY = Math.min(el.startY, el.endY) * sy;
          const rectW = Math.abs(el.endX - el.startX) * sx,
            rectH = Math.abs(el.endY - el.startY) * sy;
          page.drawRectangle({
            x: rectX,
            y: pdfH - rectY - rectH,
            width: rectW,
            height: rectH,
            color: rgb(r, g, b),
            opacity: el.opacity,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      if (onSave) {
        onSave(
          new Blob([pdfBytes], { type: "application/pdf" }),
          `edited_${file.name}`,
        );
      } else {
        saveAs(
          new Blob([pdfBytes], { type: "application/pdf" }),
          `edited_${file.name}`,
        );
      }
      showToast("PDF Saved Successfully!", "success");
      setSelectedElementId(null);
    } catch (err) {
      console.error("[PDF Save] Error:", err);
      showToast("Error saving PDF: " + err.message, "error");
    }
  };

  function updateElement(id, newProps) {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newProps } : el)),
    );
  }
  function updateElementAndSaveHistory(id, newProps) {
    saveHistory(
      elements.map((el) => (el.id === id ? { ...el, ...newProps } : el)),
    );
  }
  function deleteElement(id) {
    saveHistory(elements.filter((el) => el.id !== id));
    setSelectedElementId(null);
  }
  const toggleFormat = (format, currentState, setter) => {
    setter(!currentState);
    if (selectedElementId)
      updateElementAndSaveHistory(selectedElementId, {
        [format]: !currentState,
      });
  };
  const applyAlign = (alignValue) => {
    setTextAlign(alignValue);
    if (selectedElementId)
      updateElementAndSaveHistory(selectedElementId, { align: alignValue });
  };

  // Free-drag resize handle for images. Commits to history on mouse-up so a single resize is one undo step.
  const startImageResize = (el, e) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX,
      startY = e.clientY;
    const startW = el.width,
      startH = el.height;
    const onMove = (ev) => {
      const dx = ev.clientX - startX,
        dy = ev.clientY - startY;
      updateElement(el.id, {
        width: Math.max(30, startW + dx),
        height: Math.max(30, startH + dy),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setElements((curr) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(curr);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        elementsRef.current = curr;
        return curr;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)));
  const zoomReset = () => setZoom(1);

  // Signature pad: draws with a transparent background so the exported PNG only contains ink,
  // then drops it in as a normal (movable, resizable) image element rather than a raw pen stroke.
  const openSignatureModal = () => {
    setShowSignatureModal(true);
    setTimeout(() => {
      const canvas = sigCanvasRef.current;
      if (canvas)
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }, 0);
  };
  const handleSigMouseDown = (e) => {
    sigDrawingRef.current = true;
    const rect = sigCanvasRef.current.getBoundingClientRect();
    sigLastPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };
  const handleSigMouseMove = (e) => {
    if (!sigDrawingRef.current) return;
    const rect = sigCanvasRef.current.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const ctx = sigCanvasRef.current.getContext("2d");
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(sigLastPointRef.current.x, sigLastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    sigLastPointRef.current = point;
  };
  const handleSigMouseUp = () => {
    sigDrawingRef.current = false;
  };
  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };
  const insertSignature = () => {
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let hasInk = false;
    for (let i = 3; i < pixelData.length; i += 4) {
      if (pixelData[i] !== 0) {
        hasInk = true;
        break;
      }
    }
    if (!hasInk) {
      showToast("Draw your signature first", "error");
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    const rect = canvasRef.current.getBoundingClientRect();
    const width = 180,
      height = 68;
    const newId = Date.now();
    saveHistory([
      ...elements,
      {
        id: newId,
        type: "image",
        x: (rect.width - width) / 2,
        y: rect.height / 2,
        width,
        height,
        src: dataUrl,
        page: pageNumber,
        canvasWidth: rect.width,
        canvasHeight: rect.height,
      },
    ]);
    setShowSignatureModal(false);
    setActiveTool("selection");
    setSelectedElementId(newId);
  };

  const ToolBtn = ({ id, icon: Icon, label, disabled }) => (
    <button
      className={`w-full flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-colors ${activeTool === id ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" : "text-gray-600 hover:bg-gray-100"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => {
        if (disabled) return;
        if (id === "image") {
          fileInputRef.current?.click();
          return;
        }
        if (id === "sign") {
          openSignatureModal();
          return;
        }
        setActiveTool(id);
      }}
      title={label}
    >
      <Icon size={22} strokeWidth={activeTool === id ? 2.5 : 2} />
      <span className="text-[10px] font-medium hidden md:block">{label}</span>
    </button>
  );

  const needsPropertiesPanel =
    ["text", "draw", "highlight", "arrow", "check", "cross"].includes(
      activeTool,
    ) || selectedElementId !== null;
  const overlayInteractive = !(
    activeTool === "selection" ||
    activeTool === "edit" ||
    activeTool === "highlight"
  );

  return (
    <div className="flex h-[85vh] relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 text-gray-800 shadow-xl font-sans">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Left Sidebar Toolbar (PDF Guru Style) */}
      <div className="w-20 md:w-24 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2 z-20 shadow-sm overflow-y-auto shrink-0">
        <ToolBtn id="selection" icon={MousePointer2} label="Select" />
        <div className="w-12 h-[1px] bg-gray-100 my-1 shrink-0" />
        <ToolBtn id="edit" icon={FileEdit} label="Edit PDF" />
        <ToolBtn id="text" icon={Type} label="Add Text" />
        <ToolBtn id="image" icon={ImageIcon} label="Image" />
        <ToolBtn id="sign" icon={PenLine} label="Sign" />
        <div className="w-12 h-[1px] bg-gray-100 my-1 shrink-0" />
        <ToolBtn id="draw" icon={PenTool} label="Draw" />
        <ToolBtn id="highlight" icon={Highlighter} label="Highlight" />
        <ToolBtn id="erase" icon={Eraser} label="Eraser" />
        <div className="w-12 h-[1px] bg-gray-100 my-1 shrink-0" />
        <ToolBtn id="arrow" icon={MoveUpRight} label="Arrow" />
        <ToolBtn id="check" icon={Check} label="Check" />
        <ToolBtn id="cross" icon={X} label="Cross" />
      </div>

      {/* Center Canvas Workspace */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-100/50">
        {/* Top Header */}
        <div className="min-h-[4rem] py-2 md:py-0 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between px-2 md:px-6 shadow-sm z-10 shrink-0 gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button
                className={`p-1 md:p-2 rounded hover:bg-white hover:shadow-sm ${historyIndex === 0 ? "opacity-30" : ""}`}
                onClick={handleUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
              <button
                className={`p-1 md:p-2 rounded hover:bg-white hover:shadow-sm ${historyIndex === history.length - 1 ? "opacity-30" : ""}`}
                onClick={handleRedo}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200 hidden sm:flex">
              <button
                className="p-1 md:p-2 rounded hover:bg-white hover:shadow-sm"
                onClick={zoomOut}
                title="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                className="text-xs font-medium w-10 md:w-12 text-center hover:bg-white rounded py-1"
                onClick={zoomReset}
                title="Reset zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                className="p-1 md:p-2 rounded hover:bg-white hover:shadow-sm"
                onClick={zoomIn}
                title="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
            </div>
            {pendingImage && (
              <span className="text-[10px] md:text-sm font-medium text-blue-600 bg-blue-50 px-2 md:px-3 py-1 rounded-full border border-blue-200">
                Place image
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            <button
              className="px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition flex items-center gap-1 md:gap-2"
              onClick={handleSave}
            >
              <Download size={14} className="md:w-4 md:h-4" /> 
              <span className="hidden sm:inline">Preview & Download</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex justify-center py-10 px-4 relative">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="shadow-2xl"
          >
            <div className="relative border border-gray-200 bg-white ring-1 ring-gray-900/5">
              <Page
                pageNumber={pageNumber}
                scale={zoom}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                onRenderSuccess={handlePageRenderSuccess}
              />

              {/* Interactive Overlay */}
              <div
                ref={canvasRef}
                className={`absolute top-0 left-0 w-full h-full z-10 ${["draw", "erase", "text", "arrow", "check", "cross", "image"].includes(activeTool) ? "cursor-crosshair" : ""}`}
                style={{ pointerEvents: overlayInteractive ? "auto" : "none" }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onClick={handleCanvasClick}
              >
                {elements
                  .filter((el) => el.page === pageNumber)
                  .map((el) => {
                    const isSelected = selectedElementId === el.id;

                    if (el.type === "image") {
                      return (
                        <motion.div
                          key={el.id}
                          className="interactive-element absolute"
                          style={{
                            left: 0,
                            top: 0,
                            x: el.x,
                            y: el.y,
                            width: el.width,
                            height: el.height,
                            pointerEvents: "auto",
                          }}
                          drag={activeTool === "selection"}
                          dragMomentum={false}
                          onDragEnd={(e, info) =>
                            updateElementAndSaveHistory(el.id, {
                              x: el.x + info.offset.x,
                              y: el.y + info.offset.y,
                            })
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTool("selection");
                            setSelectedElementId(el.id);
                          }}
                        >
                          <div
                            className={`w-full h-full border-2 ${isSelected ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]" : "border-transparent"} relative group`}
                          >
                            <img
                              src={el.src}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "fill",
                              }}
                              draggable={false}
                            />
                            {isSelected && (
                              <>
                                <button
                                  className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1 shadow-sm"
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    deleteElement(el.id);
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                                <div
                                  className="absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white shadow"
                                  style={{
                                    pointerEvents: "auto",
                                    cursor: "nwse-resize",
                                  }}
                                  onMouseDown={(e) => startImageResize(el, e)}
                                />
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    }

                    if (el.type === "text") {
                      if (el.isReplacement) {
                        return (
                          <React.Fragment key={el.id}>
                            <div
                              className="absolute bg-white"
                              style={{
                                left: el.originalRect.x,
                                top: el.originalRect.y,
                                width: el.originalRect.width + 8,
                                height: el.originalRect.height + 4,
                                zIndex: 49,
                                pointerEvents: "none",
                              }}
                            />
                            <div
                              className="absolute"
                              style={{
                                left: el.x,
                                top: el.y,
                                zIndex: 60,
                                pointerEvents: "auto",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedElementId(el.id);
                              }}
                            >
                              <input
                                type="text"
                                value={el.text}
                                onChange={(e) =>
                                  updateElement(el.id, { text: e.target.value })
                                }
                                onBlur={() =>
                                  updateElementAndSaveHistory(el.id, {
                                    text: el.text,
                                  })
                                }
                                className="bg-transparent outline-none m-0 p-0"
                                style={{
                                  color: el.color || "#000000",
                                  fontSize: el.size || 16,
                                  fontWeight: el.bold ? "bold" : "normal",
                                  fontStyle: el.italic ? "italic" : "normal",
                                  textDecoration: el.underline
                                    ? "underline"
                                    : "none",
                                  textAlign: el.align || "left",
                                  fontFamily: "Helvetica, Arial, sans-serif",
                                  width: `${Math.max(60, measureTextWidth(el.text, el.size, el.bold, el.italic) + 12)}px`,
                                  border: isSelected
                                    ? "1px dashed #3b82f6"
                                    : "1px dashed transparent",
                                  borderRadius: 2,
                                  cursor: "text",
                                  pointerEvents: "auto",
                                }}
                                autoFocus={false}
                              />
                              {isSelected && (
                                <button
                                  className="absolute -top-5 right-0 text-[10px] bg-red-100 hover:bg-red-200 text-red-600 rounded px-1"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    deleteElement(el.id);
                                  }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </React.Fragment>
                        );
                      }

                      return (
                        <motion.div
                          key={el.id}
                          className="interactive-element absolute"
                          style={{
                            left: 0,
                            top: 0,
                            x: el.x,
                            y: el.y,
                            pointerEvents: "auto",
                          }}
                          drag={activeTool === "selection"}
                          dragMomentum={false}
                          onDragEnd={(e, info) =>
                            updateElementAndSaveHistory(el.id, {
                              x: el.x + info.offset.x,
                              y: el.y + info.offset.y,
                            })
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTool("selection");
                            setSelectedElementId(el.id);
                          }}
                        >
                          <div
                            className={`p-1 -m-1 border-2 ${isSelected ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]" : "border-transparent"}`}
                          >
                            <input
                              id={`text-input-${el.id}`}
                              type="text"
                              value={el.text}
                              onChange={(e) =>
                                updateElement(el.id, { text: e.target.value })
                              }
                              onBlur={() => {
                                if (!el.text.trim()) deleteElement(el.id);
                                else
                                  updateElementAndSaveHistory(el.id, {
                                    text: el.text,
                                  });
                              }}
                              placeholder={isSelected ? "Type..." : ""}
                              className="bg-transparent outline-none m-0 p-0 resize-none min-w-[50px]"
                              style={{
                                color: el.color,
                                fontSize: el.size || 16,
                                fontWeight: el.bold ? "bold" : "normal",
                                fontStyle: el.italic ? "italic" : "normal",
                                textDecoration: el.underline
                                  ? "underline"
                                  : "none",
                                textAlign: el.align || "left",
                                fontFamily: "Helvetica, Arial, sans-serif",
                                width: `${Math.max(50, measureTextWidth(el.text, el.size, el.bold, el.italic) + 16)}px`,
                              }}
                              autoFocus={isSelected && !el.text}
                            />
                          </div>
                        </motion.div>
                      );
                    }
                    if (el.type === "highlight") {
                      return (
                        <div
                          key={el.id}
                          style={{
                            position: "absolute",
                            left: Math.min(el.startX, el.endX),
                            top: Math.min(el.startY, el.endY),
                            width: Math.abs(el.endX - el.startX),
                            height: Math.abs(el.endY - el.startY),
                            backgroundColor: el.color,
                            opacity: el.opacity,
                            pointerEvents: "none",
                          }}
                        />
                      );
                    }
                    return null;
                  })}

                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {elements
                    .filter(
                      (el) =>
                        el.page === pageNumber &&
                        (el.type === "draw" || el.type === "sign"),
                    )
                    .map((el) => (
                      <polyline
                        key={el.id}
                        points={el.path.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke={el.color || "red"}
                        strokeWidth="2"
                      />
                    ))}
                  {elements
                    .filter(
                      (el) => el.page === pageNumber && el.type === "arrow",
                    )
                    .map((el) => {
                      const angle = Math.atan2(
                        el.endY - el.startY,
                        el.endX - el.startX,
                      );
                      const headlen = 10;
                      return (
                        <g
                          key={el.id}
                          stroke={el.color || "red"}
                          strokeWidth="2"
                          fill="none"
                        >
                          <line
                            x1={el.startX}
                            y1={el.startY}
                            x2={el.endX}
                            y2={el.endY}
                          />
                          <line
                            x1={el.endX}
                            y1={el.endY}
                            x2={
                              el.endX - headlen * Math.cos(angle - Math.PI / 6)
                            }
                            y2={
                              el.endY - headlen * Math.sin(angle - Math.PI / 6)
                            }
                          />
                          <line
                            x1={el.endX}
                            y1={el.endY}
                            x2={
                              el.endX - headlen * Math.cos(angle + Math.PI / 6)
                            }
                            y2={
                              el.endY - headlen * Math.sin(angle + Math.PI / 6)
                            }
                          />
                        </g>
                      );
                    })}
                  {elements
                    .filter(
                      (el) => el.page === pageNumber && el.type === "check",
                    )
                    .map((el) => (
                      <g
                        key={el.id}
                        stroke={el.color || "black"}
                        strokeWidth="2"
                        fill="none"
                      >
                        <line
                          x1={el.x - 7.5}
                          y1={el.y}
                          x2={el.x - 2.5}
                          y2={el.y - 7.5}
                        />
                        <line
                          x1={el.x - 2.5}
                          y1={el.y - 7.5}
                          x2={el.x + 7.5}
                          y2={el.y + 7.5}
                        />
                      </g>
                    ))}
                  {elements
                    .filter(
                      (el) => el.page === pageNumber && el.type === "cross",
                    )
                    .map((el) => (
                      <g
                        key={el.id}
                        stroke={el.color || "black"}
                        strokeWidth="2"
                        fill="none"
                      >
                        <line
                          x1={el.x - 7.5}
                          y1={el.y - 7.5}
                          x2={el.x + 7.5}
                          y2={el.y + 7.5}
                        />
                        <line
                          x1={el.x - 7.5}
                          y1={el.y + 7.5}
                          x2={el.x + 7.5}
                          y2={el.y - 7.5}
                        />
                      </g>
                    ))}
                  {isDrawing &&
                    activeTool === "draw" &&
                    currentPath.length > 0 && (
                      <polyline
                        points={currentPath
                          .map((p) => `${p.x},${p.y}`)
                          .join(" ")}
                        fill="none"
                        stroke={selectedColor}
                        strokeWidth="2"
                      />
                    )}
                  {isDrawing &&
                    activeTool === "arrow" &&
                    currentPath.length === 2 && (
                      <g stroke={selectedColor} strokeWidth="2" fill="none">
                        <line
                          x1={currentPath[0].x}
                          y1={currentPath[0].y}
                          x2={currentPath[1].x}
                          y2={currentPath[1].y}
                        />
                      </g>
                    )}
                </svg>
              </div>
            </div>
          </Document>
        </div>

        {/* Floating Page Navigation */}
        {numPages > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center bg-white shadow-xl rounded-full px-4 py-2 border border-gray-100 z-20">
            <button
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
            >
              &lt;
            </button>
            <span className="text-sm font-medium mx-4">
              Page {pageNumber} of {numPages}
            </span>
            <button
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar Properties Panel */}
      {needsPropertiesPanel && (
        <div className="absolute bottom-0 left-20 right-0 h-[45%] md:h-auto md:relative w-auto md:w-64 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col p-5 gap-6 z-30 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-sm shrink-0 overflow-y-auto">
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
                  onClick={() => {
                    setSelectedColor(c);
                    if (selectedElementId)
                      updateElementAndSaveHistory(selectedElementId, {
                        color: c,
                      });
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

          {["text"].includes(activeTool) && (
            <>
              <div className="h-[1px] w-full bg-gray-100" />
              <div>
                <span className="text-sm font-medium text-gray-700 mb-2 block">
                  Typography
                </span>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-1 mb-2">
                  <button
                    onClick={() => toggleFormat("bold", isBold, setIsBold)}
                    className={`flex-1 p-2 rounded ${isBold ? "bg-white shadow-sm font-bold text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    B
                  </button>
                  <button
                    onClick={() =>
                      toggleFormat("italic", isItalic, setIsItalic)
                    }
                    className={`flex-1 p-2 rounded italic ${isItalic ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    I
                  </button>
                  <button
                    onClick={() =>
                      toggleFormat("underline", isUnderline, setIsUnderline)
                    }
                    className={`flex-1 p-2 rounded underline ${isUnderline ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    U
                  </button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => applyAlign("left")}
                    className={`flex-1 p-2 flex justify-center rounded ${textAlign === "left" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    <AlignLeft size={16} />
                  </button>
                  <button
                    onClick={() => applyAlign("center")}
                    className={`flex-1 p-2 flex justify-center rounded ${textAlign === "center" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    <AlignCenter size={16} />
                  </button>
                  <button
                    onClick={() => applyAlign("right")}
                    className={`flex-1 p-2 flex justify-center rounded ${textAlign === "right" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    <AlignRight size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Font Size
                </span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => {
                      const s = Math.max(8, textSize - 2);
                      setTextSize(s);
                      if (selectedElementId)
                        updateElementAndSaveHistory(selectedElementId, {
                          size: s,
                        });
                    }}
                    className="p-1 hover:bg-gray-100 bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={8}
                    value={textSize}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      if (!Number.isFinite(s)) return;
                      setTextSize(s);
                      if (selectedElementId)
                        updateElementAndSaveHistory(selectedElementId, {
                          size: s,
                        });
                    }}
                    className="w-10 text-center text-sm outline-none border-x border-gray-200"
                  />
                  <button
                    onClick={() => {
                      const s = textSize + 2;
                      setTextSize(s);
                      if (selectedElementId)
                        updateElementAndSaveHistory(selectedElementId, {
                          size: s,
                        });
                    }}
                    className="p-1 hover:bg-gray-100 bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTool === "highlight" && selectedElementId === null && (
            <p className="text-xs text-gray-400 leading-relaxed">
              Select text in the document with your mouse — it'll be highlighted
              in this color automatically.
            </p>
          )}

          {selectedElementId !== null && (
            <>
              <div className="h-[1px] w-full bg-gray-100" />
              <button
                className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                onClick={() => deleteElement(selectedElementId)}
              >
                <Trash2 size={16} /> Delete Element
              </button>
            </>
          )}
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setShowSignatureModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-[460px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                Draw your signature
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowSignatureModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <canvas
              ref={sigCanvasRef}
              width={400}
              height={150}
              className="w-full border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 cursor-crosshair"
              onMouseDown={handleSigMouseDown}
              onMouseMove={handleSigMouseMove}
              onMouseUp={handleSigMouseUp}
              onMouseLeave={handleSigMouseUp}
            />
            <div className="flex items-center justify-between mt-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                onClick={clearSignature}
              >
                <RotateCcw size={14} /> Clear
              </button>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowSignatureModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md"
                  onClick={insertSignature}
                >
                  Insert Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
