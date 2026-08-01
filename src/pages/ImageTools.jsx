import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import FileDropzone from '../components/FileDropzone';
import FilePreviewModal from '../components/FilePreviewModal';
import { showToast } from '../components/Toast';
import { Download, Trash2, Merge, Scissors, RotateCw, FlipHorizontal, Sun, Contrast, ZoomIn, ZoomOut } from 'lucide-react';

const TOOLS = [
  { id: 0, action: 'edit', title: 'Edit Image', desc: 'Filters, crop & rotate', icon: '🎨', color: '#A855F7' },
  { id: 1, action: 'merge', title: 'Merge Images', desc: 'Combine horizontally', icon: '🔗', color: '#8B5CF6' },
  { id: 2, action: 'split', title: 'Split Image', desc: 'Divide into halves', icon: '✂️', color: '#FF6B9D' },
];

export default function ImageTools() {
  const location = useLocation();
  const { action } = useParams();
  const navigate = useNavigate();

  const activeTool = action ? TOOLS.find(t => t.action === action)?.id ?? null : null;

  const [image, setImage] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturate: 100, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0 });
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState(false);
  const [scale, setScale] = useState(1);
  const [mergeImages, setMergeImages] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const canvasRef = useRef(null);
  const toolColor = '#A855F7';

  const loadImage = (file) => {
    setImage(file);
    setImgUrl(URL.createObjectURL(file));
    setFilters({ brightness: 100, contrast: 100, saturate: 100, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0 });
    setRotation(0); setFlip(false); setScale(1);
  };

  useEffect(() => {
    if (location.state?.importedFile) {
      loadImage(location.state.importedFile);
      navigate('/image/edit');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filterStr = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg)`;

  const downloadEdited = () => {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    img.src = imgUrl;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.filter = filterStr;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      if (flip) ctx.scale(-1, 1);
      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
      canvas.toBlob(blob => {
        setPreviewFile({ blob, filename: `edited_${image.name}` });
        showToast('Image ready for preview!', 'success');
      }, 'image/png');
    };
  };

  const handleMergeImages = () => {
    if (mergeImages.length < 2) return showToast('Add at least 2 images', 'error');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgs = mergeImages.map(u => {
      const im = document.createElement('img');
      im.src = u;
      return im;
    });
    Promise.all(imgs.map(im => new Promise(res => { im.onload = res; }))).then(() => {
      const maxH = Math.max(...imgs.map(i => i.naturalHeight));
      const totalW = imgs.reduce((s, i) => s + i.naturalWidth, 0);
      canvas.width = totalW; canvas.height = maxH;
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, totalW, maxH);
      let x = 0;
      imgs.forEach(im => { ctx.drawImage(im, x, 0); x += im.naturalWidth; });
      canvas.toBlob(blob => {
        setPreviewFile({ blob, filename: 'merged_images.png' });
        showToast('Images ready for preview!', 'success');
      }, 'image/png');
    });
  };

  const handleSplitImage = () => {
    if (!imgUrl) return showToast('Upload an image first', 'error');
    const im = document.createElement('img');
    im.src = imgUrl;
    im.onload = () => {
      const half = Math.floor(im.naturalWidth / 2);
      [[0, half], [half, im.naturalWidth - half]].forEach(([x, w], i) => {
        const c = document.createElement('canvas');
        c.width = w; c.height = im.naturalHeight;
        c.getContext('2d').drawImage(im, -x, 0);
        c.toBlob(blob => saveAs(blob, `part${i+1}_${image?.name || 'image.png'}`), 'image/png');
      });
      showToast('Image split into 2 parts!', 'success');
    };
  };

  const filterControls = [
    { key: 'brightness', label: '☀️ Brightness', min: 0, max: 200, unit: '%' },
    { key: 'contrast',   label: '◑ Contrast',    min: 0, max: 200, unit: '%' },
    { key: 'saturate',   label: '🎨 Saturation',  min: 0, max: 200, unit: '%' },
    { key: 'blur',       label: '💧 Blur',         min: 0, max: 10,  unit: 'px' },
    { key: 'sepia',      label: '🟤 Sepia',        min: 0, max: 100, unit: '%' },
    { key: 'grayscale',  label: '⬛ Grayscale',    min: 0, max: 100, unit: '%' },
    { key: 'hueRotate',  label: '🌈 Hue Rotate',   min: 0, max: 360, unit: '°' },
  ];

  const PRESETS = [
    { name: 'Original',  f: { brightness: 100, contrast: 100, saturate: 100, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0 } },
    { name: 'Vivid',     f: { brightness: 110, contrast: 120, saturate: 160, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0 } },
    { name: 'B&W',       f: { brightness: 100, contrast: 110, saturate: 0,   blur: 0, sepia: 0, grayscale: 100, hueRotate: 0 } },
    { name: 'Vintage',   f: { brightness: 95,  contrast: 90,  saturate: 80,  blur: 0, sepia: 60, grayscale: 0, hueRotate: 0 } },
    { name: 'Cool',      f: { brightness: 100, contrast: 105, saturate: 110, blur: 0, sepia: 0, grayscale: 0, hueRotate: 180 } },
    { name: 'Dreamy',    f: { brightness: 105, contrast: 85,  saturate: 130, blur: 1, sepia: 10, grayscale: 0, hueRotate: 30 } },
  ];

  return (
    <div className="page-body">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>{activeTool !== null ? TOOLS[activeTool].icon : '🖼️'}</span>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800 }}>
                {activeTool !== null ? TOOLS[activeTool].title : 'Image Tools'}
              </h1>
              <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: 15 }}>
                {activeTool !== null ? TOOLS[activeTool].desc : 'Edit, Merge & Split your images'}
              </p>
            </div>
          </div>
          <div className="badge" style={{ background: 'white', color: toolColor, border: `1px solid ${toolColor}` }}>IMG Suite</div>
        </div>

        {activeTool === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
            {TOOLS.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate('/image/' + tool.action)}
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
              onClick={() => { navigate('/image'); setImgUrl(null); setImage(null); setMergeImages([]); }}
              style={{ background: 'transparent', border: 'none', color: 'rgba(240,240,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 14 }}
            >
              ← Back to Tools
            </button>

            {/* Edit */}
            {activeTool === 0 && (
              <div className="tool-content">
            {!imgUrl ? (
              <FileDropzone onFiles={f => loadImage(f[0])}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'] }}
                multiple={false} label="Drop an image to edit" icon="🖼️" color={toolColor} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
                {/* Preview */}
                <div>
                  <div className="canvas-area" style={{ minHeight: 360, position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={imgUrl}
                      alt="Edit preview"
                      style={{
                        maxWidth: '100%', maxHeight: 400,
                        filter: filterStr,
                        transform: `rotate(${rotation}deg) scaleX(${flip ? -1 : 1}) scale(${scale})`,
                        transition: '0.3s ease',
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setRotation(r => r + 90)}><RotateCw size={14} /> Rotate</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setFlip(f => !f)}><FlipHorizontal size={14} /> Flip</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setScale(s => Math.min(s + 0.1, 3))}><ZoomIn size={14} /></button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setScale(s => Math.max(s - 0.1, 0.3))}><ZoomOut size={14} /></button>
                    <button className="btn btn-primary" onClick={downloadEdited}><Download size={14} /> Download</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setImgUrl(null); setImage(null); }}><Trash2 size={14} /></button>
                  </div>
                </div>

                {/* Controls */}
                <div>
                  {/* Presets */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,240,255,0.6)', marginBottom: 10 }}>Presets</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                      {PRESETS.map(p => (
                        <button key={p.name} onClick={() => setFilters(p.f)}
                          style={{ padding: '6px 4px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(240,240,255,0.7)', fontSize: 12, cursor: 'pointer', transition: '0.2s' }}>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders */}
                  {filterControls.map(fc => (
                    <div key={fc.key} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(240,240,255,0.55)', marginBottom: 4 }}>
                        <span>{fc.label}</span>
                        <span style={{ color: toolColor }}>{filters[fc.key]}{fc.unit}</span>
                      </div>
                      <input type="range" min={fc.min} max={fc.max} value={filters[fc.key]}
                        onChange={e => setFilters(f => ({ ...f, [fc.key]: +e.target.value }))}
                        style={{ width: '100%', accentColor: toolColor }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
              </div>
            )}

            {/* Merge */}
            {activeTool === 1 && (
              <div className="tool-content">
            <FileDropzone onFiles={f => setMergeImages(p => [...p, ...f.map(fi => URL.createObjectURL(fi))])}
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
              label="Add images to merge (stitch side by side)" icon="🖼️" color={toolColor} />
            {mergeImages.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16 }}>
                  {mergeImages.map((url, i) => (
                    <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={url} alt="" style={{ height: 120, width: 'auto', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                      <button onClick={() => setMergeImages(p => p.filter((_,j) => j !== i))}
                        style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#FF6B9D', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-accent" onClick={handleMergeImages}>
                    <Merge size={15} /> Merge & Preview {mergeImages.length} Images
                  </button>
                  <button className="btn btn-secondary" onClick={() => setMergeImages([])}><Trash2 size={13} /> Clear</button>
                </div>
              </motion.div>
            )}
              </div>
            )}

            {/* Split */}
            {activeTool === 2 && (
              <div className="tool-content">
            {!imgUrl ? (
              <FileDropzone onFiles={f => loadImage(f[0])}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
                multiple={false} label="Drop image to split" icon="✂️" color={toolColor} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="canvas-area" style={{ marginBottom: 16 }}>
                  <img src={imgUrl} alt="Split preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                </div>
                <p style={{ fontSize: 13, color: 'rgba(240,240,255,0.5)', marginBottom: 12 }}>Image will be split vertically into 2 equal halves.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-accent" onClick={handleSplitImage}>
                  <Scissors size={15} /> Split & Preview Image
                  </button>
                  <button className="btn btn-secondary" onClick={() => { setImgUrl(null); setImage(null); }}><Trash2 size={13} /> Remove</button>
                </div>
              </motion.div>
            )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
      <FilePreviewModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}
