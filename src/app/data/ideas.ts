export type IdeaKind = "text" | "image" | "voice";

export interface Idea {
  id: string;
  kind: IdeaKind;
  title: string;
  content: string;
  date: string;
  time: string;
  tags: string[];
  mood: string;
  favorite: boolean;
  archived: boolean;
  relatedIds: string[];
}

export const INITIAL_IDEAS: Idea[] = [
  {
    id: "city-breath",
    kind: "text",
    title: "城市的呼吸节奏",
    content: "深夜的红绿灯像某种缓慢的脉搏，街道也许不是静止的空间，而是一种有周期的生命。",
    date: "3月17日",
    time: "23:42",
    tags: ["城市", "空间", "节奏"],
    mood: "沉思",
    favorite: true,
    archived: false,
    relatedIds: ["empty-street", "room-memory"],
  },
  {
    id: "light-shadow",
    kind: "image",
    title: "光与影的交错",
    content: "窗边的影子被两种色温分开，冷光像现在，暖光更像记忆。",
    date: "3月17日",
    time: "22:15",
    tags: ["光影", "色彩", "记忆"],
    mood: "好奇",
    favorite: false,
    archived: false,
    relatedIds: ["room-memory"],
  },
  {
    id: "night-silence",
    kind: "image",
    title: "夜空下的宁静",
    content: "路灯以外的地方并不是黑色，而是一层很慢、很安静的蓝。",
    date: "3月17日",
    time: "21:30",
    tags: ["夜晚", "蓝色", "平静"],
    mood: "平静",
    favorite: true,
    archived: false,
    relatedIds: ["wind-sound"],
  },
  {
    id: "wind-sound",
    kind: "voice",
    title: "关于夜风的声音片段",
    content: "也许可以做一组只记录城市间隙声音的短片，不出现人物，只留下环境的呼吸。",
    date: "3月16日",
    time: "21:58",
    tags: ["声音", "城市", "短片"],
    mood: "平静",
    favorite: false,
    archived: false,
    relatedIds: ["city-breath", "empty-street"],
  },
  {
    id: "room-memory",
    kind: "text",
    title: "记忆中的房间没有完整的墙",
    content: "回忆空间时，我们记住的是光线、气味和某个角落，而不是房间本身。",
    date: "3月14日",
    time: "00:08",
    tags: ["空间", "房间", "记忆"],
    mood: "怀念",
    favorite: true,
    archived: false,
    relatedIds: ["light-shadow", "city-breath"],
  },
  {
    id: "empty-street",
    kind: "text",
    title: "没有人物的街道",
    content: "空街并不意味着没有人，半开的窗、刚熄灭的灯和停在路边的自行车都在证明人的存在。",
    date: "3月3日",
    time: "22:30",
    tags: ["街道", "空间", "人物"],
    mood: "沉思",
    favorite: false,
    archived: false,
    relatedIds: ["city-breath", "wind-sound"],
  },
  {
    id: "rain-coffee",
    kind: "text",
    title: "雨天的咖啡香味",
    content: "气味比画面更早让人回到一个地方。雨水和咖啡也许可以成为一段记忆的开场。",
    date: "3月3日",
    time: "20:10",
    tags: ["气味", "雨天", "记忆"],
    mood: "平静",
    favorite: false,
    archived: false,
    relatedIds: ["room-memory"],
  },
];

export const IDEAS_STORAGE_KEY = "lingmu-ideas-v1";
