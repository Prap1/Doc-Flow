import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Lock,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UploadCloud,
  Cpu,
  Download,
  HelpCircle,
  Globe,
  Smartphone,
  Layers,
} from "lucide-react";
import AdBanner from "./AdBanner";

export default function HomeEditorialSection() {
  const pillars = [
    {
      icon: <Lock className="text-pink-400" size={24} />,
      title: "100% Client-Side Privacy",
      desc: "Your files never linger on external servers. Modern WebAssembly and HTML5 Canvas engines process documents securely inside your browser tab.",
    },
    {
      icon: <Zap className="text-cyan-400" size={24} />,
      title: "Instant In-Memory Speed",
      desc: "Zero upload delays for client-side tools. Split 100-page PDFs or adjust high-res photos in milliseconds without network bottlenecks.",
    },
    {
      icon: <ShieldCheck className="text-purple-400" size={24} />,
      title: "No Sign-Up or Accounts",
      desc: "Instant access to all tools. No email submission, no passwords to remember, no credit card prompts, and no recurring subscriptions.",
    },
    {
      icon: <FileCheck className="text-emerald-400" size={24} />,
      title: "Zero Watermarks Ever",
      desc: "Every exported document, converted Word file, and edited image is completely clean and ready for academic, professional, or commercial use.",
    },
  ];

  const toolsSummary = [
    {
      title: "PDF Management Suite",
      emoji: "📄",
      path: "/pdf",
      color: "from-pink-500/20 to-rose-500/5",
      borderColor: "border-pink-500/20 hover:border-pink-500/50",
      desc: "Merge multi-page reports, split specific chapters, edit text annotations, and convert read-only PDFs into editable Microsoft Word documents with vector font preservation.",
      features: ["Lossless PDF Merging", "Custom Page Range Splitting", "PDF to Word (.docx) Engine", "In-Browser Annotation Canvas"],
    },
    {
      title: "Word Document Studio",
      emoji: "📝",
      path: "/word",
      color: "from-cyan-500/20 to-blue-500/5",
      borderColor: "border-cyan-500/20 hover:border-cyan-500/50",
      desc: "Open and edit Microsoft Word (.docx) files online without MS Office installed. Reformat paragraphs, stitch multiple documents together, or export cleanly to PDF or HTML.",
      features: ["Live Browser DOCX Editor", "Sequential Document Merger", "Document Chapter Splitter", "Direct PDF/HTML Exporter"],
    },
    {
      title: "Spreadsheet & Data Studio",
      emoji: "📊",
      path: "/excel",
      color: "from-orange-500/20 to-amber-500/5",
      borderColor: "border-orange-500/20 hover:border-orange-500/50",
      desc: "Inspect tabular datasets, break multi-tab workbooks into standalone files, combine disparate spreadsheets, and convert CSV data to formatted Excel workbooks.",
      features: ["Multi-Tab Sheet Splitting", "Workbook Consolidation", "Table Search & Sorting", "CSV to XLSX Formatting"],
    },
    {
      title: "Digital Image Studio",
      emoji: "🎨",
      path: "/image",
      color: "from-purple-500/20 to-indigo-500/5",
      borderColor: "border-purple-500/20 hover:border-purple-500/50",
      desc: "Apply brightness and contrast filters, rotate and mirror graphics, join multiple images horizontally or vertically, and split photos for social media carousel posts.",
      features: ["Hardware-Accelerated Filters", "90° Rotation & Mirror Flipping", "Horizontal & Vertical Image Merging", "Carousel Grid Splitter"],
    },
  ];

  const steps = [
    {
      step: "01",
      icon: <UploadCloud size={28} className="text-indigo-400" />,
      title: "Select or Drop Files",
      desc: "Drag any PDF, Word document, Excel spreadsheet, or high-res image into the secure workspace dropzone.",
    },
    {
      step: "02",
      icon: <Cpu size={28} className="text-cyan-400" />,
      title: "Process in Sandbox",
      desc: "Adjust settings, reorder pages, apply filters, or edit copy in real time with hardware-accelerated algorithms.",
    },
    {
      step: "03",
      icon: <Download size={28} className="text-emerald-400" />,
      title: "Download Instantly",
      desc: "Save your processed file with original quality preserved. Temporary memory is automatically wiped clean.",
    },
  ];

  return (
    <div className="w-full mt-16 text-left">
      {/* 4 Pillars Section */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> The Modern Document Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-white mb-4">
            Why Over 100,000+ Users Rely on ApniPDFs
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed">
            Engineered from the ground up for privacy-conscious professionals, educators, students, and businesses who demand speed without sacrificing security.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Workspace Grid */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-outfit font-extrabold text-white mb-3">
            An All-in-One Productive Ecosystem
          </h2>
          <p className="text-white/60 text-base">
            Everything you need to handle everyday digital assets in one clean, unified workspace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {toolsSummary.map((tool, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl bg-gradient-to-br ${tool.color} border ${tool.borderColor} transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{tool.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                    <div className="text-xs text-white/50">Comprehensive Utilities</div>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {tool.desc}
                </p>
                <div className="grid grid-cols-2 gap-2.5 mb-8">
                  {tool.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-white/80">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to={tool.path}
                className="btn btn-secondary inline-flex items-center justify-between w-full text-sm font-semibold"
              >
                <span>Launch {tool.title}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works 3 Step Process */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Three Simple Steps to Seamless Documents
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            No complex setup, no terminal commands, and no software installations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((st, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">
                STEP {st.step}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                {st.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AdSense Placement */}
      <AdBanner />

      {/* Trust & Compliance Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 mb-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to process your documents with complete peace of mind?
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Explore our transparent Privacy Policy, learn how our browser engine operates, or consult our FAQ guide.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/how-it-works" className="btn btn-secondary text-sm">
              How It Works
            </Link>
            <Link to="/faqs" className="btn btn-primary text-sm">
              Read FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
