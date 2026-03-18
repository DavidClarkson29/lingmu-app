import { HomeIndicator } from "./HomeIndicator";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai" | "day-calendar";

interface FloatingTabBarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  mode: "night" | "day";
}

export function FloatingTabBar({ current, onNavigate, mode }: FloatingTabBarProps) {
  const isNight = mode === "night";
  const activeColor = isNight ? "rgba(160,200,255,1)" : "rgba(70,130,180,1)";
  const inactiveColor = isNight ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
  
  const nightActive = current === "night-input" || current === "night-camera";
  const profileActive = current === "profile";
  const dayActive = current === "day-dashboard" || current === "day-ai" || current === "day-calendar";

  return (
    <div 
      className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center z-50 gap-8 p-4 rounded-2xl"
      style={{
        background: isNight ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
        backdropFilter: "blur(30px) saturate(150%)",
        WebkitBackdropFilter: "blur(30px) saturate(150%)",
        border: isNight ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
      }}
    >
      {/* Moon - Night Mode */}
      <button onClick={() => onNavigate("night-input")} className="transition-transform active:scale-90">
        <svg width="26" height="26" viewBox="0 0 24 24" fill={nightActive ? activeColor : "none"} stroke={nightActive ? activeColor : inactiveColor} strokeWidth="1.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      {/* Profile */}
      <button onClick={() => onNavigate("profile")} className="transition-transform active:scale-90">
        <svg width="26" height="26" viewBox="0 0 24 24" fill={profileActive ? activeColor : "none"} stroke={profileActive ? activeColor : inactiveColor} strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </button>

      {/* Sun - Day Mode */}
      <button onClick={() => onNavigate("day-dashboard")} className="transition-transform active:scale-90">
        <svg width="26" height="26" viewBox="0 0 24 24" fill={dayActive ? activeColor : "none"} stroke={dayActive ? activeColor : inactiveColor} strokeWidth="1.5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>
    </div>
  );
}
