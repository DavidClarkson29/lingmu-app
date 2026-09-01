type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface BottomNavProps {
  current: Page;
  onNavigate: (page: Page) => void;
  mode: "night" | "day";
}

export function BottomNav({ current, onNavigate, mode }: BottomNavProps) {
  const isNight = mode === "night";
  const activeColor = isNight ? "rgba(160,200,255,1)" : "rgba(70,130,180,1)";
  const inactiveColor = isNight ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
  const borderColor = isNight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const bgColor = isNight ? "rgba(8,12,28,0.85)" : "rgba(255,255,255,0.85)";

  const nightActive = current === "night-input";
  const profileActive = current === "profile";
  const dayActive = current === "day-dashboard" || current === "day-ai";

  return (
    <div
      style={{
        background: bgColor,
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${borderColor}`,
        WebkitBackdropFilter: "blur(20px)",
      }}
      className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-around px-8 z-50"
    >
      {/* Moon - Night Mode */}
      <button
        onClick={() => onNavigate("night-input")}
        className="flex flex-col items-center gap-0.5 transition-all duration-300"
      >
        <SFSymbol icon={Moon} size={24} color={nightActive ? activeColor : inactiveColor} strokeWidth={1.65} fill={nightActive ? activeColor : "none"} style={{ transition: "all 0.3s" }} />
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: nightActive ? activeColor : "transparent",
            transition: "background 0.3s",
          }}
        />
      </button>

      {/* User */}
      <button
        onClick={() => onNavigate("profile")}
        className="flex flex-col items-center gap-0.5 transition-all duration-300"
      >
        <SFSymbol icon={UserRound} size={24} color={profileActive ? activeColor : inactiveColor} strokeWidth={1.65} style={{ transition: "all 0.3s" }} />
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: profileActive ? activeColor : "transparent",
            transition: "background 0.3s",
          }}
        />
      </button>

      {/* Sun - Day Mode */}
      <button
        onClick={() => onNavigate("day-dashboard")}
        className="flex flex-col items-center gap-0.5 transition-all duration-300"
      >
        <SFSymbol icon={Sun} size={24} color={dayActive ? activeColor : inactiveColor} strokeWidth={1.65} style={{ transition: "all 0.3s" }} />
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: dayActive ? activeColor : "transparent",
            transition: "background 0.3s",
          }}
        />
      </button>
    </div>
  );
}
import { Moon, Sun, UserRound } from "lucide-react";
import { SFSymbol } from "./SFSymbol";
