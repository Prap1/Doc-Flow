import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import FileDropzone from '../components/FileDropzone';
import RichEditor from '../components/RichEditor';
import { showToast } from '../components/Toast';
import { Trash2, Download, RefreshCw, Merge, Scissors } from 'lucide-react';

const TABS = ['Edit Document', 'Merge Docs', 'Split Doc', 'Convert'];

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

export default function WordTools() {
  const [tab, setTab] = useState(0);
  const [editFile, setEditFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const toolColor = '#00D9FF';

  const loadDocx = async (file) => {
    setEditFile(file);
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    setHtmlContent(result.value);
  };

  const downloadEdited = () => {
    if (!htmlContent) return showToast('Nothing to save', 'error');
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6;}</style></head><body>${htmlContent}</body></html>`], { type: 'text/html' });
    saveAs(blob, `edited_${editFile?.name || 'document'}.html`);
    showToast('Document saved as HTML (open in Word)', 'success');
  };

  const handleMerge = async () => {
    if (mergeFiles.length < 2) return showToast('Add at least 2 DOCX files', 'error');
    setProcessing(true);
    let combined = '<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6;}hr{border-color:#ccc;margin:40px 0;}</style></head><body>';
    for (const f of mergeFiles) {
      const buf = await f.arrayBuffer();
      const res = await mammoth.convertToHtml({ arrayBuffer: buf });
      combined += res.value + '<hr/>';
    }
    combined += '</body></html>';
    saveAs(new Blob([combined], { type: 'text/html' }), 'merged_document.html');
    showToast('Documents merged!', 'success');
    setProcessing(false);
  };

  const handleSplit = async () => {
    if (!splitFile) return showToast('Upload a DOCX file first', 'error');
    setProcessing(true);
    const buf = await splitFile.arrayBuffer();
    const res = await mammoth.convertToHtml({ arrayBuffer: buf });
    const parser = new DOMParser();
    const doc = parser.parseFromString(res.value, 'text/html');
    const headings = doc.querySelectorAll('h1,h2,h3');
    if (headings.length < 2) {
      // Split by paragraphs
      const paras = doc.querySelectorAll('p');
      const half = Math.ceil(paras.length / 2);
      const p1 = [...paras].slice(0, half).map(p => p.outerHTML).join('');
      const p2 = [...paras].slice(half).map(p => p.outerHTML).join('');
      saveAs(new Blob([`<html><body>${p1}</body></html>`], { type: 'text/html' }), 'part1.html');
      saveAs(new Blob([`<html><body>${p2}</body></html>`], { type: 'text/html' }), 'part2.html');
      showToast('Split into 2 parts by paragraphs', 'success');
    } else {
      headings.forEach((h, i) => {
        saveAs(new Blob([`<html><body><h2>${h.textContent}</h2></body></html>`], { type: 'text/html' }), `section_${i+1}.html`);
      });
      showToast(`Split into ${headings.length} sections by headings`, 'success');
    }
    setProcessing(false);
  };

  return (
    <div className="page-body">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>📝</span>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800 }}>Word Tools</h1>
              <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: 15 }}>Edit, Merge, Split & Convert Word documents</p>
            </div>
          </div>
          <div className="badge" style={{ background: 'white', color: '#00D9FF', border: '1px solid #00D9FF' }}>DOCX Suite</div>
        </div>

        <div className="tabs">
          {TABS.map((t, i) => (
            <button key={i} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        {/* Edit */}
        {tab === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            {!editFile ? (
              <FileDropzone onFiles={f => loadDocx(f[0])} accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
                multiple={false} label="Drop your Word doc (.docx)" icon="📝" color={toolColor} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="file-item" style={{ marginBottom: 16 }}>
                  <div className="file-item-icon" style={{ background: 'rgba(0,217,255,0.15)', color: toolColor }}>📝</div>
                  <div className="file-item-info">
                    <div className="file-item-name">{editFile.name}</div>
                    <div className="file-item-size">{formatBytes(editFile.size)}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditFile(null); setHtmlContent(''); }}><Trash2 size={13} /></button>
                </div>
                <RichEditor value={htmlContent} onChange={setHtmlContent} placeholder="Edit your document…" minHeight={320} showEmoji />
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn btn-cyan" onClick={downloadEdited}><Download size={15} /> Save Document</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Merge */}
        {tab === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <FileDropzone onFiles={f => setMergeFiles(p => [...p, ...f])}
              accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
              label="Add Word documents to merge" icon="🔗" color={toolColor} />
            {mergeFiles.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 20 }}>
                <div className="file-list">
                  {mergeFiles.map((f, i) => (
                    <div key={i} className="file-item">
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(0,217,255,0.15)', color: toolColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i+1}</div>
                      <div className="file-item-info"><div className="file-item-name">{f.name}</div><div className="file-item-size">{formatBytes(f.size)}</div></div>
                      <button className="btn btn-secondary btn-sm" onClick={() => setMergeFiles(p => p.filter((_,j) => j !== i))}><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <button className="btn btn-cyan" onClick={handleMerge} disabled={processing}>
                    {processing ? <RefreshCw size={15} /> : <Merge size={15} />} {processing ? 'Merging…' : 'Merge Documents'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setMergeFiles([])}><Trash2 size={13} /> Clear</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Split */}
        {tab === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <FileDropzone onFiles={f => setSplitFile(f[0])}
              accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
              multiple={false} label="Drop DOCX to split" icon="✂️" color={toolColor} />
            {splitFile && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 16 }}>
                <div className="file-item" style={{ marginBottom: 16 }}>
                  <div className="file-item-icon" style={{ background: 'rgba(0,217,255,0.15)', color: toolColor }}>📝</div>
                  <div className="file-item-info"><div className="file-item-name">{splitFile.name}</div><div className="file-item-size">{formatBytes(splitFile.size)}</div></div>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(240,240,255,0.5)', marginBottom: 12 }}>Splits by headings (H1/H2/H3) or by half if no headings found.</p>
                <button className="btn btn-cyan" onClick={handleSplit} disabled={processing}>
                  {processing ? <RefreshCw size={15} /> : <Scissors size={15} />} {processing ? 'Splitting…' : 'Split Document'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Convert */}
        {tab === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { label: 'Word → Google Docs', emoji: '📃', color: '#00FFB3' },
                { label: 'Word → PDF', emoji: '📄', color: '#FF6B9D' },
              ].map((opt, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} className="card" style={{ padding: 24, background: `${opt.color}08`, borderColor: `${opt.color}20` }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{opt.emoji}</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8, color: opt.color }}>{opt.label}</h3>
                  <FileDropzone
                    onFiles={f => { showToast(`Converting ${f[0].name}…`, 'info'); setTimeout(() => showToast('Conversion complete! (Demo)', 'success'), 1500); }}
                    accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
                    multiple={false} label="Drop .docx" sublabel="" icon="📝" color={opt.color}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
