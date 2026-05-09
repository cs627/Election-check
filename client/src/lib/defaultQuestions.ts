// ============================================================
// IES Supermarket Quiz — Default Questions (built-in fallback)
// Used before any Excel file is uploaded
// ============================================================

import { Question } from "./dataStore";

export const DEFAULT_QUESTIONS: Question[] = [
  // === EASY (10 points) ===
  { id: "e1", text: "香港特別行政區的英文縮寫是什麼？", options: ["HKG", "HKSAR", "HK", "SAR"], correctIndex: 1, difficulty: "easy", points: 10, category: "基本知識" },
  { id: "e2", text: "香港立法會選舉每隔幾年舉行一次？", options: ["3年", "4年", "5年", "6年"], correctIndex: 1, difficulty: "easy", points: 10, category: "選舉制度" },
  { id: "e3", text: "香港特別行政區成立於哪一年？", options: ["1995年", "1996年", "1997年", "1998年"], correctIndex: 2, difficulty: "easy", points: 10, category: "歷史" },
  { id: "e4", text: "香港的立法機關叫做什麼？", options: ["議會", "立法局", "立法會", "國會"], correctIndex: 2, difficulty: "easy", points: 10, category: "基本知識" },
  { id: "e5", text: "在香港，選民需要年滿多少歲才可以投票？", options: ["16歲", "18歲", "21歲", "25歲"], correctIndex: 1, difficulty: "easy", points: 10, category: "選舉制度" },
  { id: "e6", text: "香港特別行政區行政長官的任期是多少年？", options: ["3年", "4年", "5年", "6年"], correctIndex: 2, difficulty: "easy", points: 10, category: "政府架構" },
  { id: "e7", text: "以下哪些是香港的法定語言？", options: ["普通話", "英語", "廣東話", "英語和中文"], correctIndex: 3, difficulty: "easy", points: 10, category: "基本知識" },
  { id: "e8", text: "選舉委員會主要負責選出哪個職位？", options: ["立法會議員", "行政長官", "區議員", "法官"], correctIndex: 1, difficulty: "easy", points: 10, category: "選舉制度" },
  { id: "e9", text: "香港基本法由哪個機構頒布？", options: ["香港立法會", "全國人民代表大會", "行政長官", "英國議會"], correctIndex: 1, difficulty: "easy", points: 10, category: "法律" },
  { id: "e10", text: "「一國兩制」中的「兩制」指的是什麼？", options: ["兩種語言制度", "兩種貨幣制度", "社會主義和資本主義制度", "兩種法律制度"], correctIndex: 2, difficulty: "easy", points: 10, category: "基本法" },
  // === MEDIUM (20 points) ===
  { id: "m1", text: "根據《基本法》，香港實行「一國兩制」的期限是多少年？", options: ["30年", "40年", "50年", "60年"], correctIndex: 2, difficulty: "medium", points: 20, category: "基本法" },
  { id: "m2", text: "香港立法會現時共有多少個議席？", options: ["60席", "70席", "80席", "90席"], correctIndex: 3, difficulty: "medium", points: 20, category: "立法會" },
  { id: "m3", text: "香港選舉委員會現時共有多少名委員？", options: ["800名", "1000名", "1200名", "1500名"], correctIndex: 2, difficulty: "medium", points: 20, category: "選舉制度" },
  { id: "m4", text: "香港的三權分立包括哪三權？", options: ["行政、立法、司法", "行政、立法、軍事", "立法、司法、警察", "行政、司法、財政"], correctIndex: 0, difficulty: "medium", points: 20, category: "政府架構" },
  { id: "m5", text: "完善選舉制度的核心原則是什麼？", options: ["愛國者治港", "外國人治港", "商界人士治港", "學者治港"], correctIndex: 0, difficulty: "medium", points: 20, category: "選舉制度" },
  // === HARD (30 points) ===
  { id: "h1", text: "《基本法》第二十三條涉及什麼立法事宜？", options: ["環境保護", "國家安全", "教育改革", "稅務制度"], correctIndex: 1, difficulty: "hard", points: 30, category: "基本法" },
  { id: "h2", text: "香港立法會的地區直選議席採用什麼選舉制度？", options: ["單議席單票制", "比例代表制", "兩輪投票制", "首選投票制"], correctIndex: 1, difficulty: "hard", points: 30, category: "選舉制度" },
  { id: "h3", text: "《基本法》第四十五條規定，行政長官最終目標是由什麼方式產生？", options: ["選舉委員會選出", "立法會選出", "普選產生", "中央政府委任"], correctIndex: 2, difficulty: "hard", points: 30, category: "基本法" },
  { id: "h4", text: "香港選舉委員會分為多少個界別？", options: ["3個", "4個", "5個", "6個"], correctIndex: 2, difficulty: "hard", points: 30, category: "選舉制度" },
  { id: "h5", text: "2021年完善選舉制度後，立法會議席由原來的多少席增加至90席？", options: ["60席", "70席", "75席", "80席"], correctIndex: 1, difficulty: "hard", points: 30, category: "選舉制度" },
];
