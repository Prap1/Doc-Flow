import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User } from "lucide-react";

export default function Contact() {
  return (
    <div className="page-body pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-outfit font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Contact Us
          </h1>
          <p className="text-white/60 text-lg">
            Get in touch with our team for any queries or support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact 1 */}
          <div className="card p-8 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Barot Manav Pinkalkumar</h2>
                <div className="text-indigo-400 text-sm font-medium">Co-Founder</div>
              </div>
            </div>
            
            <div className="space-y-4 text-white/70">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-white/40" />
                <a href="mailto:barotmanav68@gmail.com" className="hover:text-indigo-400 transition-colors">
                  barotmanav68@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-white/40" />
                <a href="tel:9574725269" className="hover:text-indigo-400 transition-colors">
                  +91 95747 25269
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-white/40 mt-1 shrink-0" />
                <span className="leading-snug">
                  2, NB Banglows, near km residency, 80feet ringroad, Unjha
                </span>
              </div>
            </div>
          </div>

          {/* Contact 2 */}
          <div className="card p-8 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Prajapati Dev Vinodbhai</h2>
                <div className="text-cyan-400 text-sm font-medium">Co-Founder</div>
              </div>
            </div>
            
            <div className="space-y-4 text-white/70">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-white/40" />
                <a href="mailto:dev300036@gmail.com" className="hover:text-cyan-400 transition-colors">
                  dev300036@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-white/40" />
                <a href="tel:9313486440" className="hover:text-cyan-400 transition-colors">
                  +91 93134 86440
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-white/40 mt-1 shrink-0" />
                <span className="leading-snug">
                  4, Gaurav Park society, Thalota Road, Visnagar
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
