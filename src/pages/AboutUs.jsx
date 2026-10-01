import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Lock,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Users,
  Target,
  Award,
  Globe,
  Mail,
  Heart,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Logo from "../components/Logo";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

export default function AboutUs() {
  const values = [
    {
      icon: <Lock className="text-pink-400" size={24} />,
      title: "Privacy First & Forever",
      desc: "We believe privacy is an absolute digital right. Your documents are personal, sensitive, and confidential. By executing operations directly inside your browser tab using WebAssembly, your documents never touch a third-party server.",
    },
    {
      icon: <FileCheck className="text-cyan-400" size={24} />,
      title: "Zero Watermarks, 100% Free",
      desc: "Too many online utilities bait users with 'free' tools only to stamp massive promotional watermarks or demand a credit card before downloading. ApniPDFs guarantees completely clean, professional output with zero fees.",
    },
    {
      icon: <Zap className="text-yellow-400" size={24} />,
      title: "Lightning In-Memory Speed",
      desc: "By removing the need to upload multi-megabyte files to external servers, document tasks execute instantly. Our browser engine processes PDFs, spreadsheets, and high-res graphics in milliseconds using your local CPU.",
    },
    {
      icon: <Award className="text-emerald-400" size={24} />,
      title: "Editorial & Technical Rigor",
      desc: "Every tool and educational guide published on ApniPDFs is engineered, verified, and continuously updated by experienced software engineers and document format specialists.",
    },
  ];

  const milestones = [
    {
      stat: "100%",
      label: "Client-Side Processing",
      desc: "Zero retention architecture for complete privacy.",
    },
    {
      stat: "0",
      label: "Watermarks or Paywalls",
      desc: "Every export is clean and ready for business or school.",
    },
    {
      stat: "100k+",
      label: "Documents Processed",
      desc: "Trusted by students, accountants, and freelancers.",
    },
    {
      stat: "99.9%",
      label: "Platform Uptime",
      desc: "Fast, globally distributed browser access 24/7.",
    },
  ];

  return (
    <div className="page-body pt-8">
      <SEO
        title="About Us & Engineering Mission — ApniPDFs"
        description="Learn about the ApniPDFs team, our mission to provide 100% private, free document tools, and our client-side WebAssembly architecture with zero data retention."
        keywords="about ApniPDFs, document tools team, client-side document privacy, WebAssembly PDF processing, safe document converter"
        canonical="https://www.apnipdfs.com/about"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto w-full"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> Our Story & Mission
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            About ApniPDFs
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            We are dedicated to building a free, private, and frictionless document ecosystem for students, professionals, and small businesses worldwide.
          </p>
        </div>

        {/* Mission Statement Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900/40 border border-indigo-500/30 mb-16 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-indigo-300">
              <Target size={22} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Our Core Purpose
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Why We Built ApniPDFs
            </h2>
            <div className="space-y-4 text-white/70 text-base sm:text-lg leading-relaxed">
              <p>
                Handling everyday files—like combining two PDF documents for a job application, converting a contract into an editable Word document, or splitting an Excel sheet—should be effortless and secure.
              </p>
              <p>
                Yet for years, the internet has been plagued by predatory conversion sites: services that force users through multi-step paywalls, upload confidential tax records to unverified servers, or place obtrusive logos over private documents.
              </p>
              <p>
                <strong>ApniPDFs was created as the modern antidote.</strong> By leveraging cutting-edge web technologies like WebAssembly, HTML5 Canvas, and modern JavaScript engines, we shifted computational power directly into the browser. No uploads. No sign-ups. No watermarks. Just instant, private utility.
              </p>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center"
            >
              <div className="text-3xl sm:text-4xl font-black text-indigo-400 font-outfit mb-2">
                {m.stat}
              </div>
              <div className="text-sm font-bold text-white mb-1">{m.label}</div>
              <div className="text-xs text-white/50">{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Our Core Values */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-outfit font-extrabold text-white mb-3">
              Guiding Engineering Principles
            </h2>
            <p className="text-white/60 text-sm sm:text-base">
              The fundamental standards that guide every line of code we write and every guide we publish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    {val.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology & Architectural Transparency */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 mb-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Architectural Transparency
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
              Unlike traditional SaaS platforms that route your binary documents through remote microservices, ApniPDFs functions as a distributed client-side application:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-white/80">
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-white/5">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>PDF Engine:</strong> Lossless client-side vector concatenation and font dictionary handling via PDF-lib.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-white/5">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Spreadsheets:</strong> In-memory XLSX workbook inspection and sheet splitting via SheetJS/XLSX.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-white/5">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Image Studio:</strong> Hardware-accelerated GPU canvas transforms with Lanczos resampling.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-white/5">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Memory Hygiene:</strong> Complete browser garbage collection upon tab closure.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Standards Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 mb-20">
          <div className="flex items-center gap-3 mb-3 text-cyan-400">
            <BookOpen size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Quality Assurance
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Our Editorial & Content Standards
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-4">
            Our educational tutorials, guides, and technical walkthroughs are written and maintained by software engineers and document system administrators.
          </p>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
            We adhere to strict content guidelines: every tutorial is verified against modern operating systems (Windows, macOS, Linux, iOS, Android) and current browser engines. We strictly prohibit AI-generated filler, prioritizing actionable step-by-step guidance, reproducible testing, and factual cybersecurity explanations.
          </p>
          <Link
            to="/guides"
            className="btn btn-secondary text-xs inline-flex items-center gap-2"
          >
            <span>Browse Our Educational Guides</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* AdSense Placement */}
        <AdBanner />

        {/* Contact & Support CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Have Questions or Suggestions?</h3>
          <p className="text-white/60 text-sm max-w-xl mx-auto mb-6">
            We welcome feedback from students, researchers, businesses, and developers. Reach out to our team at any time.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/contact" className="btn btn-primary text-sm px-6 py-2.5">
              Contact Support
            </Link>
            <Link to="/privacy" className="btn btn-secondary text-sm px-6 py-2.5">
              Read Privacy Policy
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
