import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type, Palette, Eraser, PenTool, Pencil, Book } from 'lucide-react';

const EMOJIS = ['😊','🔥','💡','⭐','🚀','❤️','✅','📌','🎯','💪','🌟','👋'];

export default function RichEditor({ value, onChange, placeholder = 'Start writing…', minHeight = 200, showEmoji = false }) {
  const [activeFormats, setActiveFormats] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [showMeaningPopup, setShowMeaningPopup] = useState(false);
  const [symbolInput, setSymbolInput] = useState('**');
  const [meaningInput, setMeaningInput] = useState('');
  const [savedRange, setSavedRange] = useState(null);

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    setActiveFormats(prev => prev.includes(cmd) ? prev.filter(f => f !== cmd) : [...prev, cmd]);
  };

  const insertEmoji = (emoji) => {
    document.execCommand('insertText', false, emoji);
  };

  const toolbarBtns = [
    { cmd: 'bold',          icon: <Bold size={14} />,          title: 'Bold' },
    { cmd: 'italic',        icon: <Italic size={14} />,        title: 'Italic' },
    { cmd: 'underline',     icon: <Underline size={14} />,     title: 'Underline' },
    { cmd: 'justifyLeft',   icon: <AlignLeft size={14} />,     title: 'Left' },
    { cmd: 'justifyCenter', icon: <AlignCenter size={14} />,   title: 'Center' },
    { cmd: 'justifyRight',  icon: <AlignRight size={14} />,    title: 'Right' },
    { cmd: 'insertUnorderedList', icon: <List size={14} />,    title: 'List' },
    { cmd: 'book',          icon: <Book size={14} />,          title: 'Notebook Font' },
    { cmd: 'pen',           icon: <PenTool size={14} />,       title: 'Pen (Blue Text)' },
    { cmd: 'pencil',        icon: <Pencil size={14} />,        title: 'Pencil (Highlight)' },
    { cmd: 'eraser',        icon: <Eraser size={14} />,        title: 'Eraser (Clear Format)' },
  ];

  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 20, overflow: 'hidden', background: 'white' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.05)', flexWrap: 'wrap', background: '#f8f9fa' }}>
        {toolbarBtns.map(btn => (
          <button
            key={btn.cmd}
            title={btn.title}
            onMouseDown={e => { 
              e.preventDefault(); 
              if (btn.cmd === 'pen') execCmd('foreColor', '#3b82f6');
              else if (btn.cmd === 'pencil') execCmd('hiliteColor', '#fef08a');
              else if (btn.cmd === 'eraser') execCmd('removeFormat');
              else if (btn.cmd === 'book') execCmd('fontName', 'Comic Sans MS');
              else execCmd(btn.cmd); 
            }}
            style={{
              padding: '5px 8px', borderRadius: 6, border: '1px solid transparent',
              background: activeFormats.includes(btn.cmd) ? 'rgba(108,99,255,0.1)' : 'transparent',
              color: activeFormats.includes(btn.cmd) ? '#6C63FF' : '#555',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              transition: '0.15s ease',
            }}
          >{btn.icon}</button>
        ))}
        
        <button
          title="Add Meaning"
          onMouseDown={e => {
            e.preventDefault();
            const sel = window.getSelection();
            if (sel.rangeCount > 0) setSavedRange(sel.getRangeAt(0));
            setShowMeaningPopup(true);
          }}
          style={{
            padding: '2px 6px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.1)',
            background: 'white', color: '#555',
            cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 'bold'
          }}
        >**</button>

        <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Type size={13} color="#555" />
          <select
            value={fontSize}
            onChange={e => { setFontSize(+e.target.value); execCmd('fontSize', '3'); }}
            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', color: '#333', fontSize: 12, borderRadius: 4, padding: '2px 4px' }}
          >
            {[12,14,16,18,20,24,28,32].map(s => <option key={s} value={s}>{s}px</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Palette size={13} color="#555" />
          <input type="color" defaultValue="#F0F0FF" onInput={e => execCmd('foreColor', e.target.value)}
            style={{ width: 24, height: 24, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'none' }} />
        </div>
      </div>

      {/* Editor area */}
      <div
        contentEditable
        suppressContentEditableWarning
        onInput={e => onChange && onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        style={{
          minHeight, padding: '16px', outline: 'none',
          color: '#111', fontSize: 15, lineHeight: 1.7,
          fontFamily: 'Inter, sans-serif',
        }}
        dangerouslySetInnerHTML={value !== undefined ? { __html: value } : undefined}
      />

      {/* Emoji row */}
      {showEmoji && (
        <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {EMOJIS.map(e => (
            <button key={e} onMouseDown={ev => { ev.preventDefault(); insertEmoji(e); }}
              className="emoji-chip">{e}</button>
          ))}
        </div>
      )}

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
