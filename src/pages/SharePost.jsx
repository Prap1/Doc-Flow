import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPost, reactToPost, getVoiceUrl } from "../api";
import { Globe, ArrowLeft, Share2, Copy } from "lucide-react";
import { showToast } from "../components/Toast";

export default function SharePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch(() => setError("Post not found or server is offline"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReact = async (key) => {
    try {
      const res = await reactToPost(id, key);
      setPost((p) => ({ ...p, reactions: res.reactions }));
    } catch {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied!", "success");
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#07071A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "rgba(240,240,255,0.4)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p>Loading post…</p>
        </div>
      </div>
    );

  if (error || !post)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#07071A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "rgba(240,240,255,0.4)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <p style={{ marginBottom: 16 }}>{error || "Post not found"}</p>
          <Link to="/">
            <button className="btn btn-secondary">← Back to ApniPDFs</button>
          </Link>
        </div>
      </div>
    );

  const typeColors = { post: "#6C63FF", story: "#FF6B9D", chat: "#00D9FF" };
  const color = typeColors[post.type] || "#6C63FF";
  const typeEmoji = { post: "📢", story: "📖", chat: "💬" }[post.type] || "📝";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: post.bg || "linear-gradient(135deg, #07071A, #12102E)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 640, width: "100%" }}
      >
        {/* Back link */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "rgba(240,240,255,0.4)",
              fontSize: 13,
              marginBottom: 20,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} /> Back to ApniPDFs
          </div>
        </Link>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${color}30`,
            borderRadius: 24,
            padding: 40,
            boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 60px ${color}15`,
            backdropFilter: "blur(20px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 200,
              height: 200,
              background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 99,
                background: `${color}20`,
                color,
                border: `1px solid ${color}30`,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {typeEmoji} {post.type}
            </span>
            <span style={{ fontSize: 12, color: "rgba(240,240,255,0.35)" }}>
              {post.created_at
                ? new Date(post.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>

          {/* Author */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 44, lineHeight: 1 }}>{post.avatar}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#F0F0FF" }}>
                {post.author_name}
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
                <Globe size={11} /> ApniPDFs · Shared Post
              </div>
            </div>
          </div>

          {/* Title */}
          {post.title && (
            <h1
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 28,
                fontWeight: 900,
                marginBottom: 16,
                lineHeight: 1.3,
                color: "#F0F0FF",
              }}
            >
              {post.title}
            </h1>
          )}

          {/* Content */}
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(240,240,255,0.82)",
              marginBottom: 24,
            }}
            dangerouslySetInnerHTML={{
              __html: post.content || "<p>No content</p>",
            }}
          />

          {/* Voice message */}
          {post.voice_filename && (
            <div
              style={{
                background: "rgba(255,107,157,0.1)",
                border: "1px solid rgba(255,107,157,0.2)",
                borderRadius: 14,
                padding: "16px 18px",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#FF6B9D",
                  fontWeight: 700,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                🎙️ Voice Message — Press play to listen
              </div>
              <audio
                controls
                src={getVoiceUrl(post.id)}
                style={{ width: "100%" }}
              />
            </div>
          )}

          {/* Reactions */}
          <div
            style={{
              display: "flex",
              gap: 10,
              paddingTop: 20,
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReact(r.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 99,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  color: "rgba(240,240,255,0.7)",
                  fontSize: 14,
                }}
              >
                {r.icon}
                {post.reactions?.[r.key] > 0 && (
                  <strong style={{ color: "#fff" }}>
                    {post.reactions[r.key]}
                  </strong>
                )}
                <span style={{ fontSize: 12, color: "rgba(240,240,255,0.45)" }}>
                  {r.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Share row */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <button className="btn btn-secondary" onClick={handleCopy}>
            <Copy size={14} /> Copy Link
          </button>
          <Link to="/chat">
            <button className="btn btn-primary">
              <Share2 size={14} /> Create Your Own
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
            color: "rgba(240,240,255,0.25)",
          }}
        >
          Powered by <strong style={{ color: "#6C63FF" }}>ApniPDFs</strong>
        </div>
      </motion.div>
    </div>
  );
}
