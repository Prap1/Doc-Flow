import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import {
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaSnapchatGhost,
  FaTelegramPlane,
  FaFacebook,
  FaLinkedin,
  FaGoogle,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { uploadWhatsAppChat } from "../api";

import RichEditor from "../components/RichEditor";
import VoiceRecorder from "../components/VoiceRecorder";
import { showToast } from "../components/Toast";
import { createPost, uploadVoice, listPosts, deletePost } from "../api";
import {
  MessageSquare,
  Share2,
  Copy,
  Download,
  Sparkles,
  Globe,
  AtSign,
  Eye,
  Save,
  Trash2,
  ExternalLink,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

const POST_TYPES = [
  {
    id: "post",
    label: "Social Post",
    icon: "📢",
    color: "#6C63FF",
    desc: "Short engaging post for social media",
  },
  {
    id: "story",
    label: "Story",
    icon: "📖",
    color: "#FF6B9D",
    desc: "Longer narrative format for blogs & stories",
  },
  {
    id: "chat",
    label: "Chat",
    icon: "💬",
    color: "#00D9FF",
    desc: "Conversational style message or thread",
  },
];

const POST_PLATFORMS = [
  "youtube",
  "instagram",
  "whatsapp",
  "snapchat",
  "telegram",
  "facebook",
  "linkedin",
  "google apps",
];
const ALL_PLATFORMS = [...POST_PLATFORMS];

const platformIcons = {
  youtube: <FaYoutube size={16} />,
  instagram: <FaInstagram size={16} />,
  whatsapp: <FaWhatsapp size={16} />,
  snapchat: <FaSnapchatGhost size={16} />,
  telegram: <FaTelegramPlane size={16} />,
  facebook: <FaFacebook size={16} />,
  linkedin: <FaLinkedin size={16} />,
  "google apps": <FaGoogle size={16} />,
};

const AVATARS = ["👩‍💻", "🧑‍🎨", "👨‍🚀", "👩‍🏫", "🧙", "🦸", "🦊", "🐼"];
const BACKGROUNDS = [
  {
    label: "Violet",
    value: "linear-gradient(135deg, #1a1040 0%, #0d0825 100%)",
  },
  {
    label: "Ocean",
    value: "linear-gradient(135deg, #0a2040 0%, #051525 100%)",
  },
  { label: "Rose", value: "linear-gradient(135deg, #2a0820 0%, #150310 100%)" },
  {
    label: "Forest",
    value: "linear-gradient(135deg, #082018 0%, #030f0c 100%)",
  },
  {
    label: "Cosmic",
    value: "linear-gradient(135deg, #120828 0%, #200a40 100%)",
  },
];

export default function ChatStudio() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [plainText, setPlainText] = useState("");
  const [avatar, setAvatar] = useState("👩‍💻");
  const [authorName, setAuthorName] = useState("ApniPDFs User");
  const [bg, setBg] = useState(BACKGROUNDS[0].value);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [reactions, setReactions] = useState({
    heart: 0,
    like: 0,
    star: 0,
    bookmark: 0,
  });
  const [tab, setTab] = useState(0); // 0=Create, 1=Preview, 2=Share, 3=My Posts
  const [savedPostId, setSavedPostId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [waFile, setWaFile] = useState(null);
  const [waTitle, setWaTitle] = useState("WhatsApp Chat");
  const [waAuthor, setWaAuthor] = useState("");
  const [waOutputName, setWaOutputName] = useState("chat");
  const [waStartDate, setWaStartDate] = useState("");
  const [waEndDate, setWaEndDate] = useState("");
  const [waResult, setWaResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

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

  const handleWaUpload = async () => {
    if (!waFile) return showToast("Please select a zip file first", "error");
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("zip_file", waFile);
      if (waAuthor) fd.append("my_name", waAuthor);
      fd.append("title", waTitle);
      fd.append("output_filename", waOutputName);
      if (waStartDate) fd.append("start_date", waStartDate);
      if (waEndDate) fd.append("end_date", waEndDate);
      const res = await uploadWhatsAppChat(fd);
      setWaResult(res.data || res);
      showToast("Chat exported successfully!", "success");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const startCalRef = useRef(null);
  const endCalRef = useRef(null);

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

  const [socialPlatform, setSocialPlatform] = useState(POST_PLATFORMS[0]);
  const [socialDrafts, setSocialDrafts] = useState(() => {
    const drafts = {};
    ALL_PLATFORMS.forEach((p) => {
      drafts[p] = { title: "", content: "" };
    });
    return drafts;
  });

  // When activeType changes, make sure socialPlatform is valid for the new type
  useEffect(() => {
    if (activeType === "post" && !POST_PLATFORMS.includes(socialPlatform)) {
      setSocialPlatform(POST_PLATFORMS[0]);
    }
  }, [activeType, socialPlatform]);

  const pt = POST_TYPES.find((p) => p.id === activeType);

  const handleReact = (key) =>
    setReactions((r) => ({ ...r, [key]: r[key] + 1 }));

  const handleShare = (platform) => {
    const text = encodeURIComponent(
      `${title}\n\n${plainText}\n\n— ${authorName} | via ApniPDFs`,
    );
    if (platform === "copy") {
      const url = savedPostId
        ? `${window.location.origin}/share/${savedPostId}`
        : `${title}\n\n${plainText}`;
      navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!", "success");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    }
  };

  // Save post to backend
  const handleSaveToServer = async () => {
    setSaving(true);
    try {
      const post = await createPost({
        type: activeType,
        title,
        content,
        author_name: authorName,
        avatar,
        bg,
        reactions,
      });
      setSavedPostId(post.id);
      // Upload voice if recorded
      if (voiceBlob) {
        await uploadVoice(post.id, voiceBlob);
        showToast("Post & voice saved! Share link ready.", "success");
      } else {
        showToast("Post saved to server!", "success");
      }
    } catch (e) {
      showToast(`Save failed: ${e.message}`, "error");
    }
    setSaving(false);
  };

  // Load saved posts
  const loadMyPosts = async () => {
    setLoadingPosts(true);
    try {
      const posts = await listPosts();
      setMyPosts(posts);
    } catch {
      showToast("Could not load posts (is the server running?)", "warn");
    }
    setLoadingPosts(false);
  };

  useEffect(() => {
    if (tab === 3) loadMyPosts();
  }, [tab]);

  const downloadPost = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || "My Post"}</title>
  <style>
    body { font-family: 'Arial', sans-serif; background: ${bg}; min-height:100vh; display:flex; align-items:center; justify-content:center; margin:0; padding:20px; }
    .card { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:20px; padding:32px; max-width:600px; width:100%; color:#F0F0FF; backdrop-filter:blur(20px); }
    .avatar { font-size:48px; margin-bottom:12px; }
    h1 { font-size:28px; font-weight:800; margin:0 0 12px; }
    .content { font-size:16px; line-height:1.7; color:rgba(240,240,255,0.8); }
    .meta { margin-top:20px; font-size:13px; color:rgba(240,240,255,0.4); }
    ${voiceUrl ? ".voice-note { margin-top:20px; padding:12px 16px; background:rgba(255,107,157,0.1); border:1px solid rgba(255,107,157,0.2); border-radius:12px; font-size:13px; color:#FF6B9D; }" : ""}
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">${avatar}</div>
    <h1>${title || "Untitled"}</h1>
    <div class="content">${content}</div>
    ${voiceUrl ? `<div class="voice-note">🎙️ Voice message included<audio controls src="${voiceUrl}" style="display:block;margin-top:8px;width:100%;"></audio></div>` : ""}
    <div class="meta">By ${authorName} · ${new Date().toLocaleDateString()} · ApniPDFs</div>
  </div>
</body>
</html>`;
    saveAs(new Blob([html], { type: "text/html" }), `${title || "post"}.html`);
    showToast("Post downloaded as HTML!", "success");
  };

  return (
    <div className="page-body">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="page-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 40 }}>💬</span>
            <div>
              <h1
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                Chat Studio
              </h1>
              <p style={{ color: "rgba(240,240,255,0.5)", fontSize: 15 }}>
                Create stunning posts, stories & chats with voice messages
              </p>
            </div>
          </div>
          <span
            className="badge"
            style={{
              background: "white",
              color: "#EC4899",
              border: "1px solid #EC4899",
            }}
          >
            <Sparkles size={11} /> Studio
          </span>
        </div>

        {/* Post type selector */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {POST_TYPES.map((pt) => (
            <motion.button
              key={pt.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveType(pt.id)}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "14px 16px",
                borderRadius: 14,
                border: `2px solid ${activeType === pt.id ? pt.color : "rgba(255,255,255,0.08)"}`,
                background:
                  activeType === pt.id
                    ? `${pt.color}15`
                    : "rgba(255,255,255,0.03)",
                color:
                  activeType === pt.id ? pt.color : "rgba(240,240,255,0.5)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                boxShadow:
                  activeType === pt.id ? `0 0 24px ${pt.color}25` : "none",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{pt.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{pt.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                {pt.desc}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Main tabs */}
        {activeType !== "chat" && (
          <div className="tabs" style={{ marginBottom: 24 }}>
            {["✏️ Create", "👁️ Preview", "🚀 Share", "📋 My Posts"].map(
              (t, i) => (
                <button
                  key={i}
                  className={`tab ${tab === i ? "active" : ""}`}
                  onClick={() => setTab(i)}
                >
                  {t}
                </button>
              ),
            )}
          </div>
        )}

        {/* CREATE tab */}
        {tab === 0 && activeType !== "whatsapp" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="studio-grid">
              <div>
                {/* Title */}
                <div style={{ marginBottom: 12 }}>
                  {activeType === "chat" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="card p-6"
                      style={{
                        marginBottom: 24,
                        border: "1px solid rgba(0, 217, 255, 0.2)",
                        background: "rgba(0, 217, 255, 0.03)",
                        paddingBottom:
                          showStartCalendar || showEndCalendar ? 320 : 24,
                        transition: "padding-bottom 0.2s",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          marginBottom: 16,
                          color: "#00D9FF",
                        }}
                      >
                        WhatsApp Chat Export (.zip)
                      </h3>
                      <input
                        type="file"
                        accept=".zip"
                        onChange={(e) => setWaFile(e.target.files[0])}
                        className="input"
                        style={{
                          marginBottom: 16,
                          padding: "12px",
                          width: "100%",
                          height: "auto",
                        }}
                      />

                      <div
                        style={{ display: "flex", gap: 16, marginBottom: 16 }}
                      >
                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(240,240,255,0.55)",
                              display: "block",
                              marginBottom: 6,
                              fontWeight: 600,
                            }}
                          >
                            Aapka naam (chat me jaisa dikhta hai)
                          </label>
                          <input
                            type="text"
                            value={waAuthor}
                            onChange={(e) => setWaAuthor(e.target.value)}
                            placeholder="Optional — e.g. Ravi"
                            className="input w-[100%]"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(240,240,255,0.55)",
                              display: "block",
                              marginBottom: 6,
                              fontWeight: 600,
                            }}
                          >
                            Chat title
                          </label>
                          <input
                            type="text"
                            value={waTitle}
                            onChange={(e) => setWaTitle(e.target.value)}
                            className="input w-[100%]"
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label
                          style={{
                            fontSize: 13,
                            color: "rgba(240,240,255,0.55)",
                            display: "block",
                            marginBottom: 6,
                            fontWeight: 600,
                          }}
                        >
                          Output file ka naam (bina extension ke)
                        </label>
                        <input
                          type="text"
                          value={waOutputName}
                          onChange={(e) => setWaOutputName(e.target.value)}
                          className="input w-[100%]"
                        />
                      </div>

                      <div
                        style={{ display: "flex", gap: 16, marginBottom: 16 }}
                      >
                        <div
                          ref={startCalRef}
                          style={{ flex: 1, position: "relative" }}
                        >
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(240,240,255,0.55)",
                              display: "block",
                              marginBottom: 6,
                              fontWeight: 600,
                            }}
                          >
                            Start date
                          </label>
                          <div
                            onClick={() =>
                              setShowStartCalendar(!showStartCalendar)
                            }
                            className="input w-[100%]"
                            style={{
                              padding: "12px",
                              cursor: "pointer",
                              minHeight: 46,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {waStartDate || "Select Start Date"}
                          </div>
                          {showStartCalendar && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                zIndex: 10,
                                marginTop: 4,
                                borderRadius: 8,
                                overflow: "hidden",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                              }}
                            >
                              <Calendar
                                onChange={(d) => {
                                  setWaStartDate(formatDateForBackend(d));
                                  setShowStartCalendar(false);
                                }}
                                value={parseDateString(waStartDate)}
                                maxDate={
                                  waEndDate
                                    ? parseDateString(waEndDate)
                                    : undefined
                                }
                                className="custom-calendar"
                              />
                            </div>
                          )}
                        </div>
                        <div
                          ref={endCalRef}
                          style={{ flex: 1, position: "relative" }}
                        >
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(240,240,255,0.55)",
                              display: "block",
                              marginBottom: 6,
                              fontWeight: 600,
                            }}
                          >
                            End date
                          </label>
                          <div
                            onClick={() => setShowEndCalendar(!showEndCalendar)}
                            className="input w-[100%]"
                            style={{
                              padding: "12px",
                              cursor: "pointer",
                              minHeight: 46,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {waEndDate || "Select End Date"}
                          </div>
                          {showEndCalendar && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                zIndex: 10,
                                marginTop: 4,
                                borderRadius: 8,
                                overflow: "hidden",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                              }}
                            >
                              <Calendar
                                onChange={(d) => {
                                  setWaEndDate(formatDateForBackend(d));
                                  setShowEndCalendar(false);
                                }}
                                value={parseDateString(waEndDate)}
                                minDate={
                                  waStartDate
                                    ? parseDateString(waStartDate)
                                    : undefined
                                }
                                className="custom-calendar"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(240,240,255,0.4)",
                          marginBottom: 20,
                        }}
                      >
                        Date range khali chhod do agar poori chat chahiye.
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <button
                          className="btn w-[100%]"
                          style={{
                            background:
                              "linear-gradient(135deg, #00D9FF, #00FFB3)",
                            color: "#000",
                            fontWeight: 700,
                            padding: "14px 32px",
                          }}
                          onClick={handleWaUpload}
                          disabled={isUploading}
                        >
                          {isUploading ? "Converting..." : "Convert Chat"}
                        </button>
                      </div>

                      {waResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            marginTop: 24,
                            padding: 16,
                            background: "rgba(0, 255, 179, 0.08)",
                            borderRadius: 12,
                            border: "1px solid rgba(0, 255, 179, 0.2)",
                          }}
                        >
                          <h4
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#00FFB3",
                              marginBottom: 12,
                            }}
                          >
                            Conversion Successful! 🎉
                          </h4>
                          <p
                            style={{
                              fontSize: 14,
                              color: "rgba(240,240,255,0.8)",
                              marginBottom: 8,
                            }}
                          >
                            Total Messages: {waResult.total_messages}
                          </p>
                          <p
                            style={{
                              fontSize: 14,
                              color: "rgba(240,240,255,0.8)",
                              marginBottom: 16,
                            }}
                          >
                            Filtered Messages: {waResult.filtered_messages}
                          </p>
                          <div style={{ display: "flex", gap: 12 }}>
                            <button
                              onClick={async () => {
                                const newWin = window.open("", "_blank");
                                newWin.document.write("Loading chat...");
                                try {
                                  const res = await fetch(waResult.html_url);
                                  const html = await res.text();
                                  newWin.document.open();
                                  newWin.document.write(html);
                                  newWin.document.close();
                                } catch (err) {
                                  newWin.location.href = waResult.html_url;
                                }
                              }}
                              className="btn btn-secondary"
                            >
                              <Eye size={15} /> View Full HTML
                            </button>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = waResult.html_url;
                                link.download = waResult.download_filename;
                                link.click();
                              }}
                            >
                              <Download size={15} /> Download{" "}
                              {waResult.download_filename}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {activeType === "post" && (
                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          fontSize: 13,
                          color: "rgba(240,240,255,0.55)",
                          display: "block",
                          marginBottom: 8,
                          fontWeight: 600,
                        }}
                      >
                        Select Platform
                      </label>
                      <div
                        className="tabs"
                        style={{ marginBottom: 0, flexWrap: "wrap" }}
                      >
                        {POST_PLATFORMS.map((platform) => (
                          <button
                            key={platform}
                            className={`tab ${socialPlatform === platform ? "active" : ""}`}
                            style={{
                              textTransform: "capitalize",
                              padding: "6px 12px",
                              fontSize: 13,
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                            onClick={() => {
                              if (socialPlatform === platform) return;
                              // save current draft
                              setSocialDrafts((prev) => ({
                                ...prev,
                                [socialPlatform]: { title, content },
                              }));
                              // load new draft
                              setSocialPlatform(platform);
                              setTitle(socialDrafts[platform].title);
                              setContent(socialDrafts[platform].content);
                            }}
                          >
                            {platformIcons[platform]}
                            {platform}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeType !== "chat" && (
                    <>
                      <label
                        style={{
                          fontSize: 13,
                          color: "rgba(240,240,255,0.55)",
                          display: "block",
                          marginBottom: 6,
                          fontWeight: 600,
                        }}
                      >
                        {pt.icon} {pt.label} Title
                      </label>
                      <input
                        className="input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={`Enter your ${activeType} title…`}
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          fontFamily: "Outfit, sans-serif",
                        }}
                      />
                    </>
                  )}
                </div>

                {activeType !== "chat" && (
                  <>
                    {/* Content editor */}
                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          fontSize: 13,
                          color: "rgba(240,240,255,0.55)",
                          display: "block",
                          marginBottom: 6,
                          fontWeight: 600,
                        }}
                      >
                        Content
                      </label>
                      <RichEditor
                        value={content}
                        onChange={(val) => {
                          setContent(val);
                          const tmp = document.createElement("div");
                          tmp.innerHTML = val;
                          setPlainText(tmp.textContent);
                        }}
                        placeholder={`Write your ${activeType} here… Use the toolbar to style your content.`}
                        minHeight={activeType === "story" ? 400 : 220}
                        showEmoji
                      />
                    </div>

                    {/* Voice recorder */}
                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          fontSize: 13,
                          color: "rgba(240,240,255,0.55)",
                          display: "block",
                          marginBottom: 6,
                          fontWeight: 600,
                        }}
                      >
                        🎙️ Voice Message (optional)
                      </label>
                      <VoiceRecorder
                        onSend={(url, blob) => {
                          setVoiceUrl(url);
                          setVoiceBlob(blob);
                          showToast("Voice message attached!", "success");
                        }}
                      />
                    </div>

                    {/* Saved post link */}
                    {savedPostId && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: "rgba(0,255,179,0.08)",
                          border: "1px solid rgba(0,255,179,0.2)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          marginBottom: 12,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: 14 }}>✅</span>
                        <span
                          style={{ fontSize: 13, color: "#00FFB3", flex: 1 }}
                        >
                          Saved! Share link ready
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/share/${savedPostId}`)}
                        >
                          <ExternalLink size={12} /> View
                        </button>
                      </motion.div>
                    )}

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => setTab(1)}
                      >
                        <Eye size={16} /> Preview
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleSaveToServer}
                        disabled={saving}
                        style={{
                          background:
                            "linear-gradient(135deg, #00D9FF, #00b8d9)",
                        }}
                      >
                        {saving ? <RefreshCw size={15} /> : <Save size={15} />}
                        {saving ? "Saving…" : "Save to Server"}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={downloadPost}
                      >
                        <Download size={15} /> Download
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar controls */}
              {activeType !== "chat" && (
                <div>
                  <div
                    className="card"
                    style={{ padding: 20, marginBottom: 16 }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 14,
                        color: "rgba(240,240,255,0.7)",
                      }}
                    >
                      ✨ Customize
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label
                        style={{
                          fontSize: 12,
                          color: "rgba(240,240,255,0.45)",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Author Name
                      </label>
                      <input
                        className="input"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Your name"
                        style={{ fontSize: 13 }}
                      />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label
                        style={{
                          fontSize: 12,
                          color: "rgba(240,240,255,0.45)",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Avatar
                      </label>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {AVATARS.map((av) => (
                          <button
                            key={av}
                            onClick={() => setAvatar(av)}
                            style={{
                              fontSize: 22,
                              padding: 4,
                              borderRadius: 8,
                              border: `2px solid ${avatar === av ? pt.color : "transparent"}`,
                              background:
                                avatar === av ? `${pt.color}15` : "transparent",
                              cursor: "pointer",
                            }}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          color: "rgba(240,240,255,0.45)",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Card Background
                      </label>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {BACKGROUNDS.map((b) => (
                          <button
                            key={b.label}
                            onClick={() => setBg(b.value)}
                            title={b.label}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: b.value,
                              border: `2px solid ${bg === b.value ? "#fff" : "transparent"}`,
                              cursor: "pointer",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="card" style={{ padding: 20 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 12,
                        color: "rgba(240,240,255,0.7)",
                      }}
                    >
                      📊 Stats
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(240,240,255,0.5)",
                        lineHeight: 2,
                      }}
                    >
                      <div>
                        Words:{" "}
                        <strong style={{ color: "#8B84FF" }}>
                          {plainText.trim().split(/\s+/).filter(Boolean).length}
                        </strong>
                      </div>
                      <div>
                        Characters:{" "}
                        <strong style={{ color: "#8B84FF" }}>
                          {plainText.length}
                        </strong>
                      </div>
                      <div>
                        Read time:{" "}
                        <strong style={{ color: "#8B84FF" }}>
                          ~
                          {Math.max(
                            1,
                            Math.ceil(plainText.split(/\s+/).length / 200),
                          )}{" "}
                          min
                        </strong>
                      </div>
                      <div>
                        Voice:{" "}
                        <strong
                          style={{
                            color: voiceUrl
                              ? "#00FFB3"
                              : "rgba(240,240,255,0.3)",
                          }}
                        >
                          {voiceUrl ? "✅ Attached" : "—"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PREVIEW tab */}
        {tab === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ maxWidth: 600, width: "100%" }}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{
                    background: bg,
                    borderRadius: 24,
                    padding: 36,
                    border: `1px solid ${pt.color}30`,
                    boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 60px ${pt.color}15`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Glow orb */}
                  <div
                    style={{
                      position: "absolute",
                      top: -40,
                      right: -40,
                      width: 200,
                      height: 200,
                      background: `radial-gradient(circle, ${pt.color}20 0%, transparent 70%)`,
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Type badge */}
                  <div
                    style={{
                      marginBottom: 20,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 99,
                        background: `${pt.color}20`,
                        color: pt.color,
                        border: `1px solid ${pt.color}30`,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {pt.icon} {pt.label}
                    </span>
                    <span
                      style={{ fontSize: 12, color: "rgba(240,240,255,0.35)" }}
                    >
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  {/* Author */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ fontSize: 40, lineHeight: 1 }}>{avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>
                        {authorName || "ApniPDFs User"}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(240,240,255,0.4)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Globe size={11} /> ApniPDFs
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  {title && (
                    <h2
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontSize: 26,
                        fontWeight: 800,
                        marginBottom: 14,
                        lineHeight: 1.3,
                      }}
                    >
                      {title}
                    </h2>
                  )}

                  {/* Content */}
                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.75,
                      color: "rgba(240,240,255,0.85)",
                      marginBottom: 20,
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        content ||
                        '<p style="color:rgba(240,240,255,0.3)">Your content will appear here…</p>',
                    }}
                  />

                  {/* Voice message */}
                  {voiceUrl && (
                    <div
                      style={{
                        background: "rgba(255,107,157,0.1)",
                        border: "1px solid rgba(255,107,157,0.2)",
                        borderRadius: 12,
                        padding: "14px 16px",
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: "#FF6B9D",
                          fontWeight: 600,
                          marginBottom: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        🎙️ Voice Message — tap to listen
                      </div>
                      <audio
                        controls
                        src={voiceUrl}
                        style={{ width: "100%", height: 36 }}
                      />
                    </div>
                  )}

                  {/* Reactions */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      paddingTop: 16,
                      borderTop: "1px solid rgba(255,255,255,0.07)",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      { key: "heart", icon: "❤️", label: "Love" },
                      { key: "like", icon: "👍", label: "Like" },
                      { key: "star", icon: "⭐", label: "Star" },
                      { key: "bookmark", icon: "🔖", label: "Save" },
                    ].map((r) => (
                      <motion.button
                        key={r.key}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleReact(r.key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "6px 12px",
                          borderRadius: 99,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background:
                            reactions[r.key] > 0
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(255,255,255,0.03)",
                          cursor: "pointer",
                          color: "rgba(240,240,255,0.7)",
                          fontSize: 13,
                        }}
                      >
                        <span>{r.icon}</span>
                        {reactions[r.key] > 0 && (
                          <span style={{ fontWeight: 700, color: "#fff" }}>
                            {reactions[r.key]}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(240,240,255,0.45)",
                          }}
                        >
                          {r.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                    marginTop: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <button className="btn btn-primary" onClick={() => setTab(2)}>
                    <Share2 size={15} /> Share
                  </button>
                  <button className="btn btn-secondary" onClick={downloadPost}>
                    <Download size={15} /> Download
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setTab(0)}
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SHARE tab */}
        {tab === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section"
          >
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <div
                className="card"
                style={{ padding: 32, textAlign: "center", marginBottom: 20 }}
              >
                <div style={{ fontSize: 52, marginBottom: 12 }}>🚀</div>
                <h2
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  Share Your {pt.label}
                </h2>
                <p
                  style={{
                    color: "rgba(240,240,255,0.5)",
                    fontSize: 14,
                    marginBottom: 24,
                  }}
                >
                  {voiceUrl
                    ? "Your voice message is embedded. Recipients can listen directly."
                    : "Add a voice message from the Create tab for an even richer experience."}
                </p>

                {voiceUrl && (
                  <div
                    style={{
                      background: "rgba(0,255,179,0.08)",
                      border: "1px solid rgba(0,255,179,0.2)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      marginBottom: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>🎙️</span>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#00FFB3",
                        }}
                      >
                        Voice message attached
                      </div>
                      <div
                        style={{ fontSize: 12, color: "rgba(240,240,255,0.4)" }}
                      >
                        Recipients can play it back from the shared file
                      </div>
                    </div>
                  </div>
                )}

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => handleShare("copy")}
                    style={{ justifyContent: "center" }}
                  >
                    <Copy size={16} />{" "}
                    {savedPostId ? "Copy Share Link" : "Copy Text"}
                  </button>
                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={() => handleShare("twitter")}
                    style={{
                      justifyContent: "center",
                      color: "#1DA1F2",
                      borderColor: "rgba(29,161,242,0.3)",
                    }}
                  >
                    <AtSign size={16} /> Share on X / Twitter
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={downloadPost}
                    style={{
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #FF6B9D, #FF8C42)",
                    }}
                  >
                    <Download size={16} /> Download Shareable HTML
                  </button>
                  {savedPostId && (
                    <button
                      className="btn btn-secondary btn-lg"
                      onClick={() => navigate(`/share/${savedPostId}`)}
                      style={{
                        justifyContent: "center",
                        color: "#00FFB3",
                        borderColor: "rgba(0,255,179,0.3)",
                      }}
                    >
                      <ExternalLink size={16} /> Open Share Page
                    </button>
                  )}
                </div>
              </div>

              <div className="card" style={{ padding: 20 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: "rgba(240,240,255,0.6)",
                  }}
                >
                  💡 Share Tips
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {[
                    savedPostId
                      ? `Your post is saved on the server — share the link: /share/${savedPostId}`
                      : 'Click "Save to Server" first to get a shareable link',
                    "Download as HTML and attach it to an email — voice playback works in any browser",
                    "Copy text to paste in WhatsApp, Telegram, or any chat app",
                    "The HTML file is self-contained — no account needed to view or listen",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 13,
                        color: "rgba(240,240,255,0.5)",
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ color: "#6C63FF", marginTop: 1 }}>✦</span>{" "}
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* MY POSTS tab */}
        {tab === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                📋 Saved Posts
              </h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={loadMyPosts}
                disabled={loadingPosts}
              >
                {loadingPosts ? <RefreshCw size={13} /> : "↻"} Refresh
              </button>
            </div>

            {loadingPosts && (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "rgba(240,240,255,0.4)",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                <p>Loading posts from server…</p>
              </div>
            )}

            {!loadingPosts && myPosts.length === 0 && (
              <div
                style={{ textAlign: "center", padding: 48 }}
                className="card"
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
                  No Posts Yet
                </h3>
                <p
                  style={{
                    color: "rgba(240,240,255,0.4)",
                    fontSize: 14,
                    marginBottom: 16,
                  }}
                >
                  Create a post in the Create tab and click "Save to Server"
                </p>
                <button className="btn btn-primary" onClick={() => setTab(0)}>
                  ✏️ Create Post
                </button>
              </div>
            )}

            {!loadingPosts && myPosts.length > 0 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {myPosts.map((p) => {
                  const typeColors = {
                    post: "#6C63FF",
                    story: "#FF6B9D",
                    chat: "#00D9FF",
                  };
                  const c = typeColors[p.type] || "#6C63FF";
                  const typeEmoji =
                    { post: "📢", story: "📖", chat: "💬" }[p.type] || "📝";
                  return (
                    <motion.div
                      key={p.id}
                      whileHover={{ x: 2 }}
                      className="card"
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        background: `${c}08`,
                        borderColor: `${c}20`,
                      }}
                    >
                      <div style={{ fontSize: 28 }}>{p.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 99,
                              background: `${c}20`,
                              color: c,
                              border: `1px solid ${c}30`,
                            }}
                          >
                            {typeEmoji} {p.type}
                          </span>
                          {p.voice_filename && (
                            <span style={{ fontSize: 10, color: "#FF6B9D" }}>
                              🎙️ Voice
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.title || "Untitled"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(240,240,255,0.4)",
                            marginTop: 2,
                          }}
                        >
                          By {p.author_name} ·{" "}
                          {p.created_at
                            ? new Date(p.created_at).toLocaleDateString("en-IN")
                            : ""}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/share/${p.id}`)}
                        >
                          <ExternalLink size={12} /> View
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/share/${p.id}`,
                            );
                            showToast("Link copied!", "success");
                          }}
                          title="Copy share link"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            color: "#FF6B9D",
                            borderColor: "rgba(255,107,157,0.2)",
                          }}
                          onClick={async () => {
                            if (!confirm("Delete this post?")) return;
                            await deletePost(p.id);
                            setMyPosts((prev) =>
                              prev.filter((x) => x.id !== p.id),
                            );
                            showToast("Post deleted", "success");
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
