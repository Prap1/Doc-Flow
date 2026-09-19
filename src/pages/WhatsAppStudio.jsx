import { motion } from "framer-motion";
import { Sparkles, MessageSquare, ShieldCheck, Zap, Globe, Smartphone, HelpCircle, CheckCircle2 } from "lucide-react";
import WhatsAppSection from "../components/WhatsAppSection";
import AdBanner from "../components/AdBanner";

export default function WhatsAppStudio() {
  const features = [
    {
      icon: <Zap className="text-amber-400" size={20} />,
      title: "Direct Deep Linking",
      desc: "Instantly open native desktop or mobile apps when installed, with seamless automatic fallback to official web clients.",
    },
    {
      icon: <ShieldCheck className="text-emerald-400" size={20} />,
      title: "End-to-End Privacy",
      desc: "We do not read, intercept, or route your private messages. Links connect directly to official platform endpoints securely.",
    },
    {
      icon: <Globe className="text-cyan-400" size={20} />,
      title: "Multi-Platform Compatibility",
      desc: "Optimized for Windows, macOS, Android, and iOS devices with platform-specific protocol handlers.",
    },
    {
      icon: <Smartphone className="text-purple-400" size={20} />,
      title: "Zero Setup Required",
      desc: "No third-party plugins or accounts required on ApniPDFs. Access your communications directly in seconds.",
    },
  ];

  const socialFaqs = [
    {
      q: "How does the Social Studio redirect to my apps?",
      a: "Our system uses custom URI scheme protocols (such as whatsapp://, instagram://, and fb://). When you click an icon, your operating system detects if the official application is installed and opens it directly. If the app is not installed, it automatically redirects you to the official web client in your browser.",
    },
    {
      q: "Does ApniPDFs collect or store my social media login credentials?",
      a: "No, never. ApniPDFs never asks for your social media passwords, usernames, or tokens. Authentication occurs exclusively on the official websites or native apps of the respective providers.",
    },
    {
      q: "Can I use this hub for business and customer support?",
      a: "Yes! Many freelancers, customer support agents, and community managers use this dashboard as a unified bookmarks dashboard to quickly switch between WhatsApp Web, Telegram, Discord, and Gmail.",
    },
  ];

  return (
    <div className="page-body pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> Unified Communication
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            Social & Communication Studio
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            One-click access to your favorite social, messaging, and productivity channels. Connect instantly via desktop applications or secure web portals.
          </p>
        </div>

        {/* The interactive Social Icons Grid */}
        <div className="mb-14">
          <WhatsAppSection />
        </div>

        {/* Feature Highlights */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl mb-12">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Why Use the ApniPDFs Social Hub?
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Designed for multitaskers, digital creators, and business professionals who need rapid switching between chat apps, meetings, and client direct messaging.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="p-2 rounded-xl bg-white/5">{feat.icon}</div>
                  <h3 className="text-base font-bold text-white">{feat.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guide to Best Practices */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
              <Smartphone size={20} />
              <h3>Mobile Device Tips</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              When tapping an icon on an iPhone or Android smartphone, your browser will prompt you to open the native app directly (e.g. WhatsApp or Telegram). Ensure popup blockers or deep-link restrictions are allowed in your browser settings for the smoothest experience.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
              <Globe size={20} />
              <h3>Desktop Browser Tips</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              On Chrome, Edge, or Firefox desktop browsers, clicking will trigger the web interface (such as WhatsApp Web or Google Messages) or invoke the Windows/macOS app protocol handler if you have installed the desktop client.
            </p>
          </div>
        </div>

        {/* Social Studio FAQs */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Social Hub FAQs</h2>
            <p className="text-white/60 text-sm">Common questions regarding deep-link routing and security</p>
          </div>

          <div className="space-y-4">
            {socialFaqs.map((faq, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/10"
              >
                <h3 className="text-base font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <AdBanner />
      </motion.div>
    </div>
  );
}
