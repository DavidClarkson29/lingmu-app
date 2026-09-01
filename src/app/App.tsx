import { useEffect, useRef, useState } from "react";
import { NightInput } from "./pages/NightInput";
import { NightCamera } from "./pages/NightCamera";
import { DayDashboard } from "./pages/DayDashboard";
import { DayAIInsights } from "./pages/DayAIInsights";
import { Profile } from "./pages/Profile";
import { DayCalendar } from "./pages/DayCalendar";
import { MorningReview } from "./pages/MorningReview";
import { IdeaDetail } from "./pages/IdeaDetail";
import { IDEAS_STORAGE_KEY, INITIAL_IDEAS } from "./data/ideas";
import type { Idea } from "./data/ideas";
import { CalendarDays, Camera, Moon, Sparkles, Sun, Sunrise, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SFSymbol } from "./components/SFSymbol";
import { IOSStatusBar } from "./components/IOSStatusBar";
import { HomeIndicator } from "./components/HomeIndicator";

type Page = "night-input" | "night-camera" | "profile" | "day-dashboard" | "morning-review" | "idea-detail" | "day-ai" | "day-calendar";

const PAGE_ORDER: Page[] = ["night-input", "night-camera", "profile", "day-dashboard", "morning-review", "idea-detail", "day-ai", "day-calendar"];
const PRIMARY_TABS = new Set<Page>(["night-input", "profile", "day-dashboard"]);

interface PageTransition {
  from: Page;
  to: Page;
  kind: "push" | "fade";
  direction: 1 | -1;
  active: boolean;
  duration: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("night-input");
  const [displayPage, setDisplayPage] = useState<Page>("night-input");
  const [pageTransition, setPageTransition] = useState<PageTransition | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const transitionLockedRef = useRef(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState("city-breath");
  const [selectedInsightId, setSelectedInsightId] = useState("emotion");
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    try {
      const stored = window.localStorage.getItem(IDEAS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_IDEAS;
    } catch {
      return INITIAL_IDEAS;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => () => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
  }, []);

  const navigate = (page: Page) => {
    if (page === currentPage || transitionLockedRef.current) return;

    if (PRIMARY_TABS.has(displayPage) && PRIMARY_TABS.has(page)) {
      setCurrentPage(page);
      setDisplayPage(page);
      setPageTransition(null);
      return;
    }

    transitionLockedRef.current = true;
    const kind: PageTransition["kind"] = page === "night-camera" || displayPage === "night-camera" ? "fade" : "push";
    const direction: 1 | -1 = PAGE_ORDER.indexOf(page) >= PAGE_ORDER.indexOf(displayPage) ? 1 : -1;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 40 : kind === "fade" ? 220 : 430;

    setCurrentPage(page);
    setPageTransition({ from: displayPage, to: page, kind, direction, active: false, duration });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setPageTransition((current) => current?.to === page ? { ...current, active: true } : current);
      });
    });

    transitionTimerRef.current = window.setTimeout(() => {
      setDisplayPage(page);
      setPageTransition(null);
      transitionLockedRef.current = false;
      transitionTimerRef.current = null;
    }, duration + 20);
  };

  const isNightPage = currentPage === "night-input" || currentPage === "night-camera";

  const renderPage = (page: Page) => {
    switch (page) {
      case "night-input":
        return <NightInput onNavigate={navigate} />;
      case "night-camera":
        return <NightCamera onNavigate={navigate} />;
      case "profile":
        return <Profile onNavigate={navigate} />;
      case "day-dashboard":
        return (
          <DayDashboard
            ideas={ideas}
            onNavigate={navigate}
            onOpenIdea={(ideaId) => {
              setSelectedIdeaId(ideaId);
              navigate("idea-detail");
            }}
            onOpenInsight={(tagId) => {
              setSelectedInsightId(tagId);
              navigate("day-ai");
            }}
          />
        );
      case "morning-review":
        return <MorningReview onNavigate={navigate} />;
      case "idea-detail": {
        const selectedIdea = ideas.find((idea) => idea.id === selectedIdeaId) || ideas[0];
        if (!selectedIdea) return (
          <DayDashboard
            ideas={ideas}
            onNavigate={navigate}
            onOpenIdea={setSelectedIdeaId}
            onOpenInsight={(tagId) => {
              setSelectedInsightId(tagId);
              navigate("day-ai");
            }}
          />
        );
        return (
          <IdeaDetail
            idea={selectedIdea}
            relatedIdeas={selectedIdea.relatedIds.map((id) => ideas.find((idea) => idea.id === id)).filter((idea): idea is Idea => Boolean(idea))}
            onBack={() => navigate("day-dashboard")}
            backLabel="白天回看"
            onSelectIdea={setSelectedIdeaId}
            onUpdateIdea={(ideaId, patch) => setIdeas((currentIdeas) => currentIdeas.map((idea) => idea.id === ideaId ? { ...idea, ...patch } : idea))}
          />
        );
      }
      case "day-ai":
        return <DayAIInsights onNavigate={navigate} initialTagId={selectedInsightId} />;
      case "day-calendar":
        return <DayCalendar onNavigate={navigate} />;
      default:
        return <NightInput onNavigate={navigate} />;
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: isNightPage
          ? "linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 50%, #050510 100%)"
          : "#D8D2C8",
        transition: "background 0.6s ease",
      }}
    >
      {/* iPhone 15 Pro Frame — 393×852 */}
      <div
        style={{
          width: 393,
          height: 852,
          borderRadius: 55,
          overflow: "hidden",
          position: "relative",
          boxShadow: isNightPage
            ? "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.12)",
          transition: "box-shadow 0.6s ease",
        }}
      >
        {/* Primary tabs cut directly; camera fades; deeper pages use iOS push/pop. */}
        {pageTransition ? (
          <>
            <div
              className="lm-page-layer"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                overflow: "hidden",
                pointerEvents: "none",
                opacity: pageTransition.active ? (pageTransition.kind === "fade" ? 0 : .88) : 1,
                filter: pageTransition.kind === "push" && pageTransition.active ? "brightness(.96) saturate(.96)" : "brightness(1) saturate(1)",
                transform: pageTransition.duration < 100 ? "none" : pageTransition.kind === "fade"
                  ? (pageTransition.active ? "scale(.99)" : "scale(1)")
                  : pageTransition.active
                    ? `translate3d(${-pageTransition.direction * 24}%, 0, 0) scale(.985)`
                    : "translate3d(0, 0, 0) scale(1)",
                transition: pageTransition.kind === "fade"
                  ? `transform ${pageTransition.duration}ms ease, opacity ${pageTransition.duration}ms ease`
                  : `transform ${pageTransition.duration}ms cubic-bezier(.32,.72,0,1), opacity ${pageTransition.duration}ms ease, filter ${pageTransition.duration}ms ease`,
                willChange: "transform, opacity, filter",
              }}
            >
              {renderPage(pageTransition.from)}
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: pageTransition.kind === "push" && pageTransition.active ? "rgba(25,23,22,.035)" : "transparent", transition: `background ${pageTransition.duration}ms ease`, pointerEvents: "none" }} />
            </div>
            <div
              className="lm-page-layer"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                overflow: "hidden",
                pointerEvents: "none",
                opacity: pageTransition.active ? 1 : (pageTransition.kind === "fade" ? 0 : .98),
                transform: pageTransition.duration < 100 || pageTransition.active
                  ? "translate3d(0, 0, 0) scale(1)"
                  : pageTransition.kind === "fade"
                    ? "scale(1.01)"
                    : `translate3d(${pageTransition.direction * 100}%, 0, 0) scale(1)`,
                boxShadow: pageTransition.kind === "push"
                  ? pageTransition.direction === 1 ? "-18px 0 36px rgba(35,31,29,.18)" : "18px 0 36px rgba(35,31,29,.18)"
                  : "none",
                transition: pageTransition.kind === "fade"
                  ? `transform ${pageTransition.duration}ms ease, opacity ${pageTransition.duration}ms ease`
                  : `transform ${pageTransition.duration}ms cubic-bezier(.32,.72,0,1), opacity ${pageTransition.duration}ms ease`,
                willChange: "transform, opacity",
              }}
            >
              {renderPage(pageTransition.to)}
              {pageTransition.kind === "push" && <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, width: 1, [pageTransition.direction === 1 ? "left" : "right"]: 0, background: "rgba(255,255,255,.32)", pointerEvents: "none" }} />}
            </div>
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0 }}>
            {renderPage(displayPage)}
          </div>
        )}

        {/* Persistent system chrome stays fixed while page content transitions. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 500,
            pointerEvents: "none",
          }}
        >
          <IOSStatusBar mode={isNightPage ? "night" : "day"} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 500,
            pointerEvents: "none",
          }}
        >
          <HomeIndicator mode={isNightPage ? "night" : "day"} />
        </div>
      </div>

      {/* Desktop Page Selector — vertical, right side */}
      <div
        className="fixed flex flex-col items-stretch gap-1.5 px-3 py-3 rounded-2xl"
        style={{
          top: "50%",
          transform: "translateX(0) translateY(-50%)",
          left: `calc(50% + ${393 / 2 + 20}px)`,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          zIndex: 200,
        }}
      >
        {(
          [
            { id: "night-input", icon: Moon, label: "夜间捕捉", night: true },
            { id: "night-camera", icon: Camera, label: "拍照捕捉", night: true },
            { id: "profile", icon: UserRound, label: "我的创作", night: false },
            { id: "day-dashboard", icon: Sun, label: "白天回看", night: false },
            { id: "morning-review", icon: Sunrise, label: "每日日报", night: false },
            { id: "day-ai", icon: Sparkles, label: "阶段洞察", night: false },
            { id: "day-calendar", icon: CalendarDays, label: "创作日历", night: false },
          ] as { id: Page; icon: LucideIcon; label: string; night: boolean }[]
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 12,
              background:
                currentPage === item.id
                  ? item.night
                    ? "rgba(80,140,255,0.35)"
                    : "rgba(200,160,60,0.3)"
                  : "transparent",
              color:
                currentPage === item.id
                  ? item.night
                    ? "rgba(150,200,255,1)"
                    : "rgba(160,110,20,1)"
                  : "rgba(255,255,255,0.6)",
              border:
                currentPage === item.id
                  ? item.night
                    ? "1px solid rgba(80,140,255,0.4)"
                    : "1px solid rgba(200,160,60,0.4)"
                  : "1px solid transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <SFSymbol icon={item.icon} size={13} strokeWidth={1.7} />
            {item.label}
          </button>
        ))}
      </div>

      <style>{`
        :root {
          --lm-day-bg: #F3F0E9;
          --lm-day-paper: rgba(255,253,249,0.82);
          --lm-day-ink: #323431;
          --lm-day-muted: #77756F;
          --lm-day-line: rgba(91,80,66,0.10);
          --lm-day-blue: #597687;
          --lm-day-gold: #B1843F;
          --lm-day-plum: #85708E;
          --lm-type-display: 22px;
          --lm-type-screen: 17px;
          --lm-type-section: 14px;
          --lm-type-body: 14px;
          --lm-type-support: 12px;
          --lm-type-caption: 11px;
          --lm-type-axis: 10px;
          --lm-space-page: 16px;
          --lm-space-section: 14px;
          --lm-space-card: 14px;
          --lm-space-row: 12px;
        }
        @keyframes lmInkDrift {
          0% { translate: -2px 1px; rotate: -1.2deg; }
          50% { translate: 2px -2px; rotate: 0.8deg; }
          100% { translate: 1px 2px; rotate: 1.4deg; }
        }
        @keyframes lmBookOpen {
          0% { opacity: 0; transform: perspective(700px) rotateY(-28deg) scale(0.86); }
          100% { opacity: 1; transform: perspective(700px) rotateY(0deg) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="lmInkDrift"], [style*="lmBookOpen"] { animation: none !important; }
          .lm-page-layer { transition-duration: 0.01ms !important; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; }
        ::-webkit-scrollbar { width: 0; }
        textarea:focus { outline: none; }
        input:focus { outline: none; }
        button { -webkit-tap-highlight-color: transparent; }
        .lm-day-page {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Helvetica Neue", sans-serif;
          font-feature-settings: "kern" 1;
          -webkit-font-smoothing: antialiased;
          color: var(--lm-day-ink);
        }
        .lm-day-page button,
        .lm-day-page input,
        .lm-day-page textarea { font: inherit; }
      `}</style>
    </div>
  );
}
