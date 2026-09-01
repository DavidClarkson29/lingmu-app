import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CalendarDays, FileText, Grid2X2, Heart, Image as ImageIcon, List, Mic2, Play, Search, Sparkles, Sunrise, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FloatingTabBar } from "../components/FloatingTabBar";
import { LiquidGlass } from "../components/LiquidGlass";
import { SFSymbol } from "../components/SFSymbol";
import type { Idea, IdeaKind } from "../data/ideas";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "morning-review" | "day-ai" | "day-calendar";
type LibraryView = "cards" | "list";
type LibraryFilter = "all" | IdeaKind | "favorite";

interface DayDashboardProps {
  ideas: Idea[];
  onNavigate: (page: Page) => void;
  onOpenIdea: (ideaId: string) => void;
  onOpenInsight: (tagId: string) => void;
}

interface Bubble {
  id: string;
  label: string;
  count: string;
  size: number;
  color: string;
  borderColor: string;
  x: number;
  y: number;
  shadow: string;
  depth: number;
  highlightAngle: number;
}

const bubbles: Bubble[] = [
  { id: "emotion", label: "情绪", count: "4条笔记", size: 110, color: "rgba(235,228,245,0.95)", borderColor: "rgba(180,160,220,0.3)", x: 42, y: 38, shadow: "0 8px 28px rgba(180,150,220,0.3), 0 2px 6px rgba(180,150,220,0.15)", depth: 2, highlightAngle: 135 },
  { id: "color", label: "色彩", count: "3条笔记", size: 92, color: "rgba(230,240,255,0.95)", borderColor: "rgba(140,180,240,0.3)", x: 62, y: 28, shadow: "0 6px 22px rgba(120,160,230,0.25), 0 2px 5px rgba(120,160,230,0.12)", depth: 2, highlightAngle: 120 },
  { id: "music", label: "声音", count: "2条笔记", size: 80, color: "rgba(240,248,235,0.95)", borderColor: "rgba(150,210,170,0.3)", x: 20, y: 55, shadow: "0 5px 18px rgba(130,200,150,0.22), 0 1px 4px rgba(130,200,150,0.1)", depth: 1, highlightAngle: 150 },
  { id: "space", label: "空间", count: "2条", size: 74, color: "rgba(255,245,230,0.95)", borderColor: "rgba(230,190,140,0.35)", x: 60, y: 58, shadow: "0 4px 14px rgba(220,180,120,0.2), 0 1px 3px rgba(220,180,120,0.1)", depth: 1, highlightAngle: 110 },
  { id: "light", label: "光影", count: "1条", size: 62, color: "rgba(245,235,235,0.95)", borderColor: "rgba(220,170,170,0.3)", x: 38, y: 68, shadow: "0 3px 10px rgba(210,160,160,0.18), 0 1px 2px rgba(210,160,160,0.08)", depth: 0, highlightAngle: 140 },
];

const kindMeta: Record<IdeaKind, { icon: LucideIcon; color: string; label: string }> = {
  text: { icon: FileText, color: "#B68931", label: "文字" },
  image: { icon: ImageIcon, color: "#6683AC", label: "图片" },
  voice: { icon: Mic2, color: "#9475AA", label: "语音" },
};

const cardCovers = [
  "linear-gradient(145deg, #d7dce5 0%, #a5b4c8 48%, #66758c 100%)",
  "linear-gradient(155deg, #ead9cc 0%, #c7a797 52%, #7b6c70 100%)",
  "linear-gradient(145deg, #d8d3e7 0%, #8d8fb0 55%, #50566f 100%)",
  "linear-gradient(155deg, #d6e1dd 0%, #94aaa2 50%, #5b706c 100%)",
  "linear-gradient(145deg, #e6ddcb 0%, #bca882 55%, #786b58 100%)",
  "linear-gradient(155deg, #d8dfea 0%, #879db8 52%, #53667e 100%)",
];

const libraryFilters: { id: LibraryFilter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "text", label: "文字" },
  { id: "image", label: "图片" },
  { id: "voice", label: "语音" },
  { id: "favorite", label: "收藏" },
];

export function DayDashboard({ ideas, onNavigate, onOpenIdea, onOpenInsight }: DayDashboardProps) {
  const [query, setQuery] = useState("");
  const [aiSearch, setAiSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<LibraryView>("cards");
  const [filter, setFilter] = useState<LibraryFilter>("all");

  useEffect(() => {
    if (!aiSearch) return;
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 260);
    return () => window.clearTimeout(focusTimer);
  }, [aiSearch]);

  const visibleIdeas = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (idea.archived) return false;
      if (filter === "favorite" && !idea.favorite) return false;
      if (filter !== "all" && filter !== "favorite" && idea.kind !== filter) return false;
      if (!normalized) return true;
      return [idea.title, idea.content, idea.mood, ...idea.tags].join(" ").toLowerCase().includes(normalized);
    });
  }, [filter, ideas, query]);

  return (
    <div className="lm-day-page relative w-full h-full overflow-hidden flex flex-col" style={{ background: "var(--lm-day-bg)" }}>
      <div aria-hidden="true" style={{ height: 54, flexShrink: 0 }} />

      <div className="flex items-center justify-between gap-3 px-5 pt-2 pb-1 shrink-0">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" fill="var(--lm-day-gold)" />
            <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="var(--lm-day-gold)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ color: "var(--lm-day-ink)", fontSize: 17, fontWeight: 500, letterSpacing: 0.5 }}>灵沐 LingMu</span>
        </div>
        <div
          className={`lm-search-cluster ${aiSearch ? "is-ai" : ""}`}
          style={{
            position: "relative",
            width: aiSearch ? 208 : 172,
            height: 34,
            display: "flex",
            alignItems: "center",
            gap: aiSearch ? 0 : 6,
            padding: aiSearch ? 1 : 0,
            borderRadius: 18,
            background: aiSearch ? "linear-gradient(115deg, rgba(104,137,158,.92), rgba(139,103,153,.92) 48%, rgba(183,137,82,.86), rgba(104,137,158,.92))" : "transparent",
            backgroundSize: "240% 240%",
            boxShadow: aiSearch ? "0 7px 20px rgba(104,82,119,.16), 0 0 0 3px rgba(135,105,149,.05)" : "none",
            overflow: aiSearch ? "hidden" : "visible",
            transition: "width 420ms cubic-bezier(.2,.82,.2,1), gap 360ms ease, padding 360ms ease, box-shadow 420ms ease, background-color 360ms ease",
            animation: aiSearch ? "lmAiAura 5s ease-in-out infinite" : "none",
          }}
        >
          {aiSearch && <span aria-hidden="true" className="lm-ai-sheen" />}
          <div
            className="relative flex items-center"
            style={{
              zIndex: 2,
              width: aiSearch ? 151 : 112,
              height: 32,
              padding: "0 9px",
              borderRadius: aiSearch ? "17px 6px 6px 17px" : 16,
              background: aiSearch ? "rgba(250,248,243,.9)" : "rgba(255,255,255,.52)",
              border: aiSearch ? "none" : "1px solid rgba(91,80,66,.08)",
              boxShadow: aiSearch ? "inset 0 1px rgba(255,255,255,.72)" : "none",
              transition: "width 420ms cubic-bezier(.2,.82,.2,1), border-radius 360ms ease, background 360ms ease",
            }}
          >
            <SFSymbol icon={Search} size={13} color={aiSearch ? "#7A6A82" : "rgba(0,0,0,.3)"} strokeWidth={1.7} />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={aiSearch ? "描述想找的片段…" : "搜索…"}
              aria-label={aiSearch ? "AI 搜索" : "搜索灵感"}
              style={{ flex: 1, minWidth: 0, marginLeft: 6, border: 0, outline: 0, background: "transparent", color: "rgba(0,0,0,.68)", fontSize: 11.5, transition: "color 240ms ease" }}
            />
            {query && (
              <button aria-label="清空搜索" onClick={() => setQuery("")} style={{ color: "rgba(0,0,0,.24)", display: "flex" }}>
                <SFSymbol icon={X} size={12} strokeWidth={1.7} />
              </button>
            )}
          </div>
          <button
            aria-label={aiSearch ? "切换到普通搜索" : "打开 AI 搜索"}
            aria-pressed={aiSearch}
            onClick={() => setAiSearch((current) => !current)}
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              height: 32,
              width: aiSearch ? 55 : 54,
              minWidth: aiSearch ? 55 : 54,
              padding: "0 6px",
              borderRadius: aiSearch ? "6px 17px 17px 6px" : "16px 16px 16px 6px",
              color: aiSearch ? "#fff" : "#66566E",
              background: aiSearch
                ? "linear-gradient(135deg, rgba(113,140,161,.72) 0%, rgba(139,113,151,.86) 54%, rgba(181,138,97,.72) 100%)"
                : "linear-gradient(135deg, rgba(132,163,182,.22) 0%, rgba(150,117,163,.22) 52%, rgba(190,145,91,.18) 100%)",
              border: aiSearch ? "none" : "1px solid rgba(133,112,142,.16)",
              boxShadow: aiSearch ? "inset 1px 0 rgba(255,255,255,.12), inset 0 1px rgba(255,255,255,.28)" : "inset 0 1px rgba(255,255,255,.62)",
              zIndex: 2,
              transition: "width 380ms cubic-bezier(.2,.82,.2,1), border-radius 360ms ease, background 360ms ease, box-shadow 360ms ease",
            }}
          >
            <span aria-hidden="true" className="absolute" style={{ width: 20, height: 20, borderRadius: "50%", top: -8, right: -4, background: "rgba(255,255,255,.28)", filter: "blur(1px)" }} />
            {aiSearch && <span aria-hidden="true" className="lm-ai-star-dot" />}
            <SFSymbol icon={Sparkles} size={11} color={aiSearch ? "white" : "#80678B"} strokeWidth={1.8} style={{ animation: aiSearch ? "lmAiSpark 1.9s ease-in-out infinite" : "none" }} />
            <span style={{ position: "relative", fontFamily: '"Songti SC", "STSong", serif', fontSize: 10.2, fontWeight: 650, marginLeft: 3, letterSpacing: .2, whiteSpace: "nowrap", lineHeight: 1 }}>问灵</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 mb-2 shrink-0">
        <span className="flex items-center gap-1" style={{ color: "rgba(0,0,0,0.35)", fontSize: 12 }}>
          <SFSymbol icon={CalendarDays} size={12} strokeWidth={1.65} />3月17日 · 周二
        </span>
        <span style={{ color: "var(--lm-day-gold)", fontSize: "var(--lm-type-caption)", fontWeight: 560 }}>12 条灵感</span>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        <div className="relative mx-4 mt-2 mb-1" style={{ height: 238, perspective: 600 }}>
          {bubbles.map((bubble) => {
            const scale = 0.82 + bubble.depth * 0.1;
            const blur = bubble.depth === 0 ? 1.5 : 0;
            const zTranslate = -30 + bubble.depth * 30;
            return (
              <button
                key={bubble.id}
                aria-label={`查看${bubble.label}阶段洞察`}
                onClick={() => onOpenInsight(bubble.id)}
                className="absolute flex flex-col items-center justify-center"
                style={{
                  width: bubble.size, height: bubble.size, borderRadius: "50%", background: bubble.color,
                  border: `1.5px solid ${bubble.borderColor}`, boxShadow: bubble.shadow,
                  left: `calc(${bubble.x}% - ${bubble.size / 2}px)`, top: `calc(${bubble.y}% - ${bubble.size / 2}px)`,
                  cursor: "pointer", transition: "transform 0.3s ease, filter 0.3s",
                  transform: `scale(${scale}) translateZ(${zTranslate}px)`, filter: blur > 0 ? `blur(${blur}px)` : "none",
                  opacity: 0.7 + bubble.depth * 0.15, zIndex: bubble.depth, overflow: "hidden", position: "absolute",
                }}
                onMouseEnter={(event) => (event.currentTarget.style.transform = `scale(${scale * 1.06}) translateZ(${zTranslate + 10}px)`)}
                onMouseLeave={(event) => (event.currentTarget.style.transform = `scale(${scale}) translateZ(${zTranslate}px)`)}
              >
                <div style={{ position: "absolute", top: "8%", left: "15%", width: "55%", height: "40%", borderRadius: "50%", background: `linear-gradient(${bubble.highlightAngle}deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 60%, transparent 100%)`, pointerEvents: "none", filter: "blur(4px)" }} />
                <div style={{ position: "absolute", bottom: "5%", left: "20%", width: "60%", height: "25%", borderRadius: "50%", background: "rgba(0,0,0,0.04)", pointerEvents: "none", filter: "blur(6px)" }} />
                <span style={{ color: "rgba(0,0,0,0.72)", fontSize: bubble.size > 90 ? 15 : bubble.size > 75 ? 13 : 12, fontWeight: 500, position: "relative", zIndex: 1 }}>{bubble.label}</span>
                <span style={{ color: "rgba(0,0,0,0.38)", fontSize: "var(--lm-type-caption)", marginTop: 2, position: "relative", zIndex: 1 }}>{bubble.count}</span>
              </button>
            );
          })}
          <button aria-label="打开阶段洞察" onClick={() => onNavigate("day-ai")} className="absolute flex items-center gap-1.5" style={{ bottom: 7, left: 8 }}>
            <SFSymbol icon={Sparkles} size={13} color="rgba(116,92,177,0.78)" strokeWidth={1.7} />
            <span style={{ fontSize: "var(--lm-type-support)", fontWeight: 570, background: "linear-gradient(90deg, #687fb4 0%, #9b70b4 48%, #d09370 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>色彩与情绪正在靠近 · 阶段洞察</span>
          </button>
          <div className="absolute" style={{ bottom: 8, right: 8 }}><span style={{ color: "rgba(0,0,0,0.25)", fontSize: 10 }}>3 组灵感</span></div>
        </div>

        <div className="px-4 mb-4">
          <LiquidGlass mode="day" borderRadius={17} intensity="soft">
            <button onClick={() => onNavigate("morning-review")} className="w-full" style={{ padding: "16px 18px", textAlign: "left" }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(177,132,63,0.1)", border: "1px solid rgba(177,132,63,0.12)", flexShrink: 0 }}>
                  <SFSymbol icon={Sunrise} size={20} color="rgba(178,127,35,0.82)" strokeWidth={1.65} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span style={{ color: "rgba(0,0,0,0.76)", fontSize: "var(--lm-type-section)", fontWeight: 560 }}>每日日报</span><span style={{ color: "rgba(165,111,28,0.86)", fontSize: "var(--lm-type-caption)", padding: "2px 7px", borderRadius: 9, background: "rgba(220,166,63,0.1)" }}>来自你的记录</span></div>
                  <span style={{ display: "block", color: "rgba(0,0,0,0.4)", fontSize: "var(--lm-type-support)", marginTop: 4, lineHeight: 1.5 }}>「城市像在呼吸」再次呼应了空间节奏</span>
                </div>
                <SFSymbol icon={ArrowRight} size={17} color="rgba(0,0,0,0.28)" strokeWidth={1.65} />
              </div>
            </button>
          </LiquidGlass>
        </div>

        <div className="px-4 pb-2">
          <div
            className="sticky"
            style={{
              top: 0,
              zIndex: 30,
              margin: "0 -16px 12px",
              padding: "10px 16px 10px",
              background: "rgba(243,240,233,0.9)",
              backdropFilter: "blur(18px) saturate(115%)",
              WebkitBackdropFilter: "blur(18px) saturate(115%)",
              borderBottom: "1px solid rgba(91,80,66,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div style={{ color: "var(--lm-day-ink)", fontSize: 17, fontWeight: 550 }}>灵感库</div>
                <div style={{ color: "rgba(0,0,0,0.28)", fontSize: "var(--lm-type-caption)", marginTop: 3 }}>{query ? `找到 ${visibleIdeas.length} 条相关灵感` : `${visibleIdeas.length} 条近期记录`}</div>
              </div>
              <div className="flex items-center" style={{ padding: 3, borderRadius: 12, background: "rgba(0,0,0,0.045)" }}>
                {([
                  { id: "cards" as const, icon: Grid2X2, label: "卡片视图" },
                  { id: "list" as const, icon: List, label: "列表视图" },
                ]).map((item) => {
                  const active = view === item.id;
                  return <button key={item.id} aria-label={item.label} onClick={() => setView(item.id)} className="flex items-center justify-center" style={{ width: 31, height: 27, borderRadius: 9, color: active ? "rgba(79,110,145,0.9)" : "rgba(0,0,0,0.25)", background: active ? "rgba(255,255,255,0.8)" : "transparent", boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}><SFSymbol icon={item.icon} size={15} strokeWidth={1.7} /></button>;
                })}
              </div>
            </div>

            <div className="flex gap-2.5 overflow-x-auto">
              {libraryFilters.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    style={{
                      flexShrink: 0,
                      padding: "6px 13px",
                      borderRadius: 13,
                      fontSize: "var(--lm-type-support)",
                      color: active ? "rgba(59,91,126,0.88)" : "rgba(0,0,0,0.36)",
                      background: active ? "rgba(119,157,200,0.13)" : "rgba(255,255,255,0.42)",
                      border: active ? "1px solid rgba(119,157,200,0.17)" : "1px solid rgba(255,255,255,0.65)",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {visibleIdeas.length === 0 ? (
            <div className="flex flex-col items-center justify-center" style={{ height: 180, color: "rgba(0,0,0,0.28)" }}><SFSymbol icon={Search} size={25} strokeWidth={1.6} /><span style={{ fontSize: 12, marginTop: 9 }}>没有找到相关灵感</span></div>
          ) : view === "cards" ? (
            <div className="flex gap-3 items-start">
              {([0, 1] as const).map((column) => (
                <div key={column} className="flex-1 min-w-0 flex flex-col" style={{ alignSelf: "flex-start" }}>
              {visibleIdeas.filter((_, index) => index % 2 === column).map((idea, columnIndex) => {
                const index = columnIndex * 2 + column;
                const meta = kindMeta[idea.kind];
                const coverHeight = index % 2 === 0 ? 122 : 136;
                return (
                  <button key={idea.id} onClick={() => onOpenIdea(idea.id)} className="w-full text-left overflow-hidden mb-3" style={{ borderRadius: 17, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "0 4px 16px rgba(60,55,50,0.07)" }}>
                    {idea.kind === "image" && (
                      <div className="relative flex items-center justify-center" style={{ height: coverHeight, background: cardCovers[index % cardCovers.length], overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.52), transparent 34%), linear-gradient(180deg, transparent 55%, rgba(25,28,36,0.18))" }} />
                        <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }} />
                        <div className="absolute flex items-center gap-1" style={{ left: 10, bottom: 9, color: "rgba(255,255,255,0.88)", fontSize: "var(--lm-type-caption)" }}><SFSymbol icon={meta.icon} size={12} strokeWidth={1.65} />图片灵感</div>
                      </div>
                    )}
                    <div style={{ padding: "12px 12px 11px" }}>
                      {idea.kind !== "image" && (
                        <div className="flex items-center gap-1.5 mb-2" style={{ color: meta.color, minWidth: 0 }}>
                          <SFSymbol icon={meta.icon} size={13} strokeWidth={1.65} />
                          <span style={{ fontSize: "var(--lm-type-caption)", whiteSpace: "nowrap" }}>{idea.kind === "voice" ? "语音灵感" : "文字灵感"}</span>
                          {idea.kind === "voice" && (
                            <span aria-label="播放语音" className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(148,117,170,0.12)", color: "rgba(118,83,144,0.76)", marginLeft: "auto", flexShrink: 0 }}>
                              <SFSymbol icon={Play} size={10} strokeWidth={1.8} fill="currentColor" />
                            </span>
                          )}
                        </div>
                      )}
                      <div style={{ color: "rgba(0,0,0,0.72)", fontSize: 14, fontWeight: 500, lineHeight: 1.45 }}>{idea.title}</div>
                      <p style={{ color: "rgba(0,0,0,0.38)", fontSize: "var(--lm-type-support)", lineHeight: 1.55, marginTop: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{idea.content}</p>
                      <div className="flex items-center gap-1.5 mt-2.5"><span style={{ color: "rgba(89,116,147,0.55)", fontSize: "var(--lm-type-caption)" }}>{idea.tags[0]}</span><span style={{ color: "rgba(0,0,0,0.22)", fontSize: "var(--lm-type-caption)", marginLeft: "auto" }}>{idea.date}</span>{idea.favorite && <SFSymbol icon={Heart} size={11} color="rgba(195,104,120,0.7)" fill="rgba(195,104,120,0.18)" strokeWidth={1.7} />}</div>
                    </div>
                  </button>
                );
              })}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {visibleIdeas.map((idea) => {
                const meta = kindMeta[idea.kind];
                return (
                  <button key={idea.id} onClick={() => onOpenIdea(idea.id)} className="w-full text-left mb-2.5">
                    <LiquidGlass mode="day" borderRadius={16} intensity="soft">
                      <div className="flex items-center gap-3" style={{ padding: "13px 14px" }}>
                        <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 10, background: `${meta.color}14` }}><SFSymbol icon={meta.icon} size={16} color={meta.color} strokeWidth={1.65} /></div>
                        <div className="flex-1 min-w-0"><div style={{ color: "rgba(0,0,0,0.72)", fontSize: "var(--lm-type-section)", fontWeight: 530, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{idea.title}</div><div style={{ color: "rgba(0,0,0,0.31)", fontSize: "var(--lm-type-caption)", marginTop: 4 }}>{idea.date} · {idea.time} · {idea.tags.slice(0, 2).join(" · ")}</div></div>
                        {idea.favorite && <SFSymbol icon={Heart} size={12} color="rgba(195,104,120,0.65)" fill="rgba(195,104,120,0.16)" strokeWidth={1.7} />}
                      </div>
                    </LiquidGlass>
                  </button>
                );
              })}
            </div>
          )}
          <div style={{ height: 12 }} />
        </div>
      </div>

      <style>{`
        @keyframes lmAiAura {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes lmAiSheen {
          0% { transform: translateX(-150%) skewX(-18deg); opacity: 0; }
          18% { opacity: .42; }
          48%, 100% { transform: translateX(260%) skewX(-18deg); opacity: 0; }
        }
        @keyframes lmAiSpark {
          0%, 100% { transform: scale(.9) rotate(-7deg); opacity: .78; }
          50% { transform: scale(1.12) rotate(6deg); opacity: 1; }
        }
        @keyframes lmAiDot {
          0%, 100% { transform: scale(.7); opacity: .35; }
          50% { transform: scale(1.2); opacity: .9; }
        }
        .lm-ai-sheen {
          position: absolute;
          z-index: 3;
          inset: -8px auto -8px -30%;
          width: 34%;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          filter: blur(2px);
          animation: lmAiSheen 3.2s ease-in-out infinite;
        }
        .lm-ai-star-dot {
          position: absolute;
          top: 5px;
          right: 6px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,239,193,.94);
          box-shadow: 0 0 6px rgba(255,226,157,.72);
          animation: lmAiDot 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .lm-search-cluster, .lm-ai-sheen, .lm-ai-star-dot { animation: none !important; }
        }
      `}</style>

      <FloatingTabBar current="day-dashboard" onNavigate={onNavigate} mode="day" />
    </div>
  );
}
