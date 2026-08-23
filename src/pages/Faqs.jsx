import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Is ApniPDFs free to use?",
      a: "Yes, ApniPDFs is completely free to use for all basic document processing tasks."
    },
    {
      q: "Are my files secure?",
      a: "Absolutely! We do not store your documents on our servers. Processing happens securely and your files are immediately deleted after you download the result."
    },
    {
      q: "What file formats are supported?",
      a: "We support PDF, Word (.docx, .doc), Excel (.xlsx, .csv), and common image formats (JPG, PNG, WebP)."
    },
    {
      q: "Can I use ApniPDFs on my mobile phone?",
      a: "Yes! Our website is fully responsive and works perfectly on mobile devices, tablets, and desktop computers."
    },
    {
      q: "Do I need to create an account to use the tools?",
      a: "No, you can use all of our core features without signing up or creating an account. Just upload your file and get started immediately."
    },
    {
      q: "Is there a limit on the file size I can upload?",
      a: "Currently, you can upload files up to 50MB. For most PDFs, documents, and images, this is more than enough space to process them quickly and efficiently."
    },
    {
      q: "Can I convert or process multiple files at once?",
      a: "Yes! Tools like 'Merge PDF' allow batch processing. Simply drag and drop multiple files into the upload zone to process them together."
    },
    {
      q: "How long do you keep my processed files?",
      a: "We don't keep them at all. The moment you download your processed file, all related temporary data is wiped from our memory to ensure your maximum privacy and security."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-body pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-outfit font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Frequently Asked Questions
          </h1>
          <p className="text-white/60 text-lg">
            Find answers to common questions about ApniPDFs.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-2xl overflow-hidden transition-colors ${
                  isOpen ? "bg-white/10 border-indigo-500/50" : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <h3 className="text-lg font-bold text-white m-0">
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`shrink-0 ${isOpen ? "text-indigo-400" : "text-white/50"}`}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-white/70 leading-relaxed border-t border-white/5 pt-4 mt-2 mx-6">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
