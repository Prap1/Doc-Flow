import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo';
import {
  FileText, File, FileSpreadsheet, Image, MessageSquare,
  Home, X, Menu, BookOpen, MessagesSquare
} from 'lucide-react';

const navItems = [
  { path: '/', icon: <Home size={20} />, label: 'Home', color: '#8B84FF' },
  { path: '/pdf', icon: <FileText size={20} />, label: 'PDF Tools', color: '#FF6B9D', badge: 'PDF' },
  { path: '/word', icon: <File size={20} />, label: 'Word Tools', color: '#00D9FF', badge: 'DOCX' },
  { path: '/docs', icon: <BookOpen size={20} />, label: 'Docs Tools', color: '#00FFB3', badge: 'DOCS' },
  { path: '/excel', icon: <FileSpreadsheet size={20} />, label: 'Excel Tools', color: '#FF8C42', badge: 'XLSX' },
  { path: '/image', icon: <Image size={20} />, label: 'Image Tools', color: '#A855F7', badge: 'IMG' },
  { path: '/chat', icon: <MessageSquare size={20} />, label: 'Chat Studio', color: '#EC4899', badge: 'NEW' },
  { path: '/whatsapp', icon: <MessagesSquare size={20} />, label: 'Chats', color: '#25D366', badge: 'WA' },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <motion.aside
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''} ${collapsed ? 'collapsed' : ''}`}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 72 }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flexShrink: 0 }}><Logo size={38} /></div>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px' }}>
                <span className="gradient-text">DocFlow</span>
                <span style={{ color: 'rgba(240,240,255,0.5)', fontSize: 14, marginLeft: 4 }}>Pro</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(240,240,255,0.35)', marginTop: 1 }}>All-in-One</div>
            </motion.div>
          </div>
        )}
        <motion.button
          className="sidebar-toggle-btn"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'transparent', border: 'none', color: 'rgba(240,240,255,0.6)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4
          }}
        >
          {collapsed ? <Menu size={24} /> : <X size={20} />}
        </motion.button>
        <button 
          className="mobile-close-btn"
          onClick={() => setMobileOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={{ textDecoration: 'none' }}
            onClick={() => setMobileOpen(false)}
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: collapsed ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '11px' : '11px 12px',
                  borderRadius: 12,
                  background: isActive ? `${item.color}20` : 'transparent',
                  border: `1px solid ${isActive ? item.color + '40' : 'transparent'}`,
                  color: isActive ? item.color : 'rgba(240,240,255,0.55)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  boxShadow: isActive ? `0 0 16px ${item.color}20` : 'none',
                  position: 'relative',
                }}
              >
                <span style={{ color: isActive ? item.color : 'rgba(240,240,255,0.45)', flexShrink: 0 }}>{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, flex: 1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && item.badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 99,
                    background: 'white', color: item.badge === 'PDF' ? 'red' : item.color,
                    border: `1px solid ${item.badge === 'PDF' ? 'red' : item.color}`,
                    letterSpacing: '0.5px'
                  }}>{item.badge}</span>
                )}
                {collapsed && (
                  <div style={{
                    position: 'absolute', left: 56, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(20,20,50,0.95)', color: item.color,
                    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0,
                    border: `1px solid ${item.color}30`,
                  }} className="sidebar-tooltip">
                    {item.label}
                  </div>
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
      </motion.aside>
    </>
  );
}
