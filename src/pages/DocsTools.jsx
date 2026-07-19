import { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import RichEditor from '../components/RichEditor';
import { showToast } from '../components/Toast';
import { Download, Merge, Scissors } from 'lucide-react';

const TOOLS = [
  { id: 0, action: 'edit', title: 'Edit / Create', desc: 'Write rich text docs', icon: '📝', color: '#00FFB3' },
  { id: 1, action: 'merge', title: 'Merge Docs', desc: 'Combine documents', icon: '🔗', color: '#8B5CF6' },
  { id: 2, action: 'split', title: 'Split Doc', desc: 'Divide paragraphs', icon: '✂️', color: '#FF6B9D' },
  { id: 3, action: 'convert', title: 'Convert Doc', desc: 'Export formats', icon: '🔄', color: '#00D9FF' },
];

export default function DocsTools() {
  const { action } = useParams();
  const navigate = useNavigate();

  const activeTool = action ? TOOLS.find(t => t.action === action)?.id ?? null : null;

  const [content, setContent] = useState('');
  const [docs, setDocs] = useState([{ id: 1, title: 'Untitled Doc', content: '' }]);
  const [activeDoc, setActiveDoc] = useState(0);
  const toolColor = '#00FFB3';

  const addDoc = () => {
    const newDoc = { id: Date.now(), title: `Document ${docs.length + 1}`, content: '' };
    setDocs(p => [...p, newDoc]);
    setActiveDoc(docs.length);
  };

  const saveDoc = () => {
    const d = docs[activeDoc];
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${d.title}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:60px auto;line-height:1.7;color:#333;}</style></head><body>${d.content}</body></html>`;
    saveAs(new Blob([html], { type: 'text/html' }), `${d.title}.html`);
    showToast('Document saved!', 'success');
  };

  const exportAs = (format) => {
    const d = docs[activeDoc];
    if (format === 'txt') {
      const tmp = document.createElement('div');
      tmp.innerHTML = d.content;
      saveAs(new Blob([tmp.textContent], { type: 'text/plain' }), `${d.title}.txt`);
    } else {
      saveAs(new Blob([d.content], { type: 'text/html' }), `${d.title}.${format}`);
    }
    showToast(`Exported as .${format}`, 'success');
  };

  const handleMerge = () => {
    if (docs.length < 2) return showToast('Add at least 2 documents to merge', 'error');
    const combined = docs.map((d,i) => `<h2>Document ${i+1}: ${d.title}</h2>${d.content}<hr/>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial;max-width:800px;margin:60px auto;line-height:1.7;}hr{margin:40px 0;}</style></head><body>${combined}</body></html>`;
    saveAs(new Blob([html], { type: 'text/html' }), 'merged_docs.html');
    showToast('All docs merged!', 'success');
  };

  const handleSplit = () => {
    const d = docs[activeDoc];
    const parser = new DOMParser();
    const dom = parser.parseFromString(d.content, 'text/html');
    const paras = dom.querySelectorAll('p,h1,h2,h3');
    const half = Math.ceil(paras.length / 2);
    const p1 = [...paras].slice(0, half).map(p => p.outerHTML).join('');
    const p2 = [...paras].slice(half).map(p => p.outerHTML).join('');
    saveAs(new Blob([`<html><body>${p1}</body></html>`], { type: 'text/html' }), `${d.title}_part1.html`);
    saveAs(new Blob([`<html><body>${p2}</body></html>`], { type: 'text/html' }), `${d.title}_part2.html`);
    showToast('Document split into 2 parts!', 'success');
  };

  return (
    <div className="page-body">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>{activeTool !== null ? TOOLS[activeTool].icon : '📃'}</span>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800 }}>
                {activeTool !== null ? TOOLS[activeTool].title : 'Docs Tools'}
              </h1>
              <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: 15 }}>
                {activeTool !== null ? TOOLS[activeTool].desc : 'Create, Edit, Merge, Split & Convert documents'}
              </p>
            </div>
          </div>
          <div className="badge" style={{ background: 'white', color: '#00FFB3', border: '1px solid #00FFB3' }}>Docs Suite</div>
        </div>

        {activeTool === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
            {TOOLS.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate('/docs/' + tool.action)}
                className="bg-white/5 border rounded-2xl p-6 cursor-pointer flex flex-col gap-3 relative overflow-hidden transition-colors hover:border-white/20"
                style={{ borderColor: `${tool.color}30` }}
              >
                <div className="absolute -top-5 -right-5 text-[80px] opacity-5 pointer-events-none">{tool.icon}</div>
                <div className="text-3xl">{tool.icon}</div>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: tool.color }}>{tool.title}</h3>
                  <p className="text-[13px] text-white/50">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="section" style={{ marginTop: 24 }}>
            <button 
              onClick={() => navigate('/docs')}
              style={{ background: 'transparent', border: 'none', color: 'rgba(240,240,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 14 }}
            >
              ← Back to Tools
            </button>

            {activeTool === 0 && (
              <div className="tool-content">
            {/* Doc tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
              {docs.map((d, i) => (
                <button key={d.id} onClick={() => setActiveDoc(i)}
                  style={{ padding: '6px 16px', borderRadius: 8, border: `1px solid ${i === activeDoc ? toolColor + '50' : 'rgba(255,255,255,0.08)'}`, background: i === activeDoc ? `${toolColor}15` : 'rgba(255,255,255,0.04)', color: i === activeDoc ? toolColor : 'rgba(240,240,255,0.5)', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {d.title}
                </button>
              ))}
              <button onClick={addDoc} style={{ padding: '6px 12px', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(240,240,255,0.4)', fontSize: 13, cursor: 'pointer' }}>
                + New
              </button>
            </div>

            {/* Title */}
            <input className="input" style={{ marginBottom: 12, fontSize: 18, fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}
              value={docs[activeDoc]?.title}
              onChange={e => setDocs(p => p.map((d,i) => i === activeDoc ? { ...d, title: e.target.value } : d))}
              placeholder="Document title…"
            />

            <RichEditor
              value={docs[activeDoc]?.content}
              onChange={val => setDocs(p => p.map((d,i) => i === activeDoc ? { ...d, content: val } : d))}
              placeholder="Start writing your document…"
              minHeight={360}
              showEmoji
            />

            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={saveDoc}><Download size={15} /> Save as HTML</button>
              <button className="btn btn-secondary" onClick={() => exportAs('txt')}><Download size={15} /> Export .txt</button>
              <button className="btn btn-secondary" onClick={() => exportAs('pdf')}>Export Concept</button>
            </div>
              </div>
            )}

            {activeTool === 1 && (
              <div className="tool-content">
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <p style={{ color: 'rgba(240,240,255,0.6)', marginBottom: 16, fontSize: 14 }}>
                You have <strong style={{ color: toolColor }}>{docs.length} document(s)</strong> in your workspace. Click "Merge All" to combine them into one file.
              </p>
              {docs.map((d, i) => (
                <div key={d.id} className="file-item" style={{ marginBottom: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(0,255,179,0.15)', color: toolColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i+1}</div>
                  <div className="file-item-info"><div className="file-item-name">{d.title}</div></div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleMerge}><Merge size={15} /> Merge All Documents</button>
              </div>
            )}

            {activeTool === 2 && (
              <div className="tool-content">
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: 'rgba(240,240,255,0.6)', marginBottom: 16 }}>
                Split active document: <strong style={{ color: toolColor }}>{docs[activeDoc]?.title}</strong>
              </p>
              <p style={{ fontSize: 13, color: 'rgba(240,240,255,0.4)' }}>Document will be split into 2 equal parts by paragraphs.</p>
            </div>
            <button className="btn btn-primary" onClick={handleSplit}><Scissors size={15} /> Split Document</button>
              </div>
            )}

            {activeTool === 3 && (
              <div className="tool-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { label: 'Export → Word (.docx concept)', emoji: '📝', color: '#00D9FF', format: 'html' },
                { label: 'Export → PDF concept', emoji: '📄', color: '#FF6B9D', format: 'html' },
              ].map((opt, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} className="card" style={{ padding: 28, textAlign: 'center', background: 'white', borderColor: `${opt.color}40`, cursor: 'pointer', boxShadow: `0 8px 32px ${opt.color}15` }}
                  onClick={() => exportAs(opt.format)}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{opt.emoji}</div>
                  <h3 style={{ fontWeight: 700, color: opt.color, marginBottom: 8 }}>{opt.label}</h3>
                  <p style={{ fontSize: 13, color: '#555' }}>Click to convert and download current document</p>
                </motion.div>
              ))}
            </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
