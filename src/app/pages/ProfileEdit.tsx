import { useRef, useState } from "react";
import { ArrowLeft, Camera, Check, ChevronRight, Link2, LogOut, ShieldAlert, UserRound } from "lucide-react";
import { LiquidGlass } from "../components/LiquidGlass";
import { SFSymbol } from "../components/SFSymbol";

export interface LingmuProfile {
  name: string;
  bio: string;
  avatarUrl: string;
}

interface ProfileEditProps {
  profile: LingmuProfile;
  onBack: () => void;
  onSave: (profile: LingmuProfile) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const initialAccounts = [
  { id: "wechat", mark: "", image: "/art/account-wechat-color.png", name: "微信", detail: "灵沐的夜", linked: true, color: "#668D73" },
  { id: "qq", mark: "", image: "/art/account-qq-color.png", name: "QQ", detail: "尚未关联", linked: false, color: "#6F8EA5" },
  { id: "apple", mark: "", image: "", name: "Apple ID", detail: "d•••••@icloud.com", linked: true, color: "#55585A" },
];

export function ProfileEdit({ profile, onBack, onSave, onLogout, onDeleteAccount }: ProfileEditProps) {
  const [draft, setDraft] = useState(profile);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickAvatar = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, avatarUrl: String(reader.result || "") }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "linear-gradient(180deg, #ECE8E1 0%, #F4F1EB 34%, #F3F0E9 100%)" }}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0" style={{ height: 250, background: "radial-gradient(circle at 76% 10%, rgba(111,137,157,.15), transparent 36%), radial-gradient(circle at 12% 32%, rgba(143,118,153,.1), transparent 34%)" }} />
      <div aria-hidden="true" style={{ height: 54 }} />

      <header className="relative flex items-center px-4" style={{ height: 52 }}>
        <button aria-label="返回我的创作" onClick={onBack} className="flex items-center justify-center" style={{ width: 34, height: 34, marginLeft: -5, color: "rgba(40,42,41,.58)" }}>
          <SFSymbol icon={ArrowLeft} size={19} strokeWidth={1.65} />
        </button>
        <div style={{ marginLeft: 5 }}>
          <div style={{ color: "rgba(35,37,36,.84)", fontFamily: "Songti SC, STSong, serif", fontSize: 19, fontWeight: 600 }}>编辑资料</div>
          <div style={{ color: "rgba(35,37,36,.34)", fontSize: 9.5, marginTop: 1 }}>账号、身份与关联方式</div>
        </div>
        <button onClick={() => onSave(draft)} className="flex items-center gap-1" style={{ marginLeft: "auto", height: 31, padding: "0 11px", borderRadius: 15, color: "#F9F7F1", background: "linear-gradient(135deg, #6E8797, #81718A)", fontSize: 10.5, boxShadow: "0 7px 18px rgba(91,103,116,.16)" }}>
          <SFSymbol icon={Check} size={12} strokeWidth={1.8} />保存
        </button>
      </header>

      <div className="relative overflow-y-auto px-4 pb-8" style={{ height: "calc(100% - 106px)" }}>
        <LiquidGlass mode="day" borderRadius={23} intensity="medium" material="liquid">
          <div className="flex flex-col items-center" style={{ padding: "18px 16px 17px", background: "linear-gradient(145deg, rgba(255,253,248,.72), rgba(250,247,241,.38))" }}>
            <button aria-label="更换头像" onClick={() => fileInputRef.current?.click()} className="relative flex items-center justify-center" style={{ width: 76, height: 76, borderRadius: 27, overflow: "hidden", color: "#8C7794", background: "linear-gradient(145deg, rgba(121,145,160,.16), rgba(148,123,153,.16))", border: "1px solid rgba(255,255,255,.72)", boxShadow: "0 12px 28px rgba(75,72,70,.11)" }}>
              {draft.avatarUrl ? <img src={draft.avatarUrl} alt="当前头像" className="w-full h-full object-cover" /> : <SFSymbol icon={UserRound} size={30} strokeWidth={1.35} />}
              <span className="absolute flex items-center justify-center" style={{ right: 4, bottom: 4, width: 23, height: 23, borderRadius: 10, color: "white", background: "rgba(49,57,65,.78)", backdropFilter: "blur(8px)" }}><SFSymbol icon={Camera} size={11} strokeWidth={1.8} /></span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => pickAvatar(event.target.files?.[0])} />
            <span style={{ marginTop: 8, color: "rgba(39,41,40,.35)", fontSize: 9.5 }}>点一下，换张更像你的图</span>

            <label className="w-full" style={{ marginTop: 15 }}>
              <span style={{ color: "rgba(38,40,39,.4)", fontSize: 10 }}>用户名</span>
              <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} style={{ width: "100%", height: 42, marginTop: 6, padding: "0 12px", borderRadius: 13, border: "1px solid rgba(89,80,69,.075)", background: "rgba(255,255,255,.54)", color: "rgba(30,32,31,.76)", fontSize: 13.5, outline: "none" }} />
            </label>
            <label className="w-full" style={{ marginTop: 11 }}>
              <span style={{ color: "rgba(38,40,39,.4)", fontSize: 10 }}>一句介绍</span>
              <input value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} style={{ width: "100%", height: 42, marginTop: 6, padding: "0 12px", borderRadius: 13, border: "1px solid rgba(89,80,69,.075)", background: "rgba(255,255,255,.54)", color: "rgba(30,32,31,.76)", fontSize: 13, outline: "none" }} />
            </label>
          </div>
        </LiquidGlass>

        <div className="flex items-end px-1" style={{ marginTop: 18, marginBottom: 7 }}>
          <span style={{ color: "rgba(32,34,33,.62)", fontSize: 13, fontWeight: 570 }}>关联账号</span>
          <span style={{ marginLeft: "auto", color: "rgba(32,34,33,.3)", fontSize: 9.5 }}>换设备也能找到这些灵感</span>
        </div>
        <LiquidGlass mode="day" borderRadius={19} intensity="soft">
          <div>
            {accounts.map((account, index) => (
              <button key={account.id} onClick={() => setAccounts((items) => items.map((item) => item.id === account.id ? { ...item, linked: !item.linked, detail: item.linked ? "尚未关联" : item.id === "qq" ? "248••••31" : item.detail } : item))} className="w-full flex items-center text-left" style={{ height: 57, padding: "0 14px", borderBottom: index < accounts.length - 1 ? "1px solid rgba(0,0,0,.045)" : "none" }}>
                <span className="flex items-center justify-center overflow-hidden" style={{ width: 30, height: 30, borderRadius: 10, background: account.image ? "rgba(255,255,255,.94)" : `${account.color}18`, color: account.color, fontSize: account.id === "apple" ? 18 : 12, fontWeight: 650, boxShadow: account.image ? "0 2px 7px rgba(42,42,40,.07)" : "none" }}>
                  {account.image ? <img src={account.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transform: account.id === "qq" ? "scale(1.04)" : "scale(1.08)" }} /> : account.mark}
                </span>
                <span style={{ marginLeft: 10 }}><span style={{ display: "block", color: "rgba(30,32,31,.72)", fontSize: 12.5, fontWeight: 550 }}>{account.name}</span><span style={{ display: "block", color: "rgba(30,32,31,.32)", fontSize: 9.5, marginTop: 2 }}>{account.detail}</span></span>
                <span className="flex items-center gap-1" style={{ marginLeft: "auto", color: account.linked ? "rgba(91,126,102,.72)" : "rgba(42,44,43,.28)", fontSize: 9.5 }}>
                  {account.linked ? <><SFSymbol icon={Link2} size={11} strokeWidth={1.7} />已关联</> : <>关联<SFSymbol icon={ChevronRight} size={12} strokeWidth={1.6} /></>}
                </span>
              </button>
            ))}
          </div>
        </LiquidGlass>

        <div className="px-1" style={{ marginTop: 18, marginBottom: 7, color: "rgba(32,34,33,.62)", fontSize: 13, fontWeight: 570 }}>账号与安全</div>
        <LiquidGlass mode="day" borderRadius={19} intensity="soft">
          <button onClick={onLogout} className="w-full flex items-center text-left" style={{ height: 54, padding: "0 14px", borderBottom: "1px solid rgba(0,0,0,.045)" }}>
            <SFSymbol icon={LogOut} size={16} color="#8B766B" strokeWidth={1.65} /><span style={{ marginLeft: 11, color: "rgba(38,35,33,.68)", fontSize: 12.5 }}>退出登录</span><SFSymbol icon={ChevronRight} size={13} color="rgba(0,0,0,.2)" strokeWidth={1.6} style={{ marginLeft: "auto" }} />
          </button>
          <button onClick={() => setConfirmingDelete(true)} className="w-full flex items-center text-left" style={{ height: 54, padding: "0 14px", color: "rgba(167,91,83,.72)" }}>
            <SFSymbol icon={ShieldAlert} size={16} strokeWidth={1.65} /><span style={{ marginLeft: 11, fontSize: 12.5 }}>注销账号</span><span style={{ marginLeft: "auto", fontSize: 9.5, opacity: .56 }}>清除所有同步内容</span>
          </button>
        </LiquidGlass>
      </div>

      {confirmingDelete && (
        <div className="absolute inset-0 flex items-end" style={{ zIndex: 80, padding: "0 14px 28px", background: "rgba(37,34,32,.25)", backdropFilter: "blur(10px)" }}>
          <LiquidGlass mode="day" borderRadius={22} intensity="medium" className="w-full">
            <div style={{ padding: 18 }}><div style={{ color: "rgba(30,29,28,.78)", fontSize: 15, fontWeight: 590 }}>真的要注销吗？</div><div style={{ color: "rgba(30,29,28,.4)", fontSize: 10.5, lineHeight: 1.6, marginTop: 5 }}>这是演示操作。确认后会回到登录页，灵感内容不会在当前演示中实际删除。</div><div className="flex gap-8" style={{ marginTop: 15 }}><button onClick={() => setConfirmingDelete(false)} style={{ flex: 1, height: 40, borderRadius: 13, background: "rgba(255,255,255,.56)", color: "rgba(30,29,28,.56)", fontSize: 11 }}>先留着</button><button onClick={onDeleteAccount} style={{ flex: 1, height: 40, borderRadius: 13, background: "rgba(170,91,82,.78)", color: "white", fontSize: 11 }}>确认注销</button></div></div>
          </LiquidGlass>
        </div>
      )}
    </div>
  );
}
