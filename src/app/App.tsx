import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NightInput } from "./pages/NightInput";
import { NightCamera } from "./pages/NightCamera";
import { DayDashboard } from "./pages/DayDashboard";
import type { InsightBubbleOrigin } from "./pages/DayDashboard";
import { DayAIInsights } from "./pages/DayAIInsights";
import { Profile } from "./pages/Profile";
import { ProfileEdit, type LingmuProfile } from "./pages/ProfileEdit";
import { Login } from "./pages/Login";
import { SettingsDetail, type SettingId } from "./pages/SettingsDetail";
import { DayCalendar } from "./pages/DayCalendar";
import { MorningReview } from "./pages/MorningReview";
import { IdeaDetail } from "./pages/IdeaDetail";
import { IDEAS_STORAGE_KEY, INITIAL_IDEAS } from "./data/ideas";
import type { Idea } from "./data/ideas";
import { Bell, CalendarDays, Camera, ChevronDown, CloudUpload, Eye, EyeOff, FileDown, LogIn, Minus, Moon, Palette, Pencil, Plus, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Sunrise, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SFSymbol } from "./components/SFSymbol";
import { IOSStatusBar } from "./components/IOSStatusBar";
import { HomeIndicator } from "./components/HomeIndicator";

type Page = "login" | "night-input" | "night-camera" | "profile" | "profile-edit" | "settings-detail" | "day-dashboard" | "morning-review" | "idea-detail" | "day-ai" | "day-calendar";

const PAGE_ORDER: Page[] = ["login", "night-input", "night-camera", "profile", "profile-edit", "settings-detail", "day-dashboard", "morning-review", "idea-detail", "day-ai", "day-calendar"];
const PRIMARY_TABS = new Set<Page>(["night-input", "profile", "day-dashboard"]);

interface PageTransition {
  from: Page;
  to: Page;
  kind: "push" | "fade" | "insight" | "relaunch";
  direction: 1 | -1;
  active: boolean;
  duration: number;
  bloom?: { x: number; y: number; size: number; color: string };
}

type TransitionOptions = { kind: "insight"; bloom: InsightBubbleOrigin } | { kind: "fade" };

interface PreviewNavChild {
  id: Page;
  icon: LucideIcon;
  label: string;
  settingId?: SettingId;
}

interface PreviewNavGroup {
  id: "capture" | "day" | "profile";
  page: Page;
  icon: LucideIcon;
  label: string;
  accent: "blue" | "gold" | "violet";
  children: PreviewNavChild[];
}

const PREVIEW_NAV: PreviewNavGroup[] = [
  {
    id: "capture",
    page: "night-input",
    icon: Moon,
    label: "夜间捕捉",
    accent: "blue",
    children: [{ id: "night-camera", icon: Camera, label: "拍照捕捉" }],
  },
  {
    id: "day",
    page: "day-dashboard",
    icon: Sun,
    label: "白天回看",
    accent: "gold",
    children: [
      { id: "idea-detail", icon: Pencil, label: "灵感详情" },
      { id: "morning-review", icon: Sunrise, label: "灵沐日报" },
      { id: "day-ai", icon: Sparkles, label: "阶段洞察" },
    ],
  },
  {
    id: "profile",
    page: "profile",
    icon: UserRound,
    label: "我的创作",
    accent: "violet",
    children: [
      { id: "day-calendar", icon: CalendarDays, label: "创作日历" },
      { id: "profile-edit", icon: Pencil, label: "编辑资料" },
      { id: "settings-detail", settingId: "capture", icon: SlidersHorizontal, label: "捕捉偏好" },
      { id: "settings-detail", settingId: "reminders", icon: Bell, label: "温和提醒" },
      { id: "settings-detail", settingId: "insights", icon: Sparkles, label: "日报与洞察" },
      { id: "settings-detail", settingId: "appearance", icon: Palette, label: "外观与字体" },
      { id: "settings-detail", settingId: "privacy", icon: ShieldCheck, label: "AI 与隐私" },
      { id: "settings-detail", settingId: "sync", icon: CloudUpload, label: "云端同步" },
      { id: "settings-detail", settingId: "export", icon: FileDown, label: "导出与备份" },
    ],
  },
];

const PREVIEW_ACCENTS = {
  blue: { fill: "rgba(91,139,190,.22)", border: "rgba(125,174,224,.32)", text: "#a9d3fb" },
  gold: { fill: "rgba(181,137,62,.20)", border: "rgba(218,174,91,.30)", text: "#e7c47d" },
  violet: { fill: "rgba(134,113,163,.22)", border: "rgba(174,150,205,.30)", text: "#d1b9e7" },
} as const;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("night-input");
  const [displayPage, setDisplayPage] = useState<Page>("night-input");
  const [pageTransition, setPageTransition] = useState<PageTransition | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const transitionLockedRef = useRef(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState("poster-type");
  const [selectedInsightId, setSelectedInsightId] = useState("emotion");
  const [morningInkStartedAt, setMorningInkStartedAt] = useState<number | null>(null);
  const [loginHandoff, setLoginHandoff] = useState(false);
  const [profile, setProfile] = useState<LingmuProfile>({ name: "灵沐", bio: "做设计，也玩点声音和影像", avatarUrl: "" });
  const [selectedSettingId, setSelectedSettingId] = useState<SettingId>("capture");
  const [previewScale, setPreviewScale] = useState(() => {
    const stored = Number(window.localStorage.getItem("lingmu-preview-scale"));
    return stored >= .55 && stored <= 1.15 ? stored : 1;
  });
  const [previewPanelsHidden, setPreviewPanelsHidden] = useState(false);
  const [expandedPreviewGroups, setExpandedPreviewGroups] = useState<Record<PreviewNavGroup["id"], boolean>>({
    capture: false,
    day: false,
    profile: false,
  });
  const [constellationEntries, setConstellationEntries] = useState(() => {
    const stored = window.localStorage.getItem("lingmu-constellation-entries");
    return stored === null ? 6 : Number(stored) || 0;
  });
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

  useEffect(() => {
    window.localStorage.setItem("lingmu-constellation-entries", String(constellationEntries));
  }, [constellationEntries]);

  useEffect(() => {
    window.localStorage.setItem("lingmu-preview-scale", String(previewScale));
  }, [previewScale]);

  useEffect(() => () => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
  }, []);

  const navigate = (page: Page, options?: TransitionOptions) => {
    if (transitionLockedRef.current) return;

    const destinationGroup = PREVIEW_NAV.find((group) => group.page === page || group.children.some((child) => child.id === page));
    setExpandedPreviewGroups({
      capture: destinationGroup?.id === "capture",
      day: destinationGroup?.id === "day",
      profile: destinationGroup?.id === "profile",
    });

    if (page === currentPage) return;

    if (page === "morning-review") setMorningInkStartedAt(Date.now());

    if (PRIMARY_TABS.has(displayPage) && PRIMARY_TABS.has(page)) {
      setCurrentPage(page);
      setDisplayPage(page);
      setPageTransition(null);
      return;
    }

    transitionLockedRef.current = true;
    const kind: PageTransition["kind"] = page === "login" && displayPage !== "login"
      ? "relaunch"
      : options?.kind ?? (page === "night-camera" || displayPage === "night-camera" ? "fade" : "push");
    const direction: 1 | -1 = PAGE_ORDER.indexOf(page) >= PAGE_ORDER.indexOf(displayPage) ? 1 : -1;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 40 : kind === "relaunch" ? 880 : kind === "insight" ? 760 : kind === "fade" ? 220 : 430;
    const phoneRect = phoneRef.current?.getBoundingClientRect();
    const bloom = options?.kind === "insight" ? {
      x: options.bloom.viewportX - (phoneRect?.left ?? 0),
      y: options.bloom.viewportY - (phoneRect?.top ?? 0),
      size: options.bloom.size,
      color: options.bloom.color,
    } : undefined;

    setCurrentPage(page);
    setPageTransition({ from: displayPage, to: page, kind, direction, active: false, duration, bloom });
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

  const isNightPage = currentPage === "login" || currentPage === "night-input" || currentPage === "night-camera";
  const usesDarkStatusBar = isNightPage || currentPage === "profile";

  const openInsight = (tagId: string, origin: InsightBubbleOrigin) => {
    setSelectedInsightId(tagId);
    navigate("day-ai", { kind: "insight", bloom: origin });
  };

  const completeLoginEntry = () => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    transitionLockedRef.current = false;
    setLoginHandoff(true);
    setCurrentPage("night-input");
    setDisplayPage("night-input");
    setPageTransition(null);
  };

  const adjustPreviewScale = (nextScale: number) => {
    setPreviewScale(Math.min(1.15, Math.max(.55, Math.round(nextScale * 20) / 20)));
  };

  const fitPreviewToScreen = () => {
    const reservedWidth = previewPanelsHidden ? 32 : 420;
    const fitted = Math.min(1, (window.innerHeight - 32) / 852, (window.innerWidth - reservedWidth) / 393);
    adjustPreviewScale(fitted);
  };

  const renderPage = (page: Page) => {
    switch (page) {
      case "login":
        return <Login onEnter={completeLoginEntry} />;
      case "night-input":
        return <NightInput onNavigate={navigate} totalEntries={constellationEntries} onEntrySaved={() => setConstellationEntries((current) => current + 1)} />;
      case "night-camera":
        return <NightCamera onNavigate={navigate} />;
      case "profile":
        return <Profile onNavigate={navigate} totalEntries={constellationEntries} profileName={profile.name} profileBio={profile.bio} avatarUrl={profile.avatarUrl} onOpenSetting={(settingId) => { setSelectedSettingId(settingId); navigate("settings-detail"); }} />;
      case "profile-edit":
        return (
          <ProfileEdit
            profile={profile}
            onBack={() => navigate("profile")}
            onSave={(nextProfile) => { setProfile(nextProfile); navigate("profile"); }}
            onLogout={() => navigate("login", { kind: "fade" })}
            onDeleteAccount={() => navigate("login", { kind: "fade" })}
          />
        );
      case "settings-detail":
        return <SettingsDetail settingId={selectedSettingId} onBack={() => navigate("profile")} />;
      case "day-dashboard":
        return (
          <DayDashboard
            ideas={ideas}
            onNavigate={navigate}
            onOpenIdea={(ideaId) => {
              setSelectedIdeaId(ideaId);
              navigate("idea-detail");
            }}
            onOpenInsight={openInsight}
            onDeleteIdeas={(ideaIds) => setIdeas((currentIdeas) => currentIdeas.filter((idea) => !ideaIds.includes(idea.id)))}
          />
        );
      case "morning-review":
        return <MorningReview onNavigate={navigate} inkAnimationStartedAt={morningInkStartedAt} />;
      case "idea-detail": {
        const selectedIdea = ideas.find((idea) => idea.id === selectedIdeaId) || ideas[0];
        if (!selectedIdea) return (
          <DayDashboard
            ideas={ideas}
            onNavigate={navigate}
            onOpenIdea={setSelectedIdeaId}
            onOpenInsight={openInsight}
            onDeleteIdeas={(ideaIds) => setIdeas((currentIdeas) => currentIdeas.filter((idea) => !ideaIds.includes(idea.id)))}
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
        return <NightInput onNavigate={navigate} totalEntries={constellationEntries} onEntrySaved={() => setConstellationEntries((current) => current + 1)} />;
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
        ref={phoneRef}
        style={{
          width: 393,
          height: 852,
          borderRadius: 55,
          overflow: "hidden",
          position: "relative",
          boxShadow: isNightPage
            ? "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.12)",
          transform: `scale(${previewScale})`,
          transformOrigin: "center center",
          transition: "box-shadow 0.6s ease, transform 0.3s cubic-bezier(.2,.75,.2,1)",
        }}
      >
        {/* Primary tabs cut directly; camera fades; deeper pages push; login relaunches through black. */}
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
                opacity: pageTransition.active ? (pageTransition.kind === "fade" || pageTransition.kind === "insight" || pageTransition.kind === "relaunch" ? 0 : .88) : 1,
                filter: pageTransition.kind === "insight" && pageTransition.active
                  ? "blur(14px) saturate(.76)"
                  : pageTransition.kind === "relaunch" && pageTransition.active
                    ? "brightness(0) blur(3px)"
                  : pageTransition.kind === "push" && pageTransition.active ? "brightness(.96) saturate(.96)" : "brightness(1) saturate(1)",
                transform: pageTransition.duration < 100 || pageTransition.kind === "insight" || pageTransition.kind === "relaunch" ? "none" : pageTransition.kind === "fade"
                  ? (pageTransition.active ? "scale(.99)" : "scale(1)")
                  : pageTransition.active
                    ? `translate3d(${-pageTransition.direction * 24}%, 0, 0) scale(.985)`
                    : "translate3d(0, 0, 0) scale(1)",
                transition: pageTransition.kind === "insight"
                  ? `opacity 230ms ease 170ms, filter 310ms ease 120ms`
                  : pageTransition.kind === "relaunch"
                  ? "opacity 210ms ease, filter 250ms ease"
                  : pageTransition.kind === "fade"
                  ? `transform ${pageTransition.duration}ms ease, opacity ${pageTransition.duration}ms ease`
                  : `transform ${pageTransition.duration}ms cubic-bezier(.32,.72,0,1), opacity ${pageTransition.duration}ms ease, filter ${pageTransition.duration}ms ease`,
                willChange: "transform, opacity, filter",
              }}
            >
              {renderPage(pageTransition.from)}
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: pageTransition.kind === "push" && pageTransition.active ? "rgba(25,23,22,.035)" : "transparent", transition: `background ${pageTransition.duration}ms ease`, pointerEvents: "none" }} />
            </div>
            {pageTransition.kind === "relaunch" && (
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 15, background: "#000" }} />
            )}
            <div
              className="lm-page-layer"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                overflow: "hidden",
                pointerEvents: "none",
                opacity: pageTransition.active ? 1 : (pageTransition.kind === "fade" || pageTransition.kind === "insight" || pageTransition.kind === "relaunch" ? 0 : .98),
                filter: pageTransition.kind === "insight" && !pageTransition.active
                  ? "blur(22px) saturate(.72)"
                  : pageTransition.kind === "relaunch" && !pageTransition.active ? "brightness(0) blur(5px)" : "blur(0) saturate(1)",
                transform: pageTransition.duration < 100 || pageTransition.active || pageTransition.kind === "insight" || pageTransition.kind === "relaunch"
                  ? "translate3d(0, 0, 0) scale(1)"
                  : pageTransition.kind === "fade"
                    ? "scale(1.01)"
                    : `translate3d(${pageTransition.direction * 100}%, 0, 0) scale(1)`,
                boxShadow: pageTransition.kind === "push"
                  ? pageTransition.direction === 1 ? "-18px 0 36px rgba(35,31,29,.18)" : "18px 0 36px rgba(35,31,29,.18)"
                  : "none",
                transition: pageTransition.kind === "insight"
                  ? `opacity 300ms ease 330ms, filter 340ms cubic-bezier(.2,.72,.2,1) 330ms`
                  : pageTransition.kind === "relaunch"
                  ? "opacity 310ms ease 470ms, filter 330ms ease 450ms"
                  : pageTransition.kind === "fade"
                  ? `transform ${pageTransition.duration}ms ease, opacity ${pageTransition.duration}ms ease`
                  : `transform ${pageTransition.duration}ms cubic-bezier(.32,.72,0,1), opacity ${pageTransition.duration}ms ease`,
                willChange: "transform, opacity, filter",
              }}
            >
              {renderPage(pageTransition.to)}
              {pageTransition.kind === "push" && <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, width: 1, [pageTransition.direction === 1 ? "left" : "right"]: 0, background: "rgba(255,255,255,.32)", pointerEvents: "none" }} />}
            </div>
            {pageTransition.kind === "relaunch" && (
              <div aria-hidden="true" className="lm-relaunch-curtain" style={{ animationDuration: `${pageTransition.duration}ms` }} />
            )}
            {pageTransition.kind === "insight" && pageTransition.bloom && (
              <div aria-hidden="true" className="lm-gamecenter-transition">
                {[
                  { dx: -78, dy: -52, ratio: .26, color: "rgba(130,147,157,.62)", delay: 0 },
                  { dx: 72, dy: -64, ratio: .21, color: "rgba(159,145,124,.58)", delay: 12 },
                  { dx: -88, dy: 46, ratio: .19, color: "rgba(132,151,138,.56)", delay: 20 },
                  { dx: 82, dy: 54, ratio: .28, color: "rgba(150,135,151,.56)", delay: 6 },
                ].map((satellite, index) => (
                  <span
                    key={index}
                    className="lm-gamecenter-satellite"
                    style={{
                      left: pageTransition.bloom!.x,
                      top: pageTransition.bloom!.y,
                      width: pageTransition.bloom!.size * satellite.ratio,
                      height: pageTransition.bloom!.size * satellite.ratio,
                      background: satellite.color,
                      animationDuration: `${pageTransition.duration * .46}ms`,
                      animationDelay: `${satellite.delay}ms`,
                      "--lm-orbit-x": `${satellite.dx}px`,
                      "--lm-orbit-y": `${satellite.dy}px`,
                    } as CSSProperties}
                  />
                ))}
                <div
                  className="lm-gamecenter-bubble"
                  style={{
                    left: pageTransition.bloom.x,
                    top: pageTransition.bloom.y,
                    width: pageTransition.bloom.size,
                    height: pageTransition.bloom.size,
                    background: `radial-gradient(circle at 30% 23%, rgba(255,255,255,.9) 0 5%, rgba(255,255,255,.38) 14%, transparent 34%), linear-gradient(145deg, rgba(255,255,255,.3), transparent 48%), ${pageTransition.bloom.color}`,
                    animationDuration: `${pageTransition.duration}ms`,
                    "--lm-bloom-scale": Math.max(18, 1900 / pageTransition.bloom.size),
                    "--lm-bloom-overshoot": Math.max(18, 1900 / pageTransition.bloom.size) * 1.045,
                    "--lm-bloom-settle": Math.max(18, 1900 / pageTransition.bloom.size) * 1.012,
                  } as CSSProperties}
                >
                  <span className="lm-gamecenter-glint" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={loginHandoff ? "lm-night-login-arrival" : ""} style={{ position: "absolute", inset: 0 }}>
            {renderPage(displayPage)}
          </div>
        )}

        {loginHandoff && (
          <div
            aria-hidden="true"
            className="lm-login-handoff-overlay"
            onAnimationEnd={(event) => { if (event.target === event.currentTarget) setLoginHandoff(false); }}
            style={{ position: "absolute", inset: 0, zIndex: 450, pointerEvents: "none", overflow: "hidden" }}
          >
            {[
              [15, 18, 1.3], [31, 39, 2], [48, 22, 1], [67, 31, 1.6], [84, 16, 1.1],
              [22, 66, 1], [39, 55, 1.5], [58, 72, 2.1], [73, 59, 1], [91, 76, 1.6],
            ].map(([left, top, size], index) => (
              <span key={index} className="lm-login-handoff-star" style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${index * 28}ms` }} />
            ))}
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
          <IOSStatusBar mode={usesDarkStatusBar ? "night" : "day"} />
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

      {!previewPanelsHidden && (
        <>
          {/* Hierarchical page selector and preview controls — right side */}
          <nav
            className="lm-preview-panel lm-preview-tree"
            style={{ left: `calc(50% + ${393 * previewScale / 2 + 38}px)` }}
            aria-label="演示页面导航"
          >
            <span className="lm-preview-eyebrow">页面导航</span>
            {PREVIEW_NAV.map((group) => {
              const accent = PREVIEW_ACCENTS[group.accent];
              const groupActive = currentPage === group.page || group.children.some((child) => child.id === currentPage);
              const expanded = expandedPreviewGroups[group.id];
              return (
                <div className="lm-tree-group" key={group.id}>
                  <div className="lm-tree-parent-row">
                    <button
                      className="lm-tree-parent"
                      onClick={() => navigate(group.page)}
                      aria-current={currentPage === group.page ? "page" : undefined}
                      style={groupActive ? { background: accent.fill, borderColor: accent.border, color: accent.text } : undefined}
                    >
                      <SFSymbol icon={group.icon} size={14} strokeWidth={1.8} />
                      <span>{group.label}</span>
                    </button>
                    <button
                      className="lm-tree-toggle"
                      onClick={() => setExpandedPreviewGroups((groups) => ({ ...groups, [group.id]: !groups[group.id] }))}
                      aria-label={`${expanded ? "收起" : "展开"}${group.label}`}
                      aria-expanded={expanded}
                    >
                      <ChevronDown size={13} style={{ transform: expanded ? "rotate(0deg)" : "rotate(-90deg)" }} />
                    </button>
                  </div>
                  {expanded && (
                    <div className="lm-tree-children">
                      {group.children.map((child) => (
                        <button
                          key={`${child.id}-${child.settingId ?? "page"}`}
                          className="lm-tree-child"
                          onClick={() => {
                            if (child.settingId) setSelectedSettingId(child.settingId);
                            navigate(child.id);
                          }}
                          aria-current={currentPage === child.id && (!child.settingId || selectedSettingId === child.settingId) ? "page" : undefined}
                          style={currentPage === child.id && (!child.settingId || selectedSettingId === child.settingId) ? { color: accent.text, background: accent.fill } : undefined}
                        >
                          <span className="lm-tree-node" style={{ borderColor: currentPage === child.id && (!child.settingId || selectedSettingId === child.settingId) ? accent.text : undefined }} />
                          <SFSymbol icon={child.icon} size={12} strokeWidth={1.65} />
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="lm-panel-divider" />
            <button className="lm-demo-login" onClick={() => navigate("login")} aria-current={currentPage === "login" ? "page" : undefined}>
              <LogIn size={13} />
              登录演示
            </button>
            <div className="lm-panel-divider" />
            <span className="lm-preview-eyebrow">预览尺寸</span>
            <div className="lm-scale-stepper">
              <button onClick={() => adjustPreviewScale(previewScale - .05)} aria-label="缩小预览"><Minus size={14} /></button>
              <strong>{Math.round(previewScale * 100)}%</strong>
              <button onClick={() => adjustPreviewScale(previewScale + .05)} aria-label="放大预览"><Plus size={14} /></button>
            </div>
            <button className="lm-fit-button" onClick={fitPreviewToScreen}>适应屏幕</button>
            <button className="lm-hide-panels" onClick={() => setPreviewPanelsHidden(true)}>
              <EyeOff size={14} />
              隐藏侧栏
            </button>
          </nav>
        </>
      )}

      {previewPanelsHidden && (
        <button className="lm-restore-panels" onClick={() => setPreviewPanelsHidden(false)}>
          <Eye size={14} />
          显示控件
        </button>
      )}

      <style>{`
        .lm-preview-panel {
          position: fixed;
          top: 50%;
          z-index: 600;
          transform: translateY(-50%);
          color: rgba(255,255,255,.72);
          background: rgba(24,25,31,.58);
          border: 1px solid rgba(255,255,255,.13);
          box-shadow: 0 14px 44px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.06);
          -webkit-backdrop-filter: blur(24px) saturate(1.15);
          backdrop-filter: blur(24px) saturate(1.15);
          transition: left .3s cubic-bezier(.2,.75,.2,1), right .3s cubic-bezier(.2,.75,.2,1), opacity .2s ease;
        }
        .lm-preview-eyebrow {
          color: rgba(255,255,255,.42);
          font-size: 9px;
          letter-spacing: .16em;
          line-height: 1;
        }
        @keyframes lmRelaunchCurtain {
          0% { opacity: 0; }
          18% { opacity: 1; }
          58% { opacity: 1; }
          100% { opacity: 0; }
        }
        .lm-relaunch-curtain {
          position: absolute;
          inset: 0;
          z-index: 550;
          pointer-events: none;
          background: #000;
          animation-name: lmRelaunchCurtain;
          animation-timing-function: cubic-bezier(.42,0,.22,1);
          animation-fill-mode: both;
        }
        .lm-scale-stepper {
          display: grid;
          grid-template-columns: 28px 1fr 28px;
          align-items: center;
          gap: 5px;
          margin-top: 12px;
        }
        .lm-scale-stepper button {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 9px;
          color: rgba(255,255,255,.72);
          background: rgba(255,255,255,.06);
          transition: background .18s ease, transform .18s ease;
        }
        .lm-scale-stepper button:hover { background: rgba(255,255,255,.12); }
        .lm-scale-stepper button:active { transform: scale(.94); }
        .lm-scale-stepper strong {
          text-align: center;
          font-size: 12px;
          font-weight: 550;
          font-variant-numeric: tabular-nums;
        }
        .lm-fit-button, .lm-hide-panels, .lm-demo-login {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 10px;
          color: rgba(255,255,255,.58);
          font-size: 11px;
          transition: color .18s ease, background .18s ease;
        }
        .lm-fit-button { margin-top: 9px; padding: 7px; background: rgba(255,255,255,.06); }
        .lm-hide-panels { margin-top: 6px; padding: 5px 2px; }
        .lm-fit-button:hover, .lm-hide-panels:hover, .lm-demo-login:hover { color: white; background: rgba(255,255,255,.1); }
        .lm-panel-divider { height: 1px; margin: 10px 0; background: rgba(255,255,255,.08); }
        .lm-preview-tree {
          width: 174px;
          max-height: calc(100vh - 24px);
          overflow: auto;
          padding: 14px 12px;
          border-radius: 22px;
          scrollbar-width: none;
        }
        .lm-preview-tree::-webkit-scrollbar { display: none; }
        .lm-tree-group { margin-top: 9px; }
        .lm-tree-parent-row { position: relative; display: flex; align-items: center; }
        .lm-tree-parent {
          display: flex;
          min-width: 0;
          flex: 1;
          align-items: center;
          gap: 7px;
          padding: 7px 30px 7px 9px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: rgba(255,255,255,.66);
          font-size: 12px;
          text-align: left;
          transition: background .18s ease, color .18s ease, border-color .18s ease;
          white-space: nowrap;
        }
        .lm-tree-parent:hover { background: rgba(255,255,255,.06); color: white; }
        .lm-tree-toggle {
          position: absolute;
          right: 5px;
          display: grid;
          width: 24px;
          height: 24px;
          place-items: center;
          border-radius: 8px;
          color: rgba(255,255,255,.35);
        }
        .lm-tree-toggle:hover { color: rgba(255,255,255,.8); background: rgba(255,255,255,.07); }
        .lm-tree-toggle svg { transition: transform .2s ease; }
        .lm-tree-children {
          position: relative;
          margin: 3px 0 2px 16px;
          padding-left: 10px;
        }
        .lm-tree-children::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 7px;
          width: 1px;
          background: linear-gradient(rgba(255,255,255,.16), rgba(255,255,255,.04));
        }
        .lm-tree-child {
          position: relative;
          display: flex;
          width: 100%;
          align-items: center;
          gap: 6px;
          padding: 5px 7px;
          border-radius: 8px;
          color: rgba(255,255,255,.42);
          font-size: 10.5px;
          text-align: left;
          white-space: nowrap;
          transition: color .18s ease, background .18s ease;
        }
        .lm-tree-child:hover { color: rgba(255,255,255,.82); background: rgba(255,255,255,.05); }
        .lm-tree-node {
          position: absolute;
          left: -12px;
          width: 5px;
          height: 5px;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 50%;
          background: rgba(27,28,34,.9);
        }
        .lm-demo-login { padding: 7px; }
        .lm-demo-login[aria-current="page"] { color: #b9d7f5; background: rgba(91,139,190,.2); }
        .lm-restore-panels {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          color: rgba(255,255,255,.65);
          background: rgba(24,25,31,.46);
          box-shadow: 0 8px 24px rgba(0,0,0,.16);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
          font-size: 11px;
          transition: color .18s ease, background .18s ease;
        }
        .lm-restore-panels:hover { color: white; background: rgba(24,25,31,.7); }
        @keyframes lmLoginHandoffDissolve {
          0% { opacity: 1; transform: scale(1); backdrop-filter: blur(15px) saturate(.82); }
          38% { opacity: .88; }
          100% { opacity: 0; transform: scale(1.035); backdrop-filter: blur(0) saturate(1); }
        }
        @keyframes lmLoginHandoffStar {
          0% { opacity: .72; transform: translate3d(0,0,0) scale(.8); }
          100% { opacity: 0; transform: translate3d(0,-20px,0) scale(1.8); }
        }
        @keyframes lmNightLoginArrival {
          from { opacity: .68; transform: scale(1.018); filter: blur(4px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .lm-login-handoff-overlay {
          background: radial-gradient(circle at 50% 53%, rgba(66,86,115,.92) 0%, rgba(22,40,64,.98) 37%, #091526 76%);
          animation: lmLoginHandoffDissolve 560ms cubic-bezier(.22,.72,.2,1) both;
          -webkit-backdrop-filter: blur(15px) saturate(.82);
        }
        .lm-login-handoff-star {
          position: absolute;
          border-radius: 50%;
          background: rgba(239,241,230,.9);
          box-shadow: 0 0 7px rgba(192,214,230,.82);
          animation: lmLoginHandoffStar 480ms ease-out both;
        }
        .lm-night-login-arrival { animation: lmNightLoginArrival 620ms cubic-bezier(.2,.72,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .lm-login-handoff-overlay, .lm-login-handoff-star, .lm-night-login-arrival { animation-duration: 60ms !important; }
        }
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
        .lm-gamecenter-transition {
          position: absolute;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          overflow: hidden;
        }
        .lm-gamecenter-bubble {
          position: absolute;
          border-radius: 50%;
          transform: translate3d(-50%, -50%, 0) scale(.88);
          transform-origin: center;
          box-shadow: inset 0 1px 3px rgba(255,255,255,.58), inset 0 -10px 24px rgba(42,38,58,.16), 0 12px 34px rgba(68,58,82,.26);
          will-change: transform, filter, opacity;
          animation-name: lmGameCenterBubble;
          animation-timing-function: linear;
          animation-fill-mode: both;
        }
        .lm-gamecenter-glint {
          position: absolute;
          left: 18%;
          top: 12%;
          width: 52%;
          height: 28%;
          border-radius: 50%;
          background: linear-gradient(145deg, rgba(255,255,255,.72), rgba(255,255,255,.04));
          filter: blur(3px);
          transform: rotate(-18deg);
        }
        .lm-gamecenter-satellite {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          transform: translate3d(-50%, -50%, 0) scale(.28);
          box-shadow: inset 0 1px 2px rgba(255,255,255,.65), 0 6px 18px rgba(70,64,82,.18);
          animation: lmGameCenterSatellite cubic-bezier(.18,.82,.2,1) both;
          will-change: transform, opacity;
        }
        @keyframes lmGameCenterBubble {
          0% { opacity: .9; transform: translate3d(-50%, -50%, 0) scale(.92); filter: blur(0) saturate(.72); }
          8% { transform: translate3d(-50%, -50%, 0) scale(1.04); filter: blur(.5px) saturate(.7); }
          38% { opacity: .96; transform: translate3d(-50%, -50%, 0) scale(var(--lm-bloom-overshoot)); filter: blur(10px) saturate(.62); }
          62% { opacity: .9; transform: translate3d(-50%, -50%, 0) scale(var(--lm-bloom-scale)); filter: blur(19px) saturate(.58); }
          82% { opacity: .42; transform: translate3d(-50%, -50%, 0) scale(var(--lm-bloom-settle)); filter: blur(26px) saturate(.54); }
          100% { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(var(--lm-bloom-scale)); filter: blur(31px) saturate(.52); }
        }
        @keyframes lmGameCenterSatellite {
          0% { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(.28); }
          18% { opacity: .82; }
          62% { opacity: .7; transform: translate3d(calc(-50% + var(--lm-orbit-x)), calc(-50% + var(--lm-orbit-y)), 0) scale(1.12); }
          100% { opacity: 0; transform: translate3d(calc(-50% + var(--lm-orbit-x)), calc(-50% + var(--lm-orbit-y)), 0) scale(.72); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="lmInkDrift"], [style*="lmBookOpen"] { animation: none !important; }
          .lm-page-layer { transition-duration: 0.01ms !important; }
          .lm-gamecenter-transition { display: none; }
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
