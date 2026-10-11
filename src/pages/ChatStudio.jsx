import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  MessageSquare,
  UploadCloud,
  FileText,
  Calendar as CalendarIcon,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { uploadWhatsAppChat } from "../api";
import { showToast } from "../components/Toast";
import SEO from "../components/SEO";
import ChatContentSection from "../components/ChatContentSection";

export default function ChatStudio() {
  const [waFile, setWaFile] = useState(null);
  const [waTitle, setWaTitle] = useState("Chat Archive");
  const [waAuthor, setWaAuthor] = useState("");
  const [waOutputName, setWaOutputName] = useState("chat");
  const [waStartDate, setWaStartDate] = useState("");
  const [waEndDate, setWaEndDate] = useState("");
  const [waResult, setWaResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const startCalRef = useRef(null);
  const endCalRef = useRef(null);
  const fileInputRef = useRef(null);

  const formatDateForBackend = (d) => {
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  };

  const parseDateString = (ds) => {
    if (!ds) return new Date();
    const parts = ds.split("-");
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startCalRef.current && !startCalRef.current.contains(event.target)) {
        setShowStartCalendar(false);
      }
      if (endCalRef.current && !endCalRef.current.contains(event.target)) {
        setShowEndCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConvert = async () => {
    if (!waFile) {
      showToast("Please select a chat archive (.zip) file first", "error");
      return;
    }
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("zip_file", waFile);
      if (waAuthor) fd.append("my_name", waAuthor);
      fd.append("title", waTitle || "Chat Archive");
      fd.append("output_filename", waOutputName || "chat");
      if (waStartDate) fd.append("start_date", waStartDate);
      if (waEndDate) fd.append("end_date", waEndDate);

      const res = await uploadWhatsAppChat(fd);
      setWaResult(res.data || res);
      showToast("Chat converted successfully!", "success");
    } catch (e) {
      showToast(e.message || "Failed to convert chat", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-body pt-8">
      <SEO
        title="Chat Studio — Convert & View Chat Archives Online | ApniPDFs"
        description="Upload and convert chat export archives into clean, responsive HTML documents with date filtering and complete client-side privacy."
        keywords="chat studio, convert chat export, chat to html, view chat backup online, ApniPDFs"
        canonical="https://www.apnipdfs.com/chat"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> Conversation Converter
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-white mb-3">
            Chat Studio
          </h1>
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            Convert exported chat backups into clean, searchable, and responsive HTML transcripts with custom date filtering.
          </p>
        </div>

        {/* Main Converter Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-2xl mb-12">
          {/* File Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-500/5 hover:bg-cyan-500/10 rounded-2xl p-8 text-center cursor-pointer transition-all mb-8 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setWaFile(e.target.files[0]);
                  showToast(`Selected: ${e.target.files[0].name}`, "info");
                }
              }}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud size={32} className="text-cyan-400" />
            </div>
            {waFile ? (
              <div>
                <p className="text-white font-bold text-base mb-1">
                  {waFile.name}
                </p>
                <p className="text-white/50 text-xs">
                  {(waFile.size / 1024).toFixed(1)} KB · Click or drag to change
                  file
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white font-bold text-base mb-1">
                  Upload Chat Archive (.zip)
                </p>
                <p className="text-white/50 text-xs">
                  Drag and drop your exported chat archive or browse from your
                  device
                </p>
              </div>
            )}
          </div>

          {/* Form Options Grid */}
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">
                Chat Title
              </label>
              <input
                type="text"
                value={waTitle}
                onChange={(e) => setWaTitle(e.target.value)}
                placeholder="e.g. Project Discussion"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">
                Your Participant Name (Optional)
              </label>
              <input
                type="text"
                value={waAuthor}
                onChange={(e) => setWaAuthor(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">
                Export File Name
              </label>
              <input
                type="text"
                value={waOutputName}
                onChange={(e) => setWaOutputName(e.target.value)}
                placeholder="chat"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div ref={startCalRef} className="relative">
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Start Date
                </label>
                <div
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/80 cursor-pointer flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <span className="truncate">
                    {waStartDate || "Start Date"}
                  </span>
                  <CalendarIcon size={13} className="text-white/40 shrink-0" />
                </div>
                {showStartCalendar && (
                  <div className="absolute top-full left-0 z-30 mt-2 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <Calendar
                      onChange={(d) => {
                        setWaStartDate(formatDateForBackend(d));
                        setShowStartCalendar(false);
                      }}
                      value={parseDateString(waStartDate)}
                      maxDate={
                        waEndDate ? parseDateString(waEndDate) : undefined
                      }
                      className="custom-calendar"
                    />
                  </div>
                )}
              </div>

              <div ref={endCalRef} className="relative">
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  End Date
                </label>
                <div
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/80 cursor-pointer flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <span className="truncate">{waEndDate || "End Date"}</span>
                  <CalendarIcon size={13} className="text-white/40 shrink-0" />
                </div>
                {showEndCalendar && (
                  <div className="absolute top-full right-0 z-30 mt-2 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <Calendar
                      onChange={(d) => {
                        setWaEndDate(formatDateForBackend(d));
                        setShowEndCalendar(false);
                      }}
                      value={parseDateString(waEndDate)}
                      minDate={
                        waStartDate ? parseDateString(waStartDate) : undefined
                      }
                      className="custom-calendar"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-white/40 mb-6 text-center">
            Tip: Leave the date range empty to convert the entire conversation
            history without filters.
          </p>

          {/* Action Button */}
          <button
            onClick={handleConvert}
            disabled={isUploading}
            className="w-full btn btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {isUploading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Processing Chat Archive...</span>
              </>
            ) : (
              <>
                <MessageSquare size={16} />
                <span>Convert Chat Archive</span>
              </>
            )}
          </button>

          {/* Results Box */}
          {waResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base mb-4">
                <CheckCircle2 size={18} />
                <span>Conversion Complete!</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-white/70 mb-6">
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-white/40 text-[11px] mb-1">
                    Total Messages
                  </div>
                  <div className="text-lg font-bold text-white">
                    {waResult.total_messages ?? "—"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-white/40 text-[11px] mb-1">
                    Filtered Output
                  </div>
                  <div className="text-lg font-bold text-emerald-400">
                    {waResult.filtered_messages ?? "—"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={async () => {
                    const newWin = window.open("", "_blank");
                    if (newWin) {
                      newWin.document.write("Loading conversation transcript...");
                      try {
                        const res = await fetch(waResult.html_url);
                        const html = await res.text();
                        newWin.document.open();
                        newWin.document.write(html);
                        newWin.document.close();
                      } catch {
                        newWin.location.href = waResult.html_url;
                      }
                    }
                  }}
                  className="btn btn-secondary w-full sm:w-auto text-xs py-2.5 inline-flex items-center justify-center gap-2"
                >
                  <Eye size={14} /> View Transcript in Browser
                </button>

                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = waResult.html_url;
                    link.download = waResult.download_filename || "chat.html";
                    link.click();
                  }}
                  className="btn btn-primary w-full sm:w-auto text-xs py-2.5 inline-flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download HTML Transcript
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content Section with Guides & FAQs */}
        <ChatContentSection />
      </motion.div>
    </div>
  );
}
