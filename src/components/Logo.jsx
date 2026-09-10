import logoImg from "../assets/logo.png";
import logoIcon from "../assets/logo-icon.png";

export default function Logo({
  variant = "horizontal", // "horizontal" (icon badge + prominent text) | "badge" (icon badge only) | "full" (full image with baked text)
  size = 40,
  className = "",
  alt = "ApniPDFs Logo",
  ...props
}) {
  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3 ${className}`} {...props}>
        <div
          className="rounded-xl bg-white p-1.5 shadow-md shadow-emerald-500/15 border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-200"
          style={{ width: size, height: size }}
        >
          <img
            src={logoIcon}
            alt={alt}
            className="w-full h-full object-contain select-none"
            loading="eager"
          />
        </div>
        <div className="font-outfit font-black text-2xl tracking-tight leading-none select-none flex items-center whitespace-nowrap">
          <span className="text-white">Apni</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400">
            PDFs
          </span>
        </div>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-white p-1.5 shadow-md shadow-emerald-500/15 border border-white/20 transition-all duration-200 ${className}`}
        style={{ width: size, height: size }}
        {...props}
      >
        <img
          src={logoIcon}
          alt={alt}
          className="w-full h-full object-contain select-none"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <img
      src={logoImg}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block object-contain select-none transition-transform duration-200 ${className}`}
      style={{ width: size, height: size }}
      loading="eager"
      {...props}
    />
  );
}
