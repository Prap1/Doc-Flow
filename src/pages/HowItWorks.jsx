import { motion } from "framer-motion";
import { UploadCloud, Cpu, Download, ShieldCheck, Zap, Layers, RefreshCw, FileText, FileSpreadsheet, Image as ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import AdBanner from "../components/AdBanner";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UploadCloud size={32} />,
      title: "1. Select or Drop Your File",
      desc: "Drag and drop your file into the dedicated upload zone or select it from your device. We support PDF, DOCX, XLSX, CSV, JPG, PNG, and WebP files up to 50MB.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
    },
    {
      icon: <Cpu size={32} />,
      title: "2. In-Browser / Ephemeral Processing",
      desc: "Your file is processed instantly using client-side JavaScript, WebAssembly, and canvas algorithms. Everything happens inside your browser tab without permanent server storage.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
    },
    {
      icon: <Download size={32} />,
      title: "3. Instant Lossless Download",
      desc: "Click download to immediately save the processed, merged, split, or converted file back onto your local device. The temporary memory is wiped clean immediately.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
  ];

  const technologies = [
    {
      title: "WebAssembly & PDF-lib",
      desc: "High-performance binary execution right inside your browser to parse, split, rotate, and merge PDF pages without upload latency.",
      badge: "Binary Speed",
    },
    {
      title: "HTML5 Canvas Engine",
      desc: "Pixel-perfect image manipulation, compression, cropping, and color balancing executed via hardware-accelerated WebGL and 2D canvas.",
      badge: "GPU Accelerated",
    },
    {
      title: "XLSX Sheet Parser",
      desc: "Fast spreadsheet engine capable of parsing multi-sheet workbooks, extracting tables, converting to CSV, and splitting workbooks.",
      badge: "Data Precision",
    },
    {
      title: "Client-Side Privacy",
      desc: "Because the heavy computational lifting occurs on your device, your confidential contracts and private photos never reside on external servers.",
      badge: "Zero-Logs",
    },
  ];

  return (
    <div className="page-body pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto w-full"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> The ApniPDFs Technology
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            How ApniPDFs Works
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience ultra-fast, client-side document processing with zero software installation, zero account requirements, and guaranteed confidentiality.
          </p>
        </div>

        {/* 3 Step Process */}
        <div className="grid md:grid-cols-3 gap-8 relative mb-20">
          <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-cyan-500/30 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all"
            >
              <div
                className={`w-20 h-20 rounded-2xl ${step.bg} ${step.color} border ${step.border} flex items-center justify-center mb-6 shadow-xl`}
              >
                {step.icon}
              </div>
              <h2 className="text-xl font-bold text-white mb-3">{step.title}</h2>
              <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive: Architecture & Technology */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-16">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Built for Modern Web Standards & Absolute Privacy
            </h2>
            <p className="text-white/60 text-base leading-relaxed">
              Traditional document tools upload your files to external cloud servers, run server-side conversions, and store files for hours. ApniPDFs re-engineers this workflow:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {technologies.map((tech, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{tech.title}</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {tech.badge}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Guides by Tool */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Comprehensive Tool Suites
            </h2>
            <p className="text-white/60 text-sm">
              Discover what you can accomplish with our document processing engines
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-lg">
                  📄
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">PDF Processing Suite</h3>
                  <div className="text-xs text-white/50">Edit, Merge, Split & Convert</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Merge PDFs:</strong> Combine multiple PDFs into a single polished document.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Split PDFs:</strong> Extract specific pages or separate documents effortlessly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Convert to Docx:</strong> Transform read-only PDFs into editable Word documents.</span>
                </li>
              </ul>
              <Link to="/pdf" className="inline-flex text-xs font-semibold text-pink-400 hover:underline pt-2">
                Explore PDF Tools →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
                  📝
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Word Document Studio</h3>
                  <div className="text-xs text-white/50">Edit & Convert DOCX Files</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>Live Browser Editor:</strong> Edit text, paragraphs, and headings without MS Office.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>Merge Documents:</strong> Append multiple docx files together seamlessly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>Format Conversion:</strong> Export DOCX to PDF or HTML with preserved styles.</span>
                </li>
              </ul>
              <Link to="/word" className="inline-flex text-xs font-semibold text-cyan-400 hover:underline pt-2">
                Explore Word Tools →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg">
                  📊
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Spreadsheet Studio</h3>
                  <div className="text-xs text-white/50">XLSX & CSV Data Utilities</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-orange-400 mt-0.5 shrink-0" />
                  <span><strong>Table Viewer:</strong> Inspect tabular sheets with sorting and pagination.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-orange-400 mt-0.5 shrink-0" />
                  <span><strong>Split Sheets:</strong> Break multi-tab workbooks into standalone spreadsheets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-orange-400 mt-0.5 shrink-0" />
                  <span><strong>Merge Workbooks:</strong> Combine separate tables into unified datasets.</span>
                </li>
              </ul>
              <Link to="/excel" className="inline-flex text-xs font-semibold text-orange-400 hover:underline pt-2">
                Explore Excel Tools →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
                  🎨
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Image Studio</h3>
                  <div className="text-xs text-white/50">Edit, Filters, Split & Merge</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>Instant Adjustments:</strong> Brightness, contrast, rotation, and mirror flipping.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>Split Images:</strong> Divide graphics horizontally or vertically for grids.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>Merge Photos:</strong> Join multiple snapshots side-by-side or stacked.</span>
                </li>
              </ul>
              <Link to="/image" className="inline-flex text-xs font-semibold text-purple-400 hover:underline pt-2">
                Explore Image Tools →
              </Link>
            </div>
          </div>
        </div>

        <AdBanner />
      </motion.div>
    </div>
  );
}
