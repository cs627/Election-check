// ============================================================
// IES Supermarket Quiz — Data Store
// Manages Excel-loaded products + questions in localStorage
// Non-programmers edit the Excel file; this reads it at runtime
// ============================================================

import * as XLSX from "xlsx";

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "#4ECDC4",
  medium: "#FFB800",
  hard: "#FF6B6B",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "簡單 Easy",
  medium: "中等 Medium",
  hard: "困難 Hard",
};

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30,
};

export interface Product {
  id: string;          // P001
  barcode: string;     // 4890008100309
  nameZH: string;      // 新鮮蘋果
  nameEN: string;      // Fresh Apple
  emoji: string;       // 🍎
  imageUrl: string;    // optional custom image URL
  notes: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];   // [A, B, C, D]
  correctIndex: number; // 0=A, 1=B, 2=C, 3=D
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

export interface GameData {
  products: Product[];
  questions: Question[];
  loadedAt: number;
  fileName: string;
}

const STORAGE_KEY = "ies_quiz_game_data_v2";

// ============================================================
// Default built-in data (used before any Excel is uploaded)
// ============================================================
export const DEFAULT_PRODUCTS: Product[] = [
  { id: "P001", barcode: "4890008100309", nameZH: "新鮮蘋果", nameEN: "Fresh Apple",    emoji: "🍎", imageUrl: "", notes: "" },
  { id: "P002", barcode: "4890008100316", nameZH: "新鮮牛奶", nameEN: "Fresh Milk",     emoji: "🥛", imageUrl: "", notes: "" },
  { id: "P003", barcode: "4890008100323", nameZH: "香脆麵包", nameEN: "Crispy Bread",   emoji: "🍞", imageUrl: "", notes: "" },
  { id: "P004", barcode: "4890008100330", nameZH: "橙汁飲品", nameEN: "Orange Juice",   emoji: "🍊", imageUrl: "", notes: "" },
  { id: "P005", barcode: "4890008100347", nameZH: "早餐麥片", nameEN: "Breakfast Cereal",emoji: "🥣", imageUrl: "", notes: "" },
  { id: "P006", barcode: "4890008100354", nameZH: "新鮮雞蛋", nameEN: "Fresh Eggs",     emoji: "🥚", imageUrl: "", notes: "" },
  { id: "P007", barcode: "4890008100361", nameZH: "香蕉",     nameEN: "Banana",         emoji: "🍌", imageUrl: "", notes: "" },
  { id: "P008", barcode: "4890008100378", nameZH: "番茄",     nameEN: "Tomato",         emoji: "🍅", imageUrl: "", notes: "" },
  { id: "P009", barcode: "4890008100385", nameZH: "薯片",     nameEN: "Potato Chips",   emoji: "🥔", imageUrl: "", notes: "" },
  { id: "P010", barcode: "4890008100392", nameZH: "朱古力",   nameEN: "Chocolate",      emoji: "🍫", imageUrl: "", notes: "" },
  { id: "P011", barcode: "4890008100408", nameZH: "餅乾",     nameEN: "Biscuits",       emoji: "🍪", imageUrl: "", notes: "" },
  { id: "P012", barcode: "4890008100415", nameZH: "罐頭湯",   nameEN: "Canned Soup",    emoji: "🥫", imageUrl: "", notes: "" },
  { id: "P013", barcode: "4890008100422", nameZH: "意大利粉", nameEN: "Spaghetti",      emoji: "🍝", imageUrl: "", notes: "" },
  { id: "P014", barcode: "4890008100439", nameZH: "芝士",     nameEN: "Cheese",         emoji: "🧀", imageUrl: "", notes: "" },
  { id: "P015", barcode: "4890008100446", nameZH: "蜂蜜",     nameEN: "Honey",          emoji: "🍯", imageUrl: "", notes: "" },
  { id: "P016", barcode: "4890008100453", nameZH: "綠茶",     nameEN: "Green Tea",      emoji: "🍵", imageUrl: "", notes: "" },
  { id: "P017", barcode: "4890008100460", nameZH: "礦泉水",   nameEN: "Mineral Water",  emoji: "💧", imageUrl: "", notes: "" },
  { id: "P018", barcode: "4890008100477", nameZH: "薯仔",     nameEN: "Potato",         emoji: "🥔", imageUrl: "", notes: "" },
  { id: "P019", barcode: "4890008100484", nameZH: "紅蘿蔔",   nameEN: "Carrot",         emoji: "🥕", imageUrl: "", notes: "" },
  { id: "P020", barcode: "4890008100491", nameZH: "西蘭花",   nameEN: "Broccoli",       emoji: "🥦", imageUrl: "", notes: "" },
];

// ============================================================
// localStorage persistence
// ============================================================
export function loadGameData(): GameData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameData;
  } catch {
    return null;
  }
}

export function saveGameData(data: GameData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearGameData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ============================================================
// Leaderboard helpers
// ============================================================
const LEADERBOARD_KEY = "ies_quiz_leaderboard_v3";

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

export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ============================================================
// Excel parser — reads the 2-sheet template
// ============================================================
const ANSWER_MAP: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
const DIFFICULTY_MAP: Record<string, Difficulty> = {
  easy: "easy", medium: "medium", hard: "hard",
};
const POINTS_MAP: Record<Difficulty, number> = { easy: 10, medium: 20, hard: 30 };

export interface ParseResult {
  success: boolean;
  data?: GameData;
  errors: string[];
  warnings: string[];
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });

        const errors: string[] = [];
        const warnings: string[] = [];

        // ---- Parse Products sheet ----
        const productSheet = wb.Sheets[wb.SheetNames[0]];
        const productRows = XLSX.utils.sheet_to_json(productSheet, {
          header: 1,
          defval: "",
        }) as unknown[][];

        const products: Product[] = [];
        const barcodeSet = new Set<string>();

        for (let i = 1; i < productRows.length; i++) {
          const row = productRows[i] as string[];
          const id = String(row[0] || "").trim();
          const barcode = String(row[1] || "").trim();
          const nameZH = String(row[2] || "").trim();
          const nameEN = String(row[3] || "").trim();
          const emoji = String(row[4] || "📦").trim();
          const imageUrl = String(row[5] || "").trim();
          const notes = String(row[6] || "").trim();

          if (!id && !barcode && !nameZH) continue; // skip empty rows

          if (!id) { errors.push(`第 ${i + 1} 行：缺少貨物編號`); continue; }
          if (!barcode) { errors.push(`第 ${i + 1} 行 (${id})：缺少條碼`); continue; }
          if (!nameZH) { errors.push(`第 ${i + 1} 行 (${id})：缺少貨物名稱`); continue; }
          if (barcodeSet.has(barcode)) {
            errors.push(`第 ${i + 1} 行 (${id})：條碼 ${barcode} 重複`);
            continue;
          }

          barcodeSet.add(barcode);
          products.push({ id, barcode, nameZH, nameEN: nameEN || nameZH, emoji, imageUrl, notes });
        }

        // ---- Parse Questions sheet ----
        const questionSheet = wb.Sheets[wb.SheetNames[1]];
        if (!questionSheet) {
          errors.push("找不到題目設定工作表（第2頁）");
        }

        const questionRows = questionSheet
          ? (XLSX.utils.sheet_to_json(questionSheet, {
              header: 1,
              defval: "",
            }) as unknown[][])
          : [];

        const questions: Question[] = [];
        const qIdSet = new Set<string>();

        for (let i = 1; i < questionRows.length; i++) {
          const row = questionRows[i] as string[];
          const id = String(row[0] || "").trim();
          const text = String(row[1] || "").trim();
          const optA = String(row[2] || "").trim();
          const optB = String(row[3] || "").trim();
          const optC = String(row[4] || "").trim();
          const optD = String(row[5] || "").trim();
          const correctRaw = String(row[6] || "").trim().toUpperCase();
          const diffRaw = String(row[7] || "easy").trim().toLowerCase();
          const pointsRaw = Number(row[8]) || 0;
          const category = String(row[9] || "一般").trim();

          if (!id && !text) continue;

          if (!id) { errors.push(`題目第 ${i + 1} 行：缺少題目編號`); continue; }
          if (!text) { errors.push(`題目第 ${i + 1} 行 (${id})：缺少題目內容`); continue; }
          if (!optA || !optB || !optC || !optD) {
            errors.push(`題目 ${id}：選項不完整（需要 A/B/C/D 四個選項）`);
            continue;
          }
          if (!(correctRaw in ANSWER_MAP)) {
            errors.push(`題目 ${id}：正確答案「${correctRaw}」無效，請填 A/B/C/D`);
            continue;
          }
          if (qIdSet.has(id)) {
            warnings.push(`題目 ${id} 重複，已跳過`);
            continue;
          }

          const difficulty: Difficulty = DIFFICULTY_MAP[diffRaw] || "easy";
          if (!DIFFICULTY_MAP[diffRaw]) {
            warnings.push(`題目 ${id}：難度「${diffRaw}」無效，已設為 easy`);
          }

          const points = pointsRaw > 0 ? pointsRaw : POINTS_MAP[difficulty];

          qIdSet.add(id);
          questions.push({
            id,
            text,
            options: [optA, optB, optC, optD],
            correctIndex: ANSWER_MAP[correctRaw],
            difficulty,
            points,
            category,
          });
        }

        if (products.length === 0) errors.push("貨物設定表為空，請至少填入一件貨物");
        if (questions.length === 0) errors.push("題目設定表為空，請至少填入一條題目");

        if (errors.length > 0) {
          resolve({ success: false, errors, warnings });
          return;
        }

        const gameData: GameData = {
          products,
          questions,
          loadedAt: Date.now(),
          fileName: file.name,
        };

        resolve({ success: true, data: gameData, errors: [], warnings });
      } catch (err) {
        resolve({
          success: false,
          errors: [`讀取 Excel 檔案時出錯：${err}`],
          warnings: [],
        });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// ============================================================
// Barcode lookup
// ============================================================
export function findProductByBarcode(
  barcode: string,
  products: Product[]
): Product | null {
  return products.find((p) => p.barcode === barcode.trim()) || null;
}

// ============================================================
// Random question (same as before, but from dynamic data)
// ============================================================
export function getRandomQuestion(
  questions: Question[],
  excludeIds: string[] = []
): Question | null {
  let pool = questions.filter((q) => !excludeIds.includes(q.id));
  if (pool.length === 0) pool = [...questions];
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
