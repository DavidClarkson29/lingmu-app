import { ChevronLeft, FileText, Image as ImageIcon, Mic2, Sparkles } from "lucide-react";
import { LiquidGlass } from "../components/LiquidGlass";
import { SFSymbol } from "../components/SFSymbol";

type Page = "day-dashboard" | "morning-review";

interface MorningReviewProps {
  onNavigate: (page: Page) => void;
  inkAnimationStartedAt?: number | null;
}

const captureSummary = [
  { icon: FileText, label: "文字", value: 2, color: "#9B7847" },
  { icon: ImageIcon, label: "图片", value: 2, color: "#6687A2" },
  { icon: Mic2, label: "语音", value: 1, color: "#8C759B" },
];

export function MorningReview({ onNavigate, inkAnimationStartedAt = null }: MorningReviewProps) {
  const inkElapsed = inkAnimationStartedAt === null ? 0 : Math.max(0, Date.now() - inkAnimationStartedAt);
  const shouldAnimateInk = inkAnimationStartedAt !== null;

  return (
    <div className="lm-day-page relative w-full h-full overflow-hidden flex flex-col" style={{ background: "var(--lm-day-bg)" }}>
      <div aria-hidden="true" style={{ height: 54, flexShrink: 0 }} />

      <main className="flex-1 min-h-0 px-3.5 pb-2.5">
        <LiquidGlass mode="day" borderRadius={22} intensity="medium" material="liquid" className="h-full">
          <article className="relative h-full overflow-hidden flex flex-col" style={{ padding: "15px 17px 14px", background: "rgba(250,247,239,0.78)" }}>
            <header className="shrink-0">
              <div className="flex items-center justify-between">
                <button aria-label="返回白天回看" onClick={() => onNavigate("day-dashboard")} className="flex items-center" style={{ width: 34, height: 34, marginLeft: -7, color: "rgba(44,39,34,0.48)" }}>
                  <SFSymbol icon={ChevronLeft} size={21} strokeWidth={1.65} />
                </button>
                <div style={{ color: "rgba(44,39,34,0.44)", fontSize: 10, letterSpacing: 1.6 }}>NO. 0317</div>
              </div>

              <div className="flex items-end justify-between" style={{ marginTop: 5 }}>
                <div>
                  <div style={{ color: "#38332E", fontFamily: '"Songti SC", "STSong", serif', fontSize: 29, lineHeight: 1, fontWeight: 700, letterSpacing: 1.5 }}>灵沐日报</div>
                  <div style={{ color: "rgba(56,51,46,0.42)", fontSize: 9.5, marginTop: 6, letterSpacing: 1.9 }}>LINGMU DAILY</div>
                </div>
                <div className="text-right">
                  <div style={{ color: "#4A443E", fontSize: 20, fontWeight: 540, lineHeight: 1 }}>09:41</div>
                  <div style={{ color: "rgba(56,51,46,0.42)", fontSize: 10.5, marginTop: 6 }}>2026年3月17日 · 周二</div>
                </div>
              </div>

              <div className="flex items-center gap-2" style={{ marginTop: 13 }}>
                <div style={{ height: 2, background: "rgba(56,51,46,0.72)", flex: 1 }} />
                <div style={{ color: "rgba(56,51,46,0.42)", fontSize: 9.5, letterSpacing: 1.2 }}>昨夜之后 · 今日之前</div>
                <div style={{ height: 2, background: "rgba(56,51,46,0.72)", flex: 1 }} />
              </div>
            </header>

            <section
              className="relative flex-1 min-h-0"
              style={{ margin: "6px -3px 5px" }}
            >
              <img
                src="/art/daily-ink-space-v3.png"
                alt="雨后门廊与空巷的水墨小景"
                className={`lm-daily-ink ${shouldAnimateInk ? "lm-daily-ink-enter" : "lm-daily-ink-static"} absolute object-contain`}
                style={{ inset: "18px -4px 10px 8px", width: "calc(100% - 4px)", height: "calc(100% - 28px)", objectPosition: "center", filter: "saturate(.68) contrast(.9)", opacity: .84, animationDelay: shouldAnimateInk ? `${160 - inkElapsed}ms` : undefined }}
              />

              <div className={`${shouldAnimateInk ? "lm-daily-copy-enter" : ""} relative flex h-full flex-col`} style={{ padding: "13px 12px 8px", animationDelay: shouldAnimateInk ? `${500 - inkElapsed}ms` : undefined }}>
                <div className="flex items-center gap-1.5" style={{ color: "#806A8C" }}>
                  <SFSymbol icon={Sparkles} size={12} strokeWidth={1.6} />
                  <span style={{ fontSize: 10, letterSpacing: 1.8 }}>今日格言 · 一隅心景</span>
                </div>
                <blockquote style={{ color: "#37322D", fontFamily: '"Songti SC", "STSong", serif', fontSize: 25, fontWeight: 650, lineHeight: 1.46, letterSpacing: 1.2, marginTop: 9, textShadow: "0 1px 0 rgba(255,255,255,.65)" }}>
                  模糊的念头，<br />也会自己找方向。
                </blockquote>

                <div className="mt-auto" style={{ maxWidth: 226, padding: "8px 18px 6px 4px", background: "linear-gradient(90deg, rgba(250,247,239,.94) 0%, rgba(250,247,239,.76) 70%, transparent 100%)" }}>
                  <div style={{ width: 31, height: 1, background: "rgba(87,74,63,.38)", marginBottom: 7 }} />
                  <p style={{ color: "rgba(56,51,46,.72)", fontSize: 10.5, lineHeight: 1.62 }}>
                    昨晚几条其实都在给《夜路小片》补东西：楼梯光是开头，便利店的蓝接中间，鼓点空一下刚好能切镜头。
                  </p>
                  <div style={{ color: "#668099", fontSize: 9, marginTop: 5, letterSpacing: .1 }}>
                    今天先补两个 8 秒镜头，不用想完整片子
                  </div>
                </div>
              </div>
            </section>

            <footer className="shrink-0" style={{ borderTop: "1px solid rgba(56,51,46,0.22)", paddingTop: 11 }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ color: "#4A443E", fontSize: 12.5, fontWeight: 580 }}>昨夜收录</div>
                  <div style={{ color: "rgba(56,51,46,0.4)", fontSize: 10.5, marginTop: 2 }}>19:00—00:00 · 5 条随手记</div>
                </div>
                <div className="flex items-center" style={{ gap: 9 }}>
                  {captureSummary.map((item) => (
                    <div key={item.label} className="flex items-center gap-1" style={{ color: item.color }}>
                      <SFSymbol icon={item.icon} size={12} strokeWidth={1.6} />
                      <span style={{ fontSize: 10.5 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2" style={{ marginTop: 10, padding: "9px 10px", borderRadius: 11, background: "rgba(80,72,63,0.055)" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#B68A52", flexShrink: 0 }} />
                <span className="truncate" style={{ color: "rgba(56,51,46,0.5)", fontSize: 10.5 }}>最后一条：《夜路小片》的鼓点先空一下</span>
              </div>
            </footer>
          </article>
        </LiquidGlass>
      </main>

      <div aria-hidden="true" style={{ height: 23, flexShrink: 0 }} />

      <style>{`
        .lm-daily-ink {
          -webkit-mask-image: radial-gradient(ellipse at center, #000 0 46%, rgba(0,0,0,.82) 57%, transparent 74%);
          mask-image: radial-gradient(ellipse at center, #000 0 46%, rgba(0,0,0,.82) 57%, transparent 74%);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: 61% 48%;
          mask-position: 61% 48%;
          transform-origin: 61% 48%;
        }
        .lm-daily-ink-enter { animation: lmDailyInkBloom 1450ms cubic-bezier(.2,.68,.2,1) both; }
        .lm-daily-ink-static { -webkit-mask-size: 165% 150%; mask-size: 165% 150%; }
        .lm-daily-copy-enter { animation: lmDailyCopyReveal 720ms ease-out both; }
        @keyframes lmDailyInkBloom {
          0% {
            opacity: 0;
            filter: saturate(.55) contrast(.78) blur(8px);
            transform: scale(.94);
            -webkit-mask-size: 8% 7%;
            mask-size: 8% 7%;
          }
          38% { opacity: .52; }
          72% { filter: saturate(.62) contrast(.86) blur(2px); }
          100% {
            opacity: .84;
            filter: saturate(.68) contrast(.9) blur(0);
            transform: scale(1);
            -webkit-mask-size: 165% 150%;
            mask-size: 165% 150%;
          }
        }
        @keyframes lmDailyCopyReveal {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lm-daily-ink, .lm-daily-copy-enter { animation: none; }
          .lm-daily-ink { -webkit-mask-size: 165% 150%; mask-size: 165% 150%; }
        }
      `}</style>
    </div>
  );
}
