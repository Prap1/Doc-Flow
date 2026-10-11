import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FileText,
  File,
  BookOpen,
  FileSpreadsheet,
  Image as ImageIcon,
  MessageSquare,
  ChevronDown,
  Wrench,
  Menu,
  X,
  Info,
  Mail,
  ArrowRight,
} from "lucide-react";
import Logo from "./Logo";

// All 5 tools consolidated cleanly in one place
const allTools = [
  {
    path: "/pdf",
    icon: <FileText size={18} />,
    label: "PDF Studio",
    desc: "Merge, split, convert & annotate PDFs",
    color: "text-pink-400",
    bgClass: "bg-pink-500/10 border-pink-500/20",
  },
  {
    path: "/word",
    icon: <File size={18} />,
    label: "Word Studio",
    desc: "Create & edit DOCX documents",
    color: "text-cyan-400",
    bgClass: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    path: "/excel",
    icon: <FileSpreadsheet size={18} />,
    label: "Excel Studio",
    desc: "Split workbooks & convert CSVs",
    color: "text-orange-400",
    bgClass: "bg-orange-500/10 border-orange-500/20",
  },
  {
    path: "/image",
    icon: <ImageIcon size={18} />,
    label: "Image Studio",
    desc: "Compress, resize & tune images",
    color: "text-purple-400",
    bgClass: "bg-purple-500/10 border-purple-500/20",
  },
  {
    path: "/chat",
    icon: <MessageSquare size={18} />,
    label: "Chat Studio",
    desc: "Smart AI document assistant",
    color: "text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const DropdownItem = ({ item, onClick }) => (
  <NavLink
    to={item.path}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 group ${
        isActive
          ? "bg-white/10 text-white border border-white/10"
          : "hover:bg-white/[0.06] text-white/80 hover:text-white"
      }`
    }
  >
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${item.bgClass} ${item.color} transition-transform group-hover:scale-105`}
    >
      {item.icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
        {item.label}
      </span>
      <span className="text-xs text-white/50 leading-tight">
        {item.desc}
      </span>
    </div>
  </NavLink>
);

const NavItem = ({ path, icon, label, onClick }) => (
  <NavLink to={path} end={path === "/"} className="flex-shrink-0" onClick={onClick}>
    {({ isActive }) => (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
          isActive
            ? "bg-white/10 border-white/15 text-white font-semibold shadow-sm"
            : "border-transparent text-white/70 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <span className={isActive ? "text-white" : "text-white/60"}>{icon}</span>
        <span className="text-sm whitespace-nowrap">{label}</span>
      </div>
    )}
  </NavLink>
);

const ToolsDropdown = ({ onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  let timeoutId = useRef(null);

  // Check if current route is one of the tools
  const isToolActive = allTools.some((t) => location.pathname === t.path);

  const handleMouseEnter = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId.current = setTimeout(() => setIsOpen(false), 150);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative flex-shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
          isToolActive || isOpen
            ? "bg-white/10 border-white/15 text-white font-semibold shadow-sm"
            : "border-transparent text-white/70 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        <Wrench size={16} className={isToolActive ? "text-emerald-400" : "text-white/60"} />
        <span className="text-sm whitespace-nowrap">Tools</span>
        <ChevronDown
          size={14}
          className={`text-white/50 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 pt-2 z-50"
          >
            <div className="w-[320px] bg-[#0c0c20]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-1">
              <div className="px-3 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Document Studios
              </div>
              {allTools.map((tool) => (
                <DropdownItem
                  key={tool.path}
                  item={tool}
                  onClick={() => {
                    setIsOpen(false);
                    if (onItemClick) onItemClick();
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 h-16 z-[90] flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#07071A]/90 border-b border-white/10 backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Left: Brand Logo */}
      <div className="flex items-center h-full">
        <Link to="/" className="flex items-center group">
          <Logo size={34} variant="horizontal" className="group-hover:opacity-95" />
        </Link>
      </div>

      {/* Center: Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
        <NavItem path="/" icon={<Home size={16} />} label="Home" />
        <ToolsDropdown />
        <NavItem path="/guides" icon={<BookOpen size={16} />} label="Guides" />
        <NavItem path="/about" icon={<Info size={16} />} label="About Us" />
        <NavItem path="/contact" icon={<Mail size={16} />} label="Contact" />
      </nav>

      {/* Right Side: Mobile Hamburger Toggle */}
      <div className="flex items-center">
        <button
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-[#07071A]/95 border-b border-white/10 p-4 md:hidden backdrop-blur-2xl flex flex-col gap-3 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-1.5">
              <NavItem
                path="/"
                icon={<Home size={16} />}
                label="Home"
                onClick={closeMobileMenu}
              />
              <NavItem
                path="/guides"
                icon={<BookOpen size={16} />}
                label="Guides & Tutorials"
                onClick={closeMobileMenu}
              />
              <NavItem
                path="/about"
                icon={<Info size={16} />}
                label="About Us"
                onClick={closeMobileMenu}
              />
              <NavItem
                path="/contact"
                icon={<Mail size={16} />}
                label="Contact"
                onClick={closeMobileMenu}
              />
            </nav>

            <div className="pt-2 border-t border-white/10">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                All Tools
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {allTools.map((tool) => (
                  <DropdownItem
                    key={tool.path}
                    item={tool}
                    onClick={closeMobileMenu}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
