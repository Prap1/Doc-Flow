import { Globe, Mail, MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-8 px-8 bg-[#07071A]/50 border-t border-white/5 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-outfit font-extrabold text-xl tracking-tight text-white/90">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              ApniPDFs
            </span>{" "}
            Pro
          </div>
          <p className="text-white/40 text-sm flex items-center gap-1.5">
            Crafted with{" "}
            <Heart size={14} className="text-pink-500 fill-pink-500/20" /> by
            your team
          </p>
        </div>

        {/* Center: Quick Links */}
        <nav className="flex items-center gap-6 text-sm text-white/50 font-medium flex-wrap justify-center">
          <Link to="/how-it-works" className="hover:text-indigo-400 transition-colors">
            How It Works
          </Link>
          <Link to="/faqs" className="hover:text-indigo-400 transition-colors">
            FAQs
          </Link>
          <Link
            to="/privacy"
            className="hover:text-indigo-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-indigo-400 transition-colors">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-indigo-400 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Side: Socials */}
        <div className="flex items-center gap-4 text-white/40">
          <a
            href="#"
            className="hover:text-white transition-colors hover:scale-110"
          >
            <Globe size={18} />
          </a>
          <a
            href="#"
            className="hover:text-blue-400 transition-colors hover:scale-110"
          >
            <Mail size={18} />
          </a>
          <a
            href="#"
            className="hover:text-blue-600 transition-colors hover:scale-110"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-white/30 text-sm">
        &copy; 2026 ApniPDFs. All rights reserved.
      </div>
    </footer>
  );
}
