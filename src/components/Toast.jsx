import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

let toastIdCounter = 0;

// Simple global toast store (not Redux, just module-level)
const listeners = new Set();
let toasts = [];

export function showToast(message, type = 'success') {
  const id = ++toastIdCounter;
  toasts = [...toasts, { id, message, type }];
  listeners.forEach(fn => fn(toasts));
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(fn => fn(toasts));
  }, 3500);
}

const colors = {
  success: { bg: 'rgba(0,255,179,0.1)', border: 'rgba(0,255,179,0.3)', icon: '✅', color: '#00FFB3' },
  error:   { bg: 'rgba(255,107,157,0.1)', border: 'rgba(255,107,157,0.3)', icon: '❌', color: '#FF6B9D' },
  info:    { bg: 'rgba(108,99,255,0.1)',  border: 'rgba(108,99,255,0.3)',  icon: 'ℹ️', color: '#8B84FF' },
  warn:    { bg: 'rgba(255,140,66,0.1)',  border: 'rgba(255,140,66,0.3)',  icon: '⚠️', color: '#FF8C42' },
};

export function Toaster() {
  const [list, setList] = useState([]);
  useState(() => {
    const fn = updated => setList([...updated]);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence>
        {list.map(t => {
          const c = colors[t.type] || colors.success;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              style={{
                padding: '12px 18px', borderRadius: 12,
                background: 'rgba(10,10,30,0.95)',
                border: `1px solid ${c.border}`,
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${c.border}`,
                backdropFilter: 'blur(20px)',
                maxWidth: 320,
              }}
            >
              <span style={{ fontSize: 16 }}>{c.icon}</span>
              <span style={{ fontSize: 13, color: 'rgba(240,240,255,0.85)', flex: 1 }}>{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
