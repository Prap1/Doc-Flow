import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSpreadsheet,
  FileCheck,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Scissors,
  Merge,
  Table,
  Layers,
} from "lucide-react";

export default function ExcelContentSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const guides = [
    {
      title: "How to View & Edit Spreadsheets Online",
      icon: <Table className="text-orange-400" size={20} />,
      steps: [
        "Select 'Edit Spreadsheet' and drag your .xlsx, .xls, or .csv file into the upload zone.",
        "Our client-side engine parses the data grids, column structures, and cell values.",
        "View tables with interactive sorting, search rows, and edit cell content directly in the browser.",
        "Download your updated spreadsheet back to your computer in universal .xlsx format.",
      ],
    },
    {
      title: "How to Merge Multiple Excel Workbooks",
      icon: <Merge className="text-purple-400" size={20} />,
      steps: [
        "Select 'Merge Sheets' and upload two or more workbooks or monthly reports.",
        "Arrange the file list to set the preferred consolidation order.",
        "Our merger aligns corresponding sheets and stitches datasets together seamlessly.",
        "Download the unified workbook ready for financial analysis or reporting.",
      ],
    },
    {
      title: "How to Split a Multi-Tab Excel Workbook",
      icon: <Scissors className="text-pink-400" size={20} />,
      steps: [
        "Choose 'Split Sheets' and upload your master workbook containing multiple tabs.",
        "The parser scans and isolates each tab (e.g. Sales, Taxes, Inventory, Payroll).",
        "Each sheet is converted into its own dedicated, standalone spreadsheet file.",
        "Download individual sheets or grab all separated files in one session.",
      ],
    },
    {
      title: "Converting CSV to Formatted Excel (.xlsx)",
      icon: <FileSpreadsheet className="text-emerald-400" size={20} />,
      steps: [
        "Drop any raw .csv data export from your CRM, ERP, or payment processor.",
        "The engine detects delimiter schemas (commas, semicolons, tabs) automatically.",
        "Data types (numbers, dates, currency strings) are formatted cleanly.",
        "Download a formatted .xlsx workbook with preserved columns and rows.",
      ],
    },
  ];

  const faqs = [
    {
      q: "Are my company's financial records or payroll sheets stored on your servers?",
      a: "Absolutely not. All spreadsheet parsing, table rendering, sheet isolation, and mergers occur 100% inside your browser's local sandbox memory using client-side WebAssembly and JS engines. Your data never touches remote databases.",
    },
    {
      q: "What spreadsheet file formats does ApniPDFs support?",
      a: "We support modern Microsoft Excel files (.xlsx), legacy binary workbooks (.xls), Comma-Separated Values (.csv), and tab-delimited files (.tsv).",
    },
    {
      q: "Are formulas and cell references preserved when splitting sheets?",
      a: "Formulas that reference cells within the same sheet are preserved intact. For formulas referencing external tabs, values are computed and preserved accurately to prevent broken #REF! errors in the standalone sheet.",
    },
    {
      q: "Is there a row or column limit for spreadsheet uploads?",
      a: "You can comfortably process workbooks with tens of thousands of rows up to 50MB. Because modern browser engines utilize hardware-accelerated memory, parsing is fast and responsive.",
    },
    {
      q: "Can I use Excel Tools on Mac, Linux, and mobile devices?",
      a: "Yes! Since the entire tool operates directly in modern web browsers (Chrome, Safari, Firefox, Edge), it functions identically across Windows, macOS, Linux, iPad, and mobile devices.",
    },
  ];

  return (
    <div className="w-full mt-16 pt-12 border-t border-white/10 text-left">
      {/* Guides */}
      <div className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap size={12} /> Spreadsheet Management Guide
          </div>
          <h2 className="text-3xl font-outfit font-extrabold text-white mb-3">
            Comprehensive Guide to Excel & Data Tools
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Master online spreadsheet viewing, multi-sheet workbook splitting, and file consolidation without expensive software licenses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all"
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
      <div className="p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-indigo-500/10 border border-white/10 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-orange-400 font-semibold text-sm mb-2">
            <ShieldCheck size={18} /> High-Precision Data Isolation
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Enterprise-Grade Security for Sensitive Spreadsheets
          </h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
            Accounting ledgers, client registries, and confidential sales forecasts require uncompromised discretion. With ApniPDFs, your data stays within your browser tab—never archived, indexed, or shared.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-orange-400 shrink-0" />
            <span>Strict Client-Side Sandboxing</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
            <span>Fast Multi-Tab Workbook Parsing</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
            <span>Zero Watermarks or Restrictions</span>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 mb-16 overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileCheck className="text-orange-400" size={20} />
          Technical Standards & Data Formats
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase tracking-wider text-white/40 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Standard / Feature</th>
                <th className="py-3 px-4">Supported Capabilities</th>
                <th className="py-3 px-4">Engine Technology</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Workbook Types</td>
                <td className="py-3 px-4">.xlsx, .xls, .csv, .tsv, OpenDocument .ods</td>
                <td className="py-3 px-4 text-orange-400">SheetJS XLSX Engine</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Max File Size</td>
                <td className="py-3 px-4">Up to 50MB per workbook</td>
                <td className="py-3 px-4 text-amber-400">Client Memory Buffer</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Operations</td>
                <td className="py-3 px-4">Sheet Splitting, Workbook Merging, Table View</td>
                <td className="py-3 px-4 text-purple-400">Vectorized JS Engine</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Data Privacy</td>
                <td className="py-3 px-4">Zero server uploads; instant local disposal</td>
                <td className="py-3 px-4 text-emerald-400">Local Sandbox</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Excel Tools FAQs</h3>
          <p className="text-white/60 text-sm">Common questions regarding spreadsheet editing and sheet splitting</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isOpen ? "bg-white/[0.06] border-orange-500/40" : "bg-white/[0.02] border-white/10"
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
                    className="text-orange-400 shrink-0"
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
