import { IOSStatusBar } from "../components/IOSStatusBar";
import { LiquidGlass } from "../components/LiquidGlass";
import { FloatingTabBar } from "../components/FloatingTabBar";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface ProfileProps {
  onNavigate: (page: Page) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const stats = [
    { label: "灵感总数", value: "128" },
    { label: "连续记录", value: "23天" },
    { label: "标签数", value: "18" },
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #faf8f5 0%, #f2f0ed 100%)" }}
    >
      <IOSStatusBar mode="day" />

      {/* Avatar section */}
      <div className="flex flex-col items-center pt-6 pb-4 shrink-0">
        <div
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(120,160,220,0.5), rgba(180,130,220,0.5))",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <span style={{ fontSize: 32 }}>🌙</span>
        </div>
        <span style={{ color: "rgba(0,0,0,0.82)", fontSize: 18, fontWeight: 500 }}>灵沐</span>
        <span style={{ color: "rgba(0,0,0,0.4)", fontSize: 13, marginTop: 4 }}>LingMu · 创意记录者</span>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4 shrink-0">
        <LiquidGlass mode="day" borderRadius={20} intensity="medium">
          <div className="flex justify-around py-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span style={{ color: "rgba(0,0,0,0.82)", fontSize: 22, fontWeight: 600 }}>{s.value}</span>
                <span style={{ color: "rgba(0,0,0,0.38)", fontSize: 12, marginTop: 2 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </LiquidGlass>
      </div>

      {/* Menu items */}
      <div className="flex-1 px-4 overflow-y-auto">
        {[
          { icon: "🌟", label: "我的灵感库", sublabel: "128条记录" },
          { icon: "📊", label: "数据回顾", sublabel: "月度总结" },
          { icon: "🎨", label: "个性化设置", sublabel: "主题 · 字体" },
          { icon: "🔔", label: "提醒设置", sublabel: "每日记录提醒" },
          { icon: "☁️", label: "云端同步", sublabel: "已同步" },
        ].map((item, i) => (
          <div key={i} className="mb-2">
            <LiquidGlass mode="day" borderRadius={16} intensity="soft">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div className="flex-1">
                  <div style={{ color: "rgba(0,0,0,0.75)", fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ color: "rgba(0,0,0,0.35)", fontSize: 11 }}>{item.sublabel}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </LiquidGlass>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <FloatingTabBar current="profile" onNavigate={onNavigate} mode="day" />
    </div>
  );
}