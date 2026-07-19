import { useState, useRef, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FileDropzone from '../components/FileDropzone';
import { showToast } from '../components/Toast';
import { Download, Merge, Scissors, Trash2, RefreshCw, Plus } from 'lucide-react';
import { useExcelMergeMutation, useExcelSplitMutation } from '../store/apiSlice';

const TOOLS = [
  { id: 0, action: 'edit', title: 'Edit Spreadsheet', desc: 'View & edit data', icon: '📊', color: '#FF8C42' },
  { id: 1, action: 'merge', title: 'Merge Sheets', desc: 'Combine workbooks', icon: '🔗', color: '#8B5CF6' },
  { id: 2, action: 'split', title: 'Split Sheets', desc: 'Separate workbooks', icon: '✂️', color: '#FF6B9D' },
];

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

export default function ExcelTools() {
  const location = useLocation();
  const { action } = useParams();
  const navigate = useNavigate();

  const activeTool = action ? TOOLS.find(t => t.action === action)?.id ?? null : null;

  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  
  const toolColor = '#FF8C42';

  const loadExcel = async (file) => {
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    setWorkbook(wb);
    setSheetNames(wb.SheetNames);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    setTableData(data);
    setActiveSheet(0);
  };

  useEffect(() => {
    if (location.state?.importedFile) {
      loadExcel(location.state.importedFile);
      navigate('/excel/edit');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const switchSheet = (i) => {
    setActiveSheet(i);
    const ws = workbook.Sheets[sheetNames[i]];
    setTableData(XLSX.utils.sheet_to_json(ws, { header: 1 }));
  };

  const updateCell = (ri, ci, val) => {
    setTableData(prev => {
      const next = prev.map(r => [...r]);
      if (!next[ri]) next[ri] = [];
      next[ri][ci] = val;
      return next;
    });
  };

  const addRow = () => setTableData(p => [...p, Array(p[0]?.length || 5).fill('')]);
  const addCol = () => setTableData(p => p.map(r => [...r, '']));

  const downloadEdited = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(tableData);
    XLSX.utils.book_append_sheet(wb, ws, sheetNames[activeSheet] || 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `edited_${fileName}`);
    showToast('Spreadsheet saved!', 'success');
  };

  const [excelMerge, { isLoading: isMerging }] = useExcelMergeMutation();
  const [excelSplit, { isLoading: isSplitting }] = useExcelSplitMutation();
  
  const processing = isMerging || isSplitting;

  const handleMerge = async () => {
    if (mergeFiles.length < 2) return showToast('Add at least 2 files', 'error');
    try {
      const fd = new FormData();
      mergeFiles.forEach(f => fd.append('files', f));
      const blob = await excelMerge(fd).unwrap();
      saveAs(blob, 'merged_spreadsheet.xlsx');
      showToast('Merged successfully via server!', 'success');
    } catch (e) { 
      let msg = e.message || 'Unknown error';
      if (e.data instanceof Blob) {
        try { msg = JSON.parse(await e.data.text()).error || msg; } catch {}
      } else if (e.data?.error) { msg = e.data.error; }
      showToast(`Merge failed: ${msg}`, 'error'); 
    }
  };

  const handleSplit = async () => {
    if (!splitFile) return showToast('Upload a file first', 'error');
    try {
      const fd = new FormData();
      fd.append('file', splitFile);
      const blob = await excelSplit(fd).unwrap();
      saveAs(blob, 'split_sheets.zip');
      showToast('Split successfully!', 'success');
    } catch (e) { 
      let msg = e.message || 'Unknown error';
      if (e.data instanceof Blob) {
        try { msg = JSON.parse(await e.data.text()).error || msg; } catch {}
      } else if (e.data?.error) { msg = e.data.error; }
      showToast(`Split failed: ${msg}`, 'error'); 
    }
  };

  return (
    <div className="page-body">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>{activeTool !== null ? TOOLS[activeTool].icon : '📊'}</span>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800 }}>
                {activeTool !== null ? TOOLS[activeTool].title : 'Excel Tools'}
              </h1>
              <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: 15 }}>
                {activeTool !== null ? TOOLS[activeTool].desc : 'Edit, Merge & Split Excel spreadsheets'}
              </p>
            </div>
          </div>
          <div className="badge" style={{ background: 'white', color: toolColor, border: `1px solid ${toolColor}` }}>XLSX Suite</div>
        </div>

        {activeTool === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
            {TOOLS.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate('/excel/' + tool.action)}
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
              onClick={() => { navigate('/excel'); setWorkbook(null); setMergeFiles([]); setSplitFile(null); setTableData([]); }}
              style={{ background: 'transparent', border: 'none', color: 'rgba(240,240,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 14 }}
            >
              ← Back to Tools
            </button>

            {/* Edit */}
            {activeTool === 0 && (
              <div className="tool-content">
            {!workbook ? (
              <FileDropzone onFiles={f => loadExcel(f[0])}
                accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }}
                multiple={false} label="Drop your Excel file (.xlsx / .xls)" icon="📊" color={toolColor} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Sheet tabs */}
                {sheetNames.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
                    {sheetNames.map((name, i) => (
                      <button key={i} onClick={() => switchSheet(i)}
                        style={{ padding: '5px 14px', borderRadius: 8, border: `1px solid ${i === activeSheet ? toolColor + '50' : 'rgba(255,255,255,0.1)'}`, background: i === activeSheet ? `${toolColor}15` : 'rgba(255,255,255,0.04)', color: i === activeSheet ? toolColor : 'rgba(240,240,255,0.5)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Table */}
                <div style={{ overflowX: 'auto', marginBottom: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', maxHeight: 440, overflowY: 'auto' }}>
                  <table className="spreadsheet-table">
                    <tbody>
                      {tableData.slice(0, 50).map((row, ri) => (
                        <tr key={ri}>
                          <td style={{ background: 'rgba(255,140,66,0.08)', color: 'rgba(240,240,255,0.3)', fontSize: 11, width: 32, textAlign: 'center', userSelect: 'none' }}>{ri + 1}</td>
                          {(row || []).slice(0, 20).map((cell, ci) => (
                            <td key={ci} style={{ padding: 0 }}>
                              <input
                                value={cell ?? ''}
                                onChange={e => updateCell(ri, ci, e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', padding: '6px 10px', fontSize: 13, outline: 'none', fontFamily: 'Inter, monospace' }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={addRow}><Plus size={13} /> Add Row</button>
                  <button className="btn btn-secondary btn-sm" onClick={addCol}><Plus size={13} /> Add Column</button>
                  <button className="btn btn-primary" onClick={downloadEdited}><Download size={15} /> Download Excel</button>
                  <button className="btn btn-secondary" onClick={() => { setWorkbook(null); setTableData([]); setSheetNames([]); }}>
                    <Trash2 size={13} /> Close
                  </button>
                </div>
              </motion.div>
            )}
              </div>
            )}

            {/* Merge */}
            {activeTool === 1 && (
              <div className="tool-content">
            <FileDropzone onFiles={f => setMergeFiles(p => [...p, ...f])}
              accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }}
              label="Add Excel files to merge" icon="🔗" color={toolColor} />
            {mergeFiles.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 16 }}>
                <div className="file-list">
                  {mergeFiles.map((f, i) => (
                    <div key={i} className="file-item">
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: `${toolColor}20`, color: toolColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i+1}</div>
                      <div className="file-item-info"><div className="file-item-name">{f.name}</div><div className="file-item-size">{formatBytes(f.size)}</div></div>
                      <button className="btn btn-secondary btn-sm" onClick={() => setMergeFiles(p => p.filter((_,j) => j !== i))}><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={handleMerge} disabled={processing}>
                    {processing ? <RefreshCw size={15} /> : <Merge size={15} />} {processing ? 'Merging…' : 'Merge Excel Files'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => setMergeFiles([])}><Trash2 size={13} /> Clear</button>
                </div>
              </motion.div>
            )}
              </div>
            )}

            {/* Split */}
            {activeTool === 2 && (
              <div className="tool-content">
            <FileDropzone onFiles={f => setSplitFile(f[0])}
              accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }}
              multiple={false} label="Drop Excel file to split by sheets" icon="✂️" color={toolColor} />
            {splitFile && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 16 }}>
                <div className="file-item" style={{ marginBottom: 16 }}>
                  <div className="file-item-icon" style={{ background: `${toolColor}15`, color: toolColor }}>📊</div>
                  <div className="file-item-info"><div className="file-item-name">{splitFile.name}</div><div className="file-item-size">{formatBytes(splitFile.size)}</div></div>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(240,240,255,0.5)', marginBottom: 12 }}>Each sheet will be saved as a separate .xlsx file.</p>
                <button className="btn btn-primary" onClick={() => handleSplit(splitFile)} disabled={processing}>
                  {processing ? <RefreshCw size={15} /> : <Scissors size={15} />} {processing ? 'Splitting…' : 'Split by Sheets'}
                </button>
              </motion.div>
            )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
