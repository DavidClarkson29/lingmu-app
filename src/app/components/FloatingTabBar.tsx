import { Moon, Sun, UserRound } from "lucide-react";
import { SFSymbol } from "./SFSymbol";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface FloatingTabBarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  mode: "night" | "day";
}

export function FloatingTabBar({ current, onNavigate, mode }: FloatingTabBarProps) {
  const isNight = mode === "night";
  const isNightInput = current === "night-input";
  const nightActive = current === "night-input" || current === "night-camera";
  const profileActive = current === "profile";
  const dayActive = current === "day-dashboard" || current === "day-ai";
  const nightColor = nightActive ? (isNight ? "#A7C9F3" : "#6787A6") : (isNight ? "rgba(151,185,226,.4)" : "rgba(83,116,145,.34)");
  const profileColor = profileActive ? (isNight ? "#C3ACCE" : "#87738F") : (isNight ? "rgba(190,165,199,.36)" : "rgba(126,103,137,.32)");
  const dayColor = dayActive ? (isNight ? "#E1BD77" : "#B3853E") : (isNight ? "rgba(222,185,111,.36)" : "rgba(167,123,54,.32)");

  return (
    <div className="shrink-0 flex flex-col items-center" style={{ paddingBottom: 23 }}>
      {/* Full-width transparent bar */}
      <div
        style={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
          background: isNightInput
            ? "transparent"
            : isNight
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(248,245,239,0.78)",
          backdropFilter: isNightInput ? "none" : "blur(40px) saturate(160%)",
          WebkitBackdropFilter: isNightInput ? "none" : "blur(40px) saturate(160%)",
          borderTop: isNightInput
            ? "none"
            : isNight
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(91,80,66,0.09)",
        }}
      >
        {/* Top specular highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: isNightInput
              ? "transparent"
              : isNight
                ? "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 70%, transparent 90%)"
                : "rgba(255,255,255,0.55)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />

        <div
          className="flex items-center justify-around relative"
          style={{ height: 50, zIndex: 1, paddingLeft: 32, paddingRight: 32 }}
        >
          {/* Moon */}
          <button
            onClick={() => onNavigate("night-input")}
            className="flex flex-col items-center gap-0.5"
            style={{ padding: "4px 16px" }}
          >
            <SFSymbol icon={Moon} size={24} color={nightColor} strokeWidth={1.65} fill={nightActive ? nightColor : "none"} style={{ transition: "all 0.3s" }} />
            <div
              style={{
                width: 4, height: 4, borderRadius: "50%",
                background: nightActive ? nightColor : "transparent",
                transition: "background 0.3s",
              }}
            />
          </button>

          {/* Profile */}
          <button
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-0.5"
            style={{ padding: "4px 16px" }}
          >
            <SFSymbol icon={UserRound} size={24} color={profileColor} strokeWidth={1.65} style={{ transition: "all 0.3s" }} />
            <div
              style={{
                width: 4, height: 4, borderRadius: "50%",
                background: profileActive ? profileColor : "transparent",
                transition: "background 0.3s",
              }}
            />
          </button>

          {/* Sun */}
          <button
            onClick={() => onNavigate("day-dashboard")}
            className="flex flex-col items-center gap-0.5"
            style={{ padding: "4px 16px" }}
          >
            <SFSymbol icon={Sun} size={24} color={dayColor} strokeWidth={1.65} style={{ transition: "all 0.3s" }} />
            <div
              style={{
                width: 4, height: 4, borderRadius: "50%",
                background: dayActive ? dayColor : "transparent",
                transition: "background 0.3s",
              }}
            />
          </button>
        </div>
      </div>

    </div>
  );
}
