import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { guidesData } from "../data/guidesData";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "PDF Tutorials", "Word & Documents", "Security & Privacy", "Spreadsheets", "Image Processing"];

  const filteredGuides = guidesData.filter((guide) => {
    const matchesCategory =
      selectedCategory === "All" || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-body pt-8">
      <SEO
        title="Document Guides & Tutorials — ApniPDFs Knowledge Base"
        description="Comprehensive in-depth tutorials and best practices on merging PDFs, converting Word documents, in-browser privacy, splitting Excel sheets, and optimizing images."
        keywords="PDF guide, how to merge PDF, PDF to Word tutorial, client side privacy, split excel sheets, image compression tutorial"
        canonical="https://www.apnipdfs.com/guides"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto w-full"
      >
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> Educational Knowledge Base
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            Document Guides & Tutorials
          </h1>
          <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
            In-depth tutorials, technical deep-dives, and best practices for editing, converting, merging, and securing PDFs, Word documents, Excel workbooks, and images.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tutorials & guides..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Featured Guide Banner (if "All" or match) */}
        {filteredGuides.length > 0 && selectedCategory === "All" && !searchTerm && (
          <div className="mb-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-blue-900/30 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <BookOpen size={180} />
            </div>
            <div className="max-w-2xl relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30 inline-block mb-3">
                Featured Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {filteredGuides[0].title}
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-6 leading-relaxed">
                {filteredGuides[0].summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-white/50 mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {filteredGuides[0].readTime}
                </span>
                <span>•</span>
                <span>{filteredGuides[0].publishDate}</span>
                <span>•</span>
                <span>By {filteredGuides[0].author}</span>
              </div>
              <Link
                to={`/guides/${filteredGuides[0].slug}`}
                className="btn btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
              >
                <span>Read Full Tutorial</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredGuides.map((guide, idx) => (
            <motion.div
              key={guide.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${guide.categoryColor}`}
                  >
                    {guide.category}
                  </span>
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Clock size={12} /> {guide.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug">
                  <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                </h3>

                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {guide.summary}
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 mb-4">
                  <span>{guide.author}</span>
                  <span>{guide.publishDate}</span>
                </div>
                <Link
                  to={`/guides/${guide.slug}`}
                  className="btn btn-secondary w-full text-xs font-semibold py-2 inline-flex items-center justify-center gap-2"
                >
                  <span>Read Article</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl">
            <BookOpen size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Guides Found</h3>
            <p className="text-white/50 text-sm">
              Try adjusting your search query or selecting a different category.
            </p>
          </div>
        )}

        {/* AdSense Placement */}
        <AdBanner />

        {/* Quick Tools Access */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Need to process your documents right now?
              </h3>
              <p className="text-white/60 text-sm">
                Try our suite of 100% free, private browser-based utilities with zero sign-ups or watermarks.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/pdf" className="btn btn-primary text-xs px-4 py-2">
                PDF Studio
              </Link>
              <Link to="/word" className="btn btn-secondary text-xs px-4 py-2">
                Word Studio
              </Link>
              <Link to="/excel" className="btn btn-secondary text-xs px-4 py-2">
                Excel Studio
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
