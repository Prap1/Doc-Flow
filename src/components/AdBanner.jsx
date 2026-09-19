import { useEffect, useRef } from "react";

export default function AdBanner({
  client = "ca-pub-6246785881230575",
  slot = "9761683759",
  format = "auto",
  responsive = "true",
  className = "",
  style = { display: "block", minHeight: "100px" },
}) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Only push if the ins element is mounted and not yet initialized by AdSense
        if (
          adRef.current &&
          !adRef.current.getAttribute("data-adsbygoogle-status") &&
          !adRef.current.hasChildNodes()
        ) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (e) {
      // Gracefully ignore AdSense errors if blocked or dev mode
      console.debug("AdSense status:", e);
    }
  }, []);

  return (
    <div
      className={`ad-container my-8 w-full max-w-5xl mx-auto overflow-hidden text-center rounded-2xl bg-white/[0.02] border border-white/5 p-3 sm:p-4 backdrop-blur-sm transition-all ${className}`}
      aria-label="Advertisement"
    >
      <div className="text-[10px] uppercase tracking-widest font-medium text-white/30 mb-2 select-none">
        Advertisement
      </div>
      <div className="min-h-[100px] flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={style}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
}
