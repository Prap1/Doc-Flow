import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, File, BookOpen, FileSpreadsheet, Image, MessageSquare, ArrowRight, Sparkles, UploadCloud } from 'lucide-react';
import Logo from '../assets/Logo';

const modules = [
  { path: '/pdf',   emoji: '📄', label: 'PDF Tools',   desc: 'Edit · Merge · Split · Convert',  color: '#FF6B9D', bg: 'rgba(255,107,157,0.08)' },
  { path: '/word',  emoji: '📝', label: 'Word Tools',  desc: 'Edit · Merge · Split · Convert',  color: '#00D9FF', bg: 'rgba(0,217,255,0.08)' },
  { path: '/docs',  emoji: '📃', label: 'Docs Tools',  desc: 'Edit · Merge · Split · Convert',  color: '#00FFB3', bg: 'rgba(0,255,179,0.08)' },
  { path: '/excel', emoji: '📊', label: 'Excel Tools', desc: 'Edit · Split · Merge Sheets',      color: '#FF8C42', bg: 'rgba(255,140,66,0.08)' },
  { path: '/image', emoji: '🖼️', label: 'Image Tools', desc: 'Edit · Crop · Merge · Filters',   color: '#A855F7', bg: 'rgba(168,85,247,0.08)' },
  { path: '/chat',  emoji: '💬', label: 'Chat Studio', desc: 'Create · Edit · Share · Voice',   color: '#EC4899', bg: 'rgba(236,72,153,0.08)', badge: '✨ New' },
];



const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4,0,0.2,1] } },
};

export default function Home() {
  return (
    <div className="page-body" style={{ paddingTop: 80 }}>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 64, position: 'relative' }}
      >
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: -60, left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: -40, right: '20%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(0,217,255,0.1) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          style={{ display: 'inline-block', marginBottom: 20 }}
        >
          <Logo size={72} />
        </motion.div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
          <span className="gradient-text">DocFlow Pro</span>
          <br />
          <span style={{ color: 'rgba(240,240,255,0.75)', fontWeight: 600, fontSize: '55%' }}>Your All-in-One Document Suite</span>
        </h1>
        <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: 17, maxWidth: 540, margin: '0 auto 28px' }}>
          Edit, merge, split and convert PDFs, Word docs, Spreadsheets, Images and create viral content — all in one beautiful workspace.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/pdf"><button className="btn btn-primary btn-lg"><Sparkles size={18} /> Get Started</button></Link>
          <Link to="/chat"><button className="btn btn-secondary btn-lg"><MessageSquare size={18} /> Chat Studio</button></Link>
        </div>
      </motion.div>

      {/* Upload & Text side-by-side */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="tool-grid tool-grid-2" style={{ marginBottom: 48 }}
      >
        <motion.div variants={item} className="dropzone" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 200 }}>
          <div className="dropzone-icon" style={{ color: '#8B84FF' }}><UploadCloud size={48} /></div>
          <h3>Upload Design</h3>
          <p>Drag & drop your files here or click to browse</p>
        </motion.div>
        
        <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column' }}>
          <textarea 
            className="textarea" 
            placeholder="Type your text here..." 
            style={{ flex: 1, minHeight: 200, fontSize: 16, padding: 20 }}
          ></textarea>
        </motion.div>
      </motion.div>

      {/* Modules grid */}
      <div className="section">
        <div className="section-title" style={{ fontSize: 20 }}>
          <Sparkles size={18} color="#8B84FF" /> All Tools
        </div>
        <motion.div
          variants={container} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
        >
          {modules.map((mod, i) => (
            <motion.div key={mod.path} variants={item}>
              <Link to={mod.path} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 40px ${mod.color}20` }}
                  whileTap={{ scale: 0.98 }}
                  className="card"
                  style={{ padding: 24, cursor: 'pointer', background: mod.bg, borderColor: `${mod.color}20`, position: 'relative', overflow: 'hidden' }}
                >
                  {/* Background glow */}
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${mod.color}20 0%, transparent 70%)`, borderRadius: '50%' }} />

                  {mod.badge && (
                    <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}30` }}>
                      {mod.badge}
                    </span>
                  )}

                  <div style={{ fontSize: 42, marginBottom: 12 }}>{mod.emoji}</div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 6, color: mod.color }}>{mod.label}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(240,240,255,0.5)', marginBottom: 16 }}>{mod.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: mod.color }}>
                    Open Tools <ArrowRight size={14} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Feature highlight */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="card" style={{ padding: 32, background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,217,255,0.05))', borderColor: 'rgba(108,99,255,0.2)', marginTop: 8 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 48 }}>🎤</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              Voice-Powered Chat Studio
            </h2>
            <p style={{ color: 'rgba(240,240,255,0.55)', fontSize: 14 }}>
              Create engaging posts, stories & chats — record voice messages that recipients can play back directly. Share with one click.
            </p>
          </div>
          <Link to="/chat">
            <button className="btn btn-primary"><MessageSquare size={16} /> Try Chat Studio</button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
