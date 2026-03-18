import { useState } from "react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { LiquidGlass } from "../components/LiquidGlass";
import { HomeIndicator } from "../components/HomeIndicator";

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
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #faf8f5 0%, #f4f2ef 100%)" }}
    >
      <IOSStatusBar mode="day" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2 shrink-0">
        <button
          onClick={() => onNavigate("day-dashboard")}
          className="flex items-center gap-1 transition-opacity hover:opacity-70"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ color: "rgba(0,0,0,0.6)", fontSize: 15 }}>返回</span>
        </button>
        <span style={{ color: "rgba(0,0,0,0.82)", fontSize: 17, fontWeight: 500 }}>灵感日历</span>
        <div style={{ width: 50 }} />
      </div>

      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        {/* Calendar */}
        <div className="px-4 mb-3">
          <LiquidGlass mode="day" borderRadius={20} intensity="medium">
            <div style={{ padding: "14px 16px 10px" }}>
              <div className="flex items-center justify-between mb-3">
                <button>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div style={{ color: "rgba(0,0,0,0.8)", fontSize: 15, fontWeight: 500 }}>2026年 3月</div>
                <button>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center py-1">
                    <span style={{ color: "rgba(0,0,0,0.3)", fontSize: 11 }}>{d}</span>
                  </div>
                ))}
              </div>
              {CALENDAR_DAYS.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                  {week.map((day, di) => {
                    const hasRecord = day !== null && RECORD_DAYS.has(day);
                    const isSelected = day === selectedDay;
                    const isToday = day === 17;
                    return (
                      <div key={di} className="flex flex-col items-center justify-center py-0.5">
                        {day !== null && (
                          <>
                            <button
                              onClick={() => setSelectedDay(day)}
                              style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: isSelected ? "rgba(0,0,0,0.82)" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                border: !isSelected && isToday ? "1.5px solid rgba(0,0,0,0.2)" : "none",
                                transition: "all 0.2s",
                              }}
                            >
                              <span style={{ color: isSelected ? "white" : "rgba(0,0,0,0.7)", fontSize: 13, fontWeight: isSelected ? 600 : 400 }}>
                                {day}
                              </span>
                            </button>
                            {hasRecord && (
                              <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSelected ? "rgba(100,160,220,0.9)" : "rgba(200,160,80,0.6)", marginTop: 1 }} />
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </LiquidGlass>
        </div>

        {/* Screen Time Style Bar Chart */}
        <div className="px-4 mb-3">
          <LiquidGlass mode="day" borderRadius={18} intensity="soft">
            <div style={{ padding: "16px 16px 12px" }}>
              {/* Title + total */}
              <div className="flex items-center justify-between mb-1">
                <span style={{ color: "rgba(0,0,0,0.7)", fontSize: 14, fontWeight: 500 }}>思维活跃度</span>
                <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 12 }}>3月{selectedDay}日</span>
              </div>
              <div style={{ color: "rgba(0,0,0,0.82)", fontSize: 26, fontWeight: 600, marginBottom: 12 }}>
                {records.length > 0 ? `${records.length} 条灵感` : "暂无记录"}
              </div>

              {/* Bar chart area */}
              <div style={{ position: "relative", height: 140, marginBottom: 4 }}>
                {/* Y-axis grid lines & labels */}
                {[0, Math.ceil(chartMax / 2), chartMax].map((val, i) => (
                  <div key={i} style={{ position: "absolute", left: 0, right: 28, bottom: `${(val / chartMax) * 100}%`, display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.06)", borderStyle: i === 0 ? "solid" : "dashed", borderWidth: i === 0 ? "0 0 1px 0" : 0, borderColor: "rgba(0,0,0,0.06)" }}>
                      {i > 0 && <div style={{ width: "100%", height: 0, borderTop: "1px dashed rgba(0,0,0,0.08)" }} />}
                    </div>
                    <span style={{ color: "rgba(0,0,0,0.25)", fontSize: 10, width: 24, textAlign: "right", marginLeft: 4 }}>{val}</span>
                  </div>
                ))}

                {/* Bars */}
                <div className="flex items-end justify-around" style={{ position: "absolute", bottom: 0, left: 0, right: 28, top: 0 }}>
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
                              width: 24,
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
                          <div style={{ width: 24, height: 0 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* X-axis hour labels */}
              <div className="flex justify-around" style={{ paddingRight: 28 }}>
                {CHART_HOURS.map((h) => (
                  <div key={h} style={{ flex: 1, textAlign: "center" }}>
                    <span style={{ color: "rgba(0,0,0,0.3)", fontSize: 10 }}>
                      {h === 0 ? "0时" : `${h}时`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "12px 0" }} />

              {/* Category legend — Apple Screen Time style */}
              <div className="flex justify-around">
                {MOOD_CATEGORIES.map((cat) => (
                  <div key={cat.key} className="flex flex-col items-center">
                    <span style={{ color: cat.color, fontSize: 13, fontWeight: 600 }}>{cat.label}</span>
                    <span style={{ color: "rgba(0,0,0,0.45)", fontSize: 12, marginTop: 2 }}>
                      {categoryCounts[cat.key] || 0} 条
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </LiquidGlass>
        </div>

        {/* Records for selected day */}
        <div className="px-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: "rgba(0,0,0,0.55)", fontSize: 13, fontWeight: 500 }}>
              3月{selectedDay}日的灵感
            </span>
            <span style={{ color: "rgba(100,140,200,0.8)", fontSize: 12 }}>
              {records.length}条
            </span>
          </div>

          {records.length === 0 ? (
            <LiquidGlass mode="day" borderRadius={16} intensity="soft">
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 8, opacity: 0.3 }}>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" fill="none" />
                </svg>
                <span style={{ color: "rgba(0,0,0,0.25)", fontSize: 13 }}>这天还没有灵感记录</span>
                <span style={{ color: "rgba(0,0,0,0.18)", fontSize: 11, marginTop: 4 }}>夜间模式下捕捉你的灵感吧</span>
              </div>
            </LiquidGlass>
          ) : (
            records.map((record, i) => (
              <div key={i} className="mb-2">
                <LiquidGlass mode="day" borderRadius={16} intensity="soft">
                  <div className="flex items-center gap-3 py-3 px-4">
                    <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
                      <span style={{ color: "rgba(0,0,0,0.6)", fontSize: 13, fontWeight: 500 }}>{record.time.split(":")[0]}</span>
                      <span style={{ color: "rgba(0,0,0,0.3)", fontSize: 10 }}>:{record.time.split(":")[1]}</span>
                    </div>
                    <div style={{ width: 1.5, height: 32, borderRadius: 1, background: MOOD_COLORS[record.mood] || "rgba(100,160,220,0.5)" }} />
                    <div className="flex-1 min-w-0">
                      <div style={{ color: "rgba(0,0,0,0.75)", fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {record.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: 10, padding: "1px 8px", borderRadius: 10,
                            background: `${MOOD_COLORS[record.mood]?.replace("0.8", "0.12") || "rgba(100,160,220,0.12)"}`,
                            color: MOOD_COLORS[record.mood] || "rgba(100,160,220,0.8)",
                          }}
                        >
                          {record.mood}
                        </span>
                        <span style={{ color: "rgba(0,0,0,0.3)", fontSize: 10 }}>{record.type}</span>
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

        {/* Monthly summary */}
        <div className="px-4 mb-3">
          <LiquidGlass mode="day" borderRadius={18} intensity="soft">
            <div style={{ padding: "14px 16px" }}>
              <span style={{ color: "rgba(0,0,0,0.55)", fontSize: 13, fontWeight: 500 }}>3月概览</span>
              <div className="flex justify-between mt-3">
                <div className="flex flex-col items-center">
                  <span style={{ color: "rgba(0,0,0,0.75)", fontSize: 22, fontWeight: 600 }}>11</span>
                  <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 10, marginTop: 2 }}>活跃天数</span>
                </div>
                <div className="flex flex-col items-center">
                  <span style={{ color: "rgba(0,0,0,0.75)", fontSize: 22, fontWeight: 600 }}>22</span>
                  <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 10, marginTop: 2 }}>灵感总数</span>
                </div>
                <div className="flex flex-col items-center">
                  <span style={{ color: "rgba(0,0,0,0.75)", fontSize: 22, fontWeight: 600 }}>沉思</span>
                  <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 10, marginTop: 2 }}>主要情绪</span>
                </div>
                <div className="flex flex-col items-center">
                  <span style={{ color: "rgba(0,0,0,0.75)", fontSize: 22, fontWeight: 600 }}>22h</span>
                  <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 10, marginTop: 2 }}>高峰时段</span>
                </div>
              </div>
            </div>
          </LiquidGlass>
        </div>

        <div className="h-4" />
      </div>

      <HomeIndicator mode="day" />
    </div>
  );
}
