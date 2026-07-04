import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import RichEditor from '../components/RichEditor';
import { showToast } from '../components/Toast';
import { Download, Merge, Scissors } from 'lucide-react';

const TABS = ['Edit / Create', 'Merge Docs', 'Split Doc', 'Convert'];

export default function DocsTools() {
  const [tab, setTab] = useState(0);
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
            <span style={{ fontSize: 40 }}>📃</span>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800 }}>Docs Tools</h1>
              <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: 15 }}>Create, Edit, Merge, Split & Convert documents</p>
            </div>
          </div>
          <div className="badge" style={{ background: 'white', color: '#00FFB3', border: '1px solid #00FFB3' }}>Docs Suite</div>
        </div>

        <div className="tabs">
          {TABS.map((t, i) => <button key={i} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>)}
        </div>

        {tab === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
          </motion.div>
        )}

        {tab === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
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
          </motion.div>
        )}

        {tab === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: 'rgba(240,240,255,0.6)', marginBottom: 16 }}>
                Split active document: <strong style={{ color: toolColor }}>{docs[activeDoc]?.title}</strong>
              </p>
              <p style={{ fontSize: 13, color: 'rgba(240,240,255,0.4)' }}>Document will be split into 2 equal parts by paragraphs.</p>
            </div>
            <button className="btn btn-primary" onClick={handleSplit}><Scissors size={15} /> Split Document</button>
          </motion.div>
        )}

        {tab === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { label: 'Export → Word (.docx concept)', emoji: '📝', color: '#00D9FF', format: 'html' },
                { label: 'Export → PDF concept', emoji: '📄', color: '#FF6B9D', format: 'html' },
              ].map((opt, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} className="card" style={{ padding: 28, textAlign: 'center', background: `${opt.color}08`, borderColor: `${opt.color}20`, cursor: 'pointer' }}
                  onClick={() => exportAs(opt.format)}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{opt.emoji}</div>
                  <h3 style={{ fontWeight: 700, color: opt.color, marginBottom: 8 }}>{opt.label}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(240,240,255,0.4)' }}>Click to convert and download current document</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
