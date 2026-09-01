import { useState, useRef, useEffect } from "react";
import { StarField } from "../components/StarField";
import { LiquidGlass } from "../components/LiquidGlass";
import { FloatingTabBar } from "../components/FloatingTabBar";
import { CalendarDays, Camera, Mic, MoonStar, Send, Sparkles, Square } from "lucide-react";
import { SFSymbol } from "../components/SFSymbol";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "day-ai";

interface NightInputProps {
  onNavigate: (page: Page) => void;
}

const CONSTELLATION_NAMES = ["", "北极星 α", "参宿四 β", "天狼星 γ", "织女星 δ", "心宿二 ε"];

export function NightInput({ onNavigate }: NightInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [entryCount, setEntryCount] = useState(0);
  const [entries, setEntries] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 393, h: 852 });

  useEffect(() => {
    if (containerRef.current) {
      setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
    }
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    setIsSending(true);
    const content = text.trim();
    setTimeout(() => {
      setEntries((prev) => [...prev, content]);
      setEntryCount((c) => c + 1);
      setText("");
      setIsSending(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 600);
  };

  const handleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      if (!text.trim()) {
        setText("夜风穿过窗边时，像一段没有结尾的旋律。");
      }
      return;
    }
    setIsRecording(true);
  };

  const constellationName = CONSTELLATION_NAMES[Math.min(entryCount, 5)] || "";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(170deg, #0d1b3e 0%, #060c1f 40%, #020408 100%)" }}
    >
      <StarField width={dims.w} height={dims.h} entryCount={entryCount} />

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

      {/* Success toast */}
      {showSuccess && (
        <div className="absolute z-30 left-1/2" style={{ top: "35%", transform: "translateX(-50%)", animation: "fadeInUp 0.4s ease" }}>
          <LiquidGlass mode="night" borderRadius={16} intensity="soft">
            <div className="flex items-center gap-2" style={{ padding: "8px 16px" }}>
              <SFSymbol icon={Sparkles} size={14} color="rgba(180,220,255,0.9)" strokeWidth={1.65} />
              <span style={{ color: "rgba(180,220,255,0.9)", fontSize: 12 }}>已收下，明早见</span>
            </div>
          </LiquidGlass>
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
      <div className="relative z-10 px-4 mb-4 shrink-0">
        <LiquidGlass mode="night" borderRadius={22} intensity="medium">
          <div style={{ padding: "20px 20px 16px 20px" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isRecording ? "正在听... 再点一次结束" : "把灵感扔进夜空..."}
              rows={3}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.7, resize: "none", caretColor: "rgba(120,180,255,0.9)" }}
              className="placeholder:text-[rgba(255,255,255,0.3)]"
            />
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0 14px 0" }} />
            <div className="flex items-center gap-1.5 mb-3" style={{ color: "rgba(150,190,245,0.46)" }}>
              <SFSymbol icon={MoonStar} size={13} strokeWidth={1.6} />
              <span style={{ fontSize: 10.5, letterSpacing: 0.2 }}>不用分类，也不用想完整</span>
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
              <button onClick={handleSend} disabled={!text.trim()} style={{
                width: 48, height: 48, borderRadius: "50%",
                background: isSending ? "rgba(60,100,200,0.9)" : text.trim() ? "linear-gradient(135deg, rgba(80,140,255,0.9), rgba(100,80,220,0.9))" : "rgba(60,80,140,0.4)",
                border: "1px solid rgba(120,160,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: text.trim() ? "0 0 20px rgba(80,120,255,0.35)" : "none", transition: "all 0.3s", cursor: text.trim() ? "pointer" : "default",
              }}>
                {isSending ? (
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.8)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <SFSymbol icon={Send} size={20} color="white" strokeWidth={1.9} />
                )}
              </button>
            </div>
          </div>
        </LiquidGlass>
      </div>

      {/* Floating Tab Bar */}
      <FloatingTabBar current="night-input" onNavigate={onNavigate} mode="night" />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        textarea::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>
    </div>
  );
}
