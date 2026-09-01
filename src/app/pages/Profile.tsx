import { useState } from "react";
import { ArrowUpRight, Bell, CalendarDays, CloudUpload, FileDown, Moon, Palette, Pencil, ShieldCheck, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { FloatingTabBar } from "../components/FloatingTabBar";
import { LiquidGlass } from "../components/LiquidGlass";
import { SFSymbol } from "../components/SFSymbol";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai" | "day-calendar";

interface ProfileProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { label: "灵感记录", value: "128" },
  { label: "创作夜晚", value: "23" },
  { label: "灵感回声", value: "18" },
];

const settings = [
  { icon: SlidersHorizontal, color: "#718E78", label: "捕捉偏好", sublabel: "文字优先 · 自动保存" },
  { icon: Bell, color: "#D49A37", label: "温和提醒", sublabel: "每天 22:30" },
  { icon: Sparkles, color: "#8B739E", label: "日报与洞察", sublabel: "每日生成 · 两周回顾" },
  { icon: Palette, color: "#A77ABB", label: "外观与字体", sublabel: "跟随昼夜变化" },
  { icon: ShieldCheck, color: "#638EB1", label: "AI 与隐私", sublabel: "授权范围可控" },
  { icon: CloudUpload, color: "#70A0A8", label: "云端同步", sublabel: "已同步" },
  { icon: FileDown, color: "#A57D4E", label: "导出与备份", sublabel: "Markdown · 图片" },
];

const contributionCounts: Record<string, number> = {
  "2025-12-18": 1, "2025-12-23": 2, "2025-12-29": 1,
  "2026-01-03": 1, "2026-01-08": 2, "2026-01-14": 3, "2026-01-22": 1, "2026-01-30": 2,
  "2026-02-04": 1, "2026-02-09": 2, "2026-02-14": 1, "2026-02-18": 3, "2026-02-22": 1, "2026-02-27": 2,
  "2026-03-03": 2, "2026-03-05": 1, "2026-03-07": 2, "2026-03-10": 1, "2026-03-11": 2, "2026-03-14": 3, "2026-03-15": 1, "2026-03-16": 1, "2026-03-17": 4,
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

export function Profile({ onNavigate }: ProfileProps) {
  const [editing, setEditing] = useState(false);
  const [profileName, setProfileName] = useState("灵沐");
  const [profileBio, setProfileBio] = useState("创意记录者");

  return (
    <div
      className="lm-day-page relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "var(--lm-day-bg)" }}
    >
      <div aria-hidden="true" style={{ height: 54, flexShrink: 0 }} />

      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
      <div className="flex items-center gap-3 px-5 pt-3 pb-7">
        <div
          className="flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(133,112,142,0.2)",
            boxShadow: "0 4px 18px rgba(89,89,130,0.1)",
            flexShrink: 0,
          }}
        >
          <SFSymbol icon={Moon} size={22} color="rgba(255,220,100,0.95)" strokeWidth={1.55} fill="rgba(255,220,100,0.9)" />
        </div>
        <div className="min-w-0">
          <div style={{ color: "var(--lm-day-ink)", fontSize: 18, fontWeight: 500 }}>{profileName}</div>
          <div className="truncate" style={{ color: "rgba(0,0,0,0.4)", fontSize: 12, marginTop: 3 }}>LingMu · {profileBio}</div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 shrink-0"
          style={{ marginLeft: "auto", height: 32, padding: "0 11px", borderRadius: 15, color: "rgba(66,83,96,.68)", background: "rgba(255,255,255,.46)", border: "1px solid rgba(91,80,66,.09)", boxShadow: "inset 0 1px rgba(255,255,255,.58)", fontSize: 10.5 }}
        >
          <SFSymbol icon={Pencil} size={11} strokeWidth={1.65} />
          编辑资料
        </button>
      </div>

      <div className="px-4 mb-4">
        <LiquidGlass mode="day" borderRadius={21} intensity="medium" material="liquid">
          <div className="flex justify-around" style={{ padding: "18px 0 17px" }}>
            {stats.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span style={{ color: "rgba(18,28,38,0.82)", fontSize: "var(--lm-type-display)", fontWeight: 620 }}>{item.value}</span>
                <span style={{ color: "rgba(22,35,46,0.42)", fontSize: "var(--lm-type-caption)", marginTop: 2 }}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: "rgba(0,0,0,0.045)", margin: "0 14px" }} />
          <div style={{ padding: "16px 14px 15px" }}>
            <div className="flex items-start" style={{ marginBottom: 15 }}>
              <div className="flex items-center gap-1.5">
                <SFSymbol icon={CalendarDays} size={16} color="rgba(65,105,139,0.8)" strokeWidth={1.65} />
                <div>
                  <div style={{ color: "rgba(18,30,41,0.7)", fontSize: "var(--lm-type-section)", fontWeight: 580 }}>近 14 周创作</div>
                  <div style={{ color: "rgba(23,39,52,0.35)", fontSize: "var(--lm-type-caption)", marginTop: 2 }}>12月—3月</div>
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
              <span style={{ marginLeft: "auto", color: "rgba(48,98,135,0.72)", fontWeight: 560 }}>3月17日 · 4条</span>
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

      {editing && (
        <div className="absolute inset-0 flex items-end" style={{ zIndex: 130, padding: "0 14px 25px", background: "rgba(46,43,40,.22)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
          <LiquidGlass mode="day" borderRadius={22} intensity="medium" material="liquid" className="w-full">
            <div style={{ padding: "17px 17px 16px" }}>
              <div className="flex items-center justify-between">
                <div><div style={{ color: "rgba(0,0,0,.74)", fontSize: 16, fontWeight: 570 }}>编辑资料</div><div style={{ color: "rgba(0,0,0,.34)", fontSize: 10.5, marginTop: 2 }}>让灵沐更像你的创作空间</div></div>
                <button aria-label="关闭编辑资料" onClick={() => setEditing(false)} className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: "50%", color: "rgba(0,0,0,.36)", background: "rgba(255,255,255,.5)" }}><SFSymbol icon={X} size={14} strokeWidth={1.7} /></button>
              </div>
              <label style={{ display: "block", color: "rgba(0,0,0,.42)", fontSize: 10.5, marginTop: 16 }}>显示名称</label>
              <input value={profileName} onChange={(event) => setProfileName(event.target.value)} style={{ width: "100%", height: 38, marginTop: 6, padding: "0 11px", borderRadius: 11, border: "1px solid rgba(91,80,66,.08)", background: "rgba(255,255,255,.5)", color: "rgba(0,0,0,.7)", fontSize: 13 }} />
              <label style={{ display: "block", color: "rgba(0,0,0,.42)", fontSize: 10.5, marginTop: 11 }}>一句介绍</label>
              <input value={profileBio} onChange={(event) => setProfileBio(event.target.value)} style={{ width: "100%", height: 38, marginTop: 6, padding: "0 11px", borderRadius: 11, border: "1px solid rgba(91,80,66,.08)", background: "rgba(255,255,255,.5)", color: "rgba(0,0,0,.7)", fontSize: 13 }} />
              <button onClick={() => setEditing(false)} className="w-full" style={{ height: 40, marginTop: 15, borderRadius: 13, color: "white", background: "linear-gradient(135deg, #6D8798, #86758F)", fontSize: 12.5, fontWeight: 570 }}>保存资料</button>
            </div>
          </LiquidGlass>
        </div>
      )}

      <FloatingTabBar current="profile" onNavigate={onNavigate} mode="day" />
    </div>
  );
}
