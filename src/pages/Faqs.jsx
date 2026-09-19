import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Shield, FileText, FileSpreadsheet, Image as ImageIcon, Sparkles } from "lucide-react";
import AdBanner from "../components/AdBanner";

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General & Privacy" },
    { id: "pdf", label: "PDF Tools" },
    { id: "docs", label: "Word & Office" },
    { id: "excel", label: "Spreadsheets" },
    { id: "images", label: "Images" },
  ];

  const faqs = [
    // General & Privacy
    {
      cat: "general",
      q: "Is ApniPDFs completely free to use?",
      a: "Yes! ApniPDFs is 100% free with no hidden paywalls, no trial limits, and no credit card required. Our infrastructure is sustained through non-intrusive advertisements.",
    },
    {
      cat: "general",
      q: "Are my uploaded documents and private data secure?",
      a: "Absolutely. Security and privacy are built into our architecture. Wherever technically possible, file manipulation occurs client-side inside your browser sandbox. For server conversions, files are handled ephemerally in RAM and wiped immediately upon download.",
    },
    {
      cat: "general",
      q: "Do I need to register or create an account to use the tools?",
      a: "No registration is required. You can immediately edit, merge, split, or convert documents without sharing your email address, name, or phone number.",
    },
    {
      cat: "general",
      q: "What is the maximum file size supported?",
      a: "You can process files up to 50MB per upload. For standard PDF documents, Word files, Excel workbooks, and high-resolution images, 50MB is more than ample for lightning-fast processing.",
    },
    {
      cat: "general",
      q: "Can I use ApniPDFs on smartphones, iPhones, or tablets?",
      a: "Yes. ApniPDFs is completely responsive and optimized for touch devices on Android (Chrome, Firefox) and iOS (Safari, Chrome). You can process files on the go directly from your mobile browser.",
    },

    // PDF Tools
    {
      cat: "pdf",
      q: "Does merging multiple PDFs degrade the original file quality?",
      a: "No. When merging PDFs with our tool, the original vector fonts, crisp illustrations, page bookmarks, and embedded image resolutions are retained identically without compression loss.",
    },
    {
      cat: "pdf",
      q: "How does the PDF Split tool handle page extraction?",
      a: "You can specify individual page numbers or ranges (e.g., 1, 3, 5-8). Our tool extracts only the target pages and compiles them into a clean, lightweight standalone PDF document.",
    },
    {
      cat: "pdf",
      q: "Can I edit text directly in a scanned PDF?",
      a: "Standard digital PDFs with selectable text layers can be parsed and edited immediately. If a PDF contains scanned image pages without text metadata, our editor extracts the page layers for canvas annotations and note additions.",
    },
    {
      cat: "pdf",
      q: "Can I convert PDF documents to editable Microsoft Word files?",
      a: "Yes! Our PDF to DOCX engine extracts paragraphs, headers, and text formatting and maps them into an editable Microsoft Word document (.docx) that you can refine in Word or our online editor.",
    },

    // Word & Office
    {
      cat: "docs",
      q: "Do I need Microsoft Word installed on my computer to edit .docx files?",
      a: "Not at all. Our integrated Word Studio includes an in-browser rich text processor that opens .docx files, lets you edit paragraphs, bolding, italics, headings, and alignments, and exports the result directly.",
    },
    {
      cat: "docs",
      q: "Will my document formatting be preserved when merging Word files?",
      a: "Yes. Our document merger sequentially stitches sections together while preserving paragraph styles, fonts, and table layouts from the source documents.",
    },
    {
      cat: "docs",
      q: "Can I export my Word document as a PDF?",
      a: "Yes. Once you finish editing your document in the Word Studio, you can export it directly as a standardized PDF or download it as an updated .docx file.",
    },

    // Spreadsheets
    {
      cat: "excel",
      q: "What spreadsheet formats are supported in Excel Studio?",
      a: "We support Microsoft Excel workbooks (.xlsx), legacy Excel spreadsheets (.xls), and Comma Separated Values (.csv).",
    },
    {
      cat: "excel",
      q: "How does the Split Sheets tool work for Excel workbooks?",
      a: "If you have a multi-tab Excel workbook (e.g. Sales, Expenses, Payroll), the split tool automatically reads all tabs and creates individual, isolated .xlsx files for each sheet.",
    },
    {
      cat: "excel",
      q: "Is confidential financial or company data safe when processing spreadsheets?",
      a: "Yes. Spreadsheet parsing and sheet isolation are performed locally within your browser tab via JavaScript XLSX engines. Your sensitive calculations and data tables are not uploaded to public databases.",
    },

    // Images
    {
      cat: "images",
      q: "What image formats can I edit and manipulate?",
      a: "We support JPG/JPEG, PNG, WebP, GIF, and SVG images. You can apply filters, rotate, crop, split into halves, or combine multiple photos horizontally and vertically.",
    },
    {
      cat: "images",
      q: "Does image editing preserve transparency (PNG/WebP)?",
      a: "Yes! When manipulating PNG or WebP images, the alpha channel (transparent background) is preserved accurately unless you choose an export format that does not support transparency (such as JPEG).",
    },
    {
      cat: "images",
      q: "What is the Image Splitter used for?",
      a: "The Image Splitter divides high-resolution graphics into equal sections. It is widely used for creating Instagram carousel grids, split-screen graphics, and multi-panel posters.",
    },
  ];

  const filteredFaqs = activeCategory === "all" ? faqs : faqs.filter((f) => f.cat === activeCategory);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-body pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle size={14} /> Comprehensive Knowledge Base
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            Frequently Asked Questions
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Everything you need to know about ApniPDFs file conversion, document privacy, formats, and technical capabilities.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isOpen
                    ? "bg-white/[0.08] border-indigo-500/50 shadow-xl"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <h3 className="text-base sm:text-lg font-bold text-white m-0 leading-snug">
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`shrink-0 ${isOpen ? "text-indigo-400" : "text-white/40"}`}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 text-white/70 leading-relaxed text-sm sm:text-base border-t border-white/5 pt-4 mt-1">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <AdBanner />
      </motion.div>
    </div>
  );
}
