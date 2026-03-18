import React from "react";

interface LiquidGlassProps {
  children: React.ReactNode;
  mode: "night" | "day";
  style?: React.CSSProperties;
  className?: string;
  borderRadius?: number;
  intensity?: "soft" | "medium" | "strong";
}

export function LiquidGlass({
  children,
  mode,
  style,
  className,
  borderRadius = 22,
  intensity = "medium",
}: LiquidGlassProps) {
  const isNight = mode === "night";

  const blurMap = { soft: 24, medium: 40, strong: 56 };
  const blur = blurMap[intensity];

  const nightStyle: React.CSSProperties = {
    background: `rgba(14, 20, 60, ${intensity === "strong" ? 0.68 : 0.52})`,
    backdropFilter: `blur(${blur}px) saturate(160%) brightness(85%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(160%) brightness(85%)`,
    border: "1px solid rgba(110, 158, 255, 0.22)",
    boxShadow: [
      "0 1.5px 0 rgba(160, 205, 255, 0.18) inset",
      "0 -0.5px 0 rgba(0, 0, 70, 0.28) inset",
      `0 ${intensity === "strong" ? 24 : 12}px ${intensity === "strong" ? 70 : 40}px rgba(0, 0, 30, 0.55)`,
      "0 2px 8px rgba(0, 0, 25, 0.35)",
    ].join(", "),
  };

  const dayStyle: React.CSSProperties = {
    background: `rgba(255, 255, 255, ${intensity === "strong" ? 0.72 : 0.58})`,
    backdropFilter: `blur(${blur}px) saturate(180%) brightness(105%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%) brightness(105%)`,
    border: "1px solid rgba(255, 255, 255, 0.82)",
    boxShadow: [
      "0 2px 0 rgba(255, 255, 255, 0.95) inset",
      "0 -0.5px 0 rgba(0, 0, 0, 0.04) inset",
      `0 ${intensity === "strong" ? 16 : 8}px ${intensity === "strong" ? 40 : 24}px rgba(0, 0, 0, 0.09)`,
      "0 1px 3px rgba(0, 0, 0, 0.05)",
    ].join(", "),
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius,
        ...(isNight ? nightStyle : dayStyle),
        ...style,
      }}
    >
      {/* Top specular edge highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: isNight
            ? "linear-gradient(90deg, transparent 8%, rgba(140,195,255,0.55) 25%, rgba(200,230,255,0.7) 50%, rgba(140,195,255,0.55) 75%, transparent 92%)"
            : "linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.85) 75%, transparent 92%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      {/* Subtle inner gradient for depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "45%",
          background: isNight
            ? "linear-gradient(to bottom, rgba(100,150,255,0.06), transparent)"
            : "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)",
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
