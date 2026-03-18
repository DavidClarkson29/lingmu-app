import { useState } from "react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { LiquidGlass } from "../components/LiquidGlass";
import { HomeIndicator } from "../components/HomeIndicator";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface DayAIInsightsProps {
  onNavigate: (page: Page) => void;
}

interface AICard {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  tagCount: string;
  bg: string;
  iconBg: string;
}

const aiCards: AICard[] = [
  { id: "emotion", icon: "♡", iconColor: "#e86c7a", title: "情绪流向", subtitle: "你的近期情绪状态", tagCount: "4条笔记", bg: "rgba(255,238,240,0.85)", iconBg: "rgba(232,108,122,0.12)" },
  { id: "creative", icon: "◎", iconColor: "#e09840", title: "创意方向", subtitle: "尝试探索深度情绪结构化", tagCount: "3条笔记", bg: "rgba(255,245,228,0.85)", iconBg: "rgba(224,152,64,0.12)" },
  { id: "pattern", icon: "⌁", iconColor: "#7ab8c8", title: "规律识别", subtitle: "深夜 11 点后灵感密度最高", tagCount: "2条笔记", bg: "rgba(228,242,248,0.85)", iconBg: "rgba(122,184,200,0.12)" },
  { id: "action", icon: "→", iconColor: "#8ab87a", title: "行动建议", subtitle: "每天 5 点前建立创作节奏", tagCount: "3条笔记", bg: "rgba(234,246,230,0.85)", iconBg: "rgba(138,184,122,0.12)" },
];

export function DayAIInsights({ onNavigate }: DayAIInsightsProps) {
  const [chatText, setChatText] = useState("");

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #fdfbf8 0%, #f5f3f0 100%)" }}
    >
      <IOSStatusBar mode="day" />

      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-2 shrink-0">
        <button onClick={() => onNavigate("day-dashboard")} className="transition-opacity hover:opacity-70">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <span style={{ color: "rgba(0,0,0,0.82)", fontSize: 17, fontWeight: 500 }}>AI 洞察</span>
          <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 11 }}>基于 12 条灵感</span>
        </div>
        <div style={{ width: 22 }} />
      </div>

      {/* AI Cards Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-2" style={{ minHeight: 0 }}>
        <div className="grid grid-cols-2 gap-3">
          {aiCards.map((card) => (
            <LiquidGlass key={card.id} mode="day" borderRadius={20} intensity="soft">
              <div className="p-3.5 cursor-pointer">
                <div
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
                  }}
                >
                  <span style={{ color: card.iconColor, fontSize: 16 }}>{card.icon}</span>
                </div>
                <div style={{ color: "rgba(0,0,0,0.8)", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{card.title}</div>
                <p style={{ color: "rgba(0,0,0,0.5)", fontSize: 11, lineHeight: 1.55, marginBottom: 10 }}>{card.subtitle}</p>
                <div className="flex items-center gap-1">
                  <div style={{ padding: "2px 8px", borderRadius: 10, background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.45)", fontSize: 10 }}>{card.tagCount}</div>
                </div>
              </div>
            </LiquidGlass>
          ))}
        </div>

        {/* Explore Direction Card */}
        <div className="mt-3">
          <LiquidGlass mode="day" borderRadius={20} intensity="medium">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(140,100,220,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h18M12 3l9 9-9 9" stroke="rgba(140,100,220,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: "rgba(0,0,0,0.78)", fontSize: 14, fontWeight: 500, marginBottom: 3 }}>探索方向</div>
                  <p style={{ color: "rgba(0,0,0,0.48)", fontSize: 11, lineHeight: 1.55 }}>空间笔记 · 记忆碎片 · 声音日记 · 情绪创作 · 推荐跨领域...</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span style={{ fontSize: 10, color: "rgba(0,0,0,0.3)" }}>5 条笔记</span>
                  </div>
                </div>
              </div>
            </div>
          </LiquidGlass>
        </div>

        {/* AI Suggestion Strip */}
        <div className="mt-3">
          <LiquidGlass mode="day" borderRadius={20} intensity="soft">
            <div className="px-4 py-3 flex items-center gap-2">
              <span style={{ fontSize: 14 }}>✦</span>
              <span style={{ color: "rgba(0,0,0,0.5)", fontSize: 11, lineHeight: 1.5 }}>
                你的灵感围绕「空间与情绪」展开，创意方向丰富
              </span>
            </div>
          </LiquidGlass>
        </div>

        <div className="h-2" />
      </div>

      {/* AI Chat Input */}
      <LiquidGlass mode="day" borderRadius={0} intensity="strong">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex-1 flex items-center px-4 py-2.5 rounded-full"
              style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)" }}
            >
              <input
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="向 AI 提问关于你的灵感..."
                style={{ background: "transparent", border: "none", outline: "none", color: "rgba(0,0,0,0.7)", fontSize: 13, width: "100%" }}
                className="placeholder:text-[rgba(0,0,0,0.28)]"
              />
            </div>
            <button
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: chatText ? "rgba(60,100,200,0.9)" : "rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke={chatText ? "white" : "rgba(0,0,0,0.4)"} strokeWidth="2" strokeLinecap="round" />
                <path d="M22 2L15 22 11 13 2 9l20-7z" stroke={chatText ? "white" : "rgba(0,0,0,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <HomeIndicator mode="day" />
      </LiquidGlass>
    </div>
  );
}
