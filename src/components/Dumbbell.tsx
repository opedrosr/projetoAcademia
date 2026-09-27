export function Dumbbell() {
  return (
    <svg
      className="hero-dumbbell"
      viewBox="0 0 280 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="db-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="30%" stopColor="#2a2a2a" />
          <stop offset="70%" stopColor="#111" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="db-plate-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#666" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#333" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="db-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#555" />
          <stop offset="40%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <radialGradient id="db-grip" cx="0.5" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#525252" />
          <stop offset="60%" stopColor="#2e2e2e" />
          <stop offset="100%" stopColor="#161616" />
        </radialGradient>
        <linearGradient id="db-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#888" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#888" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Drop shadow ellipse */}
      <ellipse cx="140" cy="94" rx="120" ry="5" fill="#000" opacity="0.3" />

      {/* Left weight stack - outer plate */}
      <rect x="6" y="12" width="34" height="68" rx="6" fill="url(#db-plate)" />
      <rect x="6" y="12" width="34" height="68" rx="6" fill="url(#db-plate-rim)" />
      {/* Left inner collar */}
      <rect x="40" y="26" width="14" height="40" rx="3" fill="url(#db-plate)" />
      <rect x="40" y="26" width="14" height="40" rx="3" fill="url(#db-plate-rim)" />
      {/* Left plate highlight notch */}
      <rect x="10" y="16" width="4" height="60" rx="2" fill="url(#db-shine)" />

      {/* Right weight stack - outer plate */}
      <rect x="240" y="12" width="34" height="68" rx="6" fill="url(#db-plate)" />
      <rect x="240" y="12" width="34" height="68" rx="6" fill="url(#db-plate-rim)" />
      {/* Right inner collar */}
      <rect x="226" y="26" width="14" height="40" rx="3" fill="url(#db-plate)" />
      <rect x="226" y="26" width="14" height="40" rx="3" fill="url(#db-plate-rim)" />
      {/* Right plate highlight notch */}
      <rect x="266" y="16" width="4" height="60" rx="2" fill="url(#db-shine)" />

      {/* Bar */}
      <rect x="50" y="44" width="180" height="12" rx="6" fill="url(#db-bar)" />
      {/* Bar top shine */}
      <rect x="50" y="45" width="180" height="3" rx="1.5" fill="#777" opacity="0.35" />

      {/* Grip section */}
      <rect x="80" y="42" width="120" height="16" rx="8" fill="url(#db-grip)" />
      {/* Grip knurling texture */}
      <g opacity="0.4">
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={86 + i * 6}
            y1={44}
            x2={86 + i * 6}
            y2={56}
            stroke="#000"
            strokeWidth="0.7"
          />
        ))}
      </g>
      {/* Grip center highlight */}
      <rect x="80" y="44" width="120" height="2" rx="1" fill="#6a6a6a" opacity="0.3" />

      {/* Accent ring on left plate */}
      <circle cx="23" cy="46" r="7" fill="none" stroke="#C8431C" strokeWidth="1.5" opacity="0.5" />
      <circle cx="23" cy="46" r="3.5" fill="#C8431C" opacity="0.3" />
      {/* Accent ring on right plate */}
      <circle cx="257" cy="46" r="7" fill="none" stroke="#C8431C" strokeWidth="1.5" opacity="0.5" />
      <circle cx="257" cy="46" r="3.5" fill="#C8431C" opacity="0.3" />
    </svg>
  );
}
