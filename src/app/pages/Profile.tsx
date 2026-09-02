import { useRef, useState } from "react";
import { ArrowUpRight, Bell, CalendarDays, CloudUpload, FileDown, Moon, Palette, Pencil, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { FloatingTabBar } from "../components/FloatingTabBar";
import { LiquidGlass } from "../components/LiquidGlass";
import { SFSymbol } from "../components/SFSymbol";
import type { SettingId } from "./SettingsDetail";

type Page = "night-input" | "night-camera" | "profile" | "profile-edit" | "day-dashboard" | "day-ai" | "day-calendar";

interface ProfileProps {
  onNavigate: (page: Page) => void;
  totalEntries: number;
  profileName: string;
  profileBio: string;
  avatarUrl: string;
  onOpenSetting: (settingId: SettingId) => void;
}

const constellationCollection = [
  { name: "微光", threshold: 3, points: [[8, 27], [18, 17], [29, 23], [40, 10]], lines: [[0, 1], [1, 2], [2, 3]] },
  { name: "回声", threshold: 6, points: [[7, 12], [18, 21], [29, 11], [40, 24], [47, 15]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { name: "游弋", threshold: 10, points: [[8, 25], [17, 11], [27, 18], [38, 8], [45, 27]], lines: [[0, 1], [1, 2], [2, 3], [2, 4]] },
  { name: "织梦", threshold: 15, points: [[7, 9], [16, 27], [27, 15], [39, 26], [46, 8]], lines: [[0, 2], [1, 2], [2, 3], [2, 4]] },
  { name: "未名", threshold: 22, points: [[8, 19], [18, 8], [27, 28], [37, 12], [47, 22]], lines: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]] },
] as const;

const stats = [
  { label: "灵感记录", value: "128" },
  { label: "创作夜晚", value: "23" },
  { label: "灵感回声", value: "18" },
];

const settings = [
  { id: "capture", icon: SlidersHorizontal, color: "#718E78", label: "捕捉偏好", sublabel: "沿用上次 · 自动保存" },
  { id: "reminders", icon: Bell, color: "#D49A37", label: "温和提醒", sublabel: "四时辰 · 自选节律" },
  { id: "insights", icon: Sparkles, color: "#8B739E", label: "日报与洞察", sublabel: "晨光时间 · 两周回顾" },
  { id: "appearance", icon: Palette, color: "#A77ABB", label: "外观与字体", sublabel: "跟随昼夜变化" },
  { id: "privacy", icon: ShieldCheck, color: "#638EB1", label: "AI 与隐私", sublabel: "授权范围可控" },
  { id: "sync", icon: CloudUpload, color: "#70A0A8", label: "云端同步", sublabel: "已同步" },
  { id: "export", icon: FileDown, color: "#A57D4E", label: "导出与备份", sublabel: "Markdown · 图片" },
];

const contributionCounts: Record<string, number> = {
  "2025-12-18": 1, "2025-12-23": 2, "2025-12-29": 1,
  "2026-01-03": 1, "2026-01-08": 2, "2026-01-14": 3, "2026-01-22": 1, "2026-01-30": 2,
  "2026-02-04": 1, "2026-02-09": 2, "2026-02-14": 1, "2026-02-18": 3, "2026-02-22": 1, "2026-02-27": 2,
  "2026-03-03": 2, "2026-03-05": 1, "2026-03-07": 2, "2026-03-10": 1, "2026-03-11": 2, "2026-03-14": 3, "2026-03-15": 1, "2026-03-16": 2, "2026-03-17": 5,
};

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const contributionWeeks = Array.from({ length: 14 }, (_, weekIndex) =>
  Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(2025, 11, 15 + weekIndex * 7 + dayIndex);
    const count = contributionCounts[dateKey(date)] || 0;
    return { date, count, level: count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3 };
  }),
);

const contributionMonths = [
  { column: 0, label: "12月" },
  { column: 2, label: "1月" },
  { column: 6, label: "2月" },
  { column: 10, label: "3月" },
];

const contributionColors = ["rgba(84,112,137,0.07)", "rgba(150,184,204,0.34)", "rgba(96,145,177,0.62)", "rgba(48,98,135,0.9)"];

export function Profile({ onNavigate, totalEntries, profileName, profileBio, avatarUrl, onOpenSetting }: ProfileProps) {
  const [activeConstellationIndex, setActiveConstellationIndex] = useState(0);
  const [constellationDrag, setConstellationDrag] = useState(0);
  const constellationDragStart = useRef<number | null>(null);
  const unlockedItems = constellationCollection.filter((item) => totalEntries >= item.threshold);
  const visibleConstellations = unlockedItems.length ? unlockedItems : [constellationCollection[0]];
  const safeConstellationIndex = activeConstellationIndex % visibleConstellations.length;
  const activeConstellation = visibleConstellations[safeConstellationIndex];
  const unlockedConstellations = unlockedItems.length;
  const nextConstellation = constellationCollection.find((item) => totalEntries < item.threshold);

  const moveConstellation = (direction: number) => {
    if (visibleConstellations.length < 2) return;
    setActiveConstellationIndex((current) => (current + direction + visibleConstellations.length) % visibleConstellations.length);
  };

  const finishConstellationDrag = (clientX: number) => {
    if (constellationDragStart.current === null) return;
    const distance = clientX - constellationDragStart.current;
    if (Math.abs(distance) > 34) moveConstellation(distance < 0 ? 1 : -1);
    constellationDragStart.current = null;
    setConstellationDrag(0);
  };

  return (
    <div
      className="lm-day-page relative w-full h-full overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0C1827 0%, #17283A 23%, #4C5862 34%, #A49F9B 43%, #E1DAD0 51%, #F3F0E9 65%, #F3F0E9 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{
          height: 410,
          backgroundImage: "url('/art/profile-starry-night.png')",
          backgroundSize: "auto 390px",
          backgroundPosition: "58% top",
          opacity: .48,
          filter: "saturate(.7)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,.86) 53%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,.86) 53%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: 250,
          height: 210,
          background: "radial-gradient(ellipse at 76% 42%, rgba(255,235,192,.2), transparent 45%), linear-gradient(180deg, transparent, rgba(243,240,233,.46))",
        }}
      />
      <div aria-hidden="true" style={{ height: 54, flexShrink: 0 }} />

      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
      <div className="px-4 pt-2">
        <section
          aria-label="个人资料与星座收藏"
          className="relative overflow-hidden"
          style={{
            height: 244,
            borderRadius: 23,
            color: "rgba(249,247,237,.96)",
            background: "#101D2C",
            border: "1px solid rgba(255,255,255,.32)",
            boxShadow: "0 15px 34px rgba(40,52,66,.19), inset 0 1px rgba(255,255,255,.18)",
          }}
        >
          <style>{`
            @keyframes lm-starry-drift { 0%,100% { transform: scale(1.03) translate3d(0,0,0); } 50% { transform: scale(1.075) translate3d(-1.5%,1%,0); } }
            @keyframes lm-constellation-in { from { opacity: 0; transform: translate3d(18px,4px,0) scale(.94); filter: blur(7px); } to { opacity: 1; transform: translate3d(0,0,0) scale(1); filter: blur(0); } }
            @keyframes lm-star-breathe { 0%,100% { opacity: .72; transform: scale(.86); } 50% { opacity: 1; transform: scale(1.18); } }
            @keyframes lm-line-draw { from { stroke-dashoffset: 70; opacity: .08; } to { stroke-dashoffset: 0; opacity: .78; } }
            .lm-profile-sky { animation: lm-starry-drift 14s ease-in-out infinite; }
            .lm-active-constellation { animation: lm-constellation-in 420ms cubic-bezier(.2,.8,.2,1) both; transform-origin: center; }
            .lm-active-constellation line { stroke-dasharray: 70; animation: lm-line-draw 780ms cubic-bezier(.2,.75,.2,1) both; }
            .lm-active-constellation .lm-star-core { transform-box: fill-box; transform-origin: center; animation: lm-star-breathe 2.8s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) { .lm-profile-sky, .lm-active-constellation, .lm-active-constellation line, .lm-active-constellation .lm-star-core { animation: none !important; } }
          `}</style>

          <div
            aria-hidden="true"
            className="lm-profile-sky absolute inset-0"
            style={{ backgroundImage: "url('/art/profile-starry-night.png')", backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(8,17,29,.82) 0%, rgba(8,17,29,.58) 44%, rgba(13,30,47,.12) 100%)" }} />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(5,12,22,.88) 0%, rgba(7,16,27,.04) 70%)" }} />

          <div className="absolute flex items-center gap-2" style={{ left: 16, top: 14 }}>
            <span style={{ fontSize: 9, letterSpacing: 1.4, color: "rgba(239,227,194,.68)" }}>MY CREATIVE SKY</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(222,190,113,.72)" }} />
            <span style={{ fontSize: 9, color: "rgba(240,242,240,.45)" }}>已点亮 {unlockedConstellations} / {constellationCollection.length}</span>
          </div>

          <button
            onClick={() => onNavigate("profile-edit")}
            className="absolute flex items-center gap-1.5"
            style={{ right: 13, top: 12, zIndex: 3, height: 28, padding: "0 9px", borderRadius: 13, color: "rgba(250,248,239,.72)", background: "rgba(12,23,36,.34)", border: "1px solid rgba(255,255,255,.16)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", fontSize: 9.5 }}
          >
            <SFSymbol icon={Pencil} size={9.5} strokeWidth={1.6} />
            编辑资料
          </button>

          <div
            className="absolute touch-pan-y select-none"
            style={{ right: 2, top: 33, width: 218, height: 142, cursor: visibleConstellations.length > 1 ? "grab" : "default" }}
            onPointerDown={(event) => {
              constellationDragStart.current = event.clientX;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (constellationDragStart.current !== null) setConstellationDrag(Math.max(-34, Math.min(34, event.clientX - constellationDragStart.current)));
            }}
            onPointerUp={(event) => finishConstellationDrag(event.clientX)}
            onPointerCancel={() => { constellationDragStart.current = null; setConstellationDrag(0); }}
          >
            <div
              className="absolute inset-0"
              style={{ transform: `translate3d(${constellationDrag}px,0,0)`, transition: constellationDragStart.current === null ? "transform 220ms ease" : "none" }}
            >
              <div key={activeConstellation.name} className="lm-active-constellation absolute inset-0">
              <svg width="100%" height="105" viewBox="0 0 52 39" fill="none" aria-hidden="true" style={{ overflow: "visible", filter: "drop-shadow(0 0 9px rgba(229,203,139,.22))" }}>
                {activeConstellation.lines.map(([from, to], index) => (
                  <line key={index} x1={activeConstellation.points[from][0]} y1={activeConstellation.points[from][1]} x2={activeConstellation.points[to][0]} y2={activeConstellation.points[to][1]} stroke="rgba(226,215,177,.76)" strokeWidth=".36" style={{ animationDelay: `${index * 70}ms` }} />
                ))}
                {activeConstellation.points.map(([x, y], index) => (
                  <g key={index}>
                    <circle cx={x} cy={y} r={index === 0 ? 3.5 : 2.7} fill="rgba(222,191,117,.09)" />
                    <circle className="lm-star-core" cx={x} cy={y} r={index === 0 ? 1.05 : .76} fill={index === 0 ? "#F3D99A" : "#EAE2C9"} style={{ animationDelay: `${index * 310}ms` }} />
                  </g>
                ))}
              </svg>
              <div className="text-right" style={{ marginTop: -7, paddingRight: 19 }}>
                <div style={{ fontFamily: "serif", fontSize: 14, letterSpacing: 2.4, color: "rgba(247,236,205,.88)" }}>{activeConstellation.name}</div>
                <div style={{ fontSize: 8.5, marginTop: 2, color: "rgba(239,241,240,.4)" }}>滑动看看已收下的星光</div>
              </div>
              </div>
            </div>
          </div>

          <div className="absolute flex items-center" style={{ right: 22, top: 170, zIndex: 2, gap: 5 }}>
            {visibleConstellations.map((item, index) => (
              <button
                key={item.name}
                aria-label={`查看星座${item.name}`}
                onClick={() => setActiveConstellationIndex(index)}
                style={{ width: index === safeConstellationIndex ? 13 : 4, height: 4, borderRadius: 4, background: index === safeConstellationIndex ? "rgba(236,211,149,.88)" : "rgba(255,255,255,.3)", transition: "width 240ms ease, background 240ms ease" }}
              />
            ))}
          </div>

          <div className="absolute" style={{ left: 16, bottom: 66, zIndex: 2, maxWidth: 190 }}>
            <div className="flex items-center">
              <div className="flex items-center justify-center shrink-0 overflow-hidden" style={{ width: 42, height: 42, borderRadius: 15, background: "rgba(238,233,224,.13)", border: "1px solid rgba(255,255,255,.18)", boxShadow: "0 8px 20px rgba(0,0,0,.18)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                {avatarUrl ? <img src={avatarUrl} alt="用户头像" className="w-full h-full object-cover" /> : <SFSymbol icon={Moon} size={19} color="rgba(248,210,107,.95)" strokeWidth={1.5} fill="rgba(248,210,107,.92)" />}
              </div>
              <div className="min-w-0" style={{ marginLeft: 9 }}>
                <div className="flex items-baseline gap-1.5">
                  <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 600 }}>{profileName}</span>
                  <span style={{ fontSize: 7.5, letterSpacing: 1, color: "rgba(242,233,214,.48)" }}>LINGMU</span>
                </div>
                <div className="truncate" style={{ fontSize: 9.5, marginTop: 4, color: "rgba(243,244,239,.6)" }}>{profileBio}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5" style={{ fontSize: 8.5, marginTop: 7, color: "rgba(194,217,228,.68)" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#8FB8CE", boxShadow: "0 0 7px rgba(143,184,206,.65)" }} />
              连续创作 11 天
            </div>
          </div>

          <div className="absolute flex" style={{ left: 16, right: 16, bottom: 13, zIndex: 2, gap: 23 }}>
            {stats.map((item) => (
              <div key={item.label} className="flex flex-col items-start">
                <span style={{ fontSize: 17, lineHeight: 1, fontWeight: 610, color: "rgba(250,248,240,.9)" }}>{item.value}</span>
                <span style={{ fontSize: 8.5, marginTop: 5, color: "rgba(236,239,237,.42)" }}>{item.label}</span>
              </div>
            ))}
            <div style={{ marginLeft: "auto", alignSelf: "end", maxWidth: 92, textAlign: "right", fontSize: 8, lineHeight: 1.45, color: "rgba(236,239,237,.34)" }}>
              {nextConstellation ? `再记 ${nextConstellation.threshold - totalEntries} 次，点亮「${nextConstellation.name}」` : "下一组星星，还没取名字"}
            </div>
          </div>
        </section>
      </div>

      <div className="relative flex items-center" style={{ height: 47, padding: "0 21px" }}>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(248,240,223,.32))" }} />
        <div className="flex items-center" style={{ margin: "0 10px", gap: 7, color: "rgba(249,244,233,.68)", fontSize: 8.5, letterSpacing: .65 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(239,205,135,.8)", boxShadow: "0 0 12px rgba(239,205,135,.72)" }} />
          夜里记下 · 白天继续
        </div>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(248,240,223,.32), transparent)" }} />
      </div>

      <div className="px-4 mb-4">
        <LiquidGlass mode="day" borderRadius={21} intensity="medium" material="liquid">
          <div style={{ padding: "16px 14px 15px", background: "linear-gradient(155deg, rgba(255,252,246,.69), rgba(250,247,241,.42))" }}>
            <div className="flex items-start" style={{ marginBottom: 15 }}>
              <div className="flex items-center gap-1.5">
                <SFSymbol icon={CalendarDays} size={16} color="rgba(65,105,139,0.8)" strokeWidth={1.65} />
                <div>
                  <div style={{ color: "rgba(18,30,41,0.7)", fontSize: "var(--lm-type-section)", fontWeight: 580 }}>近 14 周创作</div>
                  <div style={{ color: "rgba(23,39,52,0.35)", fontSize: "var(--lm-type-caption)", marginTop: 2 }}>白天整理 · 12月—3月</div>
                </div>
              </div>
              <button aria-label="打开创作日历" onClick={() => onNavigate("day-calendar")} className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 10, background: "rgba(255,255,255,0.34)", color: "rgba(45,76,103,0.5)", marginLeft: "auto" }}>
                <SFSymbol icon={ArrowUpRight} size={14} strokeWidth={1.7} />
              </button>
            </div>

            <div className="flex" style={{ gap: 8 }}>
              <div
                className="grid grid-rows-7 shrink-0"
                style={{ width: 28, paddingTop: 18, rowGap: 5, color: "rgba(20,36,48,0.34)", fontSize: 10, lineHeight: "11px" }}
              >
                {["周一", "", "周三", "", "周五", "", ""].map((label, index) => <span key={index} style={{ height: 11, whiteSpace: "nowrap" }}>{label}</span>)}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="grid"
                  style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))", height: 14, marginBottom: 4, color: "rgba(20,36,48,0.38)", fontSize: 10.5, lineHeight: "14px" }}
                >
                  {contributionMonths.map((month) => <span key={month.label} style={{ gridColumn: `${month.column + 1} / span 2`, whiteSpace: "nowrap", paddingLeft: 2 }}>{month.label}</span>)}
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))", rowGap: 5 }}>
                  {contributionWeeks.flatMap((week, weekIndex) => week.map((day, dayIndex) => (
                    <button
                      key={dateKey(day.date)}
                      aria-label={`${day.date.getMonth() + 1}月${day.date.getDate()}日，${day.count ? `${day.count}条灵感` : "没有记录"}`}
                      title={`${day.date.getMonth() + 1}月${day.date.getDate()}日 · ${day.count}条灵感`}
                      onClick={() => onNavigate("day-calendar")}
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 3,
                        background: contributionColors[day.level],
                        boxShadow: day.level > 0 ? `0 1px 4px ${contributionColors[day.level]}` : "inset 0 0 0 1px rgba(68,96,118,0.025)",
                        gridColumn: weekIndex + 1,
                        gridRow: dayIndex + 1,
                        justifySelf: "center",
                        transition: "transform 180ms ease, filter 180ms ease, box-shadow 180ms ease",
                      }}
                    />
                  )))}
                </div>
              </div>
            </div>

            <div className="flex items-center" style={{ marginTop: 15, color: "rgba(20,36,48,0.42)", fontSize: "var(--lm-type-caption)" }}>
              <span>颜色越深，记录越多</span>
              <span style={{ marginLeft: "auto", color: "rgba(48,98,135,0.72)", fontWeight: 560 }}>3月17日 · 5条</span>
            </div>
          </div>
        </LiquidGlass>
      </div>

      <div className="px-4">
        <div className="px-1 mb-2" style={{ color: "rgba(0,0,0,0.46)", fontSize: "var(--lm-type-section)", fontWeight: 550 }}>偏好与信任</div>
        <LiquidGlass mode="day" borderRadius={18} intensity="soft" material="liquid">
          <div>
            {settings.map((item, index) => (
              <button
                key={item.label}
                onClick={() => onOpenSetting(item.id as SettingId)}
                className="w-full flex items-center gap-3 text-left"
                style={{
                  padding: "14px 16px",
                  borderBottom: index < settings.length - 1 ? "1px solid rgba(0,0,0,0.045)" : "none",
                }}
              >
                <div className="flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: 8, background: `${item.color}14` }}>
                  <SFSymbol icon={item.icon} size={15} color={item.color} strokeWidth={1.65} />
                </div>
                <div className="flex-1" style={{ color: "rgba(0,0,0,0.7)", fontSize: "var(--lm-type-body)", fontWeight: 530 }}>{item.label}</div>
                <div className="text-right" style={{ color: "rgba(0,0,0,0.34)", fontSize: 10, whiteSpace: "nowrap" }}>{item.sublabel}</div>
                <span style={{ color: "rgba(0,0,0,0.22)", fontSize: 18, lineHeight: 1 }}>›</span>
              </button>
            ))}
          </div>
        </LiquidGlass>
        <div style={{ height: 8 }} />
      </div>
      </div>

      <FloatingTabBar current="profile" onNavigate={onNavigate} mode="day" />
    </div>
  );
}
