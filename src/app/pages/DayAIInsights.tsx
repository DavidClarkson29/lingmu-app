import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Compass, Sparkles } from "lucide-react";
import { LiquidGlass } from "../components/LiquidGlass";
import { SFSymbol } from "../components/SFSymbol";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface DayAIInsightsProps {
  onNavigate: (page: Page) => void;
  initialTagId?: string;
}

const tagInsights = [
  {
    id: "emotion", label: "情绪", count: 4, percent: 33, color: "#8D739E", start: 0, end: 116,
    language: "你让情绪住进空间，而不是直接说出它。",
    summary: "平静与沉思反复出现，但它们很少被直接命名。你更常借空房间、街道与微弱声响，让情绪自己浮现。",
    direction: "把一种情绪设计成一间可步入的房间",
  },
  {
    id: "color", label: "色彩", count: 3, percent: 25, color: "#607F9D", start: 120, end: 206,
    language: "冷蓝是现在，暖色更接近记忆。",
    summary: "低饱和蓝灰与克制的暖色，正在形成稳定的视觉语法；它们不只是配色，也在区分时间与记忆。",
    direction: "让同一段记忆在冷暖两种光里发生",
  },
  {
    id: "music", label: "声音", count: 2, percent: 17, color: "#708D79", start: 210, end: 266,
    language: "你在听见空间里最慢的呼吸。",
    summary: "声音仍是隐约的线索，却总与城市间隙和无人场景相连。它可能成为连接静态画面与时间感的暗线。",
    direction: "收集一组只有远近变化的环境声音",
  },
  {
    id: "space", label: "空间", count: 2, percent: 17, color: "#A17A43", start: 270, end: 326,
    language: "空间是你保存人的另一种方式。",
    summary: "门、窗、街角和没有完整墙面的房间，共同指向一个母题：不画人物，也能通过痕迹感到人的存在。",
    direction: "用五个生活痕迹讲述一个未出现的人",
  },
  {
    id: "light", label: "光影", count: 1, percent: 8, color: "#A96F69", start: 330, end: 356,
    language: "光不是照明，而是情绪的温度计。",
    summary: "样本不多，但关联非常集中：窗边的冷暖分界、雨后的反光，都在改变空间被感知的情绪。",
    direction: "记录一束光从进入到消失的完整过程",
  },
] as const;

const possibilitySeeds = [
  { index: "壹", title: "把静态空间变成时间", copy: "沿着光线、回声与呼吸的变化，做一组 15 秒的无人物短片。" },
  { index: "贰", title: "建立你的情绪色谱", copy: "为平静、怀念、好奇各留一组冷暖颜色，让它们成为创作索引。" },
  { index: "叁", title: "从缺席的人开始叙事", copy: "只拍门缝、余温与被移动过的物件，让观者补全人物。" },
] as const;

export function DayAIInsights({ onNavigate, initialTagId }: DayAIInsightsProps) {
  const [selectedId, setSelectedId] = useState<(typeof tagInsights)[number]["id"]>(() => {
    const matchedTag = tagInsights.find((tag) => tag.id === initialTagId);
    return matchedTag?.id ?? "emotion";
  });
  const [expanded, setExpanded] = useState(false);
  const selected = tagInsights.find((tag) => tag.id === selectedId) ?? tagInsights[0];
  const chartGradient = `conic-gradient(${tagInsights.map((tag) => {
    const color = tag.id === selected.id ? tag.color : "rgba(77,72,67,.105)";
    return `${color} ${tag.start}deg ${tag.end}deg, transparent ${tag.end}deg ${tag.end + 4}deg`;
  }).join(", ")})`;

  return (
    <div className="lm-day-page relative w-full h-full overflow-hidden flex flex-col" style={{ background: "var(--lm-day-bg)" }}>
      <div aria-hidden="true" style={{ height: 54, flexShrink: 0 }} />

      <div className="flex items-center justify-between px-5 py-2 shrink-0">
        <button aria-label="返回白天回看" onClick={() => onNavigate("day-dashboard")} style={{ color: "rgba(0,0,0,0.46)" }}>
          <SFSymbol icon={ArrowLeft} size={20} strokeWidth={1.65} />
        </button>
        <div className="flex flex-col items-center">
          <span style={{ color: "var(--lm-day-ink)", fontSize: 17, fontWeight: 500 }}>阶段洞察</span>
          <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 11 }}>过去 14 天 · 12 条灵感</span>
        </div>
        <div style={{ width: 20 }} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4" style={{ minHeight: 0 }}>
        <LiquidGlass mode="day" borderRadius={22} intensity="medium" material="liquid">
          <section style={{ padding: "18px 16px 15px" }}>
            <div className="flex items-center gap-1.5">
              <SFSymbol icon={Sparkles} size={14} color="var(--lm-day-plum)" strokeWidth={1.65} />
              <span style={{ color: "rgba(0,0,0,0.66)", fontSize: 13.5, fontWeight: 560 }}>你的灵感成分</span>
              <span style={{ color: "rgba(0,0,0,0.28)", fontSize: 9.5, marginLeft: "auto" }}>轻触下方 Tag · 内容联动</span>
            </div>

            <div className="grid items-center" style={{ gridTemplateColumns: "124px 1fr", gap: 18, marginTop: 18 }}>
              <div className="relative" style={{ width: 118, height: 118 }}>
                <div
                  role="img"
                  aria-label="情绪 33%，色彩 25%，声音 17%，空间 17%，光影 8%"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: chartGradient,
                    filter: `drop-shadow(0 8px 13px ${selected.color}1A)`,
                    transition: "background 240ms ease, filter 240ms ease",
                  }}
                />
                <div className="absolute rounded-full flex flex-col items-center justify-center" style={{ inset: 23, background: "rgba(249,247,242,.95)", boxShadow: "inset 0 0 0 1px rgba(84,73,61,.04)" }}>
                  <span className="flex items-baseline" style={{ color: selected.color, lineHeight: 1, whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 22, fontWeight: 620 }}>{selected.percent}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, marginLeft: 1 }}>%</span>
                  </span>
                  <span style={{ color: "rgba(0,0,0,.34)", fontSize: 9, marginTop: 4 }}>{selected.label}</span>
                </div>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ color: selected.color, fontSize: 9, letterSpacing: 1.4, transition: "color 180ms ease" }}>本期创意语言</div>
                <p style={{ color: "#3D3935", fontFamily: '"Songti SC", "STSong", serif', fontSize: 18.5, lineHeight: 1.58, fontWeight: 600, marginTop: 9 }}>
                  “{selected.language}”
                </p>
                <div style={{ width: 25, height: 1, background: selected.color, marginTop: 11, opacity: .55 }} />
              </div>
            </div>

            <div className="flex flex-wrap" style={{ gap: 6, marginTop: 17 }}>
              {tagInsights.map((tag) => {
                const active = tag.id === selected.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => { setSelectedId(tag.id); setExpanded(false); }}
                    aria-pressed={active}
                    style={{
                      display: "flex", alignItems: "center", gap: 5, padding: "5px 9px", borderRadius: 13,
                      color: active ? tag.color : "rgba(0,0,0,.35)",
                      background: active ? `${tag.color}18` : "rgba(76,67,58,.045)",
                      boxShadow: active ? `inset 0 0 0 1px ${tag.color}2D` : "none",
                      fontSize: 10, transition: "all 180ms ease",
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: active ? tag.color : "rgba(0,0,0,.16)" }} />
                    {tag.label} {tag.percent}%
                  </button>
                );
              })}
            </div>
          </section>
          <section className="relative overflow-hidden" style={{ margin: "0 14px 14px", padding: "15px 3px 2px", borderTop: "1px solid rgba(76,67,58,.08)" }}>
            <div aria-hidden="true" className="absolute" style={{ width: 120, height: 120, right: -52, top: -56, borderRadius: "50%", border: `1px solid ${selected.color}18`, boxShadow: `0 0 0 18px ${selected.color}07` }} />
            <div className="relative flex items-end justify-between" style={{ marginBottom: 11 }}>
              <div>
                <div style={{ color: "rgba(0,0,0,.66)", fontSize: 12.5, fontWeight: 560 }}>合流之后</div>
                <div style={{ color: "rgba(0,0,0,.29)", fontSize: 9.5, marginTop: 3 }}>从近期记录里提炼出的 {selected.label} 线索</div>
              </div>
              <span style={{ color: selected.color, fontFamily: '"Songti SC", "STSong", serif', fontSize: 15 }}>{selected.label}</span>
            </div>
            <div className="relative" style={{ paddingBottom: 10 }}>
              <p style={{ color: "rgba(0,0,0,.56)", fontSize: 12, lineHeight: 1.75, display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: expanded ? "unset" : 2, overflow: "hidden" }}>{selected.summary}</p>
              {expanded && (
                <div style={{ marginTop: 12, padding: "11px 12px", borderRadius: 12, background: `${selected.color}0B` }}>
                  <span style={{ color: selected.color, fontSize: 9, letterSpacing: 1 }}>下一次实验</span>
                  <p style={{ color: "rgba(0,0,0,.68)", fontFamily: '"Songti SC", "STSong", serif', fontSize: 14, lineHeight: 1.55, marginTop: 5 }}>{selected.direction}</p>
                </div>
              )}
              <button onClick={() => setExpanded((current) => !current)} className="flex items-center" style={{ color: "rgba(0,0,0,.35)", fontSize: 10, marginTop: 10 }}>
                {expanded ? "收起洞察" : "展开完整洞察"}
                <SFSymbol icon={ChevronDown} size={12} strokeWidth={1.6} style={{ marginLeft: 3, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }} />
              </button>
            </div>
          </section>
        </LiquidGlass>

        <section style={{ marginTop: 14 }}>
          <div className="flex items-center gap-1.5 px-1" style={{ marginBottom: 8 }}>
            <SFSymbol icon={Compass} size={14} color="var(--lm-day-gold)" strokeWidth={1.6} />
            <span style={{ color: "rgba(0,0,0,.66)", fontSize: 13.5, fontWeight: 560 }}>向未知处发散</span>
          </div>
          <div className="flex flex-col" style={{ gap: 7 }}>
            {possibilitySeeds.map((seed) => (
              <button key={seed.index} className="w-full text-left" onClick={() => onNavigate("day-dashboard")}>
                <LiquidGlass mode="day" borderRadius={16} intensity="soft" material="liquid">
                  <div className="grid items-center" style={{ gridTemplateColumns: "29px 1fr 18px", gap: 8, padding: "11px 12px" }}>
                    <span style={{ color: "rgba(0,0,0,.24)", fontFamily: '"Songti SC", "STSong", serif', fontSize: 14 }}>{seed.index}</span>
                    <div>
                      <div style={{ color: "rgba(0,0,0,.67)", fontSize: 12.5, fontWeight: 550 }}>{seed.title}</div>
                      <div style={{ color: "rgba(0,0,0,.38)", fontSize: 10.5, lineHeight: 1.45, marginTop: 3 }}>{seed.copy}</div>
                    </div>
                    <SFSymbol icon={ArrowRight} size={14} color="rgba(0,0,0,.2)" strokeWidth={1.6} />
                  </div>
                </LiquidGlass>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div aria-hidden="true" style={{ height: 23, flexShrink: 0 }} />
    </div>
  );
}
