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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="8"
            r="4"
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="4"
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
