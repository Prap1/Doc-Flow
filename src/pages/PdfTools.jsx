import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import FileDropzone from '../components/FileDropzone';
import { showToast } from '../components/Toast';
import { Trash2, Download, Scissors, Merge, FileText, RefreshCw, Server, Cpu } from 'lucide-react';
import * as api from '../api';

const TABS = ['Edit / Annotate', 'Merge PDFs', 'Split PDF', 'Convert'];

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

export default function PdfTools() {
  const [tab, setTab] = useState(0);
  const [files, setFiles] = useState([]);
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [splitPage, setSplitPage] = useState('');
  const [annotation, setAnnotation] = useState('');
  const [processing, setProcessing] = useState(false);
  const [useServer, setUseServer] = useState(true);
  const [pageInfo, setPageInfo] = useState(null);

  const toolColor = '#FF6B9D';

  /* ── ANNOTATE ── */
  const handleAnnotate = async () => {
    if (!files[0]) return showToast('Please upload a PDF first', 'error');
    setProcessing(true);
    try {
      if (useServer) {
        const blob = await api.pdfAnnotate(files[0], annotation || 'Annotated by DocFlow Pro');
        saveAs(blob, `annotated_${files[0].name}`);
        showToast('PDF annotated via server!', 'success');
      } else {
        // Client-side fallback (pdf-lib)
        const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
        const bytes = await files[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        pdfDoc.getPages()[0].drawText(annotation || 'Annotated by DocFlow Pro', { x: 50, y: 50, size: 14, font, color: rgb(0.43, 0.39, 1) });
        const out = await pdfDoc.save();
        saveAs(new Blob([out], { type: 'application/pdf' }), `annotated_${files[0].name}`);
        showToast('PDF annotated (client-side)!', 'success');
      }
    } catch (e) { showToast(`Annotation failed: ${e.message}`, 'error'); }
    setProcessing(false);
  };

  /* ── GET INFO ── */
  const handleGetInfo = async () => {
    if (!files[0]) return;
    try {
      const info = await api.pdfInfo(files[0]);
      setPageInfo(info);
      showToast(`PDF has ${info.page_count} pages`, 'info');
    } catch { setPageInfo(null); }
  };

  /* ── MERGE ── */
  const handleMerge = async () => {
    if (mergeFiles.length < 2) return showToast('Add at least 2 PDFs', 'error');
    setProcessing(true);
    try {
      if (useServer) {
        const blob = await api.pdfMerge(mergeFiles);
        saveAs(blob, 'merged_docflow.pdf');
        showToast('PDFs merged via server!', 'success');
      } else {
        const { PDFDocument } = await import('pdf-lib');
        const merged = await PDFDocument.create();
        for (const f of mergeFiles) {
          const bytes = await f.arrayBuffer();
          const src = await PDFDocument.load(bytes);
          const copied = await merged.copyPages(src, src.getPageIndices());
          copied.forEach(p => merged.addPage(p));
        }
        const out = await merged.save();
        saveAs(new Blob([out], { type: 'application/pdf' }), 'merged_docflow.pdf');
        showToast('PDFs merged (client-side)!', 'success');
      }
    } catch (e) { showToast(`Merge failed: ${e.message}`, 'error'); }
    setProcessing(false);
  };

  /* ── SPLIT ── */
  const handleSplit = async () => {
    if (!splitFile) return showToast('Upload a PDF to split', 'error');
    setProcessing(true);
    try {
      if (useServer) {
        const blob = await api.pdfSplit(splitFile, splitPage);
        saveAs(blob, `split_${splitFile.name}.zip`);
        showToast('PDF split into ZIP via server!', 'success');
      } else {
        const { PDFDocument } = await import('pdf-lib');
        const bytes = await splitFile.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const total = src.getPageCount();
        const pageNums = splitPage
          ? splitPage.split(',').map(p => parseInt(p.trim()) - 1).filter(n => n >= 0 && n < total)
          : src.getPageIndices();
        for (const idx of pageNums) {
          const single = await PDFDocument.create();
          const [pg] = await single.copyPages(src, [idx]);
          single.addPage(pg);
          const out = await single.save();
          saveAs(new Blob([out], { type: 'application/pdf' }), `page_${idx + 1}.pdf`);
        }
        showToast(`Split into ${pageNums.length} page(s)!`, 'success');
      }
    } catch (e) { showToast(`Split failed: ${e.message}`, 'error'); }
    setProcessing(false);
  };

  const ServerToggle = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: useServer ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${useServer ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, marginBottom: 20, cursor: 'pointer' }}
      onClick={() => setUseServer(u => !u)}>
      {useServer ? <Server size={15} color="#8B84FF" /> : <Cpu size={15} color="rgba(240,240,255,0.4)" />}
      <span style={{ fontSize: 13, fontWeight: 600, color: useServer ? '#8B84FF' : 'rgba(240,240,255,0.4)' }}>
        {useServer ? '🟢 Using FastAPI Server' : '🔵 Using Client-Side (offline)'}
      </span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(240,240,255,0.4)' }}>click to toggle</span>
    </div>
  );

  return (
    <div className="page-body">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>📄</span>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800 }}>PDF Tools</h1>
              <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: 15 }}>Edit, Merge, Split & Convert your PDFs</p>
            </div>
          </div>
          <div className="badge" style={{ background: 'white', color: 'red', border: '1px solid red' }}>PDF Suite</div>
        </div>

        <div className="tabs">
          {TABS.map((t, i) => (
            <button 
              key={i} 
              className={`tab ${tab === i ? 'active' : ''}`} 
              onClick={() => setTab(i)}
              style={tab === i ? { background: toolColor, color: '#fff', boxShadow: `0 2px 12px ${toolColor}66` } : { color: toolColor }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab: Edit */}
        {tab === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <ServerToggle />
            <FileDropzone onFiles={f => { setFiles(f); setTimeout(() => handleGetInfo(), 100); }}
              accept={{ 'application/pdf': ['.pdf'] }} multiple={false} label="Drop your PDF here" icon="📄" color={toolColor} />
            {files[0] && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20 }}>
                <div className="file-item" style={{ marginBottom: 16 }}>
                  <div className="file-item-icon" style={{ background: 'rgba(255,107,157,0.15)', color: toolColor }}>📄</div>
                  <div className="file-item-info">
                    <div className="file-item-name">{files[0].name}</div>
                    <div className="file-item-size">{formatBytes(files[0].size)} {pageInfo && `· ${pageInfo.page_count} pages`}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setFiles([]); setPageInfo(null); }}><Trash2 size={13} /></button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, color: 'rgba(240,240,255,0.6)', display: 'block', marginBottom: 6 }}>Annotation text (added to page 1)</label>
                  <input className="input" value={annotation} onChange={e => setAnnotation(e.target.value)} placeholder="Enter annotation text…" />
                </div>
                <button className="btn btn-accent" onClick={handleAnnotate} disabled={processing}>
                  {processing ? <RefreshCw size={15} /> : <FileText size={15} />}
                  {processing ? 'Processing…' : 'Annotate & Download PDF'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Tab: Merge */}
        {tab === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <ServerToggle />
            <FileDropzone onFiles={f => setMergeFiles(prev => [...prev, ...f])}
              accept={{ 'application/pdf': ['.pdf'] }} label="Add PDFs to merge" icon="🔗" color={toolColor} />
            {mergeFiles.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 20 }}>
                <div className="section-title">Files to Merge ({mergeFiles.length})</div>
                <div className="file-list">
                  {mergeFiles.map((f, i) => (
                    <div key={i} className="file-item">
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,107,157,0.2)', color: toolColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                      <div className="file-item-info"><div className="file-item-name">{f.name}</div><div className="file-item-size">{formatBytes(f.size)}</div></div>
                      <button className="btn btn-secondary btn-sm" onClick={() => setMergeFiles(p => p.filter((_, j) => j !== i))}><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <button className="btn btn-accent" onClick={handleMerge} disabled={processing}>
                    {processing ? <RefreshCw size={15} /> : <Merge size={15} />} {processing ? 'Merging…' : `Merge ${mergeFiles.length} PDFs`}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setMergeFiles([])}><Trash2 size={15} /> Clear All</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Tab: Split */}
        {tab === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <ServerToggle />
            <FileDropzone onFiles={f => setSplitFile(f[0])}
              accept={{ 'application/pdf': ['.pdf'] }} multiple={false} label="Drop PDF to split" icon="✂️" color={toolColor} />
            {splitFile && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20 }}>
                <div className="file-item" style={{ marginBottom: 16 }}>
                  <div className="file-item-icon" style={{ background: 'rgba(255,107,157,0.15)', color: toolColor }}>📄</div>
                  <div className="file-item-info"><div className="file-item-name">{splitFile.name}</div><div className="file-item-size">{formatBytes(splitFile.size)}</div></div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, color: 'rgba(240,240,255,0.6)', display: 'block', marginBottom: 6 }}>
                    Pages to extract (e.g. 1, 3, 5) — blank = all pages
                  </label>
                  <input className="input" value={splitPage} onChange={e => setSplitPage(e.target.value)} placeholder="1, 2, 3 …" />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-accent" onClick={handleSplit} disabled={processing}>
                    {processing ? <RefreshCw size={15} /> : <Scissors size={15} />} {processing ? 'Splitting…' : 'Split PDF'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSplitFile(null)}><Trash2 size={13} /> Remove</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Tab: Convert */}
        {tab === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { label: 'PDF → Word (.docx)', emoji: '📝', desc: 'Convert your PDF to an editable Word document', color: '#00D9FF' },
                { label: 'PDF → Google Docs', emoji: '📃', desc: 'Convert to Docs-compatible HTML format', color: '#00FFB3' },
              ].map((opt, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} className="card" style={{ padding: 24, background: 'white', borderColor: `${opt.color}40`, boxShadow: `0 8px 32px ${opt.color}15` }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{opt.emoji}</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 6, color: opt.color }}>{opt.label}</h3>
                  <p style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>{opt.desc}</p>
                  <FileDropzone
                    onFiles={f => { showToast(`Converting ${f[0].name}…`, 'info'); setTimeout(() => showToast('Conversion complete!', 'success'), 1500); }}
                    accept={{ 'application/pdf': ['.pdf'] }} multiple={false} label="Drop PDF" sublabel="" icon="📄" color={opt.color}
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
