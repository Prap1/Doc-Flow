import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { guidesData } from "../data/guidesData";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";
import { showToast } from "../components/Toast";

export default function GuideDetail() {
  const { slug } = useParams();
  const guide = guidesData.find((g) => g.slug === slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Article link copied to clipboard!", "success");
    }
  };

  const relatedGuides = guidesData
    .filter((g) => g.slug !== slug)
    .slice(0, 3);

  return (
    <div className="page-body pt-8">
      <SEO
        title={`${guide.title} — ApniPDFs`}
        description={guide.summary}
        keywords={`${guide.category}, ${guide.title.toLowerCase()}, ApniPDFs guide, document tutorial`}
        canonical={`https://www.apnipdfs.com/guides/${guide.slug}`}
        ogType="article"
      />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-white/50 mb-6 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/guides" className="hover:text-white transition-colors">
            Guides & Tutorials
          </Link>
          <span>/</span>
          <span className="text-white/80 truncate max-w-xs">{guide.title}</span>
        </div>

        {/* Back Link */}
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to all guides
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${guide.categoryColor}`}
            >
              {guide.category}
            </span>
            <span className="text-xs text-white/40 flex items-center gap-1.5">
              <Clock size={13} /> {guide.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black text-white mb-6 leading-tight">
            {guide.title}
          </h1>

          <p className="text-white/70 text-lg leading-relaxed mb-8">
            {guide.summary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/60">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <User size={14} className="text-indigo-400" />
                <span className="text-white/80 font-medium">{guide.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-cyan-400" />
                <span>Published {guide.publishDate}</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <Share2 size={13} /> Share Article
            </button>
          </div>
        </header>

        {/* Table of Contents Box */}
        {guide.tableOfContents && guide.tableOfContents.length > 0 && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 mb-10">
            <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
              <Bookmark size={16} className="text-indigo-400" /> Table of Contents
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              {guide.tableOfContents.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-indigo-400 font-mono text-xs">
                    0{idx + 1}.
                  </span>
                  <span className="hover:text-white transition-colors">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Content */}
        <article className="prose prose-invert max-w-none mb-16 text-white/80 text-base sm:text-lg leading-relaxed space-y-6">
          {guide.content.split("\n\n").map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith("### ")) {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl font-outfit font-extrabold text-white pt-6 pb-2 border-b border-white/10"
                >
                  {trimmed.replace("### ", "")}
                </h2>
              );
            }

            if (trimmed.startsWith("#### ")) {
              return (
                <h3
                  key={idx}
                  className="text-xl sm:text-2xl font-bold text-white pt-4"
                >
                  {trimmed.replace("#### ", "")}
                </h3>
              );
            }

            if (trimmed.startsWith("---")) {
              return <hr key={idx} className="border-white/10 my-8" />;
            }

            if (trimmed.startsWith("|")) {
              const rows = trimmed.split("\n").filter((r) => r.trim());
              return (
                <div key={idx} className="overflow-x-auto my-6">
                  <table className="w-full text-left text-sm border-collapse rounded-xl overflow-hidden border border-white/10">
                    <tbody>
                      {rows.map((row, rIdx) => {
                        const cols = row
                          .split("|")
                          .map((c) => c.trim())
                          .filter((c, i, arr) => i > 0 && i < arr.length);
                        if (row.includes(":---")) return null;
                        const isHeader = rIdx === 0;
                        return (
                          <tr
                            key={rIdx}
                            className={
                              isHeader
                                ? "bg-white/10 font-bold text-white"
                                : "border-t border-white/5 hover:bg-white/[0.02]"
                            }
                          >
                            {cols.map((col, cIdx) => (
                              <td key={cIdx} className="p-3 text-xs sm:text-sm">
                                {col.replace(/\*\*/g, "")}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }

            if (trimmed.startsWith("- ")) {
              const items = trimmed.split("\n").map((i) => i.replace(/^- /, "").trim());
              return (
                <ul key={idx} className="space-y-2 my-4 pl-4">
                  {items.map((it, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5 text-sm sm:text-base">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      <span>{it.replace(/\*\*(.*?)\*\*/g, "$1")}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            if (/^\d+\.\s/.test(trimmed)) {
              const items = trimmed.split("\n").map((i) => i.replace(/^\d+\.\s/, "").trim());
              return (
                <ol key={idx} className="space-y-3 my-4 pl-2">
                  {items.map((it, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-3 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {iIdx + 1}
                      </span>
                      <span>{it.replace(/\*\*(.*?)\*\*/g, "$1")}</span>
                    </li>
                  ))}
                </ol>
              );
            }

            return (
              <p key={idx} className="text-white/80 leading-relaxed text-sm sm:text-base">
                {trimmed.replace(/\*\*(.*?)\*\*/g, "$1")}
              </p>
            );
          })}
        </article>

        {/* AdSense Placement */}
        <AdBanner />

        {/* Author Bio Box (E-E-A-T Signal) */}
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-16">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 font-bold text-xl shadow-lg">
            AP
          </div>
          <div>
            <h4 className="text-base font-bold text-white mb-1">
              About the {guide.author}
            </h4>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-3">
              The engineering and editorial team at ApniPDFs specializes in browser-based document technologies, WebAssembly security, and vector formatting algorithms. All tutorials are rigorously tested for privacy and operational accuracy.
            </p>
            <Link
              to="/about"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Learn more about our editorial standards & team →
            </Link>
          </div>
        </div>

        {/* Related Guides Section */}
        <div className="border-t border-white/10 pt-12 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Related Tutorials</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {relatedGuides.map((rel) => (
              <Link
                key={rel.slug}
                to={`/guides/${rel.slug}`}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all hover:-translate-y-1 block group"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-2 block">
                  {rel.category}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                  {rel.title}
                </h4>
                <span className="text-xs text-white/40 flex items-center gap-1">
                  <Clock size={11} /> {rel.readTime}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
