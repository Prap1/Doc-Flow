import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Layers,
  FileCheck,
  Lock,
  Scissors,
  Merge,
  RefreshCw,
} from "lucide-react";

export default function PdfContentSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const guides = [
    {
      title: "How to Edit a PDF Online",
      icon: <FileText className="text-pink-400" size={20} />,
      steps: [
        "Select the 'Edit PDF' tool and drop your PDF into the upload area.",
        "Choose between client-side annotation or server-assisted text editing.",
        "Add annotations, edit text fields, draw shapes, or highlight important sections.",
        "Click 'Download' to immediately save your edited PDF back to your device.",
      ],
    },
    {
      title: "How to Merge Multiple PDFs into One",
      icon: <Merge className="text-purple-400" size={20} />,
      steps: [
        "Click 'Merge PDFs' and drag multiple PDF documents into the dropzone.",
        "Reorder files using drag-and-drop or remove unwanted files.",
        "Click 'Merge Files' to execute instant concatenation in memory.",
        "Download your consolidated, single PDF file with all bookmarks intact.",
      ],
    },
    {
      title: "How to Split PDF Pages",
      icon: <Scissors className="text-cyan-400" size={20} />,
      steps: [
        "Select 'Split PDF' and upload the document you need to extract pages from.",
        "Enter individual page numbers (e.g., '1, 3, 5') or continuous ranges (e.g., '2-6').",
        "Our engine extracts only the specified pages without quality loss.",
        "Download your lightweight, extracted PDF file immediately.",
      ],
    },
    {
      title: "How to Convert PDF to Word (.docx)",
      icon: <RefreshCw className="text-emerald-400" size={20} />,
      steps: [
        "Navigate to 'Convert PDF' and drop your document.",
        "Our converter parses the text flow, fonts, headers, and structural tables.",
        "Download the formatted .docx file ready for Microsoft Word or Google Docs.",
        "Edit paragraphs and styling freely in any modern word processor.",
      ],
    },
  ];

  const faqs = [
    {
      q: "Will my PDF lose formatting or image quality after editing or merging?",
      a: "No. Our tools use high-fidelity vector parsing algorithms via PDF-lib. Text, fonts, embedded high-resolution images, and vector line art remain completely uncompressed and crisp.",
    },
    {
      q: "Are my confidential legal contracts or bank statements stored on your servers?",
      a: "No. ApniPDFs operates on a strict zero-retention policy. All browser-based PDF functions process your document in local memory. Any temporary server processing is handled ephemerally and purged immediately upon download.",
    },
    {
      q: "Can I merge PDFs that have different page orientations (Portrait & Landscape)?",
      a: "Yes! Our merger respects and preserves individual page rotations, dimensions, and metadata. Portrait and landscape pages coexist seamlessly in the merged output document.",
    },
    {
      q: "Is there a limit to how many pages or files I can process at once?",
      a: "You can upload files up to 50MB. There is no artificial page restriction—whether your document has 5 pages or 500 pages, our engine processes it smoothly.",
    },
    {
      q: "Does ApniPDFs add watermarks to my edited or merged files?",
      a: "Never. ApniPDFs is completely free and never adds promotional watermarks, header stamps, or branded footers to your processed files.",
    },
  ];

  return (
    <div className="w-full mt-16 pt-12 border-t border-white/10 text-left">
      {/* Guide Section */}
      <div className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap size={12} /> Step-by-Step Tutorial
          </div>
          <h2 className="text-3xl font-outfit font-extrabold text-white mb-3">
            Comprehensive Guide to ApniPDFs Tools
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Everything you need to master PDF editing, page merging, splitting, and format conversion with zero software installation.
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

      {/* Security & Features Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-white/10 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-pink-400 font-semibold text-sm mb-2">
            <ShieldCheck size={18} /> Enterprise Privacy by Architecture
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Why Professionals Trust ApniPDFs for Sensitive Documents
          </h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
            From legal briefs to tax returns and personal IDs, your documents should never be archived on unknown third-party cloud servers. ApniPDFs guarantees client-side sandboxing, TLS encryption in transit, zero file logs, and instant session data deletion.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-pink-400 shrink-0" />
            <span>100% Free & No Watermarks</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
            <span>Browser-Sandboxed Memory</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
            <span>No Account or Sign-Up Needed</span>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 mb-16 overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileCheck className="text-pink-400" size={20} />
          Technical Standards & Supported Formats
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase tracking-wider text-white/40 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Feature / Specification</th>
                <th className="py-3 px-4">Supported Capabilities</th>
                <th className="py-3 px-4">Processing Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">PDF Standards</td>
                <td className="py-3 px-4">PDF 1.3 through PDF 2.0, PDF/A-1b Archival</td>
                <td className="py-3 px-4 text-pink-400">PDF-lib & WASM</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Max File Size</td>
                <td className="py-3 px-4">Up to 50MB per single file</td>
                <td className="py-3 px-4 text-indigo-400">In-Memory Stream</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Conversion Formats</td>
                <td className="py-3 px-4">PDF → Word (.docx), HTML → PDF</td>
                <td className="py-3 px-4 text-cyan-400">DOCX Parser</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Security / Privacy</td>
                <td className="py-3 px-4">Zero persistent storage; ephemeral memory wipe</td>
                <td className="py-3 px-4 text-emerald-400">Sandbox Isolation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tool FAQs */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">PDF Tools FAQs</h3>
          <p className="text-white/60 text-sm">Answers to common questions regarding PDF editing and conversions</p>
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
