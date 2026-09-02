import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUp, ChevronDown, Delete, Eye, EyeOff, Globe2, Mic, Moon, Sparkles } from "lucide-react";
import { SFSymbol } from "../components/SFSymbol";
import { StarField } from "../components/StarField";

interface LoginProps { onEnter: () => void; }

const entryStars = Array.from({ length: 26 }, (_, index) => ({
  left: `${7 + ((index * 37) % 86)}%`,
  top: `${9 + ((index * 53) % 78)}%`,
  delay: `${(index % 8) * 55}ms`,
  size: 1 + (index % 3),
}));

export function Login({ onEnter }: LoginProps) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [entering, setEntering] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"wechat" | "qq" | "apple" | null>(null);
  const [keyboardMounted, setKeyboardMounted] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [shifted, setShifted] = useState(false);
  const [activeField, setActiveField] = useState<"account" | "password">("account");
  const formRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (keyboardOpen || !keyboardMounted) return;
    const timer = window.setTimeout(() => setKeyboardMounted(false), 340);
    return () => window.clearTimeout(timer);
  }, [keyboardMounted, keyboardOpen]);

  const openKeyboard = (field: "account" | "password") => {
    setActiveField(field);
    if (keyboardMounted) return setKeyboardOpen(true);
    setKeyboardMounted(true);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setKeyboardOpen(true)));
  };

  const closeKeyboard = () => {
    setKeyboardOpen(false);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  const updateActiveField = (updater: (value: string) => string) => {
    if (activeField === "account") setAccount(updater);
    else setPassword(updater);
  };

  const typeKey = (key: string) => {
    if (key === "backspace") return updateActiveField((value) => value.slice(0, -1));
    if (key === "space") return updateActiveField((value) => `${value} `);
    updateActiveField((value) => value + (shifted ? key.toUpperCase() : key));
  };

  const beginEnter = () => {
    if (entering) return;
    setEntering(true);
    window.setTimeout(onEnter, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 80 : 1180);
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${entering ? "lm-login-active-entry" : ""}`}
      style={{ color: "rgba(245,244,238,.94)", background: "linear-gradient(180deg, #0A1525 0%, #101E31 48%, #172839 100%)" }}
      onPointerDown={(event) => {
        if (!keyboardMounted) return;
        const target = event.target as Node;
        if (!keyboardRef.current?.contains(target) && !formRef.current?.contains(target)) closeKeyboard();
      }}
    >
      <style>{`
        @keyframes lm-login-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-1.5%,1%,0) scale(1.04); } }
        @keyframes lm-login-form-away { to { opacity: 0; transform: scale(1.12); filter: blur(18px); } }
        @keyframes lm-login-sky-open { 0% { opacity: 0; transform: scale(.16); filter: blur(18px); } 45% { opacity: .88; } 100% { opacity: 1; transform: scale(6); filter: blur(0); } }
        @keyframes lm-login-star-pass { 0% { opacity: 0; transform: translate3d(0,20px,0) scale(.2); } 35% { opacity: .9; } 100% { opacity: 0; transform: translate3d(var(--lm-star-x),-90px,0) scale(2.2); } }
        @keyframes lm-login-orbit-breathe { 0%,100% { opacity: .32; transform: scale(.82); } 50% { opacity: .86; transform: scale(1.22); } }
        @keyframes lm-login-orbit-flow { to { stroke-dashoffset: -84; } }
        @keyframes lm-login-orbit-lift { 0% { opacity: 1; transform: translate3d(0,0,0) scale(1); filter: blur(0); } 45% { opacity: .9; filter: brightness(1.8); } 100% { opacity: 0; transform: translate3d(0,-86px,0) scale(.72); filter: blur(5px); } }
        .lm-login-nebula { animation: lm-login-drift 16s ease-in-out infinite; }
        .lm-login-active-entry .lm-login-content { animation: lm-login-form-away 620ms cubic-bezier(.4,0,.2,1) forwards; }
        .lm-login-entry-bloom { animation: lm-login-sky-open 1080ms cubic-bezier(.2,.75,.16,1) forwards; }
        .lm-login-orbit-line { stroke-dasharray: 3 9; animation: lm-login-orbit-flow 18s linear infinite; }
        .lm-login-orbit-node { transform-box: fill-box; transform-origin: center; animation: lm-login-orbit-breathe 4.8s ease-in-out infinite; }
        .lm-login-orbit-node:nth-of-type(2n) { animation-delay: -2.1s; animation-duration: 6.2s; }
        .lm-login-active-entry .lm-login-lower-orbit { animation: lm-login-orbit-lift 620ms cubic-bezier(.34,.05,.3,1) forwards; }
        @media (prefers-reduced-motion: reduce) { .lm-login-nebula, .lm-login-orbit-line, .lm-login-orbit-node { animation: none; } }
      `}</style>
      <div aria-hidden="true" className="lm-login-nebula absolute inset-0" style={{ background: "radial-gradient(circle at 78% 20%, rgba(96,129,167,.25), transparent 28%), radial-gradient(circle at 20% 62%, rgba(137,104,150,.18), transparent 34%), radial-gradient(circle at 72% 86%, rgba(177,139,77,.1), transparent 32%)" }} />
      <StarField width={393} height={852} entryCount={entering ? 8 : 1} />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,12,22,.06), rgba(7,15,25,.2) 54%, rgba(8,16,26,.66))" }} />
      <div aria-hidden="true" style={{ height: 54 }} />

      <div
        className="lm-login-content relative px-7"
        style={{
          zIndex: 4,
          paddingTop: 49,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center" style={{ width: 39, height: 39, borderRadius: 15, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.13)", boxShadow: "0 8px 28px rgba(0,0,0,.14)" }}><SFSymbol icon={Moon} size={18} color="#E9C868" fill="#E9C868" strokeWidth={1.4} /></span>
          <div><div style={{ fontFamily: "Songti SC, STSong, serif", fontSize: 20, letterSpacing: 1 }}>灵沐</div><div style={{ marginTop: 1, color: "rgba(239,239,235,.34)", fontSize: 8.5, letterSpacing: 2 }}>LINGMU</div></div>
        </div>

        <div style={{ marginTop: 43 }}>
          <div style={{ fontFamily: "Songti SC, STSong, serif", fontSize: 28, letterSpacing: .6 }}>把一闪而过的留下</div>
          <div style={{ marginTop: 7, color: "rgba(231,235,235,.42)", fontSize: 11, lineHeight: 1.55 }}>几个字、一段声音、一张图，都可以从这里开始。</div>
        </div>

        <div ref={formRef} style={{ marginTop: 37 }}>
          <input aria-label="账号" value={account} onFocus={() => openKeyboard("account")} onClick={() => openKeyboard("account")} onChange={(event) => setAccount(event.target.value)} placeholder="邮箱或用户名" style={{ width: "100%", height: 45, padding: "0 14px", borderRadius: 15, border: activeField === "account" && keyboardOpen ? "1px solid rgba(155,179,198,.32)" : "1px solid rgba(255,255,255,.09)", background: "rgba(4,10,18,.2)", color: "rgba(247,247,242,.86)", fontSize: 12, outline: "none", transition: "border-color 180ms ease" }} />
          <div className="relative" style={{ marginTop: 9 }}>
            <input aria-label="密码" type={showPassword ? "text" : "password"} value={password} onFocus={() => openKeyboard("password")} onClick={() => openKeyboard("password")} onChange={(event) => setPassword(event.target.value)} placeholder="密码" style={{ width: "100%", height: 45, padding: "0 43px 0 14px", borderRadius: 15, border: activeField === "password" && keyboardOpen ? "1px solid rgba(155,179,198,.32)" : "1px solid rgba(255,255,255,.09)", background: "rgba(4,10,18,.2)", color: "rgba(247,247,242,.86)", fontSize: 12, outline: "none", transition: "border-color 180ms ease" }} />
            <button aria-label={showPassword ? "隐藏密码" : "显示密码"} onClick={() => setShowPassword(!showPassword)} className="absolute flex items-center justify-center" style={{ right: 8, top: 7, width: 31, height: 31, color: "rgba(239,241,239,.34)" }}><SFSymbol icon={showPassword ? EyeOff : Eye} size={15} strokeWidth={1.5} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3" style={{ marginTop: 21, color: "rgba(235,238,237,.24)", fontSize: 8.5 }}><span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.08)" }} /><span>其他方式</span><span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.08)" }} /></div>

        <div className="grid grid-cols-3 gap-2.5" style={{ marginTop: 15 }}>
          {([{ id: "wechat", label: "微信" }, { id: "qq", label: "QQ" }, { id: "apple", label: "Apple ID" }] as const).map((item) => (
            <button key={item.label} onClick={() => setSelectedMethod((current) => current === item.id ? null : item.id)} className="flex flex-col items-center justify-center" style={{ height: 67, borderRadius: 18, background: selectedMethod === item.id ? "rgba(126,151,174,.16)" : "rgba(255,255,255,.065)", border: selectedMethod === item.id ? "1px solid rgba(166,190,208,.28)" : "1px solid rgba(255,255,255,.1)", backdropFilter: "blur(12px)", color: "rgba(245,244,240,.8)", transition: "background 180ms ease, border-color 180ms ease" }}>
              <span className="flex items-center justify-center" style={{ width: 33, height: 29, color: "rgba(250,249,245,.9)", lineHeight: 1 }}>
                {item.id === "wechat" ? <img src="/art/login-wechat-white.png" alt="" style={{ display: "block", width: 31, height: 31, objectFit: "contain", transform: "translateY(1px)" }} /> : item.id === "qq" ? <img src="/art/login-qq-white.png" alt="" style={{ display: "block", width: 28, height: 28, objectFit: "contain", transform: "translateY(.5px)" }} /> : <span style={{ fontSize: 25, fontWeight: 500, transform: "translateY(-1px)" }}></span>}
              </span>
              <span style={{ marginTop: 7, fontSize: 9, color: selectedMethod === item.id ? "rgba(240,243,242,.7)" : "rgba(240,241,239,.4)" }}>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 19, color: "rgba(235,237,235,.26)", fontSize: 8.5 }}><SFSymbol icon={Sparkles} size={9} strokeWidth={1.5} />继续即表示同意服务与隐私约定</div>
        <button onClick={beginEnter} className="w-full flex items-center justify-center gap-2" style={{ height: 45, marginTop: 12, borderRadius: 16, background: "linear-gradient(135deg, rgba(113,141,161,.92), rgba(128,105,143,.9))", color: "white", fontSize: 11.5, fontWeight: 570, boxShadow: "0 12px 28px rgba(4,8,15,.22)" }}>
          登录 / 注册<SFSymbol icon={ArrowRight} size={14} strokeWidth={1.7} />
        </button>
      </div>

      <div aria-hidden="true" className="lm-login-lower-orbit absolute left-0 right-0" style={{ bottom: 28, height: 145, zIndex: 3, pointerEvents: "none" }}>
        <svg width="100%" height="116" viewBox="0 0 393 116" fill="none" preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <path className="lm-login-orbit-line" d="M-22 98C59 18 179 122 415 31" stroke="rgba(153,176,194,.16)" strokeWidth=".75" />
          <path d="M-12 107C76 49 220 134 405 54" stroke="rgba(150,126,162,.07)" strokeWidth=".55" />
          {[
            { x: 39, y: 59, r: 1.4, delay: "-1.2s" },
            { x: 96, y: 55, r: 2.1, delay: "-3.4s" },
            { x: 169, y: 78, r: 1.15, delay: "-.4s" },
            { x: 246, y: 78, r: 1.7, delay: "-2.6s" },
            { x: 319, y: 58, r: 1.25, delay: "-4.1s" },
            { x: 367, y: 39, r: 2.2, delay: "-1.8s" },
          ].map((node, index) => <circle key={index} className="lm-login-orbit-node" cx={node.x} cy={node.y} r={node.r} fill={index === 3 ? "rgba(224,202,148,.64)" : "rgba(197,215,226,.7)"} style={{ animationDelay: node.delay }} />)}
          <circle r="1.9" fill="rgba(241,235,207,.9)" style={{ filter: "drop-shadow(0 0 5px rgba(204,221,232,.8))" }}>
            <animateMotion dur="11s" repeatCount="indefinite" path="M-22 98C59 18 179 122 415 31" />
          </circle>
        </svg>
        <div className="absolute inset-x-0 text-center" style={{ bottom: 7, color: "rgba(224,229,228,.25)", fontFamily: "Songti SC, STSong, serif", fontSize: 9.5, letterSpacing: 2.2 }}>从今晚开始记录</div>
      </div>

      {keyboardMounted && (
        <div
          ref={keyboardRef}
          aria-hidden={!keyboardOpen}
          className="absolute left-0 right-0 bottom-0"
          onPointerDown={(event) => event.stopPropagation()}
          style={{ zIndex: 160, padding: "7px 6px 17px", background: "rgba(43,43,44,.995)", boxShadow: keyboardOpen ? "0 -12px 32px rgba(0,0,0,.42)" : "none", transform: keyboardOpen ? "translate3d(0,0,0)" : "translate3d(0,102%,0)", transition: keyboardOpen ? "transform 360ms cubic-bezier(.32,.72,0,1), box-shadow 280ms ease" : "transform 320ms cubic-bezier(.32,.72,0,1), box-shadow 220ms ease", willChange: "transform" }}
        >
          <div className="flex items-center overflow-hidden" style={{ height: 37, padding: "0 4px 6px", color: "white", fontSize: 16 }}>
            <div className="flex flex-1 items-center justify-around">{["我", "你", "这", "但是", "哎", "还", "这个", "那", "感觉"].map((word) => <button key={word} onClick={() => updateActiveField((value) => value + word)} style={{ minWidth: 25, color: "rgba(255,255,255,.96)" }}>{word}</button>)}</div>
            <button aria-label="收起键盘" onClick={closeKeyboard} className="flex items-center justify-center" style={{ width: 34, height: 30, color: "white", borderLeft: "1px solid rgba(255,255,255,.11)" }}><SFSymbol icon={ChevronDown} size={22} strokeWidth={2} /></button>
          </div>
          {["qwertyuiop", "asdfghjkl"].map((row, rowIndex) => <div key={row} className="flex justify-center" style={{ gap: 5, marginTop: rowIndex ? 7 : 0, padding: rowIndex ? "0 20px" : 0 }}>{[...row].map((key) => <button key={key} onClick={() => typeKey(key)} className="flex items-center justify-center" style={{ flex: 1, height: 43, maxWidth: 36, borderRadius: 6, background: "linear-gradient(180deg, #7c7c7d, #686869)", color: "white", fontSize: 22, textTransform: shifted ? "uppercase" : "lowercase", boxShadow: "0 1.5px 0 rgba(0,0,0,.78), inset 0 1px rgba(255,255,255,.08)" }}>{shifted ? key.toUpperCase() : key}</button>)}</div>)}
          <div className="flex items-center" style={{ gap: 5, marginTop: 7 }}>
            <button aria-label="大写" onClick={() => setShifted((value) => !value)} className="flex items-center justify-center" style={{ width: 45, height: 43, borderRadius: 6, background: shifted ? "#9b9b9d" : "linear-gradient(180deg, #575759, #49494b)", color: "white", boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}><SFSymbol icon={ArrowUp} size={22} strokeWidth={2.1} /></button>
            {[..."zxcvbnm"].map((key) => <button key={key} onClick={() => typeKey(key)} className="flex items-center justify-center" style={{ flex: 1, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #7c7c7d, #686869)", color: "white", fontSize: 22, boxShadow: "0 1.5px 0 rgba(0,0,0,.78), inset 0 1px rgba(255,255,255,.08)" }}>{shifted ? key.toUpperCase() : key}</button>)}
            <button aria-label="退格" onClick={() => typeKey("backspace")} className="flex items-center justify-center" style={{ width: 45, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #575759, #49494b)", color: "white", boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}><SFSymbol icon={Delete} size={22} strokeWidth={1.9} /></button>
          </div>
          <div className="flex items-center" style={{ gap: 6, marginTop: 8 }}>
            <button style={{ width: 46, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #575759, #49494b)", color: "white", fontSize: 17, boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}>123</button>
            <button className="flex items-center justify-center" style={{ width: 46, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #575759, #49494b)", color: "white", fontSize: 20, boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}>☺</button>
            <button onClick={() => typeKey("space")} style={{ flex: 1, height: 43, borderRadius: 6, background: "linear-gradient(180deg, #7c7c7d, #686869)", color: "white", fontSize: 17, boxShadow: "0 1.5px 0 rgba(0,0,0,.78)" }}>空格</button>
            <button onClick={closeKeyboard} style={{ width: 82, height: 43, borderRadius: 6, background: "#596F8E", color: "white", fontSize: 17, boxShadow: "0 1.5px 0 rgba(0,0,0,.82)" }}>完成</button>
          </div>
          <div className="flex items-center justify-between" style={{ height: 34, padding: "9px 23px 0", color: "rgba(255,255,255,.88)" }}><SFSymbol icon={Globe2} size={20} strokeWidth={1.7} /><SFSymbol icon={Mic} size={20} strokeWidth={1.7} /></div>
        </div>
      )}

      {entering && (
        <div className="lm-login-entering absolute inset-0" style={{ zIndex: 20, pointerEvents: "none" }}>
          <div className="lm-login-entry-bloom absolute" style={{ left: "50%", top: "53%", width: 118, height: 118, marginLeft: -59, marginTop: -59, borderRadius: "50%", background: "radial-gradient(circle, rgba(169,188,207,.38), rgba(108,130,163,.14) 36%, rgba(21,39,62,.8) 72%)" }} />
          {entryStars.map((star, index) => <span key={index} className="absolute" style={{ left: star.left, top: star.top, width: star.size, height: star.size, borderRadius: "50%", background: "rgba(243,242,225,.92)", boxShadow: "0 0 8px rgba(203,218,230,.82)", opacity: 0, animation: `lm-login-star-pass 900ms ease-out ${star.delay} forwards`, "--lm-star-x": `${(index % 2 ? 1 : -1) * (18 + index % 5 * 7)}px` } as CSSProperties} />)}
        </div>
      )}
    </div>
  );
}
