import { motion } from "framer-motion";
import { FileCheck, ShieldAlert, Scale, AlertOctagon, HelpCircle, Mail } from "lucide-react";
import AdBanner from "../components/AdBanner";

export default function TermsConditions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto w-full py-6"
    >
      <div className="bg-[#0f1023]/70 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Scale size={26} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-white">
                Terms of Service
              </h1>
              <p className="text-white/50 text-sm">
                Last Updated: September 19, 2026 · Standard Terms & User Guidelines
              </p>
            </div>
          </div>

          <p className="text-white/70 text-base leading-relaxed mt-4 mb-8">
            Welcome to <strong>ApniPDFs</strong>. By accessing, browsing, or using any service, tool, or feature provided on our website (https://apnipdfs.com), you acknowledge that you have read, understood, and agree to be bound by the following terms and conditions. If you do not agree with any part of these terms, please immediately cease using our services.
          </p>

          <div className="space-y-8 text-white/80 leading-relaxed text-sm sm:text-base">
            {/* Section 1 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-cyan-400 font-semibold text-lg">
                <FileCheck size={20} />
                <h2>1. Purpose and Scope of Services</h2>
              </div>
              <p className="text-white/70 mb-3">
                ApniPDFs provides web-based utilities for viewing, converting, editing, splitting, merging, and formatting digital files (including PDFs, Word documents, Excel spreadsheets, and images).
              </p>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>
                  Our tools are delivered without mandatory user account creation or subscription fees.
                </li>
                <li>
                  Features are executed client-side inside the browser or via automated, temporary conversion pipelines that do not maintain permanent file storage.
                </li>
                <li>
                  We reserve the right to modify, suspend, or enhance any tool or capability without prior notice.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold text-lg">
                <ShieldAlert size={20} />
                <h2>2. Acceptable Use and User Responsibilities</h2>
              </div>
              <p className="text-white/70 mb-3">
                You agree to use ApniPDFs only for lawful purposes. You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>
                  You possess the legal right, ownership, or authorized license to upload, modify, convert, and download any files you process through our services.
                </li>
                <li>
                  You will not process materials that infringe upon any patent, trademark, trade secret, copyright, or other proprietary rights of any third party.
                </li>
                <li>
                  You will not introduce viruses, malware, trojans, malicious scripts, or attempt to overwhelm or disrupt our website infrastructure or server APIs.
                </li>
                <li>
                  You will not scrape, reverse engineer, or programmatically abuse our endpoints with automated bots or distributed denial of service tactics.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-pink-400 font-semibold text-lg">
                <AlertOctagon size={20} />
                <h2>3. Intellectual Property Rights</h2>
              </div>
              <p className="text-white/70 mb-3">
                <strong>Your Content:</strong> We claim no intellectual property rights or ownership over the documents, spreadsheets, images, or audio clips you process through our tools. Your content remains 100% your own.
              </p>
              <p className="text-white/70">
                <strong>Our Platform:</strong> All website designs, branding, logos, software algorithms, UI layouts, visual styling, icons, and text are the exclusive intellectual property of ApniPDFs and protected by applicable copyright and trademark legislation.
              </p>
            </section>

            {/* Section 4 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-orange-400 font-semibold text-lg">
                <Scale size={20} />
                <h2>4. Disclaimer of Warranties & File Backups</h2>
              </div>
              <p className="text-white/70 mb-3">
                The services and utilities on ApniPDFs are provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p className="text-white/70">
                <strong>Mandatory Backup Notice:</strong> Because file conversions and format changes can result in layout variations or unexpected data rendering, you must always preserve original backup copies of your files before executing splits, merges, or conversions.
              </p>
            </section>

            {/* Section 5 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-purple-400 font-semibold text-lg">
                <AlertOctagon size={20} />
                <h2>5. Limitation of Liability</h2>
              </div>
              <p className="text-white/70">
                In no event shall ApniPDFs, its creators, operators, contributors, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data corruption, business interruption, or system downtime arising out of or in connection with the use or inability to use our tools.
              </p>
            </section>

            {/* Section 6 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-lg">
                <HelpCircle size={20} />
                <h2>6. Advertisements and External Links</h2>
              </div>
              <p className="text-white/70">
                ApniPDFs displays advertising units served by third-party ad networks (including Google AdSense) and may contain links to third-party websites or services. We do not endorse, control, or assume liability for the content, privacy practices, or goods offered by third-party advertisers or external websites.
              </p>
            </section>

            {/* Section 7 */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold text-lg">
                <Mail size={20} />
                <h2>7. Contact and Inquiries</h2>
              </div>
              <p className="text-white/70 mb-3">
                If you have any questions or require legal clarification regarding these Terms of Service, please contact our administrative team:
              </p>
              <a
                href="mailto:barotmanav68@gmail.com"
                className="text-indigo-400 font-medium hover:underline inline-flex items-center gap-1.5"
              >
                <Mail size={16} /> barotmanav68@gmail.com
              </a>
            </section>
          </div>
        </div>
      </div>

      <AdBanner className="mt-8" />
    </motion.div>
  );
}
