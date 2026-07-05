import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, File, BookOpen, FileSpreadsheet, Image, MessageSquare, ArrowRight, Sparkles, UploadCloud, Book, PenTool, Pencil, Eraser, Palette, Type } from 'lucide-react';
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
  const [isTyping, setIsTyping] = useState(false);
  const [showMeaningPopup, setShowMeaningPopup] = useState(false);
  const [symbolInput, setSymbolInput] = useState('**');
  const [meaningInput, setMeaningInput] = useState('');
  const [savedRange, setSavedRange] = useState(null);

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

      {/* Custom Upload Section (Polished UI) */}
      <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
        <motion.div variants={item} style={{ 
          border: '1px solid rgba(139, 92, 246, 0.5)',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.15)',
          borderRadius: 24,
          padding: '32px 40px',
          width: '100%',
          maxWidth: 720,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'white',
          backdropFilter: 'blur(12px)'
        }}>
          
          {/* Main Text Area / Dropzone */}
          <div className="dropzone" style={{
            width: '100%',
            height: 140,
            border: '2px dashed rgba(255,255,255,0.15)',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            background: 'white',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <UploadCloud size={48} color="#8B5CF6" style={{ marginBottom: 16, opacity: 0.8 }} />
            <p style={{ fontSize: 18, fontWeight: 500, color: '#111', marginBottom: 8 }}>Create your own things and share</p>
            <p style={{ fontSize: 13, color: '#555' }}>Drag and drop or click to upload</p>
          </div>

          {/* Input field with toolbar */}
          <div style={{ width: '100%', marginBottom: 20 }}>
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 6, padding: '8px 12px', background: '#f8f9fa', borderRadius: '20px 20px 0 0', border: '1px solid rgba(0,0,0,0.1)', borderBottom: 'none', alignItems: 'center', overflowX: 'auto' }}>
                <button title="Notebook Font" onMouseDown={e => { e.preventDefault(); document.execCommand('fontName', false, 'Comic Sans MS'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}><Book size={16} color="#555"/></button>
                <button title="Pen (Blue)" onMouseDown={e => { e.preventDefault(); document.execCommand('foreColor', false, '#3b82f6'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}><PenTool size={16} color="#555"/></button>
                <button title="Pencil (Highlight)" onMouseDown={e => { e.preventDefault(); document.execCommand('hiliteColor', false, '#fef08a'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}><Pencil size={16} color="#555"/></button>
                <button title="Eraser (Clear)" onMouseDown={e => { e.preventDefault(); document.execCommand('removeFormat', false, null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}><Eraser size={16} color="#555"/></button>
                
                <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
                
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Palette size={16} color="#555" style={{ marginRight: 4 }} />
                  <input title="Color Selection" type="color" onInput={e => document.execCommand('foreColor', false, e.target.value)} style={{ width: 20, height: 20, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Type size={16} color="#555" style={{ marginRight: 4 }} />
                  <select title="Font Size" onChange={e => document.execCommand('fontSize', false, e.target.value)} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, padding: 2, color: '#333', fontSize: 12, background: 'white' }}>
                    <option value="2">Small</option>
                    <option value="3" selected>Normal</option>
                    <option value="4">Large</option>
                    <option value="5">Huge</option>
                  </select>
                </div>
                
                <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />

                <button title="Add Meaning" onMouseDown={e => { 
                  e.preventDefault(); 
                  const sel = window.getSelection();
                  if (sel.rangeCount > 0) setSavedRange(sel.getRangeAt(0));
                  setShowMeaningPopup(true);
                }} style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, cursor: 'pointer', padding: '4px 8px', fontSize: 12, fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center' }}>**</button>
              </motion.div>
            )}
            
            <div 
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setIsTyping(true)}
              onBlur={(e) => {
                if (!e.currentTarget.textContent.trim()) {
                  setIsTyping(false);
                }
              }}
              style={{
                border: '1px solid ' + (isTyping ? '#8B5CF6' : 'rgba(0,0,0,0.1)'),
                borderRadius: isTyping ? '0 0 12px 12px' : 20,
                padding: '16px 24px',
                width: '100%',
                fontSize: 15,
                color: '#111',
                background: 'white',
                outline: 'none',
                transition: 'border 0.2s, border-radius 0.2s',
                minHeight: 56,
                textAlign: 'left'
              }}
            >
              {!isTyping && <span style={{ color: '#555', pointerEvents: 'none' }}>Create your own wish to all things.....</span>}
            </div>
          </div>

          {/* Select file button */}
          <button className="btn" style={{
            background: 'transparent',
            color: '#EAB308',
            border: '2px solid #EAB308',
            padding: '16px',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 600,
            width: '100%',
            cursor: 'pointer',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.background = 'rgba(234, 179, 8, 0.1)'; }}
          onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
          >
            Select your file
          </button>

          {/* Icons row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 20px', marginBottom: 24 }}>
            {[
              { letter: 'W', color: '#3b82f6', label: 'Word' },
              { letter: 'P', color: '#ef4444', label: 'PDF' },
              { letter: 'E', color: '#22c55e', label: 'Excel' },
              { letter: 'J', color: '#eab308', label: 'Image' }
            ].map(item => (
              <div key={item.letter} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} className="format-icon" onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ 
                  width: 56, height: 56, 
                  borderRadius: 16, 
                  background: 'white', 
                  border: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 'bold', color: '#111',
                  marginBottom: 10,
                  position: 'relative',
                  boxShadow: `0 8px 24px ${item.color}15`
                }}>
                  {item.letter}
                  {/* Glowing indicator dot */}
                  <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, borderRadius: '50%', background: item.color, boxShadow: `0 0 12px ${item.color}` }} />
                </div>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  MERGE {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom text */}
          <div style={{ padding: '12px 32px', background: '#f8f9fa', borderRadius: 99, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <span style={{ fontWeight: 500, color: '#333', letterSpacing: 0.5 }}>Chat / Story / Post</span>
            <span style={{ fontSize: 18 }}>✨</span>
          </div>

        </motion.div>
      </motion.div>

      {/* Modules grid */}
      <div className="section">
        <div className="section-title" style={{ fontSize: 20 }}>
          <Sparkles size={18} color="#8B84FF" /> All Tools
        </div>
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="tool-grid tool-grid-3"
        >
          {modules.map((module, index) => (
            <motion.div key={module.path} variants={item}>
              <Link to={module.path} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 40px ${module.color}20` }}
                  whileTap={{ scale: 0.98 }}
                  className="tool-card card"
                  style={{ background: module.bg, borderColor: `${module.color}20`, borderRadius: 20, padding: 24, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Background glow */}
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${module.color}20 0%, transparent 70%)`, borderRadius: '50%' }} />

                  {module.badge && (
                    <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${module.color}20`, color: module.color, border: `1px solid ${module.color}30` }}>
                      {module.badge}
                    </span>
                  )}

                  <div style={{ fontSize: 42, marginBottom: 12 }}>{module.emoji}</div>
                  <div>
                    <h3 style={{ fontSize: 18, marginBottom: 4, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{module.label}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{module.desc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: module.color, marginTop: 16 }}>
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

      {/* Meaning Popup */}
      {showMeaningPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#13132B', padding: 32, borderRadius: 20, width: 400, border: '1px solid rgba(139, 92, 246, 0.5)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginBottom: 16, fontSize: 20, color: '#fff' }}>Add Custom Meaning</h3>
            
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 8 }}>Enter symbol (e.g. *, **, ***):</p>
            <input 
              value={symbolInput}
              onChange={e => setSymbolInput(e.target.value)}
              placeholder="e.g. **"
              style={{ width: '100%', padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, marginBottom: 16, outline: 'none' }} 
            />

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 8 }}>Enter meaning or reason:</p>
            <input 
              autoFocus
              value={meaningInput}
              onChange={e => setMeaningInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (savedRange) {
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(savedRange);
                  }
                  if (meaningInput && symbolInput) {
                    document.execCommand('insertText', false, ` ${symbolInput} (Meaning: ${meaningInput}) `);
                  }
                  setShowMeaningPopup(false);
                  setMeaningInput('');
                  setSymbolInput('**');
                }
              }}
              placeholder="e.g. Very important..."
              style={{ width: '100%', padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, marginBottom: 24, outline: 'none' }} 
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn" onClick={() => { setShowMeaningPopup(false); setMeaningInput(''); setSymbolInput('**'); }} style={{ flex: 1, padding: 14, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, justifyContent: 'center' }}>Cancel</button>
              <button className="btn" onClick={() => {
                if (savedRange) {
                  const sel = window.getSelection();
                  sel.removeAllRanges();
                  sel.addRange(savedRange);
                }
                if (meaningInput && symbolInput) {
                  document.execCommand('insertText', false, ` ${symbolInput} (Meaning: ${meaningInput}) `);
                }
                setShowMeaningPopup(false);
                setMeaningInput('');
                setSymbolInput('**');
              }} style={{ flex: 1, padding: 14, background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, justifyContent: 'center' }}>Insert</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
