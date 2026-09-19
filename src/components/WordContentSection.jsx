import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  FileCheck,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Scissors,
  Merge,
  RefreshCw,
  Layers,
} from "lucide-react";

export default function WordContentSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const guides = [
    {
      title: "How to Edit a Word Document (.docx) Online",
      icon: <FileText className="text-cyan-400" size={20} />,
      steps: [
        "Select the 'Edit Document' tool and upload your .docx or .doc file.",
        "Our in-browser parser instantly extracts the text, headings, and structure.",
        "Use the rich text editor to modify copy, adjust typography, insert lists, or format quotes.",
        "Export the modified document back to your computer with a single click.",
      ],
    },
    {
      title: "How to Merge Multiple Word Documents",
      icon: <Merge className="text-purple-400" size={20} />,
      steps: [
        "Click 'Merge Docs' and select two or more .docx files from your device.",
        "Organize the document sequence to establish your desired flow.",
        "Click 'Merge Documents' to seamlessly combine chapters or contract appendices.",
        "Download the unified .docx file with paragraph formatting preserved.",
      ],
    },
    {
      title: "How to Split a Word Document into Chapters",
      icon: <Scissors className="text-pink-400" size={20} />,
      steps: [
        "Choose 'Split Doc' and upload the multi-page Word file.",
        "Specify section delimiters or page divisions.",
        "Our engine segments the document into discrete, standalone files.",
        "Download the separated documents individually or as an organized package.",
      ],
    },
    {
      title: "How to Convert Word to PDF or HTML",
      icon: <RefreshCw className="text-emerald-400" size={20} />,
      steps: [
        "Navigate to 'Convert Doc' and choose your target export format (PDF or HTML).",
        "Upload your source .docx file into the converter dropzone.",
        "The conversion engine parses fonts, headings, tables, and spacing accurately.",
        "Download the converted, print-ready PDF or clean web-ready HTML code.",
      ],
    },
  ];

  const faqs = [
    {
      q: "Do I need Microsoft Office or Microsoft 365 installed to edit files?",
      a: "No! ApniPDFs provides a self-contained browser-native rich text engine. You can open, read, edit, and export modern .docx files without purchasing Microsoft Word or installing any desktop software.",
    },
    {
      q: "Are complex tables and bullet points preserved during editing?",
      a: "Yes. Our document parser (built on modern Mammoth and XML document standards) recognizes standard tables, ordered/unordered lists, bold/italic text, blockquotes, and heading hierarchies.",
    },
    {
      q: "Can I convert older .doc files as well as modern .docx files?",
      a: "Yes. We support standard Microsoft Word formats. For optimal precision, modern Office Open XML (.docx) files deliver the fastest and most accurate browser-side processing.",
    },
    {
      q: "Is my proprietary writing or company correspondence stored on your servers?",
      a: "Never. All documents opened in our editor are loaded into client-side browser memory. We never archive your text, sell your copy, or retain copies on our storage volumes.",
    },
    {
      q: "Can I export my finished document as a PDF directly from the editor?",
      a: "Yes. The Word Studio allows you to either save back as an updated .docx document or render directly to a standardized, universally readable PDF.",
    },
  ];

  return (
    <div className="w-full mt-16 pt-12 border-t border-white/10 text-left">
      {/* Guides */}
      <div className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap size={12} /> Complete Word Processing Guide
          </div>
          <h2 className="text-3xl font-outfit font-extrabold text-white mb-3">
            How to Use the ApniPDFs Word Studio
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Create, edit, merge, and convert Microsoft Word documents effortlessly on any computer or mobile device.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all"
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
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-white/10 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-2">
            <ShieldCheck size={18} /> Zero-Installation Cloud Agnostic
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Pure Browser Efficiency for Word Processing
          </h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
            Say goodbye to slow desktop suites, expensive subscriptions, and mandatory sign-ups. ApniPDFs gives students, writers, and business professionals instant access to document editing with guaranteed zero-retention privacy.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
            <span>ECMA-376 Standard Compliant</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
            <span>Instant In-Memory Parsing</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-pink-400 shrink-0" />
            <span>Zero Watermarks or Ads Over Content</span>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 mb-16 overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileCheck className="text-cyan-400" size={20} />
          Document Compatibility & Features
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase tracking-wider text-white/40 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Feature / Standard</th>
                <th className="py-3 px-4">Supported Formats</th>
                <th className="py-3 px-4">Platform Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Document Formats</td>
                <td className="py-3 px-4">.docx, .doc, .rtf, .txt, .html</td>
                <td className="py-3 px-4 text-cyan-400">Mammoth & HTML5</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Max Document Size</td>
                <td className="py-3 px-4">Up to 50MB per file</td>
                <td className="py-3 px-4 text-indigo-400">Client Memory Stream</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Export Options</td>
                <td className="py-3 px-4">DOCX, PDF, HTML, Markdown</td>
                <td className="py-3 px-4 text-purple-400">Multi-Format Serializer</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Privacy Standard</td>
                <td className="py-3 px-4">100% In-Memory sandbox; zero cloud logs</td>
                <td className="py-3 px-4 text-emerald-400">Zero Retention</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Word Tools FAQs</h3>
          <p className="text-white/60 text-sm">Frequently asked questions about Word document editing and conversion</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isOpen ? "bg-white/[0.06] border-cyan-500/40" : "bg-white/[0.02] border-white/10"
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
                    className="text-cyan-400 shrink-0"
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
