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
      case "night-input":
        return <NightInput onNavigate={navigate} />;
      case "night-camera":
        return <NightCamera onNavigate={navigate} />;
      case "profile":
        return <Profile onNavigate={navigate} />;
      case "day-dashboard":
        return <DayDashboard onNavigate={navigate} />;
      case "day-ai":
        return <DayAIInsights onNavigate={navigate} />;
      case "day-calendar":
        return <DayCalendar onNavigate={navigate} />;
      default:
        return <NightInput onNavigate={navigate} />;
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: isNightPage
          ? "linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 50%, #050510 100%)"
          : "linear-gradient(135deg, #e8e4de 0%, #d4cfc8 100%)",
        transition: "background 0.6s ease",
      }}
    >
      {/* iPhone 15 Pro Frame — 393×852 */}
      <div
        style={{
          width: 393,
          height: 852,
          borderRadius: 55,
          overflow: "hidden",
          position: "relative",
          boxShadow: isNightPage
            ? "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.12)",
          transition: "box-shadow 0.6s ease",
        }}
      >
        {/* Page Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "scale(0.98)" : "scale(1)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}
        >
          {renderPage()}
        </div>
      </div>

      {/* Desktop Page Selector — vertical, right side */}
      <div
        className="fixed flex flex-col items-stretch gap-1.5 px-3 py-3 rounded-2xl"
        style={{
          top: "50%",
          transform: "translateX(0) translateY(-50%)",
          left: `calc(50% + ${393 / 2 + 20}px)`,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          zIndex: 200,
        }}
      >
        {(
          [
            { id: "night-input", label: "🌙 夜间输入", night: true },
            { id: "night-camera", label: "📷 夜间相机", night: true },
            { id: "profile", label: "👤 用户", night: false },
            { id: "day-dashboard", label: "☀️ 白天看板", night: false },
            { id: "day-ai", label: "✦ AI洞察", night: false },
            { id: "day-calendar", label: "📅 日历", night: false },
          ] as { id: Page; label: string; night: boolean }[]
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 12,
              background:
                currentPage === item.id
                  ? item.night
                    ? "rgba(80,140,255,0.35)"
                    : "rgba(200,160,60,0.3)"
                  : "transparent",
              color:
                currentPage === item.id
                  ? item.night
                    ? "rgba(150,200,255,1)"
                    : "rgba(160,110,20,1)"
                  : "rgba(255,255,255,0.6)",
              border:
                currentPage === item.id
                  ? item.night
                    ? "1px solid rgba(80,140,255,0.4)"
                    : "1px solid rgba(200,160,60,0.4)"
                  : "1px solid transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; }
        ::-webkit-scrollbar { width: 0; }
        textarea:focus { outline: none; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
}