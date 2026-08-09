// Custom animated SVG logo for ApniPDFs
export default function Logo({ size = 40, animated = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="lg1"
          x1="0"
          y1="0"
          x2="80"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6C63FF" />
          <stop offset="0.5" stopColor="#00D9FF" />
          <stop offset="1" stopColor="#FF6B9D" />
        </linearGradient>
        <linearGradient
          id="lg2"
          x1="80"
          y1="0"
          x2="0"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6B9D" />
          <stop offset="1" stopColor="#6C63FF" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hexagon base */}
      <path
        d="M40 4 L72 22 L72 58 L40 76 L8 58 L8 22 Z"
        fill="url(#lg1)"
        fillOpacity="0.12"
        stroke="url(#lg1)"
        strokeWidth="2"
        filter="url(#glow)"
      />

      {/* Document layer 1 */}
      <rect
        x="22"
        y="20"
        width="22"
        height="28"
        rx="3"
        fill="url(#lg1)"
        fillOpacity="0.3"
        stroke="url(#lg1)"
        strokeWidth="1.5"
      />
      <line
        x1="26"
        y1="27"
        x2="40"
        y2="27"
        stroke="url(#lg1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="26"
        y1="32"
        x2="40"
        y2="32"
        stroke="url(#lg1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="26"
        y1="37"
        x2="36"
        y2="37"
        stroke="url(#lg1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Document layer 2 (offset) */}
      <rect
        x="31"
        y="28"
        width="22"
        height="28"
        rx="3"
        fill="url(#lg2)"
        fillOpacity="0.4"
        stroke="url(#lg2)"
        strokeWidth="1.5"
      />
      <line
        x1="35"
        y1="35"
        x2="49"
        y2="35"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="35"
        y1="40"
        x2="49"
        y2="40"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="35"
        y1="45"
        x2="44"
        y2="45"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Center infinity/flow symbol */}
      <path
        d="M32 40 C32 37 35 35 38 37 C41 39 44 39 47 37 C50 35 53 37 53 40 C53 43 50 45 47 43 C44 41 41 41 38 43 C35 45 32 43 32 40 Z"
        fill="none"
        stroke="url(#lg1)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0"
      />
    </svg>
  );
}
