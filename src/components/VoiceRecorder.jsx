import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Send, Download } from 'lucide-react';

export default function VoiceRecorder({ onSend }) {
  const [state, setState] = useState('idle'); // idle | recording | recorded
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [playback, setPlayback] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRef.current.ondataavailable = e => chunksRef.current.push(e.data);
      mediaRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState('recorded');
        // Store the actual blob so parent can upload to server
        mediaRef.current._capturedBlob = blob;
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRef.current.start();
      setState('recording');
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch {
      alert('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    mediaRef.current?.stop();
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (playback) { audioRef.current.pause(); setPlayback(false); }
    else { audioRef.current.play(); setPlayback(true); }
  };

  const reset = () => {
    setAudioUrl(null); setState('idle'); setDuration(0); setPlayback(false); setCurrentTime(0);
  };

  const formatTime = s => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => setCurrentTime(Math.floor(audioRef.current.currentTime));
      audioRef.current.onended = () => { setPlayback(false); setCurrentTime(0); };
    }
  }, [audioUrl]);

  return (
    <div style={{ background: 'rgba(255,107,157,0.06)', border: '1px solid rgba(255,107,157,0.15)', borderRadius: 16, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#FF6B9D', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Mic size={14} /> Voice Message
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {/* Record / Stop button */}
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
          className={`voice-btn ${state === 'recording' ? 'recording' : 'idle'}`}
          onClick={state === 'recording' ? stopRecording : startRecording}
          disabled={state === 'recorded'}
        >
          {state === 'recording' ? <Square size={22} color="#fff" /> : <Mic size={24} color="#fff" />}
        </motion.button>

        {/* Waveform / playback */}
        <div style={{ flex: 1 }}>
          {state === 'idle' && (
            <p style={{ color: 'rgba(240,240,255,0.4)', fontSize: 13 }}>Press mic to start recording your voice message</p>
          )}
          {state === 'recording' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="waveform">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ height: `${8 + Math.random() * 20}px` }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#FF6B9D', fontWeight: 600 }}>{formatTime(duration)}</span>
              <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.4)' }}>Recording…</span>
            </div>
          )}
          {state === 'recorded' && audioUrl && (
            <div>
              <audio ref={audioRef} src={audioUrl} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={togglePlayback}>
                  {playback ? <Pause size={13} /> : <Play size={13} />}
                  {playback ? 'Pause' : 'Play'}
                </button>
                <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.5)' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <div className="progress-bar" style={{ width: '100%' }}>
                <div className="progress-bar-fill" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <AnimatePresence>
          {state === 'recorded' && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={reset}><Trash2 size={13} /> Discard</button>
              <a href={audioUrl} download="voice-message.webm" className="btn btn-secondary btn-sm">
                <Download size={13} /> Save
              </a>
              {onSend && (
                <button className="btn btn-accent btn-sm" onClick={() => onSend(audioUrl, mediaRef.current?._capturedBlob)}>
                  <Send size={13} /> Send
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
