import { useState, useRef, useEffect } from "react";
import { StarField } from "../components/StarField";
import { LiquidGlass } from "../components/LiquidGlass";
import { FloatingTabBar } from "../components/FloatingTabBar";
import { ArrowUp, CalendarDays, Camera, ChevronDown, Delete, Globe2, Mic, MoonStar, Send, Sparkles, Square } from "lucide-react";
import { SFSymbol } from "../components/SFSymbol";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface NightInputProps {
  onNavigate: (page: Page) => void;
  totalEntries: number;
  onEntrySaved: () => void;
}

const CONSTELLATION_NAMES = ["", "北极星 α", "参宿四 β", "天狼星 γ", "织女星 δ", "心宿二 ε"];

export function NightInput({ onNavigate, totalEntries, onEntrySaved }: NightInputProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [entryCount, setEntryCount] = useState(0);
  const [entries, setEntries] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [keyboardMounted, setKeyboardMounted] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [shifted, setShifted] = useState(false);
  const [activeField, setActiveField] = useState<"title" | "body">("body");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputPanelRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 393, h: 852 });

  useEffect(() => {
    if (containerRef.current) {
      setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
    }
  }, []);

  useEffect(() => {
    if (keyboardOpen || !keyboardMounted) return;
    const unmountTimer = window.setTimeout(() => setKeyboardMounted(false), 340);
    return () => window.clearTimeout(unmountTimer);
  }, [keyboardMounted, keyboardOpen]);

  const openKeyboard = (field: "title" | "body") => {
    setActiveField(field);
    if (keyboardMounted) {
      setKeyboardOpen(true);
      return;
    }
    setKeyboardMounted(true);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setKeyboardOpen(true)));
  };

  const closeKeyboard = () => {
    setKeyboardOpen(false);
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) activeElement.blur();
  };

  const updateActiveField = (updater: (current: string) => string) => {
    if (activeField === "title") setTitle(updater);
    else setText(updater);
  };

  const typeKey = (key: string) => {
    if (key === "backspace") return updateActiveField((current) => current.slice(0, -1));
    if (key === "space") return updateActiveField((current) => `${current} `);
    updateActiveField((current) => current + (shifted ? key.toUpperCase() : key));
    if (shifted) setShifted(false);
  };

  const handleSend = () => {
    if (!title.trim() && !text.trim()) return;
    setIsSending(true);
    const content = [title.trim(), text.trim()].filter(Boolean).join(" · ");
    setTimeout(() => {
      setEntries((prev) => [...prev, content]);
      setEntryCount((c) => c + 1);
      onEntrySaved();
      setTitle("");
      setText("");
      setIsSending(false);
    }, 600);
  };

  const handleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      if (!text.trim()) {
        setText("副歌前空一拍试试，别一下塞太满。");
      }
      return;
    }
    setIsRecording(true);
  };

  const constellationStage = Math.min(5, Math.floor(totalEntries / 3));
  const constellationName = CONSTELLATION_NAMES[constellationStage] || "";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(170deg, #0d1b3e 0%, #060c1f 40%, #020408 100%)" }}
      onPointerDown={(event) => {
        if (!keyboardMounted) return;
        const target = event.target as Node;
        if (!keyboardRef.current?.contains(target) && !inputPanelRef.current?.contains(target)) closeKeyboard();
      }}
    >
      <StarField width={dims.w} height={dims.h} entryCount={constellationStage} />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 30%, rgba(30,60,120,0.25) 0%, transparent 70%)" }}
      />

      {/* Persistent iOS status bar is rendered by the app shell. */}
      <div aria-hidden="true" style={{ height: 54, flexShrink: 0 }} />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center pt-1 pb-1 shrink-0">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l1.5 3.5L13 5.5l-2.5 2.5.5 3.5L8 10 5 11.5l.5-3.5L3 5.5l3.5-1L8 1z" fill="rgba(160,210,255,0.9)" />
          </svg>
          <span style={{ color: "rgba(255,255,255,0.92)", fontSize: 17, fontWeight: 500, letterSpacing: 0.5 }}>
            灵沐 LingMu
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            <SFSymbol icon={CalendarDays} size={12} strokeWidth={1.65} />
            3月17日 · 周二
          </span>
          <span style={{ background: "rgba(80,140,220,0.25)", border: "1px solid rgba(80,140,220,0.4)", color: "rgba(130,190,255,0.9)", fontSize: 10, padding: "1px 8px", borderRadius: 10 }}>
            {12 + entryCount}条灵感
          </span>
        </div>
      </div>

      {/* Constellation label */}
      {constellationName && (
        <div className="absolute z-10" style={{ top: "23%", left: "50%", transform: "translateX(-50%)" }}>
          <span style={{ color: "rgba(140,190,255,0.4)", fontSize: 10, letterSpacing: 2, transition: "opacity 0.8s" }}>
            {constellationName}
          </span>
        </div>
      )}

      {entryCount > 0 && (
        <div className="absolute z-10" style={{ top: "27%", left: "50%", transform: "translateX(-50%)" }}>
          <span className="flex items-center gap-1" style={{ color: "rgba(160,200,255,0.3)", fontSize: 9, letterSpacing: 1 }}>
            <SFSymbol icon={Sparkles} size={10} strokeWidth={1.6} />
            今夜已留下 {Math.min(entryCount, 5)} 个光点
          </span>
        </div>
      )}

      {/* Recent entries */}
      {entries.length > 0 && (
        <div className="absolute z-10 left-4 right-4" style={{ top: "40%", maxHeight: "18%" }}>
          <div className="flex flex-col items-center gap-1">
            {entries.slice(-3).map((entry, i) => (
              <span key={i} style={{ color: `rgba(140,190,255,${0.2 + i * 0.1})`, fontSize: 10, letterSpacing: 0.5, maxWidth: "80%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                「{entry}」
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* Main Input Area — mb-4 to match px-4 spacing to tab bar */}
      <div
        ref={inputPanelRef}
        className="relative z-10 px-4 mb-4 shrink-0"
        style={{
          transform: keyboardOpen ? "translate3d(0,-216px,0)" : "translate3d(0,0,0)",
          transition: keyboardOpen
            ? "transform 360ms cubic-bezier(.32,.72,0,1)"
            : "transform 320ms cubic-bezier(.32,.72,0,1)",
          willChange: "transform",
        }}
      >
        <LiquidGlass mode="night" borderRadius={22} intensity="medium">
          <div style={{ padding: "15px 20px 15px" }}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onFocus={() => openKeyboard("title")}
              inputMode="none"
              placeholder="标题"
              aria-label="灵感标题"
              style={{ width: "100%", height: 31, background: "transparent", border: "none", outline: "none", color: "rgba(255,255,255,.9)", fontSize: 15, fontWeight: 560, caretColor: "rgba(135,190,255,.95)" }}
              className="placeholder:text-[rgba(255,255,255,0.26)]"
            />
            <div style={{ height: 1, background: "rgba(255,255,255,.075)", margin: "3px 0 8px" }} />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => openKeyboard("body")}
              inputMode="none"
              placeholder={isRecording ? "正在听... 再点一次结束" : "随便写两句，没想清楚也行…"}
              rows={2}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "rgba(255,255,255,0.82)", fontSize: 14.5, lineHeight: 1.65, resize: "none", caretColor: "rgba(120,180,255,0.9)" }}
              className="placeholder:text-[rgba(255,255,255,0.3)]"
            />
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0 11px" }} />
            <div className="flex items-center gap-1.5 mb-2" style={{ color: "rgba(150,190,245,0.46)" }}>
              <SFSymbol icon={MoonStar} size={13} strokeWidth={1.6} />
              <span style={{ fontSize: 10.5, letterSpacing: 0.2 }}>想到哪写到哪，白天再看它属于哪件事</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  aria-label="拍照记录"
                  onClick={() => onNavigate("night-camera")}
                  style={{ color: "rgba(255,255,255,0.45)", padding: 6 }}
                  className="flex items-center gap-1 transition-opacity hover:opacity-80"
                >
                  <SFSymbol icon={Camera} size={22} color="rgba(255,255,255,0.5)" strokeWidth={1.65} />
                </button>
                <button
                  aria-label={isRecording ? "结束语音记录" : "语音记录"}
                  onClick={handleVoice}
                  style={{
                    color: isRecording ? "rgba(150,195,255,0.95)" : "rgba(255,255,255,0.45)",
                    padding: 6,
                    borderRadius: 10,
                    background: isRecording ? "rgba(80,130,220,0.18)" : "transparent",
                    transition: "all 0.2s",
                  }}
                  className="flex items-center gap-1.5"
                >
                  <SFSymbol icon={isRecording ? Square : Mic} size={20} strokeWidth={1.65} fill={isRecording ? "currentColor" : "none"} />
                  {isRecording && <span style={{ fontSize: 10.5 }}>正在听</span>}
                </button>
              </div>
              <button onClick={handleSend} disabled={!title.trim() && !text.trim()} style={{
                width: 48, height: 48, borderRadius: "50%",
                background: isSending ? "rgba(60,100,200,0.9)" : title.trim() || text.trim() ? "linear-gradient(135deg, rgba(80,140,255,0.9), rgba(100,80,220,0.9))" : "rgba(60,80,140,0.4)",
                border: "1px solid rgba(120,160,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: title.trim() || text.trim() ? "0 0 20px rgba(80,120,255,0.35)" : "none", transition: "all 0.3s", cursor: title.trim() || text.trim() ? "pointer" : "default",
              }}>
                {isSending ? (
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.8)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <span className="flex items-center justify-center" style={{ width: 22, height: 22, transform: "translate3d(-1px,1px,0)" }}>
                    <SFSymbol icon={Send} size={20} color="white" strokeWidth={1.9} />
                  </span>
                )}
              </button>
            </div>
          </div>
        </LiquidGlass>
      </div>

      {/* Floating Tab Bar */}
      <FloatingTabBar current="night-input" onNavigate={onNavigate} mode="night" />

      {keyboardMounted && (
        <div
          ref={keyboardRef}
          aria-hidden={!keyboardOpen}
          className="absolute left-0 right-0 bottom-0"
          onPointerDown={(event) => event.stopPropagation()}
          style={{
            zIndex: 160,
            padding: "7px 6px 17px",
            background: "rgba(43,43,44,.99)",
            boxShadow: keyboardOpen ? "0 -12px 32px rgba(0,0,0,.38)" : "none",
            transform: keyboardOpen ? "translate3d(0,0,0)" : "translate3d(0,102%,0)",
            transition: keyboardOpen
              ? "transform 360ms cubic-bezier(.32,.72,0,1), box-shadow 280ms ease"
              : "transform 320ms cubic-bezier(.32,.72,0,1), box-shadow 220ms ease",
            willChange: "transform",
          }}
        >
          <div className="flex items-center overflow-hidden" style={{ height: 37, padding: "0 4px 6px", color: "white", fontSize: 16 }}>
            <div className="flex flex-1 items-center justify-around">
              {["我", "你", "这", "但是", "哎", "还", "这个", "那", "感觉"].map((word) => <button key={word} onClick={() => updateActiveField((current) => current + word)} style={{ minWidth: 25, color: "rgba(255,255,255,.96)" }}>{word}</button>)}
            </div>
            <button aria-label="收起键盘" onClick={closeKeyboard} className="flex items-center justify-center" style={{ width: 34, height: 30, color: "white", borderLeft: "1px solid rgba(255,255,255,.11)" }}><SFSymbol icon={ChevronDown} size={22} strokeWidth={2} /></button>
          </div>

          {["qwertyuiop", "asdfghjkl"].map((row, rowIndex) => (
            <div key={row} className="flex justify-center" style={{ gap: 5, marginTop: rowIndex ? 7 : 0, padding: rowIndex ? "0 20px" : 0 }}>
              {[...row].map((key) => <button key={key} onClick={() => typeKey(key)} className="flex items-center justify-center" style={{ flex: 1, height: 43, maxWidth: 36, borderRadius: 6, background: "linear-gradient(180deg, #7c7c7d, #686869)", color: "white", fontSize: 22, textTransform: shifted ? "uppercase" : "lowercase", boxShadow: "0 1.5px 0 rgba(0,0,0,.78), inset 0 1px rgba(255,255,255,.08)" }}>{shifted ? key.toUpperCase() : key}</button>)}
            </div>
          ))}

          <div className="flex items-center" style={{ gap: 5, marginTop: 7 }}>
            <button aria-label="大写" onClick={() => setShifted((current) => !current)} className="flex items-center justify-center" style={{ width: 45, height: 43, borderRadius: 6, background: shifted ? "#9b9b9d" : "linear-gradient(180deg, #575759, #49494b)", color: "white", boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}><SFSymbol icon={ArrowUp} size={22} strokeWidth={2.1} /></button>
            {[..."zxcvbnm"].map((key) => <button key={key} onClick={() => typeKey(key)} className="flex items-center justify-center" style={{ flex: 1, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #7c7c7d, #686869)", color: "white", fontSize: 22, boxShadow: "0 1.5px 0 rgba(0,0,0,.78), inset 0 1px rgba(255,255,255,.08)" }}>{shifted ? key.toUpperCase() : key}</button>)}
            <button aria-label="退格" onClick={() => typeKey("backspace")} className="flex items-center justify-center" style={{ width: 45, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #575759, #49494b)", color: "white", boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}><SFSymbol icon={Delete} size={22} strokeWidth={1.9} /></button>
          </div>

          <div className="flex items-center" style={{ gap: 6, marginTop: 8 }}>
            <button style={{ width: 46, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #575759, #49494b)", color: "white", fontSize: 17, boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}>123</button>
            <button aria-label="表情" className="flex items-center justify-center" style={{ width: 46, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #575759, #49494b)", color: "white", fontSize: 20, boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}>☺</button>
            <button onClick={() => typeKey("space")} style={{ flex: 1, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #7c7c7d, #686869)", color: "white", fontSize: 17, boxShadow: "0 1.5px 0 rgba(0,0,0,.78)" }}>空格</button>
            <button onClick={closeKeyboard} style={{ width: 82, height: 43, borderRadius: 6, background: title.trim() || text.trim() ? "#596F8E" : "linear-gradient(180deg, #575759, #49494b)", color: title.trim() || text.trim() ? "white" : "rgba(255,255,255,.34)", fontSize: 17, boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}>完成</button>
          </div>

          <div className="flex items-center justify-between" style={{ height: 34, padding: "9px 23px 0", color: "rgba(255,255,255,.88)" }}>
            <SFSymbol icon={Globe2} size={20} strokeWidth={1.7} />
            <SFSymbol icon={Mic} size={20} strokeWidth={1.7} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>
    </div>
  );
}
