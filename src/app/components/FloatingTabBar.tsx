import { HomeIndicator } from "./HomeIndicator";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface FloatingTabBarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  mode: "night" | "day";
}

export function FloatingTabBar({ current, onNavigate, mode }: FloatingTabBarProps) {
  const isNight = mode === "night";
  const isNightInput = current === "night-input";
  const activeColor = isNight ? "rgba(160,200,255,1)" : "rgba(70,130,180,1)";
  const inactiveColor = isNight ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
  const nightActive = current === "night-input" || current === "night-camera";
  const profileActive = current === "profile";
  const dayActive = current === "day-dashboard" || current === "day-ai";

  return (
    {/* 👇 核心修改：加入了 absolute bottom-0 left-0 w-full z-50 强制沉底覆盖 */}
    <div className="absolute bottom-0 left-0 w-full flex flex-col items-center z-50" style={{ paddingBottom: 0 }}>
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
              : "rgba(255, 255, 255, 0.15)",
          backdropFilter: isNightInput ? "none" : "blur(40px) saturate(160%)",
          WebkitBackdropFilter: isNightInput ? "none" : "blur(40px) saturate(160%)",
          borderTop: isNightInput
            ? "none"
            : isNight
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.06)",
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
                : "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.4) 70%, transparent 90%)",
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                stroke={nightActive ? activeColor : inactiveColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={nightActive ? activeColor : "none"}
                style={{ transition: "all 0.3s" }}
              />
            </svg>
            <div
              style={{
                width: 4, height: 4, borderRadius: "50%",
                background: nightActive ? activeColor : "transparent",
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12" cy="8" r="4"
                stroke={profileActive ? activeColor : inactiveColor}
                strokeWidth="1.5"
                fill={profileActive ? activeColor : "none"}
                style={{ transition: "all 0.3s" }}
              />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke={profileActive ? activeColor : inactiveColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ transition: "all 0.3s" }}
              />
            </svg>
            <div
              style={{
                width: 4, height: 4, borderRadius: "50%",
                background: profileActive ? activeColor : "transparent",
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12" cy="12" r="4"
                stroke={dayActive ? activeColor : inactiveColor}
                strokeWidth="1.5"
                fill={dayActive ? activeColor : "none"}
                style={{ transition: "all 0.3s" }}
              />
              <path
                d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                stroke={dayActive ? activeColor : inactiveColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ transition: "all 0.3s" }}
              />
            </svg>
            <div
              style={{
                width: 4, height: 4, borderRadius: "50%",
                background: dayActive ? activeColor : "transparent",
                transition: "background 0.3s",
              }}
            />
          </button>
        </div>
      </div>

      <HomeIndicator mode={mode} />
    </div>
  );
}
