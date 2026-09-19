import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mic,
  Share2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Globe,
  Lock,
  Sparkles,
  Layers,
} from "lucide-react";

export default function ChatContentSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const guides = [
    {
      title: "How to Create a Voice-Powered Story",
      icon: <Mic className="text-pink-400" size={20} />,
      steps: [
        "Select your format: Social Post, Story, or Conversational Thread.",
        "Craft your headline, narrative, and tags in the rich text editor.",
        "Click the microphone button to record audio commentary or a personal voice message.",
        "Publish with one click to generate a clean, shareable public card.",
      ],
    },
    {
      title: "How to Share Posts Across Social Networks",
      icon: <Share2 className="text-cyan-400" size={20} />,
      steps: [
        "Once published, copy the unique secure link (apnipdfs.com/share/...).",
        "Directly broadcast to WhatsApp, Telegram, Twitter/X, or LinkedIn via quick-share icons.",
        "Recipients can read your story, play embedded voice audio, and view media immediately.",
        "No login or application download is needed for your audience to view your post.",
      ],
    },
    {
      title: "Managing & Deleting Your Posts",
      icon: <Lock className="text-purple-400" size={20} />,
      steps: [
        "Switch to the 'My Posts' tab to view your active creations.",
        "Inspect view counts and verify the formatting of published cards.",
        "Delete any post at any time with a single tap to instantly remove it from access.",
        "Your data remains under your absolute control.",
      ],
    },
    {
      title: "Audio Encoding & Browser Compatibility",
      icon: <Zap className="text-amber-400" size={20} />,
      steps: [
        "Audio is encoded using standard HTML5 MediaRecorder (WebM/Opus or AAC).",
        "Ensures lightweight audio payloads that stream instantaneously even on cellular data.",
        "Compatible across mobile Safari (iOS), Google Chrome (Android/Desktop), and Firefox.",
        "Built-in waveform visualization provides responsive feedback during recording.",
      ],
    },
  ];

  const faqs = [
    {
      q: "Can anyone listen to the voice notes attached to my shared posts?",
      a: "Anyone with your secret share link can play back the recorded voice note directly in their browser. The link is unlisted and not indexed by search engines unless you publish it publicly.",
    },
    {
      q: "Do recipients need an ApniPDFs account to view my shared content?",
      a: "No! The share viewer is completely public, frictionless, and lightweight. Friends, clients, and followers can open the link instantly on any phone or desktop without installing apps or signing in.",
    },
    {
      q: "Can I permanently delete a post after sharing it?",
      a: "Yes. From the 'My Posts' tab, click the trash icon next to any creation. It is instantly deleted from our database and the share URL will immediately return a 404.",
    },
    {
      q: "Is there a time limit on recorded voice messages?",
      a: "You can record voice messages up to 5 minutes per post. This provides ample time for comprehensive voice memos, announcements, tutorials, and storytelling.",
    },
    {
      q: "Are posts encrypted in transit?",
      a: "Yes. All post data, voice notes, and communications are transmitted over modern TLS 1.3 encryption.",
    },
  ];

  return (
    <div className="w-full mt-16 pt-12 border-t border-white/10 text-left">
      {/* Guides */}
      <div className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> Social Storytelling Tutorial
          </div>
          <h2 className="text-3xl font-outfit font-extrabold text-white mb-3">
            How to Master Chat & Voice Studio
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Create engaging multi-format posts, record voice memos, and share dynamic interactive stories with your audience worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-pink-500/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-white/5">{guide.icon}</div>
                <h3 className="text-lg font-bold text-white">{guide.title}</h3>
              </div>
              <ol className="space-y-2.5 text-sm text-white/70 list-decimal list-inside leading-relaxed">
                {guide.steps.map((step, sIdx) => (
                  <li key={sIdx} className="pl-1">
                    <span className="text-white/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlight */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-pink-400 font-semibold text-sm mb-2">
            <ShieldCheck size={18} /> Frictionless Communication
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Combine Text, Voice & Media into One Seamless URL
          </h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
            Stand out in social feeds and messaging apps. Instead of sending walls of unformatted text or raw audio files, share an interactive multimedia card that opens instantly on any browser.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-pink-400 shrink-0" />
            <span>Integrated High-Quality Audio</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
            <span>Instant One-Click Deletion</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
            <span>Zero Account Required for Readers</span>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Chat Studio FAQs</h3>
          <p className="text-white/60 text-sm">Everything you need to know about post sharing, privacy, and voice messages</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isOpen ? "bg-white/[0.06] border-pink-500/40" : "bg-white/[0.02] border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-semibold text-white text-sm sm:text-base">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-pink-400 shrink-0"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-5 pb-5 text-sm text-white/70 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
