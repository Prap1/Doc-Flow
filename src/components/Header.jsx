import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Home,
  FileText,
  File,
  BookOpen,
  FileSpreadsheet,
  Image as ImageIcon,
  MessageSquare,
  MessagesSquare,
  ChevronDown,
  ChevronRight,
  Wrench,
  Share2,
} from "lucide-react";
import Logo from "../assets/Logo";

const toolsDropdown = [
  {
    path: "/word",
    icon: <File size={16} />,
    label: "Word Studio",
    color: "text-cyan-400",
  },
  // { path: '/docs', icon: <BookOpen size={16} />, label: 'Docs Studio', color: 'text-emerald-400' },
  {
    path: "/excel",
    icon: <FileSpreadsheet size={16} />,
    label: "Excel Studio",
    color: "text-orange-400",
  },
  {
    path: "/image",
    icon: <ImageIcon size={16} />,
    label: "Image Studio",
    color: "text-purple-400",
  },
];

const socialDropdown = [
  {
    path: "/chat",
    icon: <MessageSquare size={16} />,
    label: "Post Studio",
    color: "text-rose-400",
  },
  {
    path: "/whatsapp",
    icon: <MessagesSquare size={16} />,
    label: "Chat Studio",
    color: "text-green-400",
  },
];

const DropdownItem = ({ item }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors ${isActive ? "bg-white/5" : ""}`
    }
  >
    <div className={`${item.color}`}>{item.icon}</div>
    <span className="text-sm font-medium text-white/90 whitespace-nowrap">
      {item.label}
    </span>
    <ChevronRight size={14} className="ml-auto text-white/30" />
  </NavLink>
);

const NavItem = ({ path, icon, label, color, activeBg, border, badge }) => (
  <NavLink to={path} end={path === "/"} className="flex-shrink-0">
    {({ isActive }) => (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${isActive ? `${activeBg} ${border} ${color} shadow-[0_0_16px_rgba(var(--tw-shadow-color),0.2)]` : "border-transparent text-white/50 hover:bg-white/5 hover:text-white/80"}`}
      >
        <div className={isActive ? color : ""}>{icon}</div>
        <span
          className={`text-sm whitespace-nowrap ${isActive ? "font-semibold" : "font-medium"}`}
        >
          {label}
        </span>
        {badge && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white text-red-500 border border-red-500 ml-1 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
    )}
  </NavLink>
);

const DropdownNav = ({ icon, label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  let timeoutId = null;

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 200);
  };

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <div
      className="relative flex-shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        onClick={handleClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent text-white/50 hover:bg-white/5 hover:text-white/80 transition-all duration-200 cursor-pointer"
      >
        {icon}
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
        <ChevronDown
          size={14}
          className={`opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-[#12122A] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[160px] py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {items.map((item) => (
              <DropdownItem key={item.path} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const { pathname } = useLocation();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 h-16 z-[90] flex items-center justify-between px-8 bg-[#07071A]/80 border-b border-white/10 backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center gap-6 flex-1 h-full">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <div className="font-outfit font-extrabold text-lg tracking-tight whitespace-nowrap">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-cyan-400">
              ApniPDFs
            </span>
            <span className="text-white/50 text-sm ml-1">Pro</span>
          </div>
        </div>

        {/* Navbar Links */}
        <nav className="flex items-center gap-2 h-full pt-1">
          <NavItem
            path="/"
            icon={<Home size={16} />}
            label="Home"
            color="text-indigo-400"
            activeBg="bg-indigo-500/20"
            border="border-indigo-500/40"
          />
          <DropdownNav
            icon={<Wrench size={16} />}
            label="Tools"
            items={toolsDropdown}
          />
          <NavItem
            path="/pdf"
            icon={<FileText size={16} />}
            label="PDF Studio"
            color="text-pink-400"
            activeBg="bg-pink-500/20"
            border="border-pink-500/40"
            badge="PDF"
          />
          <DropdownNav
            icon={<Share2 size={16} />}
            label="Social Studio"
            items={socialDropdown}
          />
        </nav>
      </div>

      <div className="flex items-center gap-4 ml-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 w-48 focus-within:border-indigo-400/50 focus-within:bg-white/10 transition-colors">
          <Search size={15} className="text-white/40" />
          <input
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-white/70 text-sm w-full font-inter placeholder:text-white/30"
          />
        </div>

        {/* AI badge */}
        {/* <div className="flex items-center gap-1.5 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/30 rounded-full px-3 py-1.5 text-xs font-semibold text-indigo-400 whitespace-nowrap">
          <Sparkles size={13} /> AI Powered
        </div> */}

        {/* Avatar */}
        {/* <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-[#6C63FF] to-[#00D9FF] flex items-center justify-center text-sm font-bold text-white cursor-pointer shadow-[0_0_16px_rgba(108,99,255,0.4)] hover:scale-105 transition-transform">
          DF
        </div> */}
      </div>
    </motion.header>
  );
}
