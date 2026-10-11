import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Globe,
  Lock,
  Sparkles,
  Layers,
  FileText,
  Download,
  Calendar,
} from "lucide-react";

export default function ChatContentSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const guides = [
    {
      title: "How to Export & Convert Chat Backups",
      icon: <FileText className="text-cyan-400" size={20} />,
      steps: [
        "Export your conversation history or chat backup from your messaging app as a .zip or text file.",
        "Drag and drop the archive into the Chat Studio upload dropzone.",
        "Optionally set a custom chat title and your participant name to customize the transcript.",
        "Click 'Convert Chat' to parse and generate a responsive, readable HTML view.",
      ],
    },
    {
      title: "Filtering Messages by Date Range",
      icon: <Calendar className="text-pink-400" size={20} />,
      steps: [
        "Use the Start Date and End Date calendar selectors to isolate a specific timeframe.",
        "Ideal for legal records, project milestones, or extracting recent messages from multi-year archives.",
        "Leaving dates blank will parse the complete chat history from beginning to end.",
        "The parser displays both total messages in the file and the exact count matching your filter.",
      ],
    },
    {
      title: "Viewing & Downloading Interactive Transcripts",
      icon: <Download className="text-purple-400" size={20} />,
      steps: [
        "Once conversion completes, click 'View Full HTML' to inspect the rendered conversation in your browser.",
        "Click 'Download' to save the standalone, styled HTML file directly to your local device.",
        "The generated HTML is self-contained: open it offline anytime without requiring internet access.",
        "Easily attach the transcript to emails or archive it in your project documentation.",
      ],
    },
    {
      title: "Complete Data Security & Privacy",
      icon: <Lock className="text-emerald-400" size={20} />,
      steps: [
        "Chat transcripts often contain private personal conversations, contact numbers, and confidential notes.",
        "All processing follows ApniPDFs' zero-retention privacy standards.",
        "Temporary conversion buffers are purged immediately upon generation and download.",
        "No chat logs or personal records are ever retained or indexed on public servers.",
      ],
    },
  ];

  const faqs = [
    {
      q: "What format does the exported chat download in?",
      a: "The chat archive converts into a responsive, standalone HTML document. You can open and view it in any modern web browser (Chrome, Safari, Edge, Firefox) on both desktop and mobile devices without requiring specialized software.",
    },
    {
      q: "Are my personal conversations or attachments stored on your servers?",
      a: "No. ApniPDFs operates under a strict ephemeral privacy policy. Uploaded archives are processed in memory and purged immediately after output generation. We never build profiles or store conversation logs.",
    },
    {
      q: "Can I filter chats to only include messages from a specific month or year?",
      a: "Yes! Use the built-in Start Date and End Date calendar controls before clicking 'Convert Chat'. Only messages within your selected date bounds will be included in the output.",
    },
    {
      q: "Does the output work offline?",
      a: "Yes. Once downloaded, the HTML file is completely self-contained with all CSS styling embedded. You can open, read, and search through it completely offline.",
    },
    {
      q: "Is there a limit to how many messages can be converted?",
      a: "Our parser is optimized to handle archives containing tens of thousands of messages smoothly without crashing your browser tab.",
    },
  ];

  return (
    <div className="w-full mt-16 pt-12 border-t border-white/10 text-left">
      {/* Guides */}
      <div className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> Chat Management Guide
          </div>
          <h2 className="text-3xl font-outfit font-extrabold text-white mb-3">
            How to Use Chat Studio
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Convert, filter, and archive message backups into beautifully formatted, readable HTML transcripts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((g, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    {g.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{g.title}</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-white/70">
                  {g.steps.map((st, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={14}
                        className="text-emerald-400 mt-0.5 shrink-0"
                      />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-white/60 text-sm">
            Answers to common questions regarding chat archives, date filtering, and file security.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white/90 hover:text-white transition-colors"
              >
                <span>{f.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-white/40 shrink-0 transition-transform duration-200 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-3"
                  >
                    {f.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
