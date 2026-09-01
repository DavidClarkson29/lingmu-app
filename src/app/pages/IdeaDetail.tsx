import { useState } from "react";
import { Archive, Check, ChevronLeft, FileText, Heart, Image as ImageIcon, Mic2, Pencil, Sparkles } from "lucide-react";
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
  const meta = kindMeta[idea.kind];

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
                  <div style={{ color: "rgba(0,0,0,0.27)", fontSize: "var(--lm-type-caption)", marginTop: 3 }}>{idea.date} · {idea.time}</div>
                </div>
              </div>
              <button onClick={() => editing ? saveEdit() : setEditing(true)} className="flex items-center gap-1.5" style={{ color: "rgba(74,108,145,0.62)", padding: "6px 8px", fontSize: "var(--lm-type-support)" }}>
                <SFSymbol icon={editing ? Check : Pencil} size={14} strokeWidth={1.65} />
                {editing ? "保存" : "编辑"}
              </button>
            </div>

            <h1 style={{ color: "var(--lm-day-ink)", fontSize: 21, lineHeight: 1.35, fontWeight: 580 }}>{idea.title}</h1>
            {editing ? (
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                autoFocus
                rows={5}
                style={{ width: "100%", marginTop: 13, padding: 12, borderRadius: 14, border: "1px solid rgba(90,120,150,0.13)", background: "rgba(255,255,255,0.42)", color: "rgba(0,0,0,0.64)", fontSize: 14, lineHeight: 1.75, resize: "none" }}
              />
            ) : (
              <p style={{ color: "rgba(0,0,0,0.54)", fontSize: 14, lineHeight: 1.85, marginTop: 13 }}>{idea.content}</p>
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
              <span style={{ color: "rgba(0,0,0,0.55)", fontSize: "var(--lm-type-section)", fontWeight: 570 }}>灵感回声</span>
              <span style={{ color: "rgba(0,0,0,0.26)", fontSize: "var(--lm-type-caption)" }}>来自你的旧记录</span>
            </div>
            <LiquidGlass mode="day" borderRadius={20} intensity="soft">
              <div style={{ padding: "13px 14px 11px" }}>
                <p style={{ color: "rgba(0,0,0,0.45)", fontSize: "var(--lm-type-body)", lineHeight: 1.65, marginBottom: 10 }}>
                  这条记录与下面两条灵感共享相似的空间情绪。
                </p>
                {relatedIdeas.slice(0, 2).map((related) => (
                  <button key={related.id} onClick={() => onSelectIdea(related.id)} className="w-full flex items-center gap-3 text-left" style={{ padding: "9px 7px", borderTop: "1px solid rgba(0,0,0,0.045)" }}>
                    <SFSymbol icon={kindMeta[related.kind].icon} size={16} color="rgba(92,116,148,0.58)" strokeWidth={1.65} />
                    <div className="flex-1 min-w-0">
                      <div style={{ color: "rgba(0,0,0,0.64)", fontSize: "var(--lm-type-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{related.title}</div>
                      <div style={{ color: "rgba(0,0,0,0.27)", fontSize: "var(--lm-type-caption)", marginTop: 3 }}>{related.date} · {related.tags.slice(0, 2).join(" · ")}</div>
                    </div>
                  </button>
                ))}
                <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.045)" }}>
                  <span style={{ color: "rgba(0,0,0,0.26)", fontSize: "var(--lm-type-caption)" }}>这个关联有启发吗？</span>
                  <button onClick={() => setFeedback("helpful")} style={{ color: feedback === "helpful" ? "rgba(62,119,82,0.76)" : "rgba(0,0,0,0.3)", fontSize: "var(--lm-type-caption)" }}>有启发</button>
                  <button onClick={() => setFeedback("unrelated")} style={{ color: feedback === "unrelated" ? "rgba(145,90,90,0.7)" : "rgba(0,0,0,0.3)", fontSize: "var(--lm-type-caption)" }}>不相关</button>
                </div>
              </div>
            </LiquidGlass>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center gap-1.5 px-1 mb-2">
            <Sparkles size={14} color="rgba(176,126,35,0.64)" strokeWidth={1.65} />
            <span style={{ color: "rgba(0,0,0,0.55)", fontSize: "var(--lm-type-section)", fontWeight: 550 }}>一条创意线索</span>
          </div>
          <LiquidGlass mode="day" borderRadius={19} intensity="soft">
            <div style={{ padding: "13px 14px" }}>
              <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "var(--lm-type-body)", lineHeight: 1.65 }}>
                记录三个“没有人物，却能感到人存在”的空间。
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button style={{ color: "rgba(78,108,143,0.68)", fontSize: "var(--lm-type-support)" }}>保存线索</button>
                <button style={{ color: "rgba(0,0,0,0.3)", fontSize: "var(--lm-type-support)" }}>换一个方向</button>
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
