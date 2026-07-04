import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type, Palette } from 'lucide-react';

const EMOJIS = ['😊','🔥','💡','⭐','🚀','❤️','✅','📌','🎯','💪','🌟','👋'];

export default function RichEditor({ value, onChange, placeholder = 'Start writing…', minHeight = 200, showEmoji = false }) {
  const [activeFormats, setActiveFormats] = useState([]);
  const [fontSize, setFontSize] = useState(16);

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
  ];

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)' }}>
        {toolbarBtns.map(btn => (
          <button
            key={btn.cmd}
            title={btn.title}
            onMouseDown={e => { e.preventDefault(); execCmd(btn.cmd); }}
            style={{
              padding: '5px 8px', borderRadius: 6, border: '1px solid transparent',
              background: activeFormats.includes(btn.cmd) ? 'rgba(108,99,255,0.3)' : 'transparent',
              color: activeFormats.includes(btn.cmd) ? '#8B84FF' : 'rgba(240,240,255,0.55)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              transition: '0.15s ease',
            }}
          >{btn.icon}</button>
        ))}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Type size={13} color="rgba(240,240,255,0.4)" />
          <select
            value={fontSize}
            onChange={e => { setFontSize(+e.target.value); execCmd('fontSize', '3'); }}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(240,240,255,0.6)', fontSize: 12, borderRadius: 4, padding: '2px 4px' }}
          >
            {[12,14,16,18,20,24,28,32].map(s => <option key={s} value={s}>{s}px</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Palette size={13} color="rgba(240,240,255,0.4)" />
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
          color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.7,
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
    </div>
  );
}
