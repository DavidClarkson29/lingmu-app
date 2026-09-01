interface IOSStatusBarProps {
  mode: "night" | "day";
}

export function IOSStatusBar({ mode }: IOSStatusBarProps) {
  const isNight = mode === "night";
  const fg = isNight ? "#FFFFFF" : "#111111";
  const fgOp = isNight ? "rgba(255,255,255,0.96)" : "rgba(17,17,17,0.96)";

  return (
    <div
      style={{
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 34,
        paddingRight: 28,
        paddingTop: 8,
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

      {/* Right: Cellular + Wi-Fi + Battery — iOS status indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {/* Cellular — four ascending rounded bars */}
        <svg
          aria-hidden="true"
          width="18"
          height="12"
          viewBox="0 0 18 12"
          style={{ display: "block", flexShrink: 0 }}
        >
          <rect x="0" y="9" width="3" height="3" rx="0.8" fill={fg} opacity="0.48" />
          <rect x="5" y="6" width="3" height="6" rx="0.8" fill={fg} opacity="0.68" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" fill={fg} opacity="0.88" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" fill={fg} />
        </svg>

        {/* Wi-Fi — every stroke stays inside the viewBox to prevent clipping */}
        <svg
          aria-hidden="true"
          width="17"
          height="12"
          viewBox="0 0 17 12"
          style={{ display: "block", flexShrink: 0, overflow: "visible" }}
        >
          <path
            d="M1.05 3.45C5.18 0.05 11.82 0.05 15.95 3.45"
            stroke={fg}
            strokeWidth="1.65"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M3.75 6.65C6.39 4.42 10.61 4.42 13.25 6.65"
            stroke={fg}
            strokeWidth="1.65"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M6.42 9.52C7.59 8.53 9.41 8.53 10.58 9.52"
            stroke={fg}
            strokeWidth="1.65"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="8.5" cy="11" r="0.85" fill={fg} />
        </svg>

        {/* Battery — rounded outline, charge fill and terminal */}
        <svg
          aria-hidden="true"
          width="27"
          height="13"
          viewBox="0 0 27 13"
          style={{ display: "block", flexShrink: 0 }}
        >
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="12"
            rx="3.25"
            stroke={fg}
            strokeWidth="1"
            fill="none"
            opacity={isNight ? 0.42 : 0.38}
          />
          <rect
            x="2"
            y="2"
            width="18.5"
            height="9"
            rx="2.15"
            fill={fg}
            opacity={isNight ? 0.94 : 0.92}
          />
          <path
            d="M24 4.25c.72.25 1.2.94 1.2 1.75v1c0 .81-.48 1.5-1.2 1.75Z"
            fill={fg}
            opacity={isNight ? 0.5 : 0.42}
          />
        </svg>
      </div>
    </div>
  );
}
