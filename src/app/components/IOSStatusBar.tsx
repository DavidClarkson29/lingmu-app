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
        paddingRight: 35,
        paddingTop: 7,
        position: "relative",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Time - iOS SF style */}
      <div className="flex items-center" style={{ position: "absolute", left: 77, transform: "translateX(-50%)" }}>
        <span
          style={{
            color: fgOp,
            fontSize: 16.5,
            lineHeight: 1,
            fontWeight: 650,
            letterSpacing: -0.35,
            fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          1:59
        </span>
      </div>

      {/* Right: Cellular + Wi-Fi + Battery — iOS status indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: 7.5, marginLeft: "auto" }}>
        {/* Dual-line cellular indicator, matching current iOS compact status glyph. */}
        <svg
          aria-hidden="true"
          width="20"
          height="14"
          viewBox="0 0 20 14"
          style={{ display: "block", flexShrink: 0 }}
        >
          {[0, 1, 2, 3].map((column) => (
            <g key={column} opacity={column < 2 ? 1 : column === 2 ? .36 : .2}>
              <rect x={column * 5} y={1 + (3 - column) * .45} width="3.6" height="5.1" rx="1.15" fill={fg} />
              <rect x={column * 5} y="8.2" width="3.6" height="5.1" rx="1.15" fill={fg} />
            </g>
          ))}
        </svg>

        {/* Wi-Fi — solid stepped bands match the compact iOS status glyph. */}
        <svg
          aria-hidden="true"
          width="20"
          height="14"
          viewBox="0 3 24 18"
          style={{ display: "block", flexShrink: 0 }}
        >
          <path
            d="M1.05 8.72 3.2 10.86C8.08 6.04 15.92 6.04 20.8 10.86l2.15-2.14C16.88 2.7 7.12 2.7 1.05 8.72Zm4.28 4.27 2.14 2.15a6.43 6.43 0 0 1 9.06 0l2.14-2.15c-3.69-3.67-9.65-3.67-13.34 0Zm4.3 4.28L12 19.64l2.37-2.37a3.35 3.35 0 0 0-4.74 0Z"
            fill={fg}
          />
        </svg>

        {/* Battery — rounded outline, charge fill and terminal */}
        <svg
          aria-hidden="true"
          width="29"
          height="14"
          viewBox="0 0 29 14"
          style={{ display: "block", flexShrink: 0 }}
        >
          <rect
            x="0.6"
            y="0.6"
            width="24"
            height="12.8"
            rx="3.6"
            stroke={fg}
            strokeWidth="1"
            fill="none"
            opacity={isNight ? 0.42 : 0.38}
          />
          <rect
            x="2.2"
            y="2.2"
            width="19.6"
            height="9.6"
            rx="2.3"
            fill={fg}
            opacity={isNight ? 0.94 : 0.92}
          />
          <path
            d="M26 4.45c.78.27 1.28 1 1.28 1.84v1.42c0 .84-.5 1.57-1.28 1.84Z"
            fill={fg}
            opacity={isNight ? 0.5 : 0.42}
          />
        </svg>
      </div>
    </div>
  );
}
