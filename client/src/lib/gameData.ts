// ============================================================
// IES Supermarket Quiz — Game Data & Questions
// Theme: 完善選舉制度巡迴互動展覽 票箱家族超市
// Design: Sky Blue + White + Orange | Nunito + Orbitron
// ============================================================

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
  points: number;
  category: string;
}

export interface LeaderboardEntry {
  timestamp: number;
  score: number;
  duration: number;
  questionsAnswered: number;
  correctAnswers: number;
}

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "簡單 Easy",
  medium: "中等 Medium",
  hard: "困難 Hard",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "#4ECDC4",
  medium: "#FFB800",
  hard: "#FF6B6B",
};

// ============================================================
// Questions Bank — 30 questions across 3 difficulty levels
// ============================================================
export const QUESTIONS: Question[] = [
  // === EASY (10 points) ===
  {
    id: "e1",
    text: "香港特別行政區的英文縮寫是什麼？",
    options: ["HKG", "HKSAR", "HK", "SAR"],
    correctIndex: 1,
    difficulty: "easy",
    points: 10,
    category: "基本知識",
  },
  {
    id: "e2",
    text: "香港立法會選舉每隔幾年舉行一次？",
    options: ["3年", "4年", "5年", "6年"],
    correctIndex: 1,
    difficulty: "easy",
    points: 10,
    category: "選舉制度",
  },
  {
    id: "e3",
    text: "香港特別行政區成立於哪一年？",
    options: ["1995年", "1996年", "1997年", "1998年"],
    correctIndex: 2,
    difficulty: "easy",
    points: 10,
    category: "歷史",
  },
  {
    id: "e4",
    text: "香港的立法機關叫做什麼？",
    options: ["議會", "立法局", "立法會", "國會"],
    correctIndex: 2,
    difficulty: "easy",
    points: 10,
    category: "基本知識",
  },
  {
    id: "e5",
    text: "在香港，選民需要年滿多少歲才可以投票？",
    options: ["16歲", "18歲", "21歲", "25歲"],
    correctIndex: 1,
    difficulty: "easy",
    points: 10,
    category: "選舉制度",
  },
  {
    id: "e6",
    text: "香港特別行政區行政長官的任期是多少年？",
    options: ["3年", "4年", "5年", "6年"],
    correctIndex: 2,
    difficulty: "easy",
    points: 10,
    category: "政府架構",
  },
  {
    id: "e7",
    text: "以下哪些是香港的法定語言？",
    options: ["普通話", "英語", "廣東話", "英語和中文"],
    correctIndex: 3,
    difficulty: "easy",
    points: 10,
    category: "基本知識",
  },
  {
    id: "e8",
    text: "選舉委員會主要負責選出哪個職位？",
    options: ["立法會議員", "行政長官", "區議員", "法官"],
    correctIndex: 1,
    difficulty: "easy",
    points: 10,
    category: "選舉制度",
  },
  {
    id: "e9",
    text: "香港基本法由哪個機構頒布？",
    options: ["香港立法會", "全國人民代表大會", "行政長官", "英國議會"],
    correctIndex: 1,
    difficulty: "easy",
    points: 10,
    category: "法律",
  },
  {
    id: "e10",
    text: "「一國兩制」中的「兩制」指的是什麼？",
    options: [
      "兩種語言制度",
      "兩種貨幣制度",
      "社會主義和資本主義制度",
      "兩種法律制度",
    ],
    correctIndex: 2,
    difficulty: "easy",
    points: 10,
    category: "基本法",
  },

  // === MEDIUM (20 points) ===
  {
    id: "m1",
    text: "根據《基本法》，香港實行「一國兩制」的期限是多少年？",
    options: ["30年", "40年", "50年", "60年"],
    correctIndex: 2,
    difficulty: "medium",
    points: 20,
    category: "基本法",
  },
  {
    id: "m2",
    text: "香港立法會現時共有多少個議席？",
    options: ["60席", "70席", "80席", "90席"],
    correctIndex: 3,
    difficulty: "medium",
    points: 20,
    category: "立法會",
  },
  {
    id: "m3",
    text: "香港選舉委員會現時共有多少名委員？",
    options: ["800名", "1000名", "1200名", "1500名"],
    correctIndex: 2,
    difficulty: "medium",
    points: 20,
    category: "選舉制度",
  },
  {
    id: "m4",
    text: "香港的三權分立包括哪三權？",
    options: [
      "行政、立法、司法",
      "行政、立法、軍事",
      "立法、司法、警察",
      "行政、司法、財政",
    ],
    correctIndex: 0,
    difficulty: "medium",
    points: 20,
    category: "政府架構",
  },
  {
    id: "m5",
    text: "香港特區政府的最高行政機關是什麼？",
    options: ["立法會", "行政會議", "終審法院", "廉政公署"],
    correctIndex: 1,
    difficulty: "medium",
    points: 20,
    category: "政府架構",
  },
  {
    id: "m6",
    text: "以下哪項不屬於《基本法》保障的香港居民基本權利？",
    options: ["言論自由", "宗教信仰自由", "選舉總統的權利", "人身自由"],
    correctIndex: 2,
    difficulty: "medium",
    points: 20,
    category: "基本法",
  },
  {
    id: "m7",
    text: "香港廉政公署（ICAC）成立於哪一年？",
    options: ["1970年", "1974年", "1978年", "1982年"],
    correctIndex: 1,
    difficulty: "medium",
    points: 20,
    category: "歷史",
  },
  {
    id: "m8",
    text: "香港的司法制度以哪個國家的法律制度為基礎？",
    options: ["美國", "法國", "英國", "中國"],
    correctIndex: 2,
    difficulty: "medium",
    points: 20,
    category: "法律",
  },
  {
    id: "m9",
    text: "香港特區政府的財政年度從哪個月份開始？",
    options: ["1月", "3月", "4月", "7月"],
    correctIndex: 2,
    difficulty: "medium",
    points: 20,
    category: "政府架構",
  },
  {
    id: "m10",
    text: "完善選舉制度的核心原則是什麼？",
    options: [
      "愛國者治港",
      "外國人治港",
      "商界人士治港",
      "學者治港",
    ],
    correctIndex: 0,
    difficulty: "medium",
    points: 20,
    category: "選舉制度",
  },

  // === HARD (30 points) ===
  {
    id: "h1",
    text: "《基本法》第二十三條涉及什麼立法事宜？",
    options: ["環境保護", "國家安全", "教育改革", "稅務制度"],
    correctIndex: 1,
    difficulty: "hard",
    points: 30,
    category: "基本法",
  },
  {
    id: "h2",
    text: "根據《選舉（舞弊及非法行為）條例》，選舉舞弊最高可判處多少年監禁？",
    options: ["3年", "5年", "7年", "10年"],
    correctIndex: 2,
    difficulty: "hard",
    points: 30,
    category: "法律",
  },
  {
    id: "h3",
    text: "香港立法會的地區直選議席採用什麼選舉制度？",
    options: ["單議席單票制", "比例代表制", "兩輪投票制", "首選投票制"],
    correctIndex: 1,
    difficulty: "hard",
    points: 30,
    category: "選舉制度",
  },
  {
    id: "h4",
    text: "《基本法》第四十五條規定，行政長官最終目標是由什麼方式產生？",
    options: [
      "選舉委員會選出",
      "立法會選出",
      "普選產生",
      "中央政府委任",
    ],
    correctIndex: 2,
    difficulty: "hard",
    points: 30,
    category: "基本法",
  },
  {
    id: "h5",
    text: "香港選舉委員會分為多少個界別？",
    options: ["3個", "4個", "5個", "6個"],
    correctIndex: 2,
    difficulty: "hard",
    points: 30,
    category: "選舉制度",
  },
  {
    id: "h6",
    text: "根據《基本法》，全國人民代表大會常務委員會對香港基本法擁有什麼權力？",
    options: [
      "不能解釋",
      "只能解釋政治條款",
      "最終解釋權",
      "與香港法院共同解釋",
    ],
    correctIndex: 2,
    difficulty: "hard",
    points: 30,
    category: "基本法",
  },
  {
    id: "h7",
    text: "香港《國家安全法》於哪一年正式實施？",
    options: ["2019年", "2020年", "2021年", "2022年"],
    correctIndex: 1,
    difficulty: "hard",
    points: 30,
    category: "法律",
  },
  {
    id: "h8",
    text: "香港立法會功能界別議席的選民資格主要基於什麼？",
    options: ["年齡", "職業或團體成員資格", "居住地區", "教育程度"],
    correctIndex: 1,
    difficulty: "hard",
    points: 30,
    category: "選舉制度",
  },
  {
    id: "h9",
    text: "《基本法》第一百五十八條規定，哪個機構有最終解釋基本法的權力？",
    options: [
      "香港終審法院",
      "香港立法會",
      "全國人民代表大會常務委員會",
      "行政長官",
    ],
    correctIndex: 2,
    difficulty: "hard",
    points: 30,
    category: "基本法",
  },
  {
    id: "h10",
    text: "2021年完善選舉制度後，立法會議席由原來的多少席增加至90席？",
    options: ["60席", "70席", "75席", "80席"],
    correctIndex: 1,
    difficulty: "hard",
    points: 30,
    category: "選舉制度",
  },
];

// ============================================================
// Leaderboard helpers — stored in localStorage
// ============================================================
const LEADERBOARD_KEY = "ies_quiz_leaderboard_v2";

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function saveToLeaderboard(entry: LeaderboardEntry): number {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
  const trimmed = board.slice(0, 100);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  return trimmed.findIndex((e) => e.timestamp === entry.timestamp) + 1;
}

export function getRandomQuestion(excludeIds: string[] = []): Question | null {
  let pool = QUESTIONS.filter((q) => !excludeIds.includes(q.id));
  if (pool.length === 0) pool = [...QUESTIONS];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
