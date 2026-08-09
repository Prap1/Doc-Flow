import { motion } from "framer-motion";

export default function TermsConditions() {
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
            Terms and Conditions
          </h1>
          <p className="text-white/60 mb-8">Last Updated: August 9, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              1. About ApniPDFs
            </h2>
            <p className="text-white/70 leading-relaxed">
              ApniPDFs is a platform that provides browser-based tools designed
              to help users manage documents quickly, securely, and efficiently.
              All supported processing is designed to occur locally within your
              web browser whenever possible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              2. Acceptance of Terms
            </h2>
            <p className="text-white/70 leading-relaxed">
              By accessing or using our Website, you acknowledge that you have
              read, understood, and agree to be bound by these Terms. If you do
              not agree with any part of these Terms, please discontinue the use
              of the Website.
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/70 space-y-2">
              <li>
                You are legally permitted to use this Website under the laws
                applicable in your country.
              </li>
              <li>You will use the Website only for lawful purposes.</li>
              <li>
                You accept these Terms without limitation or qualification.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              3. Browser-Based File Processing
            </h2>
            <p className="text-white/70 leading-relaxed">
              Protecting user privacy is one of our highest priorities. Whenever
              technically possible:
            </p>
            <ul className="list-disc pl-6 mt-2 text-white/70 space-y-2">
              <li>
                Your files are processed directly within your web browser.
              </li>
              <li>Your documents are not uploaded to our servers.</li>
              <li>We do not view your files.</li>
              <li>We do not permanently store your files.</li>
              <li>
                We do not sell or share your documents with third parties.
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4 font-medium">
              Users remain solely responsible for maintaining backups of
              important files before processing them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              4. Limitation of Liability
            </h2>
            <p className="text-white/70 leading-relaxed">
              To the fullest extent permitted by law, ApniPDFs, its owners,
              contributors, employees, or affiliates shall not be liable for
              loss of files, corruption of documents, business interruption,
              loss of profits, indirect damages, or technical failures. Users
              should always maintain backup copies of important documents before
              using any tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/90 mb-4">
              5. Contact Information
            </h2>
            <p className="text-white/70 leading-relaxed">
              For questions regarding these Terms and Conditions, please contact
              us at info@apnipdfs.com.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
