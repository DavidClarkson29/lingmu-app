import { HomeIndicator } from "./HomeIndicator";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai" | "day-calendar";

interface FloatingTabBarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  mode: "night" | "day";
}

export function FloatingTabBar({ current, onNavigate, mode }: FloatingTabBarProps) {
  const isNight = mode === "night";

  const navItems: { id: Page; label: string; night: boolean }[] = [
    { id: "night-input", label: "🌙 夜间输入", night: true },
    { id: "night-camera", label: "📷 夜间相机", night: true },
    { id: "profile", label: "👤 用户中心", night: false },
    { id: "day-dashboard", label: "☀️ 白天看板", night: false },
    { id: "day-ai", label: "✦ AI 洞察", night: false },
    { id: "day-calendar", label: "📅 灵感日历", night: false },
  ];

  return (
    /* 修改为：固定在左侧垂直居中 */
    <div
      className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-3 rounded-3xl z-[200]"
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            padding: "8px 16px",
            borderRadius: 16,
            fontSize: 13,
            textAlign: "left",
            width: "120px",
            background:
              current === item.id
                ? item.night
                  ? "rgba(80,140,255,0.3)"
                  : "rgba(200,160,60,0.25)"
                : "transparent",
            color:
              current === item.id
                ? item.night
                  ? "#90bfff"
                  : "#b08a40"
                : "rgba(255,255,255,0.5)",
            border:
              current === item.id
                ? `1px solid ${item.night ? "rgba(80,140,255,0.4)" : "rgba(200,160,60,0.4)"}`
                : "1px solid transparent",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
