import { useState } from "react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { LiquidGlass } from "../components/LiquidGlass";
import { HomeIndicator } from "../components/HomeIndicator";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface NightCameraProps {
  onNavigate: (page: Page) => void;
}

export function NightCamera({ onNavigate }: NightCameraProps) {
  const [mode, setMode] = useState<"photo" | "video" | "slow">("photo");
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 600);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "#000000" }}
    >
      {/* iOS Status Bar */}
      <IOSStatusBar mode="night" />

      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-5 py-2 shrink-0">
        <button
          onClick={() => onNavigate("night-input")}
          className="flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: 500, letterSpacing: 0.5 }}>
          捕捉灵感
        </span>
        <button className="transition-opacity hover:opacity-70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      {/* AI label */}
      <div className="relative z-20 px-5 mt-1 shrink-0">
        <LiquidGlass mode="night" borderRadius={20} intensity="soft" style={{ display: "inline-block" }}>
          <span
            style={{
              color: "rgba(120,180,255,0.85)",
              fontSize: 11,
              padding: "4px 12px",
              display: "block",
              letterSpacing: 0.5,
            }}
          >
            ✦ AI 识别中...
          </span>
        </LiquidGlass>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative" style={{ margin: "8px 0" }}>
        {/* Corner brackets */}
        {[
          { top: 20, left: 24, rotate: 0 },
          { top: 20, right: 24, rotate: 90 },
          { bottom: 20, left: 24, rotate: 270 },
          { bottom: 20, right: 24, rotate: 180 },
        ].map((pos, i) => (
          <div key={i} className="absolute" style={{ ...pos, width: 28, height: 28 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ transform: `rotate(${pos.rotate}deg)` }}>
              <path d="M2 12 L2 2 L12 2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}

        {/* Center crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2 }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 8, height: 8, border: "1px solid rgba(255,255,255,0.4)", borderRadius: "50%" }} />
          </div>
        </div>

        {/* Mock detected object */}
        <div className="absolute" style={{ top: "28%", left: "25%", width: "50%", height: "44%", border: "1px solid rgba(80,160,255,0.35)", borderRadius: 4 }}>
          <div style={{ position: "absolute", bottom: -22, left: 0, color: "rgba(100,170,255,0.7)", fontSize: 10, letterSpacing: 1 }}>杯子 · 92%</div>
          <div style={{ position: "absolute", top: -1, right: -1, color: "rgba(100,170,255,0.7)", fontSize: 10, letterSpacing: 1, padding: "1px 6px", background: "rgba(30,80,160,0.3)", borderRadius: "0 4px 0 4px" }}>氛围 · 67%</div>
        </div>

        {/* Exposure indicator */}
        <div className="absolute flex flex-col items-center gap-1" style={{ right: 16, top: "50%", transform: "translateY(-50%)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div style={{ width: 1.5, height: 60, background: "rgba(255,255,255,0.12)", borderRadius: 2, position: "relative" }}>
            <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translateX(-50%)", width: 8, height: 2, background: "rgba(255,220,80,0.7)", borderRadius: 1 }} />
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>+0.3</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "33.33% 33.33%" }} />
      </div>

      {/* Bottom Controls with Liquid Glass */}
      <LiquidGlass mode="night" borderRadius={0} intensity="strong">
        <div style={{ padding: "14px 0 0 0" }}>
          {/* Mode selector */}
          <div className="flex justify-center gap-6 mb-4">
            {(["拍照", "视频", "日志"] as const).map((m, i) => {
              const modeKey = (["photo", "video", "slow"] as const)[i];
              return (
                <button
                  key={m}
                  onClick={() => setMode(modeKey)}
                  style={{
                    color: mode === modeKey ? "rgba(255,220,80,0.95)" : "rgba(255,255,255,0.4)",
                    fontSize: 13,
                    letterSpacing: 0.5,
                    borderBottom: mode === modeKey ? "1.5px solid rgba(255,220,80,0.8)" : "none",
                    paddingBottom: 2,
                    transition: "all 0.2s",
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Shutter row */}
          <div className="flex items-center justify-between px-10 mb-6">
            <button style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.5)" />
                <path d="M21 15l-5-5L5 21" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <button
              onClick={handleCapture}
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: isCapturing ? "rgba(200,220,255,0.9)" : "rgba(240,245,255,0.95)",
                border: "3px solid rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isCapturing ? "0 0 0 6px rgba(100,160,255,0.3)" : "0 0 0 4px rgba(255,255,255,0.08)",
                transition: "all 0.2s",
                transform: isCapturing ? "scale(0.94)" : "scale(1)",
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: isCapturing ? "rgba(80,130,220,0.95)" : "rgba(255,255,255,0.9)", transition: "all 0.2s" }} />
            </button>

            <button style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div style={{ height: 16 }} />
        </div>
        <HomeIndicator mode="night" />
      </LiquidGlass>
    </div>
  );
}