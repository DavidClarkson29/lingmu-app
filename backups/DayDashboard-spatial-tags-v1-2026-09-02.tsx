import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, CalendarDays, Check, ChevronDown, Delete, FileText, Globe2, Grid2X2, Heart, Image as ImageIcon, List, Mic, Mic2, Play, Search, Sparkles, Sunrise, Tag, Trash2, X } from "lucide-react";
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
  onOpenInsight: (tagId: string, origin: InsightBubbleOrigin) => void;
  onDeleteIdeas: (ideaIds: string[]) => void;
}

export interface InsightBubbleOrigin {
  viewportX: number;
  viewportY: number;
  size: number;
  color: string;
}

interface Bubble {
  id: string;
  label: string;
  count: string;
  width: number;
  height: number;
  color: string;
  x: number;
  y: number;
  depth: number;
  bloomColor: string;
  percent: number;
  fontSize: number;
  lineWidth: number;
  blur: number;
  opacity: number;
  floatX: number;
  floatY: number;
  floatDelay: number;
  floatDuration: number;
}

const bubbles: Bubble[] = [
  { id: "tide-demo", label: "潮汐 demo", count: "8 条", percent: 40, width: 166, height: 72, color: "#708D79", x: 29, y: 23, depth: 5, bloomColor: "rgba(112,141,121,.78)", fontSize: 27, lineWidth: 132, blur: 0, opacity: 1, floatX: 2, floatY: -3, floatDelay: -1.1, floatDuration: 10.8 },
  { id: "night-film", label: "夜路小片", count: "6 条", percent: 30, width: 142, height: 66, color: "#607F9D", x: 73, y: 27, depth: 4, bloomColor: "rgba(96,127,157,.76)", fontSize: 23, lineWidth: 104, blur: .28, opacity: .94, floatX: -2, floatY: 2, floatDelay: -3.4, floatDuration: 12.4 },
  { id: "type-play", label: "会呼吸的字", count: "3 条", percent: 15, width: 146, height: 64, color: "#8D739E", x: 28, y: 53, depth: 3, bloomColor: "rgba(141,115,158,.74)", fontSize: 19, lineWidth: 111, blur: .58, opacity: .86, floatX: 3, floatY: 2, floatDelay: -2.2, floatDuration: 13.3 },
  { id: "weather-tool", label: "天气小工具", count: "2 条", percent: 10, width: 126, height: 60, color: "#A96F69", x: 62, y: 57, depth: 4, bloomColor: "rgba(169,111,105,.72)", fontSize: 16.5, lineWidth: 92, blur: .16, opacity: .91, floatX: -2, floatY: -2, floatDelay: -4.5, floatDuration: 11.8 },
  { id: "new-skill", label: "刚学会的", count: "1 条", percent: 5, width: 98, height: 54, color: "#A17A43", x: 82, y: 69, depth: 2, bloomColor: "rgba(161,122,67,.7)", fontSize: 13.5, lineWidth: 66, blur: 1.18, opacity: .58, floatX: 3, floatY: -2, floatDelay: -1.8, floatDuration: 14.6 },
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

export function DayDashboard({ ideas, onNavigate, onOpenIdea, onOpenInsight, onDeleteIdeas }: DayDashboardProps) {
  const [query, setQuery] = useState("");
  const [aiSearch, setAiSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchClusterRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<LibraryView>("cards");
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardMounted, setKeyboardMounted] = useState(false);
  const [shifted, setShifted] = useState(false);
  const [managing, setManaging] = useState(false);
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!aiSearch) return;
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 260);
    return () => window.clearTimeout(focusTimer);
  }, [aiSearch]);

  const toggleSelectedIdea = (ideaId: string) => {
    setSelectedIdeaIds((current) => {
      const next = new Set(current);
      if (next.has(ideaId)) next.delete(ideaId);
      else next.add(ideaId);
      return next;
    });
  };

  useEffect(() => {
    if (keyboardOpen || !keyboardMounted) return;
    const unmountTimer = window.setTimeout(() => setKeyboardMounted(false), 340);
    return () => window.clearTimeout(unmountTimer);
  }, [keyboardMounted, keyboardOpen]);

  const openKeyboard = () => {
    if (keyboardMounted) {
      setKeyboardOpen(true);
      return;
    }
    setKeyboardMounted(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setKeyboardOpen(true));
    });
  };

  const closeKeyboard = () => {
    setKeyboardOpen(false);
    searchInputRef.current?.blur();
  };

  const typeKey = (key: string) => {
    if (key === "backspace") return setQuery((current) => current.slice(0, -1));
    if (key === "space") return setQuery((current) => `${current} `);
    setQuery((current) => current + (shifted ? key.toUpperCase() : key));
    if (shifted) setShifted(false);
  };

  const visibleIdeas = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (idea.archived) return false;
      if (filter === "favorite" && !idea.favorite) return false;
      if (filter !== "all" && filter !== "favorite" && idea.kind !== filter) return false;
      if (!normalized) return true;
      return [idea.title, idea.content, idea.project, idea.mood, ...idea.tags].join(" ").toLowerCase().includes(normalized);
    });
  }, [filter, ideas, query]);

  return (
    <div
      className="lm-day-page relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "var(--lm-day-bg)" }}
      onPointerDown={(event) => {
        if (!keyboardMounted) return;
        const target = event.target as Node;
        if (!keyboardRef.current?.contains(target) && !searchClusterRef.current?.contains(target)) closeKeyboard();
      }}
    >
      <style>{`
        @keyframes lmInsightTagFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(var(--lm-float-x), var(--lm-float-y), 0); }
        }
        @keyframes lmThoughtTrace {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -92; }
        }
        @keyframes lmThoughtNodeBreathe {
          0%, 100% { opacity: .34; transform: scale(.82); }
          50% { opacity: .9; transform: scale(1.2); }
        }
        .lm-insight-tag-body {
          animation: lmInsightTagFloat var(--lm-float-duration) ease-in-out var(--lm-float-delay) infinite;
          transform-origin: center;
          transition: filter 180ms ease, opacity 180ms ease;
        }
        .lm-insight-tag:active .lm-insight-tag-body { filter: brightness(.96); }
        .lm-thought-path {
          stroke-dasharray: 2 10;
          animation: lmThoughtTrace 22s linear infinite;
        }
        .lm-thought-path:nth-of-type(2) { animation-duration: 28s; animation-direction: reverse; }
        .lm-thought-path:nth-of-type(3) { animation-duration: 34s; }
        .lm-thought-node {
          transform-box: fill-box;
          transform-origin: center;
          animation: lmThoughtNodeBreathe 5.8s ease-in-out infinite;
        }
        .lm-thought-node:nth-of-type(2n) { animation-delay: -2.7s; animation-duration: 7.4s; }
        @media (prefers-reduced-motion: reduce) { .lm-insight-tag-body, .lm-thought-path, .lm-thought-node { animation: none; } }
      `}</style>
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
          ref={searchClusterRef}
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
              onFocus={openKeyboard}
              inputMode="none"
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
        <span style={{ color: "var(--lm-day-gold)", fontSize: "var(--lm-type-caption)", fontWeight: 560 }}>{ideas.filter((idea) => !idea.archived).length} 条灵感</span>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        <div
          className="relative mx-4 mt-2 mb-1 overflow-hidden"
          style={{
            height: 238,
            background: "radial-gradient(ellipse at 24% 25%, rgba(144,158,146,.05), transparent 39%), radial-gradient(ellipse at 72% 47%, rgba(157,144,160,.04), transparent 43%)",
          }}
        >
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full" viewBox="0 0 361 238" fill="none" preserveAspectRatio="none">
            <path className="lm-thought-path" d="M-9 91C39 27 108 117 171 66C228 19 304 34 370 102" stroke="rgba(102,115,107,.075)" strokeWidth=".8" />
            <path className="lm-thought-path" d="M17 166C79 210 118 107 193 134C258 158 287 212 370 156" stroke="rgba(126,110,132,.062)" strokeWidth=".75" />
            <path className="lm-thought-path" d="M57 191C111 133 164 205 226 158C276 120 320 113 370 143" stroke="rgba(157,126,101,.052)" strokeWidth=".7" />
            <circle className="lm-thought-node" cx="173" cy="66" r="2.3" fill="rgba(112,141,121,.2)" />
            <circle className="lm-thought-node" cx="304" cy="35" r="2.1" stroke="rgba(96,127,157,.22)" strokeWidth="1" />
            <circle className="lm-thought-node" cx="118" cy="107" r="1.9" fill="rgba(141,115,158,.18)" />
            <circle className="lm-thought-node" cx="227" cy="158" r="2" stroke="rgba(169,111,105,.2)" strokeWidth="1" />
            <circle className="lm-thought-node" cx="320" cy="114" r="1.7" fill="rgba(161,122,67,.2)" />
          </svg>
          {bubbles.map((bubble) => {
            return (
              <button
                key={bubble.id}
                aria-label={`查看${bubble.label}阶段洞察，约占${bubble.percent}%`}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  onOpenInsight(bubble.id, {
                    viewportX: rect.left + rect.width / 2,
                    viewportY: rect.top + rect.height / 2,
                    size: Math.max(rect.width, rect.height),
                    color: bubble.bloomColor,
                  });
                }}
                className="lm-insight-tag absolute"
                style={{
                  width: bubble.width,
                  height: bubble.height,
                  left: `calc(${bubble.x}% - ${bubble.width / 2}px)`,
                  top: `calc(${bubble.y}% - ${bubble.height / 2}px)`,
                  cursor: "pointer",
                  zIndex: bubble.depth,
                }}
              >
                <div
                  className="lm-insight-tag-body relative w-full h-full flex flex-col items-start justify-center"
                  style={{
                    filter: `blur(${bubble.blur}px)`,
                    opacity: bubble.opacity,
                    "--lm-float-x": `${bubble.floatX}px`,
                    "--lm-float-y": `${bubble.floatY}px`,
                    "--lm-float-delay": `${bubble.floatDelay}s`,
                    "--lm-float-duration": `${bubble.floatDuration}s`,
                  } as CSSProperties}
                >
                  <span aria-hidden="true" className="absolute" style={{ left: 1, top: 16, width: 5, height: 5, borderRadius: "50%", background: bubble.color, opacity: .82, boxShadow: `0 4px 9px ${bubble.color}45` }} />
                  <span style={{ marginLeft: 14, color: "rgba(35,37,36,.87)", fontFamily: 'Songti SC, STSong, Noto Serif SC, serif', fontSize: bubble.fontSize, fontWeight: 500, lineHeight: 1.12, letterSpacing: -.25, whiteSpace: "nowrap", textShadow: "0 6px 14px rgba(47,44,39,.075)" }}>{bubble.label}</span>
                  <span aria-hidden="true" style={{ display: "block", marginLeft: 14, marginTop: 5, width: bubble.lineWidth, height: 1, borderRadius: 1, background: bubble.color, opacity: .62, boxShadow: `0 4px 8px ${bubble.color}28` }} />
                  <span style={{ marginLeft: 14, marginTop: 5, color: "rgba(39,41,40,.34)", fontSize: 9.5, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: .2 }}>{bubble.count}</span>
                </div>
              </button>
            );
          })}
          <button aria-label="打开阶段洞察" onClick={() => onNavigate("day-ai")} className="absolute flex items-center gap-1.5" style={{ bottom: 7, left: 8 }}>
            <SFSymbol icon={Sparkles} size={13} color="rgba(116,92,177,0.78)" strokeWidth={1.7} />
            <span style={{ fontSize: "var(--lm-type-support)", fontWeight: 570, background: "linear-gradient(90deg, #687fb4 0%, #9b70b4 48%, #d09370 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>最近在忙的几件事 · 阶段洞察</span>
          </button>
          <div className="absolute flex items-center gap-1" style={{ bottom: 8, right: 8, color: "rgba(0,0,0,0.25)" }}>
            <SFSymbol icon={Tag} size={10.5} strokeWidth={1.55} />
            <span style={{ fontSize: 10 }}>5 组项目 Tag</span>
          </div>
        </div>

        <div className="px-4 mb-4">
          <LiquidGlass mode="day" borderRadius={17} intensity="soft">
            <button onClick={() => onNavigate("morning-review")} className="w-full" style={{ padding: "16px 18px", textAlign: "left" }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(177,132,63,0.1)", border: "1px solid rgba(177,132,63,0.12)", flexShrink: 0 }}>
                  <SFSymbol icon={Sunrise} size={20} color="rgba(178,127,35,0.82)" strokeWidth={1.65} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span style={{ color: "rgba(0,0,0,0.76)", fontSize: "var(--lm-type-section)", fontWeight: 560 }}>灵沐日报</span><span style={{ color: "rgba(165,111,28,0.86)", fontSize: "var(--lm-type-caption)", padding: "2px 7px", borderRadius: 9, background: "rgba(220,166,63,0.1)" }}>昨晚记了什么</span></div>
                  <span style={{ display: "block", color: "rgba(0,0,0,0.4)", fontSize: "var(--lm-type-support)", marginTop: 4, lineHeight: 1.5 }}>《夜路小片》的开头、转场和鼓点，好像能接上了</span>
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
              <button
                onClick={() => {
                  setManaging((current) => !current);
                  setSelectedIdeaIds(new Set());
                }}
                style={{
                  flexShrink: 0,
                  padding: "6px 13px",
                  borderRadius: 13,
                  fontSize: "var(--lm-type-support)",
                  color: managing ? "rgba(166,75,78,.82)" : "rgba(178,96,98,.68)",
                  background: managing ? "rgba(201,102,105,.13)" : "rgba(207,119,121,.075)",
                  border: "1px solid rgba(199,107,110,.13)",
                }}
              >
                {managing ? "完成" : "管理"}
              </button>
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
                  <button
                    key={idea.id}
                    onClick={() => managing ? toggleSelectedIdea(idea.id) : onOpenIdea(idea.id)}
                    className="w-full text-left overflow-hidden mb-3"
                    style={{ position: "relative", borderRadius: 17, background: "rgba(255,255,255,0.72)", border: selectedIdeaIds.has(idea.id) ? "1px solid rgba(190,92,96,.42)" : "1px solid rgba(255,255,255,0.85)", boxShadow: selectedIdeaIds.has(idea.id) ? "0 5px 18px rgba(170,76,80,.12)" : "0 4px 16px rgba(60,55,50,0.07)", transition: "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease", transform: selectedIdeaIds.has(idea.id) ? "scale(.98)" : "scale(1)" }}
                  >
                    {managing && (
                      <span className="absolute flex items-center justify-center" style={{ zIndex: 4, right: 9, top: 9, width: 22, height: 22, borderRadius: "50%", color: selectedIdeaIds.has(idea.id) ? "white" : "rgba(163,83,87,.52)", background: selectedIdeaIds.has(idea.id) ? "rgba(180,83,87,.82)" : "rgba(255,255,255,.78)", border: "1px solid rgba(180,83,87,.24)", boxShadow: "0 2px 7px rgba(80,46,48,.1)" }}>
                        {selectedIdeaIds.has(idea.id) && <SFSymbol icon={Check} size={12} strokeWidth={2.1} />}
                      </span>
                    )}
                    {idea.kind === "image" && (
                      <div className="relative flex items-center justify-center" style={{ height: coverHeight, background: idea.cover ?? cardCovers[index % cardCovers.length], overflow: "hidden" }}>
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
                      <div className="flex items-center gap-1.5 mt-2.5"><span style={{ color: "rgba(89,116,147,0.58)", fontSize: "var(--lm-type-caption)" }}>{idea.project}</span><span style={{ color: "rgba(0,0,0,0.22)", fontSize: "var(--lm-type-caption)", marginLeft: "auto" }}>{idea.date}</span>{idea.favorite && <SFSymbol icon={Heart} size={11} color="rgba(195,104,120,0.7)" fill="rgba(195,104,120,0.18)" strokeWidth={1.7} />}</div>
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
                  <button key={idea.id} onClick={() => managing ? toggleSelectedIdea(idea.id) : onOpenIdea(idea.id)} className="w-full text-left mb-2.5" style={{ position: "relative", transform: selectedIdeaIds.has(idea.id) ? "scale(.985)" : "scale(1)", transition: "transform 180ms ease" }}>
                    <LiquidGlass mode="day" borderRadius={16} intensity="soft">
                      <div className="flex items-center gap-3" style={{ padding: "13px 14px" }}>
                        {managing && <span className="flex items-center justify-center shrink-0" style={{ width: 20, height: 20, borderRadius: "50%", color: "white", background: selectedIdeaIds.has(idea.id) ? "rgba(180,83,87,.82)" : "rgba(201,117,120,.1)", border: "1px solid rgba(180,83,87,.24)" }}>{selectedIdeaIds.has(idea.id) && <SFSymbol icon={Check} size={11} strokeWidth={2.1} />}</span>}
                        <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 10, background: `${meta.color}14` }}><SFSymbol icon={meta.icon} size={16} color={meta.color} strokeWidth={1.65} /></div>
                        <div className="flex-1 min-w-0"><div style={{ color: "rgba(0,0,0,0.72)", fontSize: "var(--lm-type-section)", fontWeight: 530, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{idea.title}</div><div style={{ color: "rgba(0,0,0,0.31)", fontSize: "var(--lm-type-caption)", marginTop: 4 }}>{idea.project} · {idea.date} {idea.time}</div></div>
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

      {managing && (
        <div className="absolute left-4 right-4" style={{ zIndex: 75, bottom: 78 }}>
          <LiquidGlass mode="day" borderRadius={17} intensity="medium" material="liquid">
            <div className="flex items-center gap-3" style={{ padding: "10px 11px 10px 14px" }}>
              <span style={{ color: "rgba(62,54,52,.52)", fontSize: 11.5, flex: 1 }}>{selectedIdeaIds.size ? `已选择 ${selectedIdeaIds.size} 条灵感` : "轻点灵感进行选择"}</span>
              <button
                disabled={selectedIdeaIds.size === 0}
                onClick={() => {
                  onDeleteIdeas([...selectedIdeaIds]);
                  setSelectedIdeaIds(new Set());
                }}
                className="flex items-center gap-1.5"
                style={{ height: 34, padding: "0 12px", borderRadius: 12, color: selectedIdeaIds.size ? "rgba(156,62,66,.88)" : "rgba(156,62,66,.25)", background: selectedIdeaIds.size ? "rgba(201,93,97,.12)" : "rgba(201,93,97,.055)", fontSize: 11.5 }}
              >
                <SFSymbol icon={Trash2} size={13} strokeWidth={1.8} />
                删除
              </button>
            </div>
          </LiquidGlass>
        </div>
      )}

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

      {keyboardMounted && (
        <div
          ref={keyboardRef}
          className="lm-ios-keyboard absolute left-0 right-0 bottom-0"
          aria-hidden={!keyboardOpen}
          style={{
            zIndex: 160,
            background: "rgba(205,208,215,.98)",
            boxShadow: keyboardOpen ? "0 -10px 28px rgba(54,57,64,.14)" : "0 -2px 10px rgba(54,57,64,0)",
            padding: "7px 6px 17px",
            transform: keyboardOpen ? "translate3d(0,0,0)" : "translate3d(0,102%,0)",
            opacity: keyboardOpen ? 1 : .98,
            transition: keyboardOpen
              ? "transform 360ms cubic-bezier(.32,.72,0,1), box-shadow 280ms ease, opacity 220ms ease"
              : "transform 320ms cubic-bezier(.32,.72,0,1), box-shadow 240ms ease, opacity 220ms ease",
            willChange: "transform",
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-center overflow-hidden" style={{ height: 37, padding: "0 4px 6px", color: "#111", fontSize: 16 }}>
            <div className="flex flex-1 items-center justify-around">
              {["我", "你", "这", "但是", "哎", "还", "这个", "那", "怎么"].map((word) => <button key={word} onClick={() => setQuery((current) => current + word)} style={{ minWidth: 25, color: "#111" }}>{word}</button>)}
            </div>
            <button aria-label="收起键盘" onClick={closeKeyboard} className="flex items-center justify-center" style={{ width: 34, height: 30, color: "#111", borderLeft: "1px solid rgba(70,72,78,.17)" }}><SFSymbol icon={ChevronDown} size={22} strokeWidth={2} /></button>
          </div>

          {["qwertyuiop", "asdfghjkl"].map((row, rowIndex) => (
            <div key={row} className="flex justify-center" style={{ gap: 5, marginTop: rowIndex ? 7 : 0, padding: rowIndex ? "0 20px" : 0 }}>
              {[...row].map((key) => <button key={key} onClick={() => typeKey(key)} className="lm-ios-key flex items-center justify-center" style={{ flex: 1, height: 43, maxWidth: 36, borderRadius: 6, background: "#fff", color: "#050505", fontSize: 22, textTransform: shifted ? "uppercase" : "lowercase", boxShadow: "0 1.5px 0 rgba(57,59,64,.48)" }}>{shifted ? key.toUpperCase() : key}</button>)}
            </div>
          ))}

          <div className="flex items-center" style={{ gap: 5, marginTop: 7 }}>
            <button aria-label="大写" onClick={() => setShifted((current) => !current)} className="lm-ios-key flex items-center justify-center" style={{ width: 45, height: 43, borderRadius: 6, background: shifted ? "#fff" : "#AEB4BE", color: "#101114", boxShadow: "0 1.5px 0 rgba(57,59,64,.42)" }}><ArrowRight size={22} strokeWidth={2.2} style={{ transform: "rotate(-90deg)" }} /></button>
            {[..."zxcvbnm"].map((key) => <button key={key} onClick={() => typeKey(key)} className="lm-ios-key flex items-center justify-center" style={{ flex: 1, height: 43, borderRadius: 6, background: "#fff", color: "#050505", fontSize: 22, textTransform: shifted ? "uppercase" : "lowercase", boxShadow: "0 1.5px 0 rgba(57,59,64,.48)" }}>{shifted ? key.toUpperCase() : key}</button>)}
            <button aria-label="退格" onClick={() => typeKey("backspace")} className="lm-ios-key flex items-center justify-center" style={{ width: 45, height: 43, borderRadius: 6, background: "#AEB4BE", color: "#101114", boxShadow: "0 1.5px 0 rgba(57,59,64,.42)" }}><SFSymbol icon={Delete} size={22} strokeWidth={1.9} /></button>
          </div>

          <div className="flex items-center" style={{ gap: 6, marginTop: 8 }}>
            <button className="lm-ios-key" style={{ width: 46, height: 43, borderRadius: 6, background: "#AEB4BE", color: "#111", fontSize: 17, boxShadow: "0 1.5px 0 rgba(57,59,64,.42)" }}>123</button>
            <button aria-label="表情" className="lm-ios-key flex items-center justify-center" style={{ width: 46, height: 43, borderRadius: 6, background: "#AEB4BE", color: "#111", fontSize: 20, boxShadow: "0 1.5px 0 rgba(57,59,64,.42)" }}>☺</button>
            <button onClick={() => typeKey("space")} className="lm-ios-key" style={{ flex: 1, height: 43, borderRadius: 6, background: "#fff", color: "#111", fontSize: 17, boxShadow: "0 1.5px 0 rgba(57,59,64,.48)" }}>空格</button>
            <button onClick={closeKeyboard} className="lm-ios-key" style={{ width: 82, height: 43, borderRadius: 6, background: query.trim() ? "#6E8BA6" : "#AEB4BE", color: query.trim() ? "white" : "rgba(40,43,48,.42)", fontSize: 17, boxShadow: "0 1.5px 0 rgba(57,59,64,.42)" }}>搜索</button>
          </div>

          <div className="flex items-center justify-between" style={{ height: 34, padding: "9px 23px 0", color: "rgba(45,48,54,.7)" }}>
            <SFSymbol icon={Globe2} size={20} strokeWidth={1.7} />
            <SFSymbol icon={Mic} size={20} strokeWidth={1.7} />
          </div>
        </div>
      )}
    </div>
  );
}
