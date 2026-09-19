import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, FileText, Cookie, AlertCircle, Mail, ExternalLink } from "lucide-react";
import AdBanner from "../components/AdBanner";

export default function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto w-full py-6"
    >
      <div className="bg-[#0f1023]/70 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-white">
                Privacy Policy
              </h1>
              <p className="text-white/50 text-sm">
                Effective Date: September 19, 2026 · Compliant with Google AdSense, GDPR & CCPA
              </p>
            </div>
          </div>

          <p className="text-white/70 text-base leading-relaxed mt-4 mb-8">
            At <strong>ApniPDFs</strong> (accessible at <a href="https://apnipdfs.com" className="text-indigo-400 hover:underline">https://apnipdfs.com</a>), your privacy is one of our utmost priorities. This comprehensive Privacy Policy document outlines the types of information that are collected, recorded, and processed by ApniPDFs, as well as our strict document protection policies and advertising compliance disclosures.
          </p>

          <div className="space-y-8 text-white/80 leading-relaxed text-sm sm:text-base">
            {/* Section 1 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold text-lg">
                <FileText size={20} />
                <h2>1. Zero-Storage Document & File Privacy Guarantee</h2>
              </div>
              <p className="text-white/70 mb-3">
                The cornerstone of ApniPDFs is privacy by architecture. Unlike traditional online converters that upload your confidential files to remote databases:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>
                  <strong>Client-Side Processing:</strong> Whenever technically supported (including PDF viewing, splitting, image manipulations, and spreadsheet operations), file processing is conducted directly inside your web browser using HTML5 Canvas, WebAssembly, and local JavaScript libraries.
                </li>
                <li>
                  <strong>No File Retention:</strong> We do not store, view, archive, or replicate your documents, spreadsheets, or images. Your uploaded files never touch persistent disk storage.
                </li>
                <li>
                  <strong>Ephemeral Server Pipelines:</strong> If an advanced conversion task requires temporary server-assisted rendering, the file is handled exclusively in ephemeral RAM and instantly purged immediately after the output is downloaded or the connection closes.
                </li>
                <li>
                  <strong>No Data Mining:</strong> We do not inspect, parse, or train machine learning algorithms on the contents of your documents.
                </li>
              </ul>
            </section>

            {/* Section 2: Google AdSense Mandatory Clause */}
            <section className="p-6 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-3 text-cyan-400 font-semibold text-lg">
                <Cookie size={20} />
                <h2>2. Google AdSense & Third-Party Advertising Disclosure</h2>
              </div>
              <p className="text-white/70 mb-3">
                This disclosure is provided in accordance with Google Publisher Policies. We utilize Google AdSense to display advertisements on our website to support our free document utility tools.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>
                  <strong>Google as a Third-Party Vendor:</strong> Google is a third-party vendor that uses cookies (including the DoubleClick cookie) to serve advertisements on ApniPDFs based on a user's prior visits to our website and other websites across the Internet.
                </li>
                <li>
                  <strong>DoubleClick Cookie:</strong> Google's use of advertising cookies enables it and its partner network to serve personalized advertisements to our users based on their browsing activity across websites.
                </li>
                <li>
                  <strong>User Opt-Out Choices:</strong> Users may opt out of personalized advertising at any time by visiting the{" "}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Google Ads Settings <ExternalLink size={14} />
                  </a>{" "}
                  page. Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 font-medium hover:underline inline-flex items-center gap-1"
                  >
                    AboutAds.info Choices <ExternalLink size={14} />
                  </a>.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-pink-400 font-semibold text-lg">
                <Lock size={20} />
                <h2>3. Cookies and Web Beacons</h2>
              </div>
              <p className="text-white/70 mb-3">
                Like most modern websites, ApniPDFs uses cookies and local browser storage. These are used to store basic user preferences, maintain session state (such as active editor view settings), and optimize web performance.
              </p>
              <p className="text-white/70">
                Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ApniPDFs. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see. Note that ApniPDFs has no access to or control over these cookies used by third-party advertisers.
              </p>
            </section>

            {/* Section 4 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-purple-400 font-semibold text-lg">
                <EyeOff size={20} />
                <h2>4. Information We Collect</h2>
              </div>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>No Account Required:</strong> ApniPDFs does not require registration, login, phone numbers, or credit card details to access any document conversion or editing utilities.
                </p>
                <p>
                  <strong>Log Data:</strong> In line with standard hosting practices, server logs may record your IP address, browser user-agent, operating system, timestamp, and referring URLs. This statistical information is strictly used for site security, detecting DDoS threats, and performance analytics.
                </p>
                <p>
                  <strong>Contact Communication:</strong> If you voluntarily reach out via our contact form or direct email, we retain your email address and message contents solely to address your support query or feedback.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-lg">
                <AlertCircle size={20} />
                <h2>5. CCPA & GDPR Privacy Rights</h2>
              </div>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>GDPR (European Union):</strong> Users residing in the EEA are entitled to rights including access, rectification, erasure, restriction of processing, data portability, and objection to processing. Because we do not store personal profiles or user files, there is no personal data record to retrieve or erase beyond standard temporary logs.
                </p>
                <p>
                  <strong>CCPA / CPRA (California Residents):</strong> Under the California Consumer Privacy Act, consumers have the right to request disclosure of categories of personal information collected, request deletion, and opt-out of the "sale" or "sharing" of personal data. <strong>ApniPDFs does not sell personal information.</strong>
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-orange-400 font-semibold text-lg">
                <ShieldCheck size={20} />
                <h2>6. Children's Information</h2>
              </div>
              <p className="text-white/70">
                Protecting children while using the internet is an imperative duty. ApniPDFs does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe your child provided personal information on our website, we strongly encourage you to contact us immediately, and we will promptly remove such information from our records.
              </p>
            </section>

            {/* Section 7 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold text-lg">
                <Mail size={20} />
                <h2>7. Contacting the Privacy Officer</h2>
              </div>
              <p className="text-white/70 mb-3">
                If you have questions, inquiries, or suggestions regarding our Privacy Policy or data handling protocols, please reach out directly:
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <div className="font-semibold text-white">ApniPDFs Legal & Privacy Team</div>
                  <div className="text-white/60 text-sm">Official Correspondence & Inquiries</div>
                </div>
                <a
                  href="mailto:info@apnipdfs.com"
                  className="btn btn-primary inline-flex items-center gap-2 text-sm"
                >
                  <Mail size={15} /> info@apnipdfs.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      <AdBanner className="mt-8" />
    </motion.div>
  );
}
