import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Bell, Check, ChevronRight, Cloud, Download, FileArchive, FileText, Image as ImageIcon, LockKeyhole, Mic2, Palette, RefreshCw, ShieldCheck, SlidersHorizontal, Sparkles, Upload, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LiquidGlass } from "../components/LiquidGlass";
import { SFSymbol } from "../components/SFSymbol";

export type SettingId = "capture" | "reminders" | "insights" | "appearance" | "privacy" | "sync" | "export";

interface SettingsDetailProps { settingId: SettingId; onBack: () => void; }

interface Preferences {
  captureMode: "last" | "text" | "voice" | "camera";
  autoSave: boolean;
  autoTranscribe: boolean;
  keepOriginalPhoto: boolean;
  haptics: boolean;
  remindersEnabled: boolean;
  reminderPeriod: "dawn" | "day" | "evening" | "night";
  reminderDays: number[];
  quietReminder: boolean;
  dailyReport: boolean;
  reportTime: string;
  insightRange: "14" | "30";
  includeMedia: boolean;
  crossProject: boolean;
  theme: "auto" | "day" | "night";
  typeface: "song" | "system";
  textSize: number;
  reduceMotion: boolean;
  aiEnabled: boolean;
  aiScope: "selected" | "all";
  keepAiContext: boolean;
  improveModels: boolean;
  syncEnabled: boolean;
  wifiOnly: boolean;
  syncMedia: boolean;
  optimizeStorage: boolean;
  exportFormat: "md" | "pdf" | "json";
  includeExportMedia: boolean;
  autoBackup: boolean;
}

const DEFAULTS: Preferences = {
  captureMode: "last", autoSave: true, autoTranscribe: true, keepOriginalPhoto: true, haptics: true,
  remindersEnabled: true, reminderPeriod: "night", reminderDays: [1, 2, 3, 4, 5, 6, 0], quietReminder: true,
  dailyReport: true, reportTime: "08:30", insightRange: "14", includeMedia: true, crossProject: true,
  theme: "auto", typeface: "song", textSize: 1, reduceMotion: false,
  aiEnabled: true, aiScope: "selected", keepAiContext: true, improveModels: false,
  syncEnabled: true, wifiOnly: true, syncMedia: true, optimizeStorage: true,
  exportFormat: "md", includeExportMedia: true, autoBackup: false,
};

const SETTINGS_KEY = "lingmu-preferences-v1";

const meta: Record<SettingId, { title: string; subtitle: string; icon: LucideIcon; color: string }> = {
  capture: { title: "捕捉偏好", subtitle: "让随手记这件事更顺一点", icon: SlidersHorizontal, color: "#718E78" },
  reminders: { title: "温和提醒", subtitle: "想起来就记，不催着你完成", icon: Bell, color: "#C28D39" },
  insights: { title: "日报与洞察", subtitle: "决定什么时候整理、整理多少", icon: Sparkles, color: "#88739B" },
  appearance: { title: "外观与字体", subtitle: "让白天和夜里都看得舒服", icon: Palette, color: "#9675A5" },
  privacy: { title: "AI 与隐私", subtitle: "你决定哪些内容可以被理解", icon: ShieldCheck, color: "#648AA7" },
  sync: { title: "云端同步", subtitle: "换设备也能接着之前的念头", icon: Cloud, color: "#6E9BA4" },
  export: { title: "导出与备份", subtitle: "把自己的东西完整带走", icon: FileArchive, color: "#9B774D" },
};

function Toggle({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return <button aria-pressed={value} onClick={() => onChange(!value)} style={{ width: 42, height: 25, padding: 2.5, borderRadius: 14, background: value ? "linear-gradient(135deg,#748E9E,#88758E)" : "rgba(78,76,72,.14)", boxShadow: value ? "0 5px 13px rgba(98,109,121,.15)" : "inset 0 0 0 1px rgba(60,58,54,.04)", transition: "background 180ms ease" }}><span style={{ display: "block", width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,.96)", boxShadow: "0 2px 6px rgba(40,38,36,.16)", transform: value ? "translateX(17px)" : "translateX(0)", transition: "transform 210ms cubic-bezier(.2,.8,.2,1)" }} /></button>;
}

function Section({ title, note, children }: { title?: string; note?: string; children: ReactNode }) {
  return <section style={{ marginTop: 17 }}>{title && <div className="flex items-end px-1" style={{ marginBottom: 7 }}><span style={{ color: "rgba(34,36,35,.58)", fontSize: 12.5, fontWeight: 570 }}>{title}</span>{note && <span style={{ marginLeft: "auto", color: "rgba(34,36,35,.28)", fontSize: 9 }}>{note}</span>}</div>}<LiquidGlass mode="day" borderRadius={19} intensity="soft"><div>{children}</div></LiquidGlass></section>;
}

function ToggleRow({ icon, title, detail, value, onChange, last = false }: { icon?: LucideIcon; title: string; detail?: string; value: boolean; onChange: (value: boolean) => void; last?: boolean }) {
  return <div className="flex items-center" style={{ minHeight: 58, padding: "9px 14px", borderBottom: last ? "none" : "1px solid rgba(0,0,0,.045)" }}>{icon && <span className="flex items-center justify-center" style={{ width: 29, height: 29, borderRadius: 10, background: "rgba(104,126,142,.09)", color: "rgba(83,109,126,.72)", marginRight: 10 }}><SFSymbol icon={icon} size={15} strokeWidth={1.6} /></span>}<div className="min-w-0" style={{ flex: 1 }}><div style={{ color: "rgba(31,33,32,.72)", fontSize: 12.5, fontWeight: 540 }}>{title}</div>{detail && <div style={{ color: "rgba(31,33,32,.31)", fontSize: 9.5, marginTop: 2, lineHeight: 1.4 }}>{detail}</div>}</div><Toggle value={value} onChange={onChange} /></div>;
}

function ChoiceGroup<T extends string>({ value, choices, onChange }: { value: T; choices: { value: T; label: string; detail?: string }[]; onChange: (value: T) => void }) {
  return <div className="grid" style={{ gridTemplateColumns: `repeat(${choices.length}, minmax(0,1fr))`, gap: 7, padding: 10 }}>{choices.map((choice) => <button key={choice.value} onClick={() => onChange(choice.value)} style={{ minHeight: 48, padding: "8px 5px", borderRadius: 13, border: value === choice.value ? "1px solid rgba(104,128,147,.24)" : "1px solid rgba(70,66,60,.045)", background: value === choice.value ? "linear-gradient(145deg,rgba(116,143,160,.15),rgba(142,120,149,.1))" : "rgba(255,255,255,.3)", color: value === choice.value ? "rgba(43,56,66,.76)" : "rgba(38,39,37,.38)", fontSize: 10.5 }}><span style={{ display: "block", fontWeight: value === choice.value ? 590 : 500 }}>{choice.label}</span>{choice.detail && <span style={{ display: "block", fontSize: 8, marginTop: 3, opacity: .72 }}>{choice.detail}</span>}</button>)}</div>;
}

function ActionRow({ icon, title, detail, onClick, tone = "normal", last = false }: { icon: LucideIcon; title: string; detail?: string; onClick?: () => void; tone?: "normal" | "accent"; last?: boolean }) {
  return <button onClick={onClick} className="w-full flex items-center text-left" style={{ minHeight: 55, padding: "9px 14px", borderBottom: last ? "none" : "1px solid rgba(0,0,0,.045)", color: tone === "accent" ? "#6C8191" : "rgba(31,33,32,.7)" }}><span className="flex items-center justify-center" style={{ width: 29, height: 29, borderRadius: 10, background: tone === "accent" ? "rgba(102,132,153,.11)" : "rgba(112,102,88,.075)", marginRight: 10 }}><SFSymbol icon={icon} size={15} strokeWidth={1.6} /></span><span style={{ flex: 1 }}><span style={{ display: "block", fontSize: 12.5, fontWeight: 540 }}>{title}</span>{detail && <span style={{ display: "block", color: "rgba(31,33,32,.3)", fontSize: 9.5, marginTop: 2 }}>{detail}</span>}</span><SFSymbol icon={ChevronRight} size={14} color="rgba(0,0,0,.18)" strokeWidth={1.6} /></button>;
}

const REMINDER_PERIODS = [
  { id: "dawn", name: "拂晓", range: "05:00–08:59", note: "清晨刚醒，适合记下还没散掉的念头", x: 10, y: 66, ink: "#C49B58", sky: "rgba(214,190,151,.19)" },
  { id: "day", name: "清昼", range: "09:00–16:59", note: "白天工作和思考时，留住正在推进的东西", x: 38, y: 22, ink: "#B88B3F", sky: "rgba(198,185,137,.16)" },
  { id: "evening", name: "向晚", range: "17:00–20:59", note: "天色慢下来，适合顺手回看今天", x: 70, y: 43, ink: "#A16F62", sky: "rgba(183,142,132,.17)" },
  { id: "night", name: "星阑", range: "21:00–04:59", note: "入夜以后，接住睡前和深夜冒出的想法", x: 91, y: 67, ink: "#667186", sky: "rgba(101,111,139,.16)" },
] as const;

type ReminderPeriod = (typeof REMINDER_PERIODS)[number]["id"];

const PERIOD_PROGRESS: Record<ReminderPeriod, number> = { dawn: .04, day: .38, evening: .7, night: .96 };

function pointOnSunPath(t: number) {
  const cubic = (p0: number, p1: number, p2: number, p3: number, u: number) => {
    const m = 1 - u;
    return m * m * m * p0 + 3 * m * m * u * p1 + 3 * m * u * u * p2 + u * u * u * p3;
  };
  if (t <= .5) {
    const u = t * 2;
    return { x: cubic(7, 70, 105, 180, u), y: cubic(120, 118, 18, 26, u) };
  }
  const u = (t - .5) * 2;
  return { x: cubic(180, 250, 275, 352, u), y: cubic(26, 34, 112, 130, u) };
}

function InkSunTrajectory({ value, onChange, reduceMotion }: { value: ReminderPeriod; onChange: (value: ReminderPeriod) => void; reduceMotion: boolean }) {
  const active = REMINDER_PERIODS.find((period) => period.id === value) || REMINDER_PERIODS[3];
  const [sunProgress, setSunProgress] = useState(PERIOD_PROGRESS[value]);
  const progressRef = useRef(sunProgress);

  useEffect(() => {
    const from = progressRef.current;
    const to = PERIOD_PROGRESS[value];
    if (reduceMotion) { progressRef.current = to; setSunProgress(to); return; }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const raw = Math.min(1, (now - started) / 720);
      const eased = 1 - Math.pow(1 - raw, 3);
      const next = from + (to - from) * eased;
      progressRef.current = next;
      setSunProgress(next);
      if (raw < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduceMotion]);

  const sunPoint = pointOnSunPath(sunProgress);

  return <div style={{ marginTop: 13 }}>
    <div className="relative overflow-hidden" style={{ height: 183, margin: "0 -3px", borderRadius: 25, background: `radial-gradient(circle at ${active.x}% ${active.y}%, ${active.sky}, transparent 34%), linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,0))`, transition: reduceMotion ? "none" : "background 700ms ease" }}>
      <div aria-hidden="true" className="absolute inset-0" style={{ opacity: .34, background: "radial-gradient(ellipse at 24% 92%,rgba(90,88,80,.09),transparent 40%),radial-gradient(ellipse at 78% 96%,rgba(95,89,82,.07),transparent 36%)" }} />
      <svg aria-hidden="true" viewBox="0 0 360 160" preserveAspectRatio="none" className="absolute" style={{ left: 4, right: 4, top: 7, width: "calc(100% - 8px)", height: 154, overflow: "visible" }}>
        <defs>
          <filter id="ink-soft"><feGaussianBlur stdDeviation="1.2" /></filter>
          <linearGradient id="ink-path" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#777970" stopOpacity=".1" />
            <stop offset=".42" stopColor="#6C706B" stopOpacity=".34" />
            <stop offset="1" stopColor="#656871" stopOpacity=".12" />
          </linearGradient>
        </defs>
        <path d="M7 120 C70 118,105 18,180 26 C250 34,275 112,352 130" fill="none" stroke="url(#ink-path)" strokeWidth="7" strokeLinecap="round" filter="url(#ink-soft)" opacity=".22" />
        <path d="M7 120 C70 118,105 18,180 26 C250 34,275 112,352 130" fill="none" stroke="url(#ink-path)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8 129 C76 127, 127 118, 188 122 C252 126, 306 133, 351 132" fill="none" stroke="#73736D" strokeWidth=".8" strokeDasharray="1 8" strokeLinecap="round" opacity=".15" />
        <circle cx={sunPoint.x} cy={sunPoint.y} r="19" fill={active.ink} opacity=".08" filter="url(#ink-soft)" />
        <circle cx={sunPoint.x} cy={sunPoint.y} r="11.5" fill={active.ink} opacity=".68" />
        <circle cx={sunPoint.x - 2.4} cy={sunPoint.y - 2.8} r="4.1" fill="rgba(255,250,231,.92)" />
      </svg>

      <div className="absolute" style={{ left: 16, top: 14 }}>
        <div style={{ color: "rgba(47,48,45,.31)", fontSize: 9, letterSpacing: ".18em" }}>一日流光</div>
        <div style={{ marginTop: 5, color: "rgba(37,39,38,.72)", fontFamily: "Songti SC, STSong, serif", fontSize: 22 }}>{active.name}</div>
      </div>
      <div className="absolute" style={{ left: 16, right: 16, bottom: 12 }}>
        <div className="flex items-baseline" style={{ color: "rgba(40,41,39,.45)" }}><span style={{ fontSize: 11.5, fontWeight: 560 }}>{active.range}</span><span style={{ marginLeft: "auto", fontSize: 8.5, letterSpacing: ".08em", color: active.ink }}>当前时辰</span></div>
        <div style={{ marginTop: 4, color: "rgba(40,41,39,.31)", fontSize: 9.5 }}>{active.note}</div>
      </div>
    </div>

    <div className="grid" style={{ gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 7, marginTop: 7 }}>
      {REMINDER_PERIODS.map((period) => {
        const selected = period.id === value;
        return <button key={period.id} aria-pressed={selected} onClick={() => onChange(period.id)} style={{ position: "relative", minHeight: 54, borderRadius: 16, border: selected ? `1px solid ${period.ink}2D` : "1px solid rgba(70,66,60,.04)", background: selected ? `linear-gradient(150deg,${period.sky},rgba(255,255,255,.34))` : "rgba(255,255,255,.22)", color: selected ? "rgba(43,43,40,.76)" : "rgba(43,43,40,.37)", boxShadow: selected ? `0 7px 20px ${period.ink}13` : "none", transition: reduceMotion ? "none" : "all 260ms ease" }}>
          <span style={{ display: "block", fontFamily: "Songti SC, STSong, serif", fontSize: 13.5, fontWeight: 600 }}>{period.name}</span>
          <span style={{ display: "block", marginTop: 4, fontSize: 7.5, letterSpacing: ".02em", opacity: .68 }}>{period.range}</span>
          {selected && <span className="absolute" style={{ width: 3.5, height: 3.5, borderRadius: "50%", left: "50%", bottom: 5, transform: "translateX(-50%)", background: period.ink }} />}
        </button>;
      })}
    </div>
  </div>;
}

function reportTimeToMinutes(value: string) {
  const [hours = "8", minutes = "30"] = value.split(":");
  return Math.max(300, Math.min(600, Number(hours) * 60 + Number(minutes)));
}

function minutesToReportTime(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function CurtainTimeSelector({ value, onChange, reduceMotion }: { value: string; onChange: (value: string) => void; reduceMotion: boolean }) {
  const minutes = reportTimeToMinutes(value);
  const progress = (minutes - 300) / 300;
  const curtainPanelWidth = 50 - progress * 33;
  const wheelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const times = Array.from({ length: 11 }, (_, index) => 300 + index * 30);
  const tickWidth = 38;

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    if (dragRef.current.active) return;
    const target = ((minutes - 300) / 30) * tickWidth;
    if (Math.abs(wheel.scrollLeft - target) > 2) wheel.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
  }, [minutes, reduceMotion]);

  const readWheel = () => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const index = Math.max(0, Math.min(times.length - 1, Math.round(wheel.scrollLeft / tickWidth)));
    const next = times[index];
    if (next !== minutes) onChange(minutesToReportTime(next));
  };

  const finishWheelDrag = (element: HTMLDivElement, pointerId: number) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    element.style.scrollSnapType = "x mandatory";
    if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
    const index = Math.max(0, Math.min(times.length - 1, Math.round(element.scrollLeft / tickWidth)));
    element.scrollTo({ left: index * tickWidth, behavior: reduceMotion ? "auto" : "smooth" });
    window.setTimeout(() => { dragRef.current.moved = false; }, 0);
  };

  return <div style={{ padding: "0 3px 4px" }}>
    <style>{`.lingmu-time-wheel::-webkit-scrollbar{display:none}`}</style>
    <div className="relative" style={{ height: 202 }}>
      <div aria-hidden="true" className="absolute" style={{ left: "9%", right: "8%", top: 24, bottom: 37, background: "linear-gradient(155deg,rgba(82,106,150,.44),rgba(197,151,163,.32) 48%,rgba(239,190,142,.3))", opacity: .72 * (1 - progress), filter: "blur(3px)", WebkitMaskImage: "radial-gradient(ellipse,#000 54%,transparent 100%)", maskImage: "radial-gradient(ellipse,#000 54%,transparent 100%)", transition: reduceMotion ? "none" : "opacity 520ms ease" }} />
      <div aria-hidden="true" className="absolute" style={{ left: "9%", right: "8%", top: 24, bottom: 37, background: "linear-gradient(155deg,rgba(239,161,124,.4),rgba(249,205,145,.36) 44%,rgba(184,191,200,.2))", opacity: Math.max(0, 1 - Math.abs(progress - .34) / .5), filter: "blur(3px)", WebkitMaskImage: "radial-gradient(ellipse,#000 54%,transparent 100%)", maskImage: "radial-gradient(ellipse,#000 54%,transparent 100%)", transition: reduceMotion ? "none" : "opacity 520ms ease" }} />
      <div aria-hidden="true" className="absolute" style={{ left: "9%", right: "8%", top: 24, bottom: 37, background: "linear-gradient(155deg,rgba(137,194,220,.4),rgba(207,224,219,.3) 49%,rgba(251,229,178,.31))", opacity: .12 + progress * .78, filter: "blur(3px)", WebkitMaskImage: "radial-gradient(ellipse,#000 54%,transparent 100%)", maskImage: "radial-gradient(ellipse,#000 54%,transparent 100%)", transition: reduceMotion ? "none" : "opacity 520ms ease" }} />
      <div aria-hidden="true" className="absolute" style={{ left: "2%", right: "2%", top: 2, height: 184, background: "radial-gradient(ellipse at 42% 53%,rgba(115,137,169,.36),rgba(173,172,186,.18) 42%,transparent 72%)", filter: "blur(10px)", opacity: .78 * (1 - progress), transition: reduceMotion ? "none" : "opacity 520ms ease" }} />
      <div aria-hidden="true" className="absolute" style={{ left: "2%", right: "2%", top: 2, height: 184, background: "radial-gradient(ellipse at 31% 68%,rgba(239,166,127,.34),rgba(250,209,151,.2) 35%,transparent 70%)", filter: "blur(10px)", opacity: Math.max(0, 1 - Math.abs(progress - .32) / .48), transition: reduceMotion ? "none" : "opacity 520ms ease" }} />
      <div aria-hidden="true" className="absolute" style={{ left: "2%", right: "2%", top: 2, height: 184, background: "radial-gradient(ellipse at 66% 36%,rgba(255,244,202,.52),rgba(181,213,224,.25) 42%,transparent 73%)", filter: "blur(10px)", opacity: .18 + progress * .76, transition: reduceMotion ? "none" : "opacity 520ms ease" }} />
      <div aria-hidden="true" className="absolute" style={{ left: `${18 + progress * 55}%`, top: `${70 - progress * 48}%`, width: 24 + progress * 16, height: 24 + progress * 16, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,249,218,.9),rgba(250,202,123,.36) 31%,transparent 70%)", filter: "blur(1px)", transform: "translate(-50%,-50%)", boxShadow: `0 0 ${18 + progress * 28}px rgba(248,211,142,${.18 + progress * .3})`, transition: reduceMotion ? "none" : "left 560ms ease,top 560ms ease,width 560ms ease,height 560ms ease,box-shadow 560ms ease" }} />
      <div aria-hidden="true" className="absolute" style={{ left: `${27 + progress * 23}%`, top: 28, width: 72, height: 145, background: "linear-gradient(108deg,transparent,rgba(255,235,185,.2),transparent 72%)", filter: "blur(4px)", transform: `rotate(${-9 + progress * 11}deg)`, transformOrigin: "top center", opacity: .12 + progress * .72, transition: reduceMotion ? "none" : "left 560ms ease,opacity 560ms ease,transform 560ms ease" }} />
      <div aria-hidden="true" className="absolute" style={{ left: "9%", right: "7%", bottom: 23, height: 55, background: "radial-gradient(ellipse at 27% 78%,rgba(111,113,96,.12),transparent 53%),radial-gradient(ellipse at 75% 86%,rgba(91,102,101,.09),transparent 52%)", filter: "blur(4px)" }} />

      <svg aria-hidden="true" viewBox="0 0 360 190" preserveAspectRatio="none" className="absolute inset-0" style={{ width: "100%", height: "100%", overflow: "visible", zIndex: 1 }}>
        <defs><filter id="curtain-ink"><feGaussianBlur stdDeviation=".6" /></filter></defs>
        <path d="M34 26 C103 22,254 23,326 27 M35 161 C118 166,244 165,327 160" fill="none" stroke="rgba(90,83,73,.22)" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M45 34 C116 31,247 32,316 35 M44 151 C122 154,239 153,317 150" fill="none" stroke="rgba(255,253,245,.48)" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M45 34 C43 73,44 113,44 151 M135 33 C134 75,136 112,135 153 M225 33 C224 75,226 112,225 153 M316 35 C318 75,316 112,317 150 M45 92 C111 90,249 92,316 91" fill="none" stroke="rgba(83,82,76,.13)" strokeWidth=".8" strokeLinecap="round" />
        <path d="M33 167 C112 172,254 171,328 166" fill="none" stroke="rgba(115,94,73,.08)" strokeWidth="7" strokeLinecap="round" filter="url(#curtain-ink)" />
      </svg>

      <div className="absolute left-1/2 text-center" style={{ top: 58, transform: "translateX(-50%)", zIndex: 2, whiteSpace: "nowrap", color: "rgba(49,49,46,.68)", transition: "color 350ms ease" }}>
        <div style={{ fontSize: 8.5, letterSpacing: ".17em", color: "rgba(48,48,45,.38)" }}>日报推开一天的时刻</div>
        <div style={{ marginTop: -3, fontFamily: "Songti SC, STSong, serif", fontSize: 54, lineHeight: 1.08, fontWeight: 600, letterSpacing: ".005em" }}>{minutesToReportTime(minutes)}</div>
      </div>

      <div aria-hidden="true" className="absolute left-0" style={{ top: 17, bottom: 22, width: `${curtainPanelWidth}%`, zIndex: 3, clipPath: `polygon(0 0,100% 1%,${97 - progress * 4}% 18%,100% 38%,${96 - progress * 3}% 58%,100% 78%,${91 - progress * 3}% 100%,0 97%)`, background: "repeating-linear-gradient(0deg,transparent 0 5px,rgba(255,255,255,.08) 6px 7px),repeating-linear-gradient(90deg,rgba(255,255,255,.16) 0 7%,rgba(255,254,249,.62) 12%,rgba(175,180,179,.09) 20%,rgba(255,255,255,.48) 29%,rgba(210,211,205,.11) 37%,rgba(255,255,255,.2) 45%)", borderRight: "1px solid rgba(255,255,255,.48)", boxShadow: `inset -${4 + progress * 8}px 0 ${12 + progress * 12}px rgba(117,122,120,.08),${3 + progress * 4}px 0 15px rgba(79,84,83,.05)`, backdropFilter: `blur(${1.45 - progress * .5}px) brightness(1.05) saturate(.72)`, WebkitBackdropFilter: `blur(${1.45 - progress * .5}px) brightness(1.05) saturate(.72)`, opacity: .8, transformOrigin: "left top", transition: reduceMotion ? "none" : "width 650ms cubic-bezier(.2,.8,.18,1),box-shadow 520ms ease,clip-path 650ms cubic-bezier(.2,.8,.18,1)" }}>
        <span className="absolute inset-y-0" style={{ left: "18%", width: "12%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.31),rgba(124,133,132,.05),transparent)", filter: "blur(1px)" }} />
        <span className="absolute inset-y-0" style={{ left: "54%", width: "15%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.35),rgba(124,133,132,.055),transparent)", filter: "blur(1px)" }} />
        <span className="absolute" style={{ left: "13%", right: "13%", top: "58%", height: 9, borderRadius: "55% 48% 58% 44%", background: "linear-gradient(180deg,rgba(255,255,255,.7),rgba(203,199,187,.2) 48%,rgba(255,255,255,.45))", border: "1px solid rgba(255,255,255,.4)", boxShadow: "0 2px 7px rgba(86,82,75,.07)", opacity: Math.max(0, (progress - .18) / .82), transform: `translateY(-50%) rotate(${-2 - progress * 2}deg)`, transition: reduceMotion ? "none" : "opacity 360ms ease,transform 540ms ease" }} />
        <span className="absolute inset-x-0 bottom-1" style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.56),rgba(147,151,148,.12),transparent)" }} />
      </div>

      <div aria-hidden="true" className="absolute right-0" style={{ top: 17, bottom: 22, width: `${curtainPanelWidth}%`, zIndex: 3, clipPath: `polygon(0 1%,100% 0,100% 97%,${9 + progress * 3}% 100%,0 78%,${4 + progress * 3}% 58%,0 38%,${3 + progress * 4}% 18%)`, background: "repeating-linear-gradient(0deg,transparent 0 5px,rgba(255,255,255,.08) 6px 7px),repeating-linear-gradient(270deg,rgba(255,255,255,.16) 0 7%,rgba(255,254,249,.62) 12%,rgba(175,180,179,.09) 20%,rgba(255,255,255,.48) 29%,rgba(210,211,205,.11) 37%,rgba(255,255,255,.2) 45%)", borderLeft: "1px solid rgba(255,255,255,.48)", boxShadow: `inset ${4 + progress * 8}px 0 ${12 + progress * 12}px rgba(117,122,120,.08),-${3 + progress * 4}px 0 15px rgba(79,84,83,.05)`, backdropFilter: `blur(${1.45 - progress * .5}px) brightness(1.05) saturate(.72)`, WebkitBackdropFilter: `blur(${1.45 - progress * .5}px) brightness(1.05) saturate(.72)`, opacity: .8, transformOrigin: "right top", transition: reduceMotion ? "none" : "width 650ms cubic-bezier(.2,.8,.18,1),box-shadow 520ms ease,clip-path 650ms cubic-bezier(.2,.8,.18,1)" }}>
        <span className="absolute inset-y-0" style={{ right: "18%", width: "12%", background: "linear-gradient(270deg,transparent,rgba(255,255,255,.31),rgba(124,133,132,.05),transparent)", filter: "blur(1px)" }} />
        <span className="absolute inset-y-0" style={{ right: "54%", width: "15%", background: "linear-gradient(270deg,transparent,rgba(255,255,255,.35),rgba(124,133,132,.055),transparent)", filter: "blur(1px)" }} />
        <span className="absolute" style={{ left: "13%", right: "13%", top: "58%", height: 9, borderRadius: "48% 55% 44% 58%", background: "linear-gradient(180deg,rgba(255,255,255,.7),rgba(203,199,187,.2) 48%,rgba(255,255,255,.45))", border: "1px solid rgba(255,255,255,.4)", boxShadow: "0 2px 7px rgba(86,82,75,.07)", opacity: Math.max(0, (progress - .18) / .82), transform: `translateY(-50%) rotate(${2 + progress * 2}deg)`, transition: reduceMotion ? "none" : "opacity 360ms ease,transform 540ms ease" }} />
        <span className="absolute inset-x-0 bottom-1" style={{ height: 1, background: "linear-gradient(270deg,transparent,rgba(255,255,255,.56),rgba(147,151,148,.12),transparent)" }} />
      </div>
    </div>

    <div className="relative" style={{ height: 55, marginTop: -5 }}>
      <div aria-hidden="true" className="absolute left-1/2" style={{ zIndex: 3, top: 3, bottom: 12, width: 1, background: "linear-gradient(180deg,rgba(135,106,73,.48),rgba(135,106,73,.08))", transform: "translateX(-.5px)", pointerEvents: "none" }} />
      <div ref={wheelRef} aria-label="日报出现时间滚轮" role="slider" aria-valuemin={300} aria-valuemax={600} aria-valuenow={minutes} tabIndex={0} onScroll={readWheel} onWheel={(event) => { event.preventDefault(); event.currentTarget.scrollLeft += event.deltaY || event.deltaX; }} onPointerDown={(event) => { dragRef.current = { active: true, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false }; event.currentTarget.style.scrollSnapType = "none"; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (!dragRef.current.active) return; const distance = event.clientX - dragRef.current.startX; if (Math.abs(distance) > 3) dragRef.current.moved = true; event.currentTarget.scrollLeft = dragRef.current.startScroll - distance; }} onPointerUp={(event) => finishWheelDrag(event.currentTarget, event.pointerId)} onPointerCancel={(event) => finishWheelDrag(event.currentTarget, event.pointerId)} onKeyDown={(event) => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); const direction = event.key === "ArrowRight" ? 1 : -1; const next = Math.max(300, Math.min(600, minutes + direction * 30)); event.currentTarget.scrollTo({ left: ((next - 300) / 30) * tickWidth, behavior: reduceMotion ? "auto" : "smooth" }); }} className="lingmu-time-wheel flex overflow-x-auto" style={{ height: 48, scrollbarWidth: "none", scrollSnapType: "x mandatory", overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch", touchAction: "pan-x", cursor: "grab", userSelect: "none", maskImage: "linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)" }}>
        <span style={{ flex: "0 0 calc(50% - 19px)" }} />
        {times.map((time, index) => {
          const selected = time === minutes;
          const major = time % 60 === 0;
          return <button key={time} aria-label={minutesToReportTime(time)} onClick={() => { if (!dragRef.current.moved) wheelRef.current?.scrollTo({ left: index * tickWidth, behavior: reduceMotion ? "auto" : "smooth" }); }} style={{ position: "relative", flex: `0 0 ${tickWidth}px`, height: 45, scrollSnapAlign: "center", color: selected ? "rgba(65,57,49,.7)" : "rgba(56,55,52,.25)" }}>
            <span className="absolute left-0 right-0" style={{ top: 17, height: 1, background: "rgba(87,80,71,.15)" }} />
            <span className="absolute left-1/2" style={{ top: major ? 11 : 14, width: 1, height: major ? 13 : 7, background: selected ? "rgba(139,107,72,.6)" : "rgba(78,75,69,.23)", transform: "translateX(-.5px)", transition: "height 180ms ease,background 180ms ease" }} />
            {major && <span className="absolute left-1/2" style={{ top: 29, transform: "translateX(-50%)", fontSize: 7.5 }}>{String(Math.floor(time / 60)).padStart(2, "0")}</span>}
          </button>;
        })}
        <span style={{ flex: "0 0 calc(50% - 19px)" }} />
      </div>
    </div>
    <div className="flex justify-between" style={{ marginTop: -2, color: "rgba(39,40,38,.27)", fontSize: 8.5 }}><span>向左 · 更早</span><span>横向滚动选择时间</span><span>更晚 · 向右</span></div>
  </div>;
}

export function SettingsDetail({ settingId, onBack }: SettingsDetailProps) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try { return { ...DEFAULTS, ...JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || "{}") }; } catch { return DEFAULTS; }
  });
  const [feedback, setFeedback] = useState("");
  const current = meta[settingId];
  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => setPreferences((state) => ({ ...state, [key]: value }));

  useEffect(() => { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences)); }, [preferences]);
  useEffect(() => { setFeedback(""); }, [settingId]);

  const flash = (message: string) => { setFeedback(message); window.setTimeout(() => setFeedback(""), 1800); };

  const content = (() => {
    switch (settingId) {
      case "capture": return <>
        <Section title="打开时先用什么"><ChoiceGroup value={preferences.captureMode} onChange={(value) => update("captureMode", value)} choices={[{ value: "last", label: "沿用上次" }, { value: "text", label: "文字" }, { value: "voice", label: "语音" }, { value: "camera", label: "拍照" }]} /></Section>
        <Section title="记录习惯"><ToggleRow title="自动保存草稿" detail="退出输入页也不会丢" value={preferences.autoSave} onChange={(value) => update("autoSave", value)} /><ToggleRow icon={Mic2} title="语音自动转文字" detail="原始录音仍会保留" value={preferences.autoTranscribe} onChange={(value) => update("autoTranscribe", value)} /><ToggleRow icon={ImageIcon} title="保留原图" detail="不只保存压缩预览" value={preferences.keepOriginalPhoto} onChange={(value) => update("keepOriginalPhoto", value)} /><ToggleRow title="轻触反馈" detail="发送和切换时给一点回应" value={preferences.haptics} onChange={(value) => update("haptics", value)} last /></Section>
      </>;
      case "reminders": return <>
        <Section><ToggleRow icon={Bell} title="提醒我随手记一下" detail="只发一条，不连续催促" value={preferences.remindersEnabled} onChange={(value) => update("remindersEnabled", value)} last /></Section>
        <InkSunTrajectory value={preferences.reminderPeriod} onChange={(value) => update("reminderPeriod", value)} reduceMotion={preferences.reduceMotion} />
        <Section title="哪几天"><div className="flex justify-between" style={{ padding: 12 }}>{["日", "一", "二", "三", "四", "五", "六"].map((day, index) => { const active = preferences.reminderDays.includes(index); return <button key={day} onClick={() => update("reminderDays", active ? preferences.reminderDays.filter((item) => item !== index) : [...preferences.reminderDays, index])} style={{ width: 34, height: 34, borderRadius: "50%", background: active ? "rgba(113,137,153,.17)" : "rgba(255,255,255,.28)", color: active ? "rgba(54,72,85,.78)" : "rgba(40,41,39,.3)", fontSize: 10.5 }}>{day}</button>; })}</div></Section>
        <Section title="别打扰"><ToggleRow title="已经记录过就不提醒" detail="当天留下任何内容后自动安静" value={preferences.quietReminder} onChange={(value) => update("quietReminder", value)} last /></Section>
      </>;
      case "insights": return <>
        <Section><ToggleRow icon={Sparkles} title="生成灵沐日报" detail="从前一天的内容里挑值得回看的" value={preferences.dailyReport} onChange={(value) => update("dailyReport", value)} last /></Section>
        <section style={{ marginTop: 17 }}><div className="flex items-end px-1" style={{ marginBottom: 3 }}><span style={{ color: "rgba(34,36,35,.58)", fontSize: 12.5, fontWeight: 570 }}>日报出现时间</span><span style={{ marginLeft: "auto", color: "rgba(34,36,35,.28)", fontSize: 9 }}>横向滚动，拉开窗帘</span></div><CurtainTimeSelector value={preferences.reportTime} onChange={(value) => update("reportTime", value)} reduceMotion={preferences.reduceMotion} /></section>
        <Section title="阶段洞察"><ChoiceGroup value={preferences.insightRange} onChange={(value) => update("insightRange", value)} choices={[{ value: "14", label: "近 14 天", detail: "节奏更轻" }, { value: "30", label: "近 30 天", detail: "线索更多" }]} /></Section>
        <Section title="内容范围"><ToggleRow title="理解图片和语音" detail="不只分析文字摘要" value={preferences.includeMedia} onChange={(value) => update("includeMedia", value)} /><ToggleRow title="允许跨项目发现联系" detail="可能找到没意识到的共同方向" value={preferences.crossProject} onChange={(value) => update("crossProject", value)} last /></Section>
      </>;
      case "appearance": return <>
        <Section title="昼夜外观"><ChoiceGroup value={preferences.theme} onChange={(value) => update("theme", value)} choices={[{ value: "auto", label: "自动", detail: "跟随场景" }, { value: "day", label: "白昼" }, { value: "night", label: "夜色" }]} /></Section>
        <Section title="文字气质"><ChoiceGroup value={preferences.typeface} onChange={(value) => update("typeface", value)} choices={[{ value: "song", label: "宋体", detail: "更安静" }, { value: "system", label: "系统字体", detail: "更清晰" }]} /></Section>
        <Section title="文字大小" note={`${Math.round(preferences.textSize * 100)}%`}><div style={{ padding: "18px 15px 15px" }}><div className="flex items-baseline justify-between" style={{ color: "rgba(37,39,38,.5)", fontFamily: preferences.typeface === "song" ? "Songti SC, STSong, serif" : "-apple-system, sans-serif" }}><span style={{ fontSize: 11 }}>灵感</span><span style={{ fontSize: 18 }}>灵感</span></div><input aria-label="文字大小" type="range" min="0.9" max="1.2" step="0.05" value={preferences.textSize} onChange={(event) => update("textSize", Number(event.target.value))} style={{ width: "100%", marginTop: 10, accentColor: "#85738F" }} /></div></Section>
        <Section><ToggleRow title="减少动态效果" detail="保留页面结构，减弱漂浮和晕染" value={preferences.reduceMotion} onChange={(value) => update("reduceMotion", value)} last /></Section>
      </>;
      case "privacy": return <>
        <Section><ToggleRow icon={Sparkles} title="允许 AI 整理灵感" detail="关闭后日报与阶段洞察将暂停" value={preferences.aiEnabled} onChange={(value) => update("aiEnabled", value)} last /></Section>
        <Section title="默认可理解的范围"><ChoiceGroup value={preferences.aiScope} onChange={(value) => update("aiScope", value)} choices={[{ value: "selected", label: "仅选中的内容", detail: "推荐" }, { value: "all", label: "全部灵感", detail: "联系更完整" }]} /></Section>
        <Section title="数据选择"><ToggleRow icon={LockKeyhole} title="保留近期理解上下文" detail="用于让下一次洞察接得上" value={preferences.keepAiContext} onChange={(value) => update("keepAiContext", value)} /><ToggleRow title="帮助改善模型" detail="默认关闭，不使用你的私人内容训练" value={preferences.improveModels} onChange={(value) => update("improveModels", value)} last /></Section>
        <Section><ActionRow icon={ShieldCheck} title="AI 使用说明" detail="看看数据什么时候被使用" /><ActionRow icon={RefreshCw} title="清除 AI 理解记录" detail="不会删除原始灵感" tone="accent" onClick={() => flash("AI 理解记录已清除")} last /></Section>
      </>;
      case "sync": return <>
        <div style={{ marginTop: 14, padding: "15px 16px", borderRadius: 20, background: "linear-gradient(145deg,rgba(105,151,163,.13),rgba(255,255,255,.25))", border: "1px solid rgba(255,255,255,.42)" }}><div className="flex items-center"><span className="flex items-center justify-center" style={{ width: 37, height: 37, borderRadius: 13, color: "#67949D", background: "rgba(255,255,255,.45)" }}><SFSymbol icon={Cloud} size={20} strokeWidth={1.5} /></span><div style={{ marginLeft: 10 }}><div style={{ color: "rgba(36,47,49,.7)", fontSize: 13, fontWeight: 570 }}>{preferences.syncEnabled ? "所有内容已同步" : "同步已暂停"}</div><div style={{ color: "rgba(36,47,49,.32)", fontSize: 9.5, marginTop: 3 }}>{preferences.syncEnabled ? "刚刚 · iCloud" : "内容只保留在这台设备"}</div></div><span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: preferences.syncEnabled ? "#79A489" : "#AD9581", boxShadow: preferences.syncEnabled ? "0 0 10px rgba(121,164,137,.6)" : "none" }} /></div></div>
        <Section><ToggleRow title="云端同步" detail="灵感、收藏与设置" value={preferences.syncEnabled} onChange={(value) => update("syncEnabled", value)} last /></Section>
        <Section title="同步方式"><ToggleRow icon={Wifi} title="仅在 Wi-Fi 下同步" value={preferences.wifiOnly} onChange={(value) => update("wifiOnly", value)} /><ToggleRow icon={ImageIcon} title="同步原图和录音" detail="关闭后只同步预览与文字" value={preferences.syncMedia} onChange={(value) => update("syncMedia", value)} /><ToggleRow title="优化本机存储" detail="较早的原文件按需下载" value={preferences.optimizeStorage} onChange={(value) => update("optimizeStorage", value)} last /></Section>
        <Section title="云端空间" note="428 MB / 5 GB"><div style={{ padding: "15px 14px" }}><div style={{ height: 6, borderRadius: 4, background: "rgba(73,91,96,.08)", overflow: "hidden" }}><div style={{ width: "8.6%", height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#7198A0,#8B7E99)" }} /></div><div className="flex" style={{ marginTop: 8, color: "rgba(35,39,39,.3)", fontSize: 9 }}><span>图片 286 MB · 录音 119 MB</span><span style={{ marginLeft: "auto" }}>还有很多空间</span></div></div></Section>
        <Section><ActionRow icon={RefreshCw} title="现在同步" detail="检查这台设备上的新内容" tone="accent" onClick={() => flash("同步完成，没有遗漏")} last /></Section>
      </>;
      case "export": return <>
        <Section title="导出格式"><ChoiceGroup value={preferences.exportFormat} onChange={(value) => update("exportFormat", value)} choices={[{ value: "md", label: "Markdown", detail: "继续编辑" }, { value: "pdf", label: "PDF", detail: "方便阅读" }, { value: "json", label: "JSON", detail: "完整数据" }]} /></Section>
        <Section title="包含什么"><ToggleRow icon={ImageIcon} title="包含原图和录音" detail="文件会明显变大" value={preferences.includeExportMedia} onChange={(value) => update("includeExportMedia", value)} /><ToggleRow icon={FileArchive} title="每月自动备份" detail="保留在这台设备的文件中" value={preferences.autoBackup} onChange={(value) => update("autoBackup", value)} last /></Section>
        <Section><ActionRow icon={Download} title="导出全部灵感" detail={`预计 20 条 · ${preferences.includeExportMedia ? "约 428 MB" : "约 2.4 MB"}`} tone="accent" onClick={() => flash(`已准备 ${preferences.exportFormat.toUpperCase()} 导出包`)} /><ActionRow icon={FileText} title="只导出当前项目" detail="从项目详情中选择范围" /><ActionRow icon={Upload} title="从备份恢复" detail="支持灵沐导出的 ZIP 与 JSON" last /></Section>
        <div style={{ marginTop: 14, color: "rgba(37,39,38,.29)", fontSize: 9.5, lineHeight: 1.65, padding: "0 5px" }}>导出的内容属于你。删除 App 前，建议先保留一份完整备份。</div>
      </>;
    }
  })();

  return <div className="relative w-full h-full overflow-hidden" style={{ background: "linear-gradient(180deg,#ECE8E1 0%,#F4F1EB 31%,#F3F0E9 100%)" }}>
    <div aria-hidden="true" className="absolute inset-x-0 top-0" style={{ height: 230, background: `radial-gradient(circle at 80% 12%, ${current.color}20, transparent 38%)` }} />
    <div aria-hidden="true" style={{ height: 54 }} />
    <header className="relative flex items-center px-4" style={{ height: 59 }}><button aria-label="返回我的创作" onClick={onBack} className="flex items-center justify-center" style={{ width: 34, height: 34, marginLeft: -5, color: "rgba(40,42,41,.58)" }}><SFSymbol icon={ArrowLeft} size={19} strokeWidth={1.65} /></button><span className="flex items-center justify-center" style={{ width: 31, height: 31, marginLeft: 5, borderRadius: 11, color: current.color, background: `${current.color}14` }}><SFSymbol icon={current.icon} size={16} strokeWidth={1.6} /></span><div style={{ marginLeft: 9 }}><div style={{ color: "rgba(35,37,36,.82)", fontFamily: "Songti SC, STSong, serif", fontSize: 18, fontWeight: 600 }}>{current.title}</div><div style={{ color: "rgba(35,37,36,.32)", fontSize: 9.5, marginTop: 1 }}>{current.subtitle}</div></div></header>
    <main className="relative overflow-y-auto px-4 pb-9" style={{ height: "calc(100% - 113px)" }}>{content}</main>
    {feedback && <div className="absolute left-1/2" style={{ bottom: 30, transform: "translateX(-50%)", zIndex: 30, padding: "9px 14px", borderRadius: 15, whiteSpace: "nowrap", color: "rgba(248,248,244,.92)", background: "rgba(41,48,52,.78)", backdropFilter: "blur(12px)", fontSize: 10.5, boxShadow: "0 9px 25px rgba(33,31,29,.16)" }}><span className="inline-flex items-center gap-1.5"><SFSymbol icon={Check} size={12} strokeWidth={1.8} />{feedback}</span></div>}
  </div>;
}
