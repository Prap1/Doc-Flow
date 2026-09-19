import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Compass, FileText, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Explore our document tools below.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            to="/pdf"
            className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 text-left transition-all hover:-translate-y-0.5"
          >
            <span className="text-2xl">📄</span>
            <div>
              <div className="text-sm font-semibold text-white">PDF Tools</div>
              <div className="text-xs text-white/50">Edit, Merge & Split</div>
            </div>
          </Link>
          <Link
            to="/word"
            className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 text-left transition-all hover:-translate-y-0.5"
          >
            <span className="text-2xl">📝</span>
            <div>
              <div className="text-sm font-semibold text-white">Word Tools</div>
              <div className="text-xs text-white/50">Docs & Converter</div>
            </div>
          </Link>
          <Link
            to="/excel"
            className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 text-left transition-all hover:-translate-y-0.5"
          >
            <span className="text-2xl">📊</span>
            <div>
              <div className="text-sm font-semibold text-white">Excel Tools</div>
              <div className="text-xs text-white/50">Sheets & Tables</div>
            </div>
          </Link>
          <Link
            to="/image"
            className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 text-left transition-all hover:-translate-y-0.5"
          >
            <span className="text-2xl">🖼️</span>
            <div>
              <div className="text-sm font-semibold text-white">Image Tools</div>
              <div className="text-xs text-white/50">Filters & Edit</div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home size={16} /> Return to Homepage
          </Link>
          <Link
            to="/sitemap"
            className="btn btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Compass size={16} /> View Sitemap
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
