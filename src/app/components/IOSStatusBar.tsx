interface IOSStatusBarProps {
  mode: "night" | "day";
}

export function IOSStatusBar({ mode }: IOSStatusBarProps) {
  const isNight = mode === "night";
  const fg = isNight ? "#fff" : "#000";
  const fgOp = isNight ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.88)";

  return (
    <div
      style={{
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 28,
        paddingRight: 22,
        paddingTop: 14,
        position: "relative",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Time - iOS SF style */}
      <span
        style={{
          color: fgOp,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: 0.2,
          fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        9:41
      </span>

      {/* Spacer */}
      <div style={{ width: 100, flexShrink: 0 }} />

      {/* Right: Cellular + WiFi + Battery — pixel-accurate iOS 17 style */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {/* Cellular — 4 bars, iOS style */}
        <svg width="17" height="12" viewBox="0 0 17 12">
          <rect x="0" y="9" width="3" height="3" rx="0.5" fill={fg} opacity={0.4} />
          <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill={fg} opacity={0.55} />
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill={fg} opacity={0.8} />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill={fg} opacity={1} />
        </svg>

        {/* WiFi — iOS 17 concentric arcs */}
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path
            d="M8 10.8a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z"
            fill={fg}
          />
          <path
            d="M5.17 7.6a3.8 3.8 0 0 1 5.66 0"
            stroke={fg}
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M2.52 4.9a7.2 7.2 0 0 1 10.96 0"
            stroke={fg}
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M0.2 2.4a10.2 10.2 0 0 1 15.6 0"
            stroke={fg}
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Battery — iOS style with body + nub */}
        <svg width="27" height="13" viewBox="0 0 27 13">
          {/* Battery body outline */}
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="12"
            rx="3.5"
            stroke={fg}
            strokeWidth="1"
            fill="none"
            opacity={isNight ? 0.4 : 0.35}
          />
          {/* Battery fill */}
          <rect
            x="2"
            y="2"
            width="17"
            height="9"
            rx="2"
            fill={fg}
            opacity={isNight ? 0.9 : 0.85}
          />
          {/* Battery nub */}
          <path
            d="M24 4.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1"
            fill={fg}
            opacity={isNight ? 0.5 : 0.4}
          />
        </svg>
      </div>
    </div>
  );
}
