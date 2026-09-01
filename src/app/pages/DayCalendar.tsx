import { useState } from "react";
import { LiquidGlass } from "../components/LiquidGlass";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai" | "day-calendar";

interface DayCalendarProps {
  onNavigate: (page: Page) => void;
}

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

const CALENDAR_DAYS = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, 31, null, null, null, null, null],
];

const RECORD_DAYS = new Set([3, 5, 7, 10, 11, 14, 15, 17, 20, 22, 25]);

const RECORDS_DB: Record<number, { time: string; title: string; type: string; mood: string }[]> = {
  3: [{ time: "22:30", title: "雨天的咖啡香味", type: "文字", mood: "平静" }],
  5: [{ time: "23:10", title: "街角的霓虹灯光", type: "图片", mood: "好奇" }],
  7: [
    { time: "21:45", title: "老唱片里的旋律", type: "文字", mood: "怀念" },
    { time: "23:20", title: "窗外的月色", type: "文字", mood: "平静" },
  ],
  10: [{ time: "20:10", title: "植物园的光影", type: "图片", mood: "愉悦" }],
  11: [
    { time: "22:50", title: "深夜电台的独白", type: "文字", mood: "感伤" },
    { time: "23:40", title: "星空下的思考", type: "文字", mood: "沉思" },
  ],
  14: [
    { time: "19:30", title: "日落时分的海面", type: "图片", mood: "感动" },
    { time: "21:15", title: "关于时间的碎片", type: "文字", mood: "沉思" },
    { time: "23:55", title: "夜风的温度", type: "文字", mood: "平静" },
  ],
  15: [{ time: "22:00", title: "城市天际线", type: "图片", mood: "震撼" }],
  17: [
    { time: "21:30", title: "夜空下的宁静", type: "图片", mood: "平静" },
    { time: "22:15", title: "光与影的交错", type: "图片", mood: "好奇" },
    { time: "23:42", title: "城市的呼吸节奏", type: "文字", mood: "沉思" },
    { time: "23:58", title: "深夜灵感闪现", type: "文字", mood: "兴奋" },
  ],
  20: [
    { time: "20:45", title: "雾中的路灯", type: "图片", mood: "神秘" },
    { time: "22:30", title: "旧书页的味道", type: "文字", mood: "怀念" },
  ],
  22: [{ time: "21:00", title: "春分时节的风", type: "文字", mood: "愉悦" }],
  25: [
    { time: "23:15", title: "关于梦境的笔记", type: "文字", mood: "沉思" },
    { time: "23:50", title: "凌晨前的宁静", type: "文字", mood: "平静" },
  ],
};

// Mood categories with Apple-style colors
const MOOD_CATEGORIES = [
  { key: "感性", moods: ["平静", "感伤", "感动", "怀念"], color: "#34AADC", label: "感性" },
  { key: "理性", moods: ["沉思", "好奇"], color: "#FF9500", label: "理性" },
  { key: "能量", moods: ["兴奋", "愉悦", "震撼", "神秘"], color: "#4CD964", label: "能量" },
];

function getMoodCategory(mood: string): string {
  for (const cat of MOOD_CATEGORIES) {
    if (cat.moods.includes(mood)) return cat.key;
  }
  return "感性";
}

function getCategoryColor(catKey: string): string {
  return MOOD_CATEGORIES.find((c) => c.key === catKey)?.color || "#34AADC";
}

// Build hourly bar data for a given day's records
const CHART_HOURS = [19, 20, 21, 22, 23, 0];

function buildBarData(records: { time: string; mood: string }[]) {
  // Each bar represents an hour slot, with stacked segments per mood category
  return CHART_HOURS.map((hour) => {
    const hourRecords = records.filter((r) => {
      const h = parseInt(r.time.split(":")[0]);
      return h === hour;
    });
    const segments: Record<string, number> = {};
    for (const r of hourRecords) {
      const cat = getMoodCategory(r.mood);
      segments[cat] = (segments[cat] || 0) + 1;
    }
    return { hour, segments, total: hourRecords.length };
  });
}

const MOOD_COLORS: Record<string, string> = {
  "平静": "rgba(120,180,220,0.8)",
  "好奇": "rgba(180,140,220,0.8)",
  "怀念": "rgba(200,170,120,0.8)",
  "愉悦": "rgba(140,200,150,0.8)",
  "感伤": "rgba(160,140,200,0.8)",
  "沉思": "rgba(100,150,200,0.8)",
  "感动": "rgba(220,140,160,0.8)",
  "震撼": "rgba(200,120,100,0.8)",
  "神秘": "rgba(140,130,200,0.8)",
  "兴奋": "rgba(220,180,80,0.8)",
};

export function DayCalendar({ onNavigate }: DayCalendarProps) {
  const [selectedDay, setSelectedDay] = useState(17);
  const records = RECORDS_DB[selectedDay] || [];
  const barData = buildBarData(records);
  const maxTotal = Math.max(...barData.map((b) => b.total), 1);
  const chartMax = Math.max(maxTotal + 1, 4); // at least 4 for visual

  // Count categories for legend
  const categoryCounts: Record<string, number> = {};
  for (const r of records) {
    const cat = getMoodCategory(r.mood);
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  return (
    <div
      className="lm-day-page relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "var(--lm-day-bg)" }}
    >
      {/* Persistent iOS status bar is rendered by the app shell. */}
      <div aria-hidden="true" style={{ height: 54, flexShrink: 0 }} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2 shrink-0">
        <button
          aria-label="返回我的创作"
          onClick={() => onNavigate("profile")}
          className="transition-opacity hover:opacity-70"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span style={{ color: "var(--lm-day-ink)", fontSize: 17, fontWeight: 500 }}>创作日历</span>
        <div style={{ width: 22 }} />
      </div>

      <div className="flex-1 overflow-y-auto pt-2.5" style={{ minHeight: 0 }}>
        {/* Compact month calendar + monthly overview */}
        <div className="px-4 mb-3.5">
          <LiquidGlass mode="day" borderRadius={20} intensity="medium" material="liquid">
            <div className="grid" style={{ padding: "13px 14px", gap: 14, gridTemplateColumns: "1.58fr 1fr" }}>
              <div className="min-w-0">
                <div className="flex items-center justify-between" style={{ height: 22, marginBottom: 5 }}>
                  <button aria-label="上个月" style={{ color: "rgba(0,0,0,0.34)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
                  <div style={{ color: "var(--lm-day-blue)", fontSize: 15, fontWeight: 550 }}>2026年 3月</div>
                  <button aria-label="下个月" style={{ color: "rgba(0,0,0,0.34)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
                </div>
                <div className="grid grid-cols-7" style={{ height: 18, marginBottom: 2 }}>
                  {WEEKDAYS.map((day) => <div key={day} className="flex items-center justify-center"><span style={{ color: "rgba(72,76,75,0.38)", fontSize: 10 }}>{day}</span></div>)}
                </div>
                {CALENDAR_DAYS.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7">
                    {week.map((day, dayIndex) => {
                      const hasRecord = day !== null && RECORD_DAYS.has(day);
                      const isSelected = day === selectedDay;
                      const isToday = day === 17;
                      return (
                        <div key={dayIndex} className="flex flex-col items-center justify-center" style={{ height: 21 }}>
                          {day !== null && (
                            <button
                              onClick={() => setSelectedDay(day)}
                              style={{ width: 20, height: 20, borderRadius: "50%", background: isSelected ? "rgba(29,35,41,0.86)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", border: !isSelected && isToday ? "1px solid rgba(0,0,0,0.18)" : "none", position: "relative" }}
                            >
                              <span style={{ color: isSelected ? "white" : "rgba(0,0,0,0.68)", fontSize: "var(--lm-type-caption)", fontWeight: isSelected ? 600 : 400 }}>{day}</span>
                              {hasRecord && <span style={{ position: "absolute", width: 2.5, height: 2.5, borderRadius: "50%", background: isSelected ? "rgba(150,198,228,0.95)" : "rgba(184,149,80,0.66)", bottom: 1 }} />}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div style={{ borderLeft: "1px solid rgba(91,80,66,0.09)", paddingLeft: 13 }}>
                <div style={{ color: "var(--lm-day-plum)", fontSize: 13, fontWeight: 550, marginBottom: 9 }}>3月概览</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
                  {[
                    { value: "11", label: "活跃天", color: "#597687" },
                    { value: "22", label: "灵感", color: "#B1843F" },
                    { value: "沉思", label: "主要情绪", color: "#85708E" },
                    { value: "22h", label: "高峰", color: "#6F8D79" },
                  ].map((item) => (
                    <div key={item.label} style={{ minWidth: 0 }}>
                      <div className="flex items-end" style={{ height: 24, color: item.color, fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{item.value}</div>
                      <div style={{ color: "rgba(55,58,57,0.38)", fontSize: 10, lineHeight: 1.2, marginTop: 5, whiteSpace: "nowrap" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 9, paddingTop: 7, borderTop: "1px solid rgba(91,80,66,0.07)", color: "rgba(89,118,135,0.58)", fontSize: 10 }}>夜间最活跃</div>
              </div>
            </div>
          </LiquidGlass>
        </div>

        {/* Screen Time Style Bar Chart */}
        <div className="px-4 mb-3.5">
          <LiquidGlass mode="day" borderRadius={18} intensity="soft" material="liquid">
            <div style={{ padding: "15px 16px 13px" }}>
              {/* Title + total */}
              <div className="flex items-start justify-between mb-3">
                <div><div style={{ color: "var(--lm-day-blue)", fontSize: 14, fontWeight: 550 }}>思维活跃度</div><div style={{ color: "rgba(55,58,57,0.36)", fontSize: 11, marginTop: 3 }}>3月{selectedDay}日 · 19:00—00:00</div></div>
                <div className="flex items-baseline gap-1" style={{ color: "var(--lm-day-gold)" }}>
                  <span style={{ fontSize: 24, fontWeight: 620, lineHeight: 1 }}>{records.length}</span>
                  <span style={{ fontSize: 11, fontWeight: 500 }}>条记录</span>
                </div>
              </div>

              {/* Bar chart area */}
              <div style={{ position: "relative", height: 82, marginBottom: 2 }}>
                {/* Y-axis grid lines & labels */}
                {[0, Math.ceil(chartMax / 2), chartMax].map((val, i) => (
                  <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: `${(val / chartMax) * 100}%`, display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.06)", borderStyle: i === 0 ? "solid" : "dashed", borderWidth: i === 0 ? "0 0 1px 0" : 0, borderColor: "rgba(0,0,0,0.06)" }}>
                      {i > 0 && <div style={{ width: "100%", height: 0, borderTop: "1px dashed rgba(0,0,0,0.08)" }} />}
                    </div>
                  </div>
                ))}

                {/* Bars */}
                <div className="flex items-end justify-around" style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 0 }}>
                  {barData.map((bar, bi) => {
                    const barHeight = bar.total > 0 ? (bar.total / chartMax) * 100 : 0;
                    // Build stacked segments
                    const segments: { cat: string; count: number }[] = [];
                    for (const cat of MOOD_CATEGORIES) {
                      if (bar.segments[cat.key]) {
                        segments.push({ cat: cat.key, count: bar.segments[cat.key] });
                      }
                    }
                    return (
                      <div key={bi} className="flex flex-col items-center" style={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
                        {bar.total > 0 ? (
                          <div
                            style={{
                              width: 20,
                              height: `${barHeight}%`,
                              borderRadius: 4,
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              transition: "height 0.4s ease",
                              minHeight: 6,
                            }}
                          >
                            {segments.map((seg, si) => (
                              <div
                                key={si}
                                style={{
                                  flex: seg.count,
                                  background: getCategoryColor(seg.cat),
                                  borderBottom: si < segments.length - 1 ? "1px solid rgba(255,255,255,0.3)" : "none",
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div style={{ width: 20, height: 0 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* X-axis hour labels */}
              <div className="flex justify-around">
                {CHART_HOURS.map((h) => (
                  <div key={h} style={{ flex: 1, textAlign: "center" }}>
                    <span style={{ color: "rgba(55,58,57,0.34)", fontSize: 10 }}>
                      {h === 0 ? "0时" : `${h}时`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "8px 0 7px" }} />

              {/* Category legend — Apple Screen Time style */}
              <div className="flex justify-around">
                {MOOD_CATEGORIES.map((cat) => (
                  <div key={cat.key} className="flex items-center gap-1.5">
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color }} />
                    <span style={{ color: cat.color, fontSize: 11, fontWeight: 500 }}>{cat.label} {categoryCounts[cat.key] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </LiquidGlass>
        </div>

        {/* Records for selected day */}
        <div className="px-4 mb-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span style={{ color: "var(--lm-day-plum)", fontSize: 14, fontWeight: 550 }}>
              3月{selectedDay}日的灵感
            </span>
            <span style={{ color: "rgba(100,140,200,0.8)", fontSize: "var(--lm-type-support)" }}>
              {records.length}条
            </span>
          </div>

          {records.length === 0 ? (
            <LiquidGlass mode="day" borderRadius={16} intensity="soft">
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 8, opacity: 0.3 }}>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" fill="none" />
                </svg>
                <span style={{ color: "rgba(0,0,0,0.25)", fontSize: "var(--lm-type-body)" }}>这天还没有灵感记录</span>
                <span style={{ color: "rgba(0,0,0,0.18)", fontSize: "var(--lm-type-support)", marginTop: 5 }}>夜间模式下捕捉你的灵感吧</span>
              </div>
            </LiquidGlass>
          ) : (
            records.map((record, i) => (
              <div key={i} className="mb-2">
                <LiquidGlass mode="day" borderRadius={16} intensity="soft" material="liquid">
                  <div className="flex items-center gap-3" style={{ padding: "11px 13px" }}>
                    <div className="flex items-center shrink-0" style={{ width: 37 }}>
                      <span style={{ color: "rgba(0,0,0,0.52)", fontSize: "var(--lm-type-support)", fontWeight: 500 }}>{record.time}</span>
                    </div>
                    <div style={{ width: 2, height: 27, borderRadius: 1, background: MOOD_COLORS[record.mood] || "rgba(100,160,220,0.5)" }} />
                    <div className="flex-1 min-w-0">
                      <div style={{ color: "rgba(0,0,0,0.72)", fontSize: "var(--lm-type-body)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {record.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: "var(--lm-type-caption)", padding: "2px 7px", borderRadius: 9,
                            background: `${MOOD_COLORS[record.mood]?.replace("0.8", "0.12") || "rgba(100,160,220,0.12)"}`,
                            color: MOOD_COLORS[record.mood] || "rgba(100,160,220,0.8)",
                          }}
                        >
                          {record.mood}
                        </span>
                        <span style={{ color: "rgba(0,0,0,0.3)", fontSize: "var(--lm-type-caption)" }}>{record.type}</span>
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </LiquidGlass>
              </div>
            ))
          )}
        </div>

        <div className="h-4" />
      </div>

      <div aria-hidden="true" style={{ height: 23 }} />
    </div>
  );
}
