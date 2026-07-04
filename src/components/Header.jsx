import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Search, Sparkles, Menu } from 'lucide-react';

const titles = {
  '/':      { label: 'Dashboard',    emoji: '🏠' },
  '/pdf':   { label: 'PDF Tools',    emoji: '📄' },
  '/word':  { label: 'Word Tools',   emoji: '📝' },
  '/docs':  { label: 'Docs Tools',   emoji: '📃' },
  '/excel': { label: 'Excel Tools',  emoji: '📊' },
  '/image': { label: 'Image Tools',  emoji: '🖼️' },
  '/chat':  { label: 'Chat Studio',  emoji: '💬' },
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const info = titles[pathname] || { label: 'DocFlow Pro', emoji: '✨' };

  return (
    <motion.header
      className="header"
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <span style={{ fontSize: 22 }} className="header-emoji">{info.emoji}</span>
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>{info.label}</h2>
          <p style={{ fontSize: 12, color: 'rgba(240,240,255,0.4)' }}>DocFlow Pro · All-in-One Suite</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Search */}
        <div className="header-search" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '8px 14px',
        }}>
          <Search size={15} color="rgba(240,240,255,0.4)" />
          <input
            placeholder="Search tools..."
            style={{ background: 'none', border: 'none', outline: 'none', color: 'rgba(240,240,255,0.7)', fontSize: 13, width: '100%', fontFamily: 'inherit' }}
          />
        </div>

        {/* AI badge */}
        <div className="header-ai-badge" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,217,255,0.1))',
          border: '1px solid rgba(108,99,255,0.3)', borderRadius: 99,
          padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#8B84FF',
        }}>
          <Sparkles size={13} /> AI Powered
        </div>

        {/* Bell */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Bell size={17} color="rgba(240,240,255,0.5)" />
        </motion.button>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6C63FF, #00D9FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer',
          boxShadow: '0 0 16px rgba(108,99,255,0.4)',
        }}>DF</div>
      </div>
    </motion.header>
  );
}
