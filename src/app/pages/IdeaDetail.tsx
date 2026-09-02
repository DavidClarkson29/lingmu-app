import { useEffect, useState } from "react";
import { Archive, Check, ChevronLeft, FileText, Heart, Image as ImageIcon, Mic2, Pause, Pencil, Play, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LiquidGlass } from "../components/LiquidGlass";
import { SFSymbol } from "../components/SFSymbol";
import type { Idea, IdeaKind } from "../data/ideas";

interface IdeaDetailProps {
  idea: Idea;
  relatedIdeas: Idea[];
  onBack: () => void;
  backLabel?: string;
  onSelectIdea: (ideaId: string) => void;
  onUpdateIdea: (ideaId: string, patch: Partial<Idea>) => void;
}

const kindMeta: Record<IdeaKind, { icon: LucideIcon; label: string; color: string; bg: string }> = {
  text: { icon: FileText, label: "文字灵感", color: "#B68931", bg: "rgba(206,160,62,0.11)" },
  image: { icon: ImageIcon, label: "图片灵感", color: "#6C88B2", bg: "rgba(108,136,178,0.11)" },
  voice: { icon: Mic2, label: "语音灵感", color: "#9878B0", bg: "rgba(152,120,176,0.11)" },
};

export function IdeaDetail({ idea, relatedIdeas, onBack, backLabel = "白天回看", onSelectIdea, onUpdateIdea }: IdeaDetailProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(idea.content);
  const [feedback, setFeedback] = useState<"helpful" | "unrelated" | null>(null);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const meta = kindMeta[idea.kind];
  const nextStep = idea.project === "潮汐 demo"
    ? "先复制一版工程再动手。关掉两三轨听一遍，比继续加新声部有用。"
    : idea.project === "夜路小片"
      ? "把这条塞进 15 秒时间线里看看，顺不顺比想不想得明白更重要。"
      : idea.project === "会呼吸的字"
      ? "先做 6 秒，只让字宽动两次。别顺手把整套视觉也做了。"
      : idea.project === "天气小工具"
        ? "先放到手机尺寸里跑一遍，开头超过 1.2 秒就再剪。"
        : "拿地铁反光那段试一次。能用在自己的东西里，才算没白学。";

  useEffect(() => {
    setDraft(idea.content);
    setEditing(false);
    setVoicePlaying(false);
    setVoiceProgress(0);
  }, [idea.content, idea.id]);

  useEffect(() => {
    if (!voicePlaying || idea.kind !== "voice") return;
    const playbackTimer = window.setInterval(() => {
      setVoiceProgress((current) => {
        const next = current + voiceSpeed / 120;
        if (next >= 1) {
          setVoicePlaying(false);
          return 1;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(playbackTimer);
  }, [idea.kind, voicePlaying, voiceSpeed]);

  const saveEdit = () => {
    onUpdateIdea(idea.id, { content: draft });
    setEditing(false);
  };

  return (
    <div className="lm-day-page relative w-full h-full overflow-hidden flex flex-col" style={{ background: "var(--lm-day-bg)" }}>
      <div aria-hidden="true" style={{ height: 54, flexShrink: 0 }} />

      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1" style={{ color: "rgba(0,0,0,0.5)", padding: 4 }}>
          <SFSymbol icon={ChevronLeft} size={20} strokeWidth={1.65} />
          <span style={{ fontSize: 14 }}>{backLabel}</span>
        </button>
        <span style={{ color: "var(--lm-day-ink)", fontSize: 17, fontWeight: 500 }}>灵感详情</span>
        <button
          aria-label="收藏"
          onClick={() => onUpdateIdea(idea.id, { favorite: !idea.favorite })}
          style={{ padding: 6, color: idea.favorite ? "rgba(210,102,120,0.78)" : "rgba(0,0,0,0.3)" }}
        >
          <SFSymbol icon={Heart} size={20} strokeWidth={1.7} fill={idea.favorite ? "rgba(210,102,120,0.2)" : "none"} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3" style={{ minHeight: 0 }}>
        <LiquidGlass mode="day" borderRadius={23} intensity="medium">
          <div style={{ padding: "18px 18px 17px" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 12, background: meta.bg }}>
                  <SFSymbol icon={meta.icon} size={18} color={meta.color} strokeWidth={1.65} />
                </div>
                <div>
                  <div style={{ color: "rgba(0,0,0,0.56)", fontSize: "var(--lm-type-support)", fontWeight: 520 }}>{meta.label}</div>
                  <div style={{ color: "rgba(0,0,0,0.27)", fontSize: "var(--lm-type-caption)", marginTop: 3 }}>{idea.project} · {idea.date} {idea.time}</div>
                </div>
              </div>
              <button onClick={() => editing ? saveEdit() : setEditing(true)} className="flex items-center gap-1.5" style={{ color: "rgba(74,108,145,0.62)", padding: "6px 8px", fontSize: "var(--lm-type-support)" }}>
                <SFSymbol icon={editing ? Check : Pencil} size={14} strokeWidth={1.65} />
                {editing ? "保存" : "编辑"}
              </button>
            </div>

            {idea.kind === "image" && (
              <div className="relative overflow-hidden" style={{ height: 210, margin: "0 -3px 17px", borderRadius: 17, background: idea.cover ?? "linear-gradient(145deg, #d8dfea, #879db8 55%, #53667e)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.28)" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 24%, rgba(255,255,255,.46), transparent 32%), linear-gradient(180deg, transparent 58%, rgba(24,28,35,.18))" }} />
                <div className="absolute" style={{ left: 12, bottom: 10, color: "rgba(255,255,255,.82)", fontSize: 10.5 }}>原始图片 · {idea.date} {idea.time}</div>
              </div>
            )}

            <h1 style={{ color: "var(--lm-day-ink)", fontSize: 21, lineHeight: 1.35, fontWeight: 580 }}>{idea.title}</h1>
            {idea.kind === "voice" && (
              <div style={{ marginTop: 14, padding: "12px 12px 10px", borderRadius: 16, background: "rgba(138,111,158,.075)", border: "1px solid rgba(138,111,158,.09)" }}>
                <div className="flex items-center gap-10px" style={{ gap: 10 }}>
                  <button
                    aria-label={voicePlaying ? "暂停语音" : "播放语音"}
                    onClick={() => {
                      if (voiceProgress >= 1) setVoiceProgress(0);
                      setVoicePlaying((current) => !current);
                    }}
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 38, height: 38, borderRadius: "50%", color: "white", background: "linear-gradient(145deg, #9B82AD, #756487)", boxShadow: "0 5px 13px rgba(105,82,121,.2)" }}
                  >
                    <SFSymbol icon={voicePlaying ? Pause : Play} size={16} strokeWidth={1.9} fill="currentColor" style={{ marginLeft: voicePlaying ? 0 : 2 }} />
                  </button>
                  <div className="relative flex-1 min-w-0" style={{ height: 36 }}>
                    <div className="absolute inset-0 flex items-center" style={{ gap: 2 }}>
                      {[8,14,21,11,27,18,31,16,24,10,20,29,14,34,22,12,25,17,30,19,9,23,15,28,12,20,32,16,25,11,19,27,14,22].map((height, index, bars) => (
                        <span key={index} style={{ flex: 1, height, minWidth: 1.5, borderRadius: 2, background: index / bars.length <= voiceProgress ? "rgba(126,98,146,.82)" : "rgba(126,98,146,.2)", transition: "background 120ms linear" }} />
                      ))}
                    </div>
                    <input
                      aria-label="语音播放进度"
                      type="range"
                      min="0"
                      max="1"
                      step="0.001"
                      value={voiceProgress}
                      onChange={(event) => setVoiceProgress(Number(event.target.value))}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                    />
                  </div>
                </div>
                <div className="flex items-center" style={{ marginTop: 7, paddingLeft: 48, color: "rgba(67,54,75,.38)", fontSize: 9.5 }}>
                  <span>{Math.floor(voiceProgress * 12) < 10 ? "0:0" : "0:"}{Math.floor(voiceProgress * 12)}</span>
                  <span style={{ marginLeft: 3 }}>/ 0:12</span>
                  <button
                    aria-label="切换播放速度"
                    onClick={() => setVoiceSpeed((current) => current === 1 ? 1.5 : current === 1.5 ? 2 : 1)}
                    style={{ marginLeft: "auto", color: "rgba(96,72,110,.62)", padding: "3px 7px", borderRadius: 8, background: "rgba(126,98,146,.08)", fontSize: 9.5 }}
                  >
                    {voiceSpeed}×
                  </button>
                </div>
              </div>
            )}
            {editing ? (
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                autoFocus
                rows={5}
                style={{ width: "100%", marginTop: 13, padding: 12, borderRadius: 14, border: "1px solid rgba(90,120,150,0.13)", background: "rgba(255,255,255,0.42)", color: "rgba(0,0,0,0.64)", fontSize: 14, lineHeight: 1.75, resize: "none" }}
              />
            ) : (
              <div style={{ marginTop: 13 }}>
                {idea.kind === "voice" && <div style={{ color: "rgba(0,0,0,.28)", fontSize: 9.5, marginBottom: 5 }}>语音转写</div>}
                <p style={{ color: "rgba(0,0,0,0.54)", fontSize: 14, lineHeight: 1.85 }}>{idea.content}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-5">
              {idea.tags.map((tag) => (
                <span key={tag} style={{ color: "rgba(77,104,137,0.58)", background: "rgba(108,141,181,0.08)", border: "1px solid rgba(108,141,181,0.1)", borderRadius: 10, padding: "4px 10px", fontSize: "var(--lm-type-caption)" }}>{tag}</span>
              ))}
            </div>
          </div>
        </LiquidGlass>

        {relatedIdeas.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1.5 px-1 mb-2">
              <SFSymbol icon={Sparkles} size={14} color="rgba(116,85,163,0.64)" strokeWidth={1.65} />
              <span style={{ color: "rgba(0,0,0,0.55)", fontSize: "var(--lm-type-section)", fontWeight: 570 }}>和这件事接得上的</span>
              <span style={{ color: "rgba(0,0,0,0.26)", fontSize: "var(--lm-type-caption)" }}>{idea.project}</span>
            </div>
            <LiquidGlass mode="day" borderRadius={20} intensity="soft">
              <div style={{ padding: "13px 14px 11px" }}>
                <p style={{ color: "rgba(0,0,0,0.45)", fontSize: "var(--lm-type-body)", lineHeight: 1.65, marginBottom: 10 }}>
                  不只是看起来有点像，这几条可以直接接着往下做。
                </p>
                {relatedIdeas.slice(0, 2).map((related) => (
                  <button key={related.id} onClick={() => onSelectIdea(related.id)} className="w-full flex items-center gap-3 text-left" style={{ padding: "9px 7px", borderTop: "1px solid rgba(0,0,0,0.045)" }}>
                    <SFSymbol icon={kindMeta[related.kind].icon} size={16} color="rgba(92,116,148,0.58)" strokeWidth={1.65} />
                    <div className="flex-1 min-w-0">
                      <div style={{ color: "rgba(0,0,0,0.64)", fontSize: "var(--lm-type-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{related.title}</div>
                      <div style={{ color: "rgba(0,0,0,0.27)", fontSize: "var(--lm-type-caption)", marginTop: 3 }}>{related.project} · {related.date}</div>
                    </div>
                  </button>
                ))}
                <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.045)" }}>
                  <span style={{ color: "rgba(0,0,0,0.26)", fontSize: "var(--lm-type-caption)" }}>放一起有用吗？</span>
                  <button onClick={() => setFeedback("helpful")} style={{ color: feedback === "helpful" ? "rgba(62,119,82,0.76)" : "rgba(0,0,0,0.3)", fontSize: "var(--lm-type-caption)" }}>有点用</button>
                  <button onClick={() => setFeedback("unrelated")} style={{ color: feedback === "unrelated" ? "rgba(145,90,90,0.7)" : "rgba(0,0,0,0.3)", fontSize: "var(--lm-type-caption)" }}>不相关</button>
                </div>
              </div>
            </LiquidGlass>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center gap-1.5 px-1 mb-2">
            <Sparkles size={14} color="rgba(176,126,35,0.64)" strokeWidth={1.65} />
            <span style={{ color: "rgba(0,0,0,0.55)", fontSize: "var(--lm-type-section)", fontWeight: 550 }}>可以顺手试一下</span>
          </div>
          <LiquidGlass mode="day" borderRadius={19} intensity="soft">
            <div style={{ padding: "13px 14px" }}>
              <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "var(--lm-type-body)", lineHeight: 1.65 }}>
                {nextStep}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button style={{ color: "rgba(78,108,143,0.68)", fontSize: "var(--lm-type-support)" }}>记到待办</button>
                <button style={{ color: "rgba(0,0,0,0.3)", fontSize: "var(--lm-type-support)" }}>换一个</button>
              </div>
            </div>
          </LiquidGlass>
        </div>

        <button
          onClick={() => {
            onUpdateIdea(idea.id, { archived: true });
            onBack();
          }}
          className="w-full flex items-center justify-center gap-2 mt-4"
          style={{ height: 38, color: "rgba(0,0,0,0.28)", fontSize: 10.5 }}
        >
          <SFSymbol icon={Archive} size={14} strokeWidth={1.65} />
          归档这条灵感
        </button>
      </div>

      <div aria-hidden="true" style={{ height: 23, flexShrink: 0 }} />
    </div>
  );
}
