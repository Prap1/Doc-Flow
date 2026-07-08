import { motion } from 'framer-motion';

export default function WhatsAppSection() {
  const socialLinks = [
    { name: 'Instagram', icon: <span style={{fontSize: 28}}>📸</span>, url: 'https://instagram.com', color: '#E4405F' },
    { name: 'WhatsApp', icon: <span style={{fontSize: 28}}>💬</span>, url: 'https://web.whatsapp.com', color: '#25D366' },
    { name: 'Snapchat', icon: <span style={{fontSize: 28}}>👻</span>, url: 'https://snapchat.com', color: '#FFFC00' },
    { name: 'Telegram', icon: <span style={{fontSize: 28}}>✈️</span>, url: 'https://web.telegram.org', color: '#0088cc' },
    { name: 'Facebook', icon: <span style={{fontSize: 28}}>📘</span>, url: 'https://facebook.com', color: '#1877F2' },
    { name: 'LinkedIn', icon: <span style={{fontSize: 28}}>💼</span>, url: 'https://linkedin.com', color: '#0A66C2' },
    { name: 'Tinder', icon: <span style={{fontSize: 28}}>🔥</span>, url: 'https://tinder.com', color: '#fe3c72' },
    { name: 'Bumble', icon: <span style={{fontSize: 28}}>🐝</span>, url: 'https://bumble.com', color: '#ffc629' },
    { name: 'Discord', icon: <span style={{fontSize: 28}}>🎮</span>, url: 'https://discord.com', color: '#5865F2' },
    { name: 'SMS', icon: <span style={{fontSize: 28}}>📱</span>, url: 'sms:', color: '#00b134' },
    { name: 'Google Messages', icon: <span style={{fontSize: 28}}>✉️</span>, url: 'https://messages.google.com', color: '#4285F4' },
    { name: 'Gmail', icon: <span style={{fontSize: 28}}>📧</span>, url: 'https://mail.google.com', color: '#EA4335' },
    { name: 'Google Meet', icon: <span style={{fontSize: 28}}>🎥</span>, url: 'https://meet.google.com', color: '#00ac47' }
  ];

  return (
    <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        {socialLinks.map((link, index) => (
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '32px 20px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: 'white',
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
            }}
            whileHover={{
              y: -8,
              borderColor: link.color,
              boxShadow: `0 10px 30px -10px ${link.color}66`,
              background: 'rgba(255, 255, 255, 0.05)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{
              color: link.color,
              background: `${link.color}15`,
              padding: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {link.icon}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.02em' }}>{link.name}</div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
