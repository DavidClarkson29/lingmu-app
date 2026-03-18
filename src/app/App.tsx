import { useState } from "react";
import { NightInput } from "./pages/NightInput";
import { NightCamera } from "./pages/NightCamera";
import { DayDashboard } from "./pages/DayDashboard";
import { DayAIInsights } from "./pages/DayAIInsights";
import { Profile } from "./pages/Profile";
import { DayCalendar } from "./pages/DayCalendar";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai" | "day-calendar";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("night-input");
  const [transitioning, setTransitioning] = useState(false);
  const [displayPage, setDisplayPage] = useState<Page>("night-input");

  const navigate = (page: Page) => {
    if (page === currentPage) return;
    setTransitioning(true);
    setTimeout(() => {
      setDisplayPage(page);
      setCurrentPage(page);
      setTransitioning(false);
    }, 220);
  };

  const isNightPage = displayPage === "night-input" || displayPage === "night-camera";

  const renderPage = () => {
    switch (displayPage) {
      case "night-input": return <NightInput onNavigate={navigate} />;
      case "night-camera": return <NightCamera onNavigate={navigate} />;
      case "profile": return <Profile onNavigate={navigate} />;
      case "day-dashboard": return <DayDashboard onNavigate={navigate} />;
      case "day-ai": return <DayAIInsights onNavigate={navigate} />;
      case "day-calendar": return <DayCalendar onNavigate={navigate} />;
      default: return <NightInput onNavigate={navigate} />;
    }
  };

  return (
    /* 1. 外层：去掉 flex-center，直接占满宽高 */
    <div
      className="w-full h-screen relative overflow-hidden"
      style={{
        background: isNightPage
          ? "linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 50%, #050510 100%)"
          : "linear-gradient(135deg, #e8e4de 0%, #d4cfc8 100%)",
        transition: "background 0.6s ease",
      }}
    >
      {/* 2. 页面内容：去掉固定的 393/852，让它随外层容器自适应 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.98)" : "scale(1)",
          transition: "opacity 0.22s ease, transform 0.22s ease",
          paddingBottom: "80px", // 为底部的导航栏留出呼吸空间
        }}
      >
        {renderPage()}
      </div>

      {/* 3. 导航栏：核心修复！去掉 fixed，改为 absolute，确保它永远在 App 容器内部的底部 */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: isNightPage ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: isNightPage ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          zIndex: 200,
        }}
      >
        {(
          [
            { id: "night-input", label: "🌙", night: true },
            { id: "night-camera", label: "📷", night: true },
            { id: "profile", label: "👤", night: false },
            { id: "day-dashboard", label: "☀️", night: false },
            { id: "day-ai", label: "✦", night: false },
            { id: "day-calendar", label: "📅", night: false },
          ] as { id: Page; label: string; night: boolean }[]
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              fontSize: 16,
              background: currentPage === item.id 
                ? (item.night ? "rgba(80,140,255,0.4)" : "rgba(0,0,0,0.1)") 
                : "transparent",
              transition: "all 0.2s",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; background: transparent; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>
    </div>
  );
}
