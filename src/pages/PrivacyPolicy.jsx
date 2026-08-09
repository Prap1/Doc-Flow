import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto w-full"
    >
      <div className="bg-[#0f1023]/60 border border-white/5 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 prose prose-invert prose-indigo max-w-none">
          <h1 className="text-3xl font-outfit font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-white/60 mb-8">Last Updated: August 9, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              1. Who We Are
            </h2>
            <p className="text-white/70 leading-relaxed">
              ApniPDFs is an online platform that provides browser-based tools.
              Our goal is to offer fast, secure, and privacy-friendly services
              while minimizing the collection of user data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-lg font-medium text-white/80 mb-2">
              Information You Provide
            </h3>
            <p className="text-white/70 leading-relaxed mb-4">
              Our Website does not require users to create an account or
              register. You may voluntarily contact us through email. In that
              case, we may receive your name, email address, and message
              content.
            </p>
            <h3 className="text-lg font-medium text-white/80 mb-2">
              Automatically Collected Information
            </h3>
            <p className="text-white/70 leading-relaxed">
              When you visit our Website, certain technical information may be
              collected automatically, such as browser type, operating system,
              device type, IP address, pages visited, date and time of visit,
              referring website, and browser language. This information helps
              improve the Website and diagnose technical issues.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              3. Files and Document Privacy
            </h2>
            <p className="text-white/70 leading-relaxed">
              Protecting your documents is one of our highest priorities.
              Whenever technically possible:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/70 space-y-2">
              <li>
                All file processing takes place directly within your web
                browser.
              </li>
              <li>Your files are not uploaded to our servers.</li>
              <li>We do not store your documents.</li>
              <li>We do not read or access your files.</li>
              <li>We do not share your files with anyone.</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Because processing occurs locally on your device, your documents
              remain under your control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              4. Cookies & Analytics
            </h2>
            <p className="text-white/70 leading-relaxed">
              We may use cookies and similar technologies to remember basic
              preferences, improve website functionality, measure performance,
              and understand how visitors use our services. Cookies do not
              provide us with access to the contents of your files.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              5. Contact Us
            </h2>
            <p className="text-white/70 leading-relaxed">
              If you have any questions regarding this Privacy Policy, please
              contact us at info@apnipdfs.com.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
