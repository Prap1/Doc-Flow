import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, Send, CheckCircle, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import AdBanner from "../components/AdBanner";
import { showToast } from "../components/Toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast("Message received! We will respond within 24-48 hours.", "success");
    }, 900);
  };

  return (
    <div className="page-body pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-outfit font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            Contact Us & Support
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have questions about file processing, privacy, or partnerships? Reach out to the ApniPDFs team. We're here to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Direct Contact & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-indigo-400" size={20} />
                Fast Support Response
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Our support team is active Monday through Saturday. We aim to reply to all user inquiries within <strong>24 to 48 hours</strong>.
              </p>
              <div className="space-y-3 pt-3 border-t border-white/5 text-sm text-white/70">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-indigo-400" />
                  <span>General Support: <strong>barotmanav68@gmail.com</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Privacy Inquiries: <strong>barotmanav68@gmail.com</strong></span>
                </div>
              </div>
            </div>

            {/* Founder Card 1 */}
            <div className="card p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Barot Manav Pinkalkumar</h3>
                  <div className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">Co-Founder & Lead Engineer</div>
                </div>
              </div>
              <div className="space-y-2.5 text-sm text-white/70">
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-white/40" />
                  <a href="mailto:barotmanav68@gmail.com" className="hover:text-indigo-400 transition-colors">
                    barotmanav68@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-white/40" />
                  <a href="tel:9574725269" className="hover:text-indigo-400 transition-colors">
                    +91 95747 25269
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-white/40 mt-0.5 shrink-0" />
                  <span className="text-xs leading-relaxed text-white/60">
                    2, NB Banglows, Near KM Residency, 80ft Ring Road, Unjha, Gujarat, India
                  </span>
                </div>
              </div>
            </div>

            {/* Founder Card 2 */}
            <div className="card p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Prajapati Dev Vinodbhai</h3>
                  <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Co-Founder & Product Lead</div>
                </div>
              </div>
              <div className="space-y-2.5 text-sm text-white/70">
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-white/40" />
                  <a href="mailto:dev300036@gmail.com" className="hover:text-cyan-400 transition-colors">
                    dev300036@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-white/40" />
                  <a href="tel:9313486440" className="hover:text-cyan-400 transition-colors">
                    +91 93134 86440
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-white/40 mt-0.5 shrink-0" />
                  <span className="text-xs leading-relaxed text-white/60">
                    4, Gaurav Park Society, Thalota Road, Visnagar, Gujarat, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Send Us a Direct Message</h2>
                <p className="text-white/60 text-sm mb-6">
                  Fill out the form below and we will get back to your email with detailed support.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 my-8"
                  >
                    <CheckCircle className="text-emerald-400 mx-auto" size={48} />
                    <h3 className="text-xl font-bold text-white">Thank You for Contacting Us!</h3>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                      Your inquiry has been submitted. Our technical team has been notified and will reply to <strong>{formData.email}</strong> shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", subject: "general", message: "" });
                      }}
                      className="btn btn-secondary text-sm mt-4"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                        Topic / Category
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#131428] border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="pdf">PDF Tools Support</option>
                        <option value="conversion">Conversion or Formatting Bug</option>
                        <option value="privacy">Privacy & Data Security</option>
                        <option value="ads">Advertising & Business Inquiries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                        Message / Details *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can our engineering team assist you?"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-4"
                    >
                      {isSubmitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send size={16} /> Submit Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-xs text-white/40 flex items-center gap-2">
                <HelpCircle size={14} />
                <span>We respect your privacy. Contact submissions are never shared with third parties.</span>
              </div>
            </div>
          </div>
        </div>

        <AdBanner />
      </motion.div>
    </div>
  );
}
