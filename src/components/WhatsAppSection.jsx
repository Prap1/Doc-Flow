import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaWhatsapp,
  FaSnapchatGhost,
  FaTelegramPlane,
  FaFacebook,
  FaLinkedin,
  FaDiscord,
  FaSms,
} from "react-icons/fa";
import { SiTinder, SiGmail, SiGooglemeet } from "react-icons/si";
import { MdMessage } from "react-icons/md";

export default function WhatsAppSection() {
  const [isLoading, setIsLoading] = useState(false);

  // Clear loader if user navigates back to this page (bfcache)
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setIsLoading(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const socialLinks = [
    {
      name: "Instagram",
      icon: <FaInstagram size={28} />,
      url: "https://instagram.com",
      appUrl: "instagram://app",
      color: "#E4405F",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={28} />,
      url: "https://web.whatsapp.com",
      appUrl: "whatsapp://app",
      color: "#25D366",
    },
    {
      name: "Snapchat",
      icon: <FaSnapchatGhost size={28} />,
      url: "https://snapchat.com",
      appUrl: "snapchat://app",
      color: "#FFFC00",
    },
    {
      name: "Telegram",
      icon: <FaTelegramPlane size={28} />,
      url: "https://web.telegram.org",
      appUrl: "tg://resolve",
      color: "#0088cc",
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={28} />,
      url: "https://facebook.com",
      appUrl: "fb://",
      color: "#1877F2",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={28} />,
      url: "https://linkedin.com",
      appUrl: "linkedin://",
      color: "#0A66C2",
    },
    {
      name: "Tinder",
      icon: <SiTinder size={28} />,
      url: "https://tinder.com",
      appUrl: "tinder://",
      color: "#fe3c72",
    },
    {
      name: "Bumble",
      icon: <span style={{ fontSize: 28 }}>🐝</span>,
      url: "https://bumble.com",
      appUrl: "bumble://",
      color: "#ffc629",
    },
    {
      name: "Discord",
      icon: <FaDiscord size={28} />,
      url: "https://discord.com",
      appUrl: "discord://",
      color: "#5865F2",
    },
    {
      name: "SMS",
      icon: <FaSms size={28} />,
      url: "sms:",
      appUrl: "sms:",
      color: "#00b134",
    },
    {
      name: "Google Messages",
      icon: <MdMessage size={28} />,
      url: "https://messages.google.com",
      appUrl: "sms:",
      color: "#4285F4",
    },
    {
      name: "Gmail",
      icon: <SiGmail size={28} />,
      url: "https://mail.google.com",
      appUrl: "googlegmail://",
      color: "#EA4335",
    },
    {
      name: "Google Meet",
      icon: <SiGooglemeet size={28} />,
      url: "https://meet.google.com",
      appUrl: "gmeet://",
      color: "#00ac47",
    },
  ];

  const handleAppClick = (e, link) => {
    e.preventDefault();
    setIsLoading(true);
    const now = Date.now();

    // Attempt to open the app via deep link
    const deepLink = link.appUrl || link.url;
    window.location.href = deepLink;

    setTimeout(() => {
      // If the app didn't open and put the browser in the background,
      // the timeout will fire roughly on time (1500ms).
      if (Date.now() - now < 2000) {
        // Fallback to web version in the same tab to avoid popup blockers
        window.location.href = link.url;
      } else {
        // If we successfully went to the background and came back, stop loading
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10, 15, 30, 0.8)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            color: "white",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            className="spinner"
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(255, 255, 255, 0.1)",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>
            {`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}
          </style>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "500",
              letterSpacing: "1px",
            }}
          >
            Redirecting...
          </div>
        </div>
      )}
      <div
        style={{
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {socialLinks.map((link, index) => (
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={link.name}
              href={link.url}
              onClick={(e) => handleAppClick(e, link)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "32px 20px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                color: "white",
                textDecoration: "none",
                backdropFilter: "blur(10px)",
                cursor: "pointer",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              }}
              whileHover={{
                y: -8,
                borderColor: link.color,
                boxShadow: `0 10px 30px -10px ${link.color}66`,
                background: "rgba(255, 255, 255, 0.05)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                style={{
                  color: link.color,
                  background: `${link.color}15`,
                  padding: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {link.icon}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  letterSpacing: "-0.02em",
                }}
              >
                {link.name}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </>
  );
}
