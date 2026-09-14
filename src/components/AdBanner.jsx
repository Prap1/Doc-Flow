import { useEffect, useRef } from "react";

export default function AdBanner({
  client = "ca-pub-6246785881230575",
  slot = "9761683759",
  format = "auto",
  responsive = "true",
  className = "",
  style = { display: "block" },
}) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Push only if adsbygoogle hasn't already initialized this ad element
        if (
          adRef.current &&
          !adRef.current.getAttribute("data-adsbygoogle-status")
        ) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (e) {
      console.warn("AdSense initialization:", e);
    }
  }, []);

  return (
    <div
      className={`ad-container my-6 w-full overflow-hidden text-center rounded-xl bg-white/[0.02] border border-white/5 p-2 ${className}`}
    >
      <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
        Advertisement
      </div>
      {/* PDF Tools Display */}
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
  );
}
