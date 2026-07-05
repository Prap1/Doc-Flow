import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import WhatsAppSection from '../components/WhatsAppSection';

export default function WhatsAppStudio() {
  return (
    <div className="page-body">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>📱</span>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800 }}>Chat Studio</h1>
              <p style={{ color: 'rgba(240,240,255,0.5)', fontSize: 15 }}>Create and generate PDF exports of simulated WhatsApp chats</p>
            </div>
          </div>
          <span className="badge" style={{ background: 'white', color: '#25D366', border: '1px solid #25D366' }}><Sparkles size={11} /> Chat</span>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <WhatsAppSection />
        </motion.div>
      </motion.div>
    </div>
  );
}
