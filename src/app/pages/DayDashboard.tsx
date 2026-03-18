import { useState } from "react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { LiquidGlass } from "../components/LiquidGlass";
import { FloatingTabBar } from "../components/FloatingTabBar";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai" | "day-calendar";

interface DayDashboardProps {
  onNavigate: (page: Page) => void;
}

interface Bubble {
  id: string;
  label: string;
  count: string;
  size: number;
  color: string;
  borderColor: string;
  x: number;
  y: number;
  shadow: string;
  depth: number; // 0=far, 1=mid, 2=near — for 3D parallax
  highlightAngle: number; // degrees for specular highlight
}

const bubbles: Bubble[] = [
  { id: "emotion", label: "情绪", count: "4条笔记", size: 110, color: "rgba(235,228,245,0.95)", borderColor: "rgba(180,160,220,0.3)", x: 42, y: 38, shadow: "0 8px 28px rgba(180,150,220,0.3), 0 2px 6px rgba(180,150,220,0.15)", depth: 2, highlightAngle: 135 },
  { id: "color", label: "色彩", count: "3条笔记", size: 92, color: "rgba(230,240,255,0.95)", borderColor: "rgba(140,180,240,0.3)", x: 62, y: 28, shadow: "0 6px 22px rgba(120,160,230,0.25), 0 2px 5px rgba(120,160,230,0.12)", depth: 2, highlightAngle: 120 },
  { id: "music", label: "音乐", count: "2条笔记", size: 80, color: "rgba(240,248,235,0.95)", borderColor: "rgba(150,210,170,0.3)", x: 20, y: 55, shadow: "0 5px 18px rgba(130,200,150,0.22), 0 1px 4px rgba(130,200,150,0.1)", depth: 1, highlightAngle: 150 },
  { id: "space", label: "空间", count: "2条", size: 74, color: "rgba(255,245,230,0.95)", borderColor: "rgba(230,190,140,0.35)", x: 60, y: 58, shadow: "0 4px 14px rgba(220,180,120,0.2), 0 1px 3px rgba(220,180,120,0.1)", depth: 1, highlightAngle: 110 },
  { id: "light", label: "光影", count: "1条", size: 62, color: "rgba(245,235,235,0.95)", borderColor: "rgba(220,170,170,0.3)", x: 38, y: 68, shadow: "0 3px 10px rgba(210,160,160,0.18), 0 1px 2px rgba(210,160,160,0.08)", depth: 0, highlightAngle: 140 },
];

const recentNotes = [
  { icon: "✏️", title: "城市的呼吸节奏", time: "23:42", type: "文字" },
  { icon: "📸", title: "光与影的交错", time: "22:15", type: "图片" },
  { icon: "🌙", title: "夜空下的宁静", time: "21:30", type: "图片" },
];

export function DayDashboard({ onNavigate }: DayDashboardProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #faf8f5 0%, #f4f2ef 100%)" }}
    >
      <IOSStatusBar mode="day" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-1 shrink-0">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" fill="rgba(220,160,40,0.8)" />
            <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
              stroke="rgba(220,160,40,0.9)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ color: "rgba(0,0,0,0.82)", fontSize: 17, fontWeight: 500, letterSpacing: 0.5 }}>
            灵沐 LingMu
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSearch(true)} className="transition-opacity hover:opacity-70">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="rgba(0,0,0,0.45)" strokeWidth="1.8" />
              <path d="M20 20l-3.5-3.5" stroke="rgba(0,0,0,0.45)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <button onClick={() => onNavigate("day-calendar")} className="transition-opacity hover:opacity-70">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="3" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="7" y="14" width="3" height="3" rx="0.5" fill="rgba(0,0,0,0.35)" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 mb-2 shrink-0">
        <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 12 }}>📅 3月17日 · 周二</span>
        <span style={{ background: "rgba(220,160,40,0.12)", border: "1px solid rgba(220,160,40,0.3)", color: "rgba(180,120,20,0.9)", fontSize: 10, padding: "1px 8px", borderRadius: 10 }}>
          12条灵感
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        {/* 3D Bubble Chart Area */}
        <div className="relative mx-4 mb-3" style={{ height: 260, perspective: 600 }}>
          {bubbles.map((bubble) => {
            const scale = 0.82 + bubble.depth * 0.1;
            const blur = bubble.depth === 0 ? 1.5 : 0;
            const zTranslate = -30 + bubble.depth * 30;

            return (
              <div
                key={bubble.id}
                className="absolute flex flex-col items-center justify-center"
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  borderRadius: "50%",
                  background: bubble.color,
                  border: `1.5px solid ${bubble.borderColor}`,
                  boxShadow: bubble.shadow,
                  left: `calc(${bubble.x}% - ${bubble.size / 2}px)`,
                  top: `calc(${bubble.y}% - ${bubble.size / 2}px)`,
                  cursor: "pointer",
                  transition: "transform 0.3s ease, filter 0.3s",
                  transform: `scale(${scale}) translateZ(${zTranslate}px)`,
                  filter: blur > 0 ? `blur(${blur}px)` : "none",
                  opacity: 0.7 + bubble.depth * 0.15,
                  zIndex: bubble.depth,
                  overflow: "hidden",
                  position: "absolute",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = `scale(${scale * 1.06}) translateZ(${zTranslate + 10}px)`)}
                onMouseLeave={(e) => (e.currentTarget.style.transform = `scale(${scale}) translateZ(${zTranslate}px)`)}
              >
                {/* Specular highlight for 3D glass feel */}
                <div
                  style={{
                    position: "absolute",
                    top: "8%",
                    left: "15%",
                    width: "55%",
                    height: "40%",
                    borderRadius: "50%",
                    background: `linear-gradient(${bubble.highlightAngle}deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 60%, transparent 100%)`,
                    pointerEvents: "none",
                    filter: "blur(4px)",
                  }}
                />
                {/* Bottom shadow inside */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "5%",
                    left: "20%",
                    width: "60%",
                    height: "25%",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.04)",
                    pointerEvents: "none",
                    filter: "blur(6px)",
                  }}
                />
                <span style={{ color: "rgba(0,0,0,0.72)", fontSize: bubble.size > 90 ? 15 : bubble.size > 75 ? 13 : 12, fontWeight: 500, position: "relative", zIndex: 1 }}>{bubble.label}</span>
                <span style={{ color: "rgba(0,0,0,0.38)", fontSize: 10, marginTop: 2, position: "relative", zIndex: 1 }}>{bubble.count}</span>
              </div>
            );
          })}
          <div className="absolute flex items-center gap-1" style={{ bottom: 8, left: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M8 6l4-4 4 4M12 2v13" stroke="rgba(100,140,200,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 21H4a2 2 0 0 1-2-2v-1" stroke="rgba(100,140,200,0.7)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ color: "rgba(100,140,200,0.8)", fontSize: 11 }}>色彩 + 情绪 可合并</span>
          </div>
          <div className="absolute" style={{ bottom: 8, right: 8 }}>
            <span style={{ color: "rgba(0,0,0,0.25)", fontSize: 10 }}>3 组灵感</span>
          </div>
        </div>

        {/* AI Insight Entry — Rainbow Border Card */}
        <div className="px-4 mb-3">
          <div
            style={{
              borderRadius: 22,
              padding: 2,
              background: "linear-gradient(135deg, #f0a0c0, #e8b860, #80d0a0, #70b8e8, #c0a0e0, #f0a0c0)",
              backgroundSize: "300% 300%",
              animation: "rainbowShift 4s ease infinite",
            }}
          >
            <div style={{ borderRadius: 20, background: "linear-gradient(160deg, #faf8f5 0%, #f4f2ef 100%)" }}>
              <LiquidGlass mode="day" borderRadius={20} intensity="medium">
                <button
                  onClick={() => onNavigate("day-ai")}
                  className="w-full"
                  style={{ padding: "16px 18px", textAlign: "left" }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: 40, height: 40, borderRadius: 14, background: "linear-gradient(135deg, rgba(220,160,40,0.18), rgba(100,140,220,0.18))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="rgba(220,160,40,0.8)" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div style={{ color: "rgba(0,0,0,0.78)", fontSize: 15, fontWeight: 500, marginBottom: 2 }}>AI 洞察</div>
                      <p style={{ color: "rgba(0,0,0,0.45)", fontSize: 12, lineHeight: 1.5 }}>
                        你近期的灵感围绕「空间与情绪」展开，建议深度探索...
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </button>
              </LiquidGlass>
            </div>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="px-4 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: "rgba(0,0,0,0.55)", fontSize: 13, fontWeight: 500 }}>3月17日的灵感</span>
            <span style={{ color: "rgba(100,140,200,0.8)", fontSize: 12 }}>4条</span>
          </div>
          {recentNotes.map((note) => (
            <div key={note.title} className="mb-2">
              <LiquidGlass mode="day" borderRadius={16} intensity="soft">
                <div className="flex items-center gap-3 py-2.5 px-3">
                  <span style={{ fontSize: 16 }}>{note.icon}</span>
                  <div className="flex-1">
                    <span style={{ color: "rgba(0,0,0,0.75)", fontSize: 14 }}>{note.title}</span>
                  </div>
                  <span style={{ color: "rgba(0,0,0,0.3)", fontSize: 11 }}>
                    {note.time} · {note.type}
                  </span>
                </div>
              </LiquidGlass>
            </div>
          ))}
        </div>

        <div className="h-2" />
      </div>

      {/* Floating Tab Bar */}
      <FloatingTabBar current="day-dashboard" onNavigate={onNavigate} mode="day" />

      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute inset-0 z-50 flex flex-col" style={{ background: "rgba(250,248,245,0.95)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}>
          <div style={{ height: 54 }} />
          <div className="px-4 pt-2 pb-3 flex items-center gap-3">
            <LiquidGlass mode="day" borderRadius={22} intensity="medium" className="flex-1">
              <div className="flex items-center gap-2 px-4 py-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="rgba(0,0,0,0.4)" strokeWidth="1.8" />
                  <path d="M20 20l-3.5-3.5" stroke="rgba(0,0,0,0.4)" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input autoFocus value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="搜索灵感..."
                  style={{ background: "transparent", border: "none", outline: "none", color: "rgba(0,0,0,0.75)", fontSize: 15, width: "100%" }}
                  className="placeholder:text-[rgba(0,0,0,0.3)]" />
              </div>
            </LiquidGlass>
            <button onClick={() => { setShowSearch(false); setSearchText(""); }} style={{ color: "rgba(100,140,200,0.9)", fontSize: 14, flexShrink: 0 }}>取消</button>
          </div>
          {searchText && (
            <div className="px-4"><span style={{ color: "rgba(0,0,0,0.35)", fontSize: 12 }}>没有找到「{searchText}」相关的灵感</span></div>
          )}
        </div>
      )}
      <style>{`
        @keyframes rainbowShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}