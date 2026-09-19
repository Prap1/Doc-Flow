import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  FileCheck,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Scissors,
  Merge,
  Sliders,
  Sparkles,
  Layers,
} from "lucide-react";

export default function ImageContentSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const guides = [
    {
      title: "How to Edit, Filter & Rotate Images",
      icon: <Sliders className="text-purple-400" size={20} />,
      steps: [
        "Select 'Edit Image' and upload any JPG, PNG, or WebP photo.",
        "Adjust dynamic sliders for Brightness, Contrast, and Grayscale in real-time.",
        "Use 90° rotation or horizontal/vertical mirror flipping tools to correct orientation.",
        "Download your optimized image instantly with zero watermarks.",
      ],
    },
    {
      title: "How to Merge Multiple Images Together",
      icon: <Merge className="text-indigo-400" size={20} />,
      steps: [
        "Click 'Merge Images' and drop two or more visual assets or photos.",
        "Select horizontal (side-by-side) or vertical (stacked) combination modes.",
        "Our canvas renderer aligns boundaries and scales dimensions automatically.",
        "Download the unified panoramic or multi-panel composite photo.",
      ],
    },
    {
      title: "How to Split Images for Social Carousels",
      icon: <Scissors className="text-pink-400" size={20} />,
      steps: [
        "Choose 'Split Image' and select the graphic you wish to divide.",
        "Our engine segments the visual into equal vertical or horizontal halves.",
        "Preview the divided segments in the interactive preview window.",
        "Download each section ready for Instagram grids, banners, or split stories.",
      ],
    },
    {
      title: "Lossless Format Optimization",
      icon: <ImageIcon className="text-cyan-400" size={20} />,
      steps: [
        "Upload high-resolution images taken from cameras or smartphones.",
        "Convert to modern WebP format for fast website load times.",
        "Maintain transparency layers for PNG graphic assets and logos.",
        "Save bandwidth while retaining crisp, pixel-perfect visual fidelity.",
      ],
    },
  ];

  const faqs = [
    {
      q: "Does ApniPDFs compress or reduce the resolution of my uploaded photos?",
      a: "No. All canvas filters, rotations, and splits operate directly on original image source dimensions without artificial downscaling or lossy compression degradation.",
    },
    {
      q: "Is PNG transparency preserved when editing or splitting graphics?",
      a: "Yes. Our HTML5 Canvas rendering pipeline fully preserves the 32-bit RGBA color channel, ensuring that transparent backgrounds in PNG and WebP files remain intact.",
    },
    {
      q: "Are my family photos or proprietary graphic assets stored online?",
      a: "Never. Image manipulation is performed 100% on your device using hardware-accelerated HTML5 Canvas and WebGL. Your photos never travel across the network or get archived on cloud servers.",
    },
    {
      q: "What is the maximum resolution and file size supported?",
      a: "We support image files up to 50MB and resolutions up to 8K (7680x4320). Your local device's memory handles the processing effortlessly.",
    },
    {
      q: "Can I use Image Tools on mobile devices and iPads?",
      a: "Yes! Our touch-responsive sliders and canvas controllers work smoothly on mobile browsers across iOS Safari and Android Chrome.",
    },
  ];

  return (
    <div className="w-full mt-16 pt-12 border-t border-white/10 text-left">
      {/* Guides */}
      <div className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap size={12} /> Digital Imagery Tutorial
          </div>
          <h2 className="text-3xl font-outfit font-extrabold text-white mb-3">
            Comprehensive Guide to Image Studio Tools
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Enhance, split, merge, and optimize your photos with hardware-accelerated browser algorithms and zero watermarks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-white/5">{guide.icon}</div>
                <h3 className="text-lg font-bold text-white">{guide.title}</h3>
              </div>
              <ol className="space-y-2.5 text-sm text-white/70 list-decimal list-inside leading-relaxed">
                {guide.steps.map((step, sIdx) => (
                  <li key={sIdx} className="pl-1">
                    <span className="text-white/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlight */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-white/10 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-purple-400 font-semibold text-sm mb-2">
            <ShieldCheck size={18} /> GPU-Accelerated Private Canvas
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Lightning-Fast Browser Processing with Complete Discretion
          </h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
            Unlike online image editors that upload personal memories to remote cloud clusters, ApniPDFs uses native browser WebGL and 2D Canvas technology. Your photos stay strictly inside your device.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
            <span>Hardware Accelerated Canvas</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-pink-400 shrink-0" />
            <span>RGBA Transparency Preservation</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
            <span>100% Free with No Watermarks</span>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 mb-16 overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileCheck className="text-purple-400" size={20} />
          Supported Formats & Canvas Specifications
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase tracking-wider text-white/40 border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Standard / Feature</th>
                <th className="py-3 px-4">Supported Capabilities</th>
                <th className="py-3 px-4">Processing Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Image Formats</td>
                <td className="py-3 px-4">JPG, JPEG, PNG, WebP, GIF, SVG</td>
                <td className="py-3 px-4 text-purple-400">HTML5 Canvas API</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Max Resolution</td>
                <td className="py-3 px-4">Up to 8K Ultra HD (7680 × 4320 px)</td>
                <td className="py-3 px-4 text-pink-400">WebGL Acceleration</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Editing Tools</td>
                <td className="py-3 px-4">Brightness, Contrast, Rotation, Mirror, Split, Merge</td>
                <td className="py-3 px-4 text-cyan-400">CSS3 & Pixel Shaders</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Privacy Standard</td>
                <td className="py-3 px-4">100% On-Device execution; zero network transfers</td>
                <td className="py-3 px-4 text-emerald-400">Zero Retention</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Image Tools FAQs</h3>
          <p className="text-white/60 text-sm">Common questions regarding image splitting, merging, and filters</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isOpen ? "bg-white/[0.06] border-purple-500/40" : "bg-white/[0.02] border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-semibold text-white text-sm sm:text-base">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-purple-400 shrink-0"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-5 pb-5 text-sm text-white/70 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
