import { motion } from "framer-motion";
import { UploadCloud, Settings, Download } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UploadCloud size={32} />,
      title: "1. Upload Your File",
      desc: "Drag and drop your PDF, Word, Excel, or Image file into our secure upload zone. You can do this directly from the homepage or within specific tool pages.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10"
    },
    {
      icon: <Settings size={32} />,
      title: "2. Edit & Process",
      desc: "Use our intuitive tools to edit text, merge files, split pages, convert formats, or apply filters. Our real-time editor makes complex tasks incredibly simple.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10"
    },
    {
      icon: <Download size={32} />,
      title: "3. Download Instantly",
      desc: "Once you're satisfied with your changes, click download to save the processed file back to your device. It's fast, secure, and hassle-free.",
      color: "text-green-400",
      bg: "bg-green-500/10"
    }
  ];

  return (
    <div className="page-body pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-outfit font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            How It Works
          </h1>
          <p className="text-white/60 text-lg">
            Processing your documents is as easy as 1-2-3.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className={`w-24 h-24 rounded-full ${step.bg} ${step.color} flex items-center justify-center mb-6 shadow-lg border border-white/5`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
