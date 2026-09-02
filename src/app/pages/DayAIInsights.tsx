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
    id: "tide-demo", label: "潮汐 demo", count: 8, percent: 40, color: "#708D79", start: 0, end: 136,
    language: "《潮汐》现在不是缺东西，是有点舍不得删。",
    summary: "主歌三个音已经够了，副歌和弦第二遍再亮，鼓组也想晚两拍进。真正卡住的是第二遍太满、桥段又有点硬塞。你这几天记下来的，大半都在提醒自己做减法。",
    direction: "复制一版工程，把桥段、两轨 pad 和反拍吉他都关掉，从头听一次。先别永久删。",
  },
  {
    id: "night-film", label: "夜路小片", count: 6, percent: 30, color: "#607F9D", start: 140, end: 242,
    language: "这个小片，镜头和声音其实已经凑了一半。",
    summary: "楼梯光当开头，便利店蓝接中间，空房间和地铁反光收尾。那段“咚、哒哒、空一下”也正好能拿来切镜头。你不是还没想好，只是还没真的去拍。",
    direction: "今晚先补楼梯和便利店两个镜头，每个拍 8 秒。拍完就走，别顺便想完整片子。",
  },
  {
    id: "type-play", label: "会呼吸的字", count: 3, percent: 15, color: "#8D739E", start: 246, end: 297,
    language: "那个会跟音乐动的字，你已经来回记了三次。",
    summary: "片名字体嫌太乖、字宽想跟鼓点动、贝斯又想晚一点进，这三条其实都在说同一版东西：前面安静一点，第二遍再放开。",
    direction: "先做 6 秒：字宽只动两次，第二次再让贝斯进来。不好看就删，不用先做完整页面。",
  },
  {
    id: "weather-tool", label: "天气小工具", count: 2, percent: 10, color: "#A96F69", start: 301, end: 335,
    language: "天气小工具现在差的不是功能，是开头那一下。",
    summary: "你只记了两件事：圆散开以后出城市名，再配一点不像提示音的低频。已经够做第一版，先别继续加天气粒子和花活。",
    direction: "把开屏限制在 1.2 秒，只做圆、城市名和一下低频。",
  },
  {
    id: "new-skill", label: "刚学会的", count: 1, percent: 5, color: "#A17A43", start: 339, end: 356,
    language: "那个跟踪蒙版算是会了，别让它只活在教程里。",
    summary: "你截了节点，还想到拿地铁玻璃那段试。挺好，这条不用总结成“掌握了新技能”，能在自己的片子里用一次就算真会。",
    direction: "拿 5 秒地铁反光跑一遍跟踪，飘了也先导出来看看。",
  },
] as const;

const possibilitySeeds = [
  { index: "01", title: "先给《潮汐》做一版减法", copy: "桥段、两轨 pad、反拍吉他全关掉，听完再决定谁回来。" },
  { index: "02", title: "把夜路小片拍出第一版", copy: "楼梯、便利店、空房间各一段，先能从头放到尾。" },
  { index: "03", title: "把会呼吸的字做成 6 秒", copy: "字宽动两次，第二次贝斯再进。就这么多。" },
] as const;

export function DayAIInsights({ onNavigate, initialTagId }: DayAIInsightsProps) {
  const [selectedId, setSelectedId] = useState<(typeof tagInsights)[number]["id"]>(() => {
    const matchedTag = tagInsights.find((tag) => tag.id === initialTagId);
    return matchedTag?.id ?? "tide-demo";
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
          <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 11 }}>过去 14 天 · 20 条随手记</span>
        </div>
        <div style={{ width: 20 }} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4" style={{ minHeight: 0 }}>
        <LiquidGlass mode="day" borderRadius={22} intensity="medium" material="liquid">
          <section style={{ padding: "18px 16px 15px" }}>
            <div className="flex items-center gap-1.5">
              <SFSymbol icon={Sparkles} size={14} color="var(--lm-day-plum)" strokeWidth={1.65} />
              <span style={{ color: "rgba(0,0,0,0.66)", fontSize: 13.5, fontWeight: 560 }}>最近这些都在忙什么</span>
              <span style={{ color: "rgba(0,0,0,0.28)", fontSize: 9.5, marginLeft: "auto" }}>点一下项目 Tag</span>
            </div>

            <div className="grid items-center" style={{ gridTemplateColumns: "124px 1fr", gap: 18, marginTop: 18 }}>
              <div className="relative" style={{ width: 118, height: 118 }}>
                <div
                  role="img"
                  aria-label="潮汐 demo 40%，夜路小片 30%，会呼吸的字 15%，天气小工具 10%，刚学会的 5%"
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
                <div style={{ color: selected.color, fontSize: 9, letterSpacing: 1.2, transition: "color 180ms ease" }}>这阵子最常冒出来的事</div>
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
                <div style={{ color: "rgba(0,0,0,.66)", fontSize: 12.5, fontWeight: 560 }}>这些记录放一起看</div>
                <div style={{ color: "rgba(0,0,0,.29)", fontSize: 9.5, marginTop: 3 }}>都算在「{selected.label}」这件事里</div>
              </div>
              <span style={{ color: selected.color, fontFamily: '"Songti SC", "STSong", serif', fontSize: 15 }}>{selected.label}</span>
            </div>
            <div className="relative" style={{ paddingBottom: 10 }}>
              <p style={{ color: "rgba(0,0,0,.56)", fontSize: 12, lineHeight: 1.75, display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: expanded ? "unset" : 2, overflow: "hidden" }}>{selected.summary}</p>
              {expanded && (
                <div style={{ marginTop: 12, padding: "11px 12px", borderRadius: 12, background: `${selected.color}0B` }}>
                  <span style={{ color: selected.color, fontSize: 9, letterSpacing: 1 }}>下一小步</span>
                  <p style={{ color: "rgba(0,0,0,.68)", fontFamily: '"Songti SC", "STSong", serif', fontSize: 14, lineHeight: 1.55, marginTop: 5 }}>{selected.direction}</p>
                </div>
              )}
              <button onClick={() => setExpanded((current) => !current)} className="flex items-center" style={{ color: "rgba(0,0,0,.35)", fontSize: 10, marginTop: 10 }}>
                {expanded ? "收起" : "看看具体怎么做"}
                <SFSymbol icon={ChevronDown} size={12} strokeWidth={1.6} style={{ marginLeft: 3, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }} />
              </button>
            </div>
          </section>
        </LiquidGlass>

        <section style={{ marginTop: 14 }}>
          <div className="flex items-center gap-1.5 px-1" style={{ marginBottom: 8 }}>
            <SFSymbol icon={Compass} size={14} color="var(--lm-day-gold)" strokeWidth={1.6} />
            <span style={{ color: "rgba(0,0,0,.66)", fontSize: 13.5, fontWeight: 560 }}>接下来可以做</span>
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
