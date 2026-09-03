import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  FileText,
  File,
  FileSpreadsheet,
  Image as ImageIcon,
  MessageSquare,
  MessagesSquare,
  HelpCircle,
  Info,
  ShieldCheck,
  FileCheck,
  Mail,
  Search,
  ArrowUpRight,
  Compass,
  Layers,
  Sparkles,
  ChevronRight,
  Combine,
  Scissors,
  Edit3,
  RefreshCw,
  FolderTree,
} from "lucide-react";

export default function Sitemap() {
  const [searchQuery, setSearchQuery] = useState("");

  const sitemapData = [
    {
      category: "Main & Overview",
      description: "Core website pages and introductory information",
      color: "from-indigo-500 to-blue-600",
      textColor: "text-indigo-400",
      borderColor: "border-indigo-500/20",
      hoverBg: "hover:border-indigo-500/50 hover:bg-indigo-500/5",
      badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
      icon: <Home size={22} className="text-indigo-400" />,
      links: [
        {
          title: "Home Dashboard",
          path: "/",
          desc: "Main hub for document processing, recent actions, and all suite tools.",
          icon: <Home size={16} />,
          badge: "Core",
        },
        {
          title: "How It Works",
          path: "/how-it-works",
          desc: "Step-by-step visual workflow guide for editing, converting, and exporting documents.",
          icon: <Info size={16} />,
        },
        {
          title: "Frequently Asked Questions",
          path: "/faqs",
          desc: "Answers to common inquiries regarding file formats, privacy, security, and usage.",
          icon: <HelpCircle size={16} />,
        },
        {
          title: "Contact & Support",
          path: "/contact",
          desc: "Get in touch with our engineering and support team for feedback or assistance.",
          icon: <Mail size={16} />,
        },
      ],
    },
    {
      category: "PDF Studio",
      description: "High-performance browser-powered PDF manipulation suite",
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-400",
      borderColor: "border-pink-500/20",
      hoverBg: "hover:border-pink-500/50 hover:bg-pink-500/5",
      badgeColor: "bg-pink-500/10 text-pink-300 border-pink-500/30",
      icon: <FileText size={22} className="text-pink-400" />,
      links: [
        {
          title: "PDF Studio Hub",
          path: "/pdf",
          desc: "Complete PDF tool workspace with quick selection and batch processing.",
          icon: <FileText size={16} />,
          badge: "Popular",
        },
        {
          title: "PDF Annotator & Editor",
          path: "/pdf/edit",
          desc: "Annotate, draw signatures, highlight, and add custom text directly onto PDF pages.",
          icon: <Edit3 size={16} />,
        },
        {
          title: "Merge PDFs",
          path: "/pdf/merge",
          desc: "Combine multiple PDF documents into a single organized document effortlessly.",
          icon: <Combine size={16} />,
        },
        {
          title: "Split PDF",
          path: "/pdf/split",
          desc: "Extract specific page ranges or break large PDF files into distinct parts.",
          icon: <Scissors size={16} />,
        },
        {
          title: "Convert PDF",
          path: "/pdf/convert",
          desc: "Seamlessly convert PDF documents to DOCX, HTML, or convert HTML templates to PDF.",
          icon: <RefreshCw size={16} />,
        },
      ],
    },
    {
      category: "Word Studio",
      description: "DOCX document merging, splitting, and format conversion",
      color: "from-cyan-500 to-blue-500",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/20",
      hoverBg: "hover:border-cyan-500/50 hover:bg-cyan-500/5",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      icon: <File size={22} className="text-cyan-400" />,
      links: [
        {
          title: "Word Studio Hub",
          path: "/word",
          desc: "Manage and transform your Microsoft Word (.docx) files with ease.",
          icon: <File size={16} />,
        },
        {
          title: "Word Document Editor",
          path: "/word/edit",
          desc: "Inspect, view, and edit DOCX document contents in real time.",
          icon: <Edit3 size={16} />,
        },
        {
          title: "Merge Word Files",
          path: "/word/merge",
          desc: "Combine multiple Word documents into a unified output file.",
          icon: <Combine size={16} />,
        },
        {
          title: "Split Word Files",
          path: "/word/split",
          desc: "Separate large Word documents into distinct sections or chapters.",
          icon: <Scissors size={16} />,
        },
        {
          title: "Convert Word to HTML / DOCX",
          path: "/word/convert",
          desc: "Bi-directional conversion between formatted HTML code and DOCX files.",
          icon: <RefreshCw size={16} />,
        },
      ],
    },
    {
      category: "Excel Studio",
      description: "Spreadsheet manipulation, JSON mapping, and table merging",
      color: "from-orange-500 to-amber-600",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/20",
      hoverBg: "hover:border-orange-500/50 hover:bg-orange-500/5",
      badgeColor: "bg-orange-500/10 text-orange-300 border-orange-500/30",
      icon: <FileSpreadsheet size={22} className="text-orange-400" />,
      links: [
        {
          title: "Excel Studio Hub",
          path: "/excel",
          desc: "Explore all spreadsheet and workbook utilities in one place.",
          icon: <FileSpreadsheet size={16} />,
        },
        {
          title: "Excel Sheet Editor",
          path: "/excel/edit",
          desc: "Load, preview, edit, and analyze Excel workbook rows and columns.",
          icon: <Edit3 size={16} />,
        },
        {
          title: "Merge Spreadsheets",
          path: "/excel/merge",
          desc: "Merge multiple Excel workbooks and sheets into one consolidated sheet.",
          icon: <Combine size={16} />,
        },
        {
          title: "Split Excel Worksheets",
          path: "/excel/split",
          desc: "Split multi-sheet workbooks into standalone individual Excel files.",
          icon: <Scissors size={16} />,
        },
      ],
    },
    {
      category: "Image Studio",
      description: "Image processing, merging, compression, and visual editing",
      color: "from-purple-500 to-violet-600",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/20",
      hoverBg: "hover:border-purple-500/50 hover:bg-purple-500/5",
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
      icon: <ImageIcon size={22} className="text-purple-400" />,
      links: [
        {
          title: "Image Studio Hub",
          path: "/image",
          desc: "Comprehensive suite for quick visual edits, joins, cuts, and compression.",
          icon: <ImageIcon size={16} />,
        },
        {
          title: "Image Editor & Filters",
          path: "/image/edit",
          desc: "Adjust brightness, contrast, crop dimensions, and apply aesthetic photo filters.",
          icon: <Edit3 size={16} />,
        },
        {
          title: "Merge Images",
          path: "/image/merge",
          desc: "Stitch multiple image photos horizontally or vertically into a unified collage.",
          icon: <Combine size={16} />,
        },
        {
          title: "Split Images",
          path: "/image/split",
          desc: "Slice images into multiple proportional grid tiles or vertical/horizontal slices.",
          icon: <Scissors size={16} />,
        },
      ],
    },
    {
      category: "Social Studio",
      description: "Interactive post generation and WhatsApp chat visualization",
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      hoverBg: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      icon: <MessageSquare size={22} className="text-emerald-400" />,
      links: [
        {
          title: "Post Studio",
          path: "/chat",
          desc: "Create dynamic shareable posts with voice notes, media attachments, and reactions.",
          icon: <MessageSquare size={16} />,
          badge: "Interactive",
        },
        {
          title: "WhatsApp Chat Studio",
          path: "/whatsapp",
          desc: "Upload and visualize WhatsApp chat backups with interactive conversation UI.",
          icon: <MessagesSquare size={16} />,
        },
      ],
    },
    {
      category: "Legal & Compliance",
      description: "Privacy commitments, data security policies, and service terms",
      color: "from-slate-400 to-gray-500",
      textColor: "text-slate-300",
      borderColor: "border-slate-500/20",
      hoverBg: "hover:border-slate-500/50 hover:bg-slate-500/5",
      badgeColor: "bg-slate-500/10 text-slate-300 border-slate-500/30",
      icon: <ShieldCheck size={22} className="text-slate-300" />,
      links: [
        {
          title: "Privacy Policy",
          path: "/privacy",
          desc: "Our zero-retention, client-side privacy commitments and security architecture.",
          icon: <ShieldCheck size={16} />,
        },
        {
          title: "Terms & Conditions",
          path: "/terms",
          desc: "Rules, user agreements, liability disclaimers, and service acceptable use terms.",
          icon: <FileCheck size={16} />,
        },
      ],
    },
  ];

  // Filter links based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return sitemapData;

    const query = searchQuery.toLowerCase();
    return sitemapData
      .map((cat) => {
        const matchesCategory =
          cat.category.toLowerCase().includes(query) ||
          cat.description.toLowerCase().includes(query);

        const matchingLinks = cat.links.filter(
          (link) =>
            link.title.toLowerCase().includes(query) ||
            link.desc.toLowerCase().includes(query) ||
            link.path.toLowerCase().includes(query)
        );

        if (matchesCategory) {
          return cat;
        }

        if (matchingLinks.length > 0) {
          return {
            ...cat,
            links: matchingLinks,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [searchQuery]);

  const totalLinks = useMemo(() => {
    return sitemapData.reduce((acc, cat) => acc + cat.links.length, 0);
  }, [sitemapData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto w-full py-6"
    >
      {/* Hero Header */}
      <div className="relative mb-12 text-center overflow-hidden rounded-3xl p-8 md:p-12 border border-white/10 bg-gradient-to-b from-[#11122a]/80 to-[#07071A]/90 backdrop-blur-2xl shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <FolderTree size={14} />
            <span>Architecture & Site Navigation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-outfit font-extrabold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-300 to-pink-300">
              Site Map & Index
            </span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
            Navigate through all available tools, document converters, post studios, and legal resources across the ApniPDFs platform.
          </p>

          {/* Search bar inside hero */}
          <div className="w-full max-w-md relative flex items-center">
            <Search
              size={18}
              className="absolute left-4 text-white/40 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, converters, pages, or URLs..."
              className="w-full bg-[#0a0b1e]/80 border border-white/15 focus:border-indigo-400/70 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder:text-white/30 outline-none backdrop-blur-md transition-all shadow-inner focus:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-medium text-white/40 hover:text-white bg-white/10 px-2 py-0.5 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-6 mt-8 text-xs font-medium text-white/50">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-indigo-400" />
              <span>{sitemapData.length} Categories</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-cyan-400" />
              <span>{totalLinks} Pages & Endpoints</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-pink-400" />
              <span>100% Free & Client-Side</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-[#0f1023]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <Search size={40} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No pages found</h3>
          <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
            We couldn't find any tools or pages matching &quot;{searchQuery}&quot;. Try searching for &quot;PDF&quot;, &quot;Merge&quot;, &quot;Convert&quot;, or &quot;Excel&quot;.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Reset Search Filter
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((section, sectionIdx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.06 }}
              className="bg-[#0f1023]/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl overflow-hidden relative group"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/5">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-sm`}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-outfit font-bold text-white flex items-center gap-3">
                      {section.category}
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${section.badgeColor}`}>
                        {section.links.length} {section.links.length === 1 ? "page" : "links"}
                      </span>
                    </h2>
                    <p className="text-white/50 text-xs sm:text-sm mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex flex-col justify-between p-4 rounded-xl bg-[#14152e]/50 border ${section.borderColor} ${section.hoverBg} transition-all duration-200 group/card hover:translate-y-[-2px] hover:shadow-lg`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`p-1.5 rounded-lg bg-white/5 ${section.textColor}`}>
                            {link.icon}
                          </span>
                          <span className="font-semibold text-white/90 text-sm group-hover/card:text-white transition-colors">
                            {link.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {link.badge && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white/80 border border-white/15">
                              {link.badge}
                            </span>
                          )}
                          <ArrowUpRight
                            size={16}
                            className="text-white/30 group-hover/card:text-white group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-all"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed pl-8">
                        {link.desc}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/30 group-hover/card:text-white/50 pl-8">
                      <span className="font-mono text-indigo-300/70">{link.path}</span>
                      <span className="flex items-center gap-1 text-white/40 group-hover/card:text-indigo-300 font-medium transition-colors">
                        Launch <ChevronRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* SEO Information & Direct Links Box */}
      <div className="mt-12 p-6 rounded-2xl bg-[#0b0c1e]/70 border border-white/5 text-center text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>Looking for raw machine-readable index? </span>
          <span className="text-white/60 font-mono">XML Sitemap available for search crawlers.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-indigo-400 hover:underline">
            Back to Home
          </Link>
          <span>•</span>
          <Link to="/contact" className="text-indigo-400 hover:underline">
            Request a Feature
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
