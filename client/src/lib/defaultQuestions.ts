// ============================================================
// IES Supermarket Quiz — Default Questions (built-in fallback)
// SOURCE: ElectionMCquestion2026 (as at 05/06 @1530)
// APPROVED: 41 questions without client remarks
// Updated: 2026-05-09
// ============================================================

import { Question } from "./dataStore";

// Helper: strip option prefix like "(A) " or "(B) "
function strip(s: string): string {
  return s.replace(/^\([A-D]\)\s*/i, "").trim();
}

// Helper: map answer letter to index
function ansIdx(ans: string): number {
  const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  return map[ans.trim().toUpperCase()] ?? 0;
}

// Helper: map Chinese difficulty to English
function diff(s: string): "easy" | "medium" | "hard" {
  if (s === "容易") return "easy";
  if (s === "中等") return "medium";
  return "hard";
}

export const DEFAULT_QUESTIONS: Question[] = [
  // ============================================================
  // 展板一：完善選舉制度的核心與優勢
  // ============================================================
  {
    id: "Q01",
    text: "完善選舉制度是否全面落實確保以愛國者為主體的「愛國者港人治港」是否完善選舉制度的其中一個重要原則？",
    options: ["是", "否"],
    correctIndex: 0,
    difficulty: "easy",
    points: 10,
    category: "展板一：完善選舉制度的核心與優勢",
  },
  {
    id: "Q06",
    text: "以下哪一項是完善選舉制度必須全面準確貫徹落實哪一項方針？",
    options: [
      strip("(A) 「一國一制」"),
      strip("(B) 「一國兩制」"),
      strip("(C) 「一國三制」"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "medium",
    points: 20,
    category: "展板一：完善選舉制度的核心與優勢",
  },
  {
    id: "Q08",
    text: "完善選舉制度確保香港特區的管治權牢牢掌握在誰的手中？",
    options: [
      strip("(A) 外國人"),
      strip("(B) 反中亂港分子"),
      strip("(C) 愛國者"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "medium",
    points: 20,
    category: "展板一：完善選舉制度的核心與優勢",
  },
  {
    id: "Q10",
    text: "以下哪一類人士不被官方界定為「治港者」範圍以內？",
    options: [
      strip("(A) 反中亂港分子"),
      strip("(B) 愛國愛港人士"),
      strip("(C) 賢能人士"),
    ],
    correctIndex: ansIdx("A"),
    difficulty: "medium",
    points: 20,
    category: "展板一：完善選舉制度的核心與優勢",
  },
  {
    id: "Q11",
    text: "完善選舉制度如何充分體現高質量民主？",
    options: [
      strip("(A) 讓所有人不論背景均可參選"),
      strip("(B) 確保選舉結果由外國勢力決定"),
      strip("(C) 確保選出的人是愛國者，並能真正代表香港市民的整體利益"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "hard",
    points: 30,
    category: "展板一：完善選舉制度的核心與優勢",
  },
  {
    id: "Q12",
    text: "根據官方文件，完善選舉制度對特區有甚麼重要性？",
    options: [
      strip("(A) 確保香港長期繁榮穩定"),
      strip("(B) 讓外國勢力參與香港政治"),
      strip("(C) 減少選舉的透明度"),
    ],
    correctIndex: ansIdx("A"),
    difficulty: "hard",
    points: 30,
    category: "展板一：完善選舉制度的核心與優勢",
  },
  {
    id: "Q13",
    text: "《全國人民代表大會關於完善香港特別行政區選舉制度的決定》授權全國人大常委會修改《基本法》的哪兩個附件？",
    options: [
      strip("(A) 附件一及附件三"),
      strip("(B) 附件一及附件二"),
      strip("(C) 附件二及附件三"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "hard",
    points: 30,
    category: "展板一：完善選舉制度的核心與優勢",
  },
  {
    id: "Q14",
    text: "修訂《基本法》附件一及二後，特區政府以甚麼方式落實完善選舉制度的憲制責任？",
    options: [
      strip("(A) 通過行政命令"),
      strip("(B) 通過公眾諮詢"),
      strip("(C) 修訂《選舉（舞弊及非法行為）條例》及《立法會條例》等本地法律"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "hard",
    points: 30,
    category: "展板一：完善選舉制度的核心與優勢",
  },

  // ============================================================
  // 展板二：資格審查委員會
  // ============================================================
  {
    id: "Q17",
    text: "資格審查委員會的主席是由中央人民政府直接委任嗎？",
    options: ["否", "是"],
    correctIndex: ansIdx("B"),
    difficulty: "easy",
    points: 10,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q18",
    text: "資格審查委員會的組成中，是否設有非官守成員？",
    options: ["是", "否"],
    correctIndex: ansIdx("A"),
    difficulty: "easy",
    points: 10,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q19",
    text: "特區警務處維護國家安全部門是否會就候選人進行審查？",
    options: ["否", "是"],
    correctIndex: ansIdx("B"),
    difficulty: "easy",
    points: 10,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q20",
    text: "市民可以對資格審查委員會根據國安委審查意見書作出的決定提起訴訟嗎？",
    options: ["是", "否"],
    correctIndex: ansIdx("B"),
    difficulty: "easy",
    points: 10,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q21",
    text: "資格審查委員會的主席及成員由誰委任？",
    options: [
      strip("(A) 立法會主席"),
      strip("(B) 全國人民代表大會"),
      strip("(C) 行政長官"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "medium",
    points: 20,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q22",
    text: "資格審查委員會的官守成員人數限制是多少？",
    options: [
      strip("(A) 不多於三名"),
      strip("(B) 不多於五名"),
      strip("(C) 不多於七名"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "medium",
    points: 20,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q23",
    text: "資格審查委員會的非官守成員人數限制是多少？",
    options: [
      strip("(A) 不多於三名"),
      strip("(B) 不多於五名"),
      strip("(C) 不多於七名"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "medium",
    points: 20,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q24",
    text: "哪個機構負責向資格審查委員會出具審查意見書？",
    options: [
      strip("(A) 廉政公署"),
      strip("(B) 香港特區國家安全委員會"),
      strip("(C) 律政司"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "medium",
    points: 20,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q25",
    text: "哪類官員有資格被委任為資格審查委員會的主席或官守成員？",
    options: [
      strip("(A) 立法會議員"),
      strip("(B) 主要官員或法官"),
      strip("(C) 區議員"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "medium",
    points: 20,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q26",
    text: "候選人資格審查委員會負責審查並確認哪三類候選人的資格？",
    options: [
      strip("(A) 選舉委員會委員、行政長官及區議員"),
      strip("(B) 選舉委員會委員、行政長官及立法會議員"),
      strip("(C) 行政長官、立法會議員及區議員"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "hard",
    points: 30,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q27",
    text: "國安委就候選人是否符合法定要求作出判斷的依據是甚麼？",
    options: [
      strip("(A) 候選人的個人財產狀況"),
      strip("(B) 候選人的學歷及工作經驗"),
      strip("(C) 警務處國家安全部門的審查情況"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "hard",
    points: 30,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q28",
    text: "資格審查委員會確保候選人必須符合哪一項核心法定要求？",
    options: [
      strip("(A) 候選人必須擁有香港永久居民身份"),
      strip("(B) 候選人必須通過普通話考試"),
      strip("(C) 候選人必須擁護《基本法》及效忠香港特別行政區"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "hard",
    points: 30,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q29",
    text: "下列哪一項不是候選人資格審查委員會的職責？",
    options: [
      strip("(A) 負責點算選票"),
      strip("(B) 審查並確認候選人的資格"),
      strip("(C) 確保候選人符合擁護《基本法》的要求"),
    ],
    correctIndex: ansIdx("A"),
    difficulty: "hard",
    points: 30,
    category: "展板二：資格審查委員會",
  },
  {
    id: "Q30",
    text: "《決定》訂明香港應當健全資格審查制度，確保候選人符合哪部法律？",
    options: [
      strip("(A) 《人權法案條例》"),
      strip("(B) 《基本法》及香港國家安全法"),
      strip("(C) 《選舉條例》"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "hard",
    points: 30,
    category: "展板二：資格審查委員會",
  },

  // ============================================================
  // 展板三：選舉委員會及立法會
  // ============================================================
  {
    id: "Q31",
    text: "選舉委員會是否合共由1500名委員組成嗎？",
    options: ["否", "是"],
    correctIndex: ansIdx("B"),
    difficulty: "easy",
    points: 10,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q32",
    text: "選舉委員會委員是否由五個大界別所組成？",
    options: ["是", "否"],
    correctIndex: ansIdx("A"),
    difficulty: "easy",
    points: 10,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q33",
    text: "立法會議員每屆是否有90人？",
    options: ["是", "否"],
    correctIndex: ansIdx("A"),
    difficulty: "easy",
    points: 10,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q34",
    text: "完善選舉制度後，立法會是否仍然保留由地方選區選舉選出的議席？",
    options: ["是", "否"],
    correctIndex: ansIdx("A"),
    difficulty: "easy",
    points: 10,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q35",
    text: "選舉委員會是否負責選出全部90名的立法會議員？",
    options: ["是", "否"],
    correctIndex: ansIdx("B"),
    difficulty: "easy",
    points: 10,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q36",
    text: "新一屆選舉委員會的界別分組一般選舉將於哪一年舉行？",
    options: [
      strip("(A) 2025年"),
      strip("(B) 2026年"),
      strip("(C) 2027年"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "easy",
    points: 10,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q37",
    text: "以下哪個界別分組屬於選舉委員會第三界別？",
    options: [
      strip("(A) 工業界（第一）"),
      strip("(B) 基層、勞工和宗教等界"),
      strip("(C) 金融界"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "medium",
    points: 20,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q38",
    text: "立法會中，由選舉委員會選舉產生的立法會議員共有多少人？",
    options: [
      strip("(A) 20人"),
      strip("(B) 30人"),
      strip("(C) 40人"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "medium",
    points: 20,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q39",
    text: "立法會中，由功能界別選舉產生的立法會議員共有多少人？",
    options: [
      strip("(A) 30人"),
      strip("(B) 40人"),
      strip("(C) 50人"),
    ],
    correctIndex: ansIdx("A"),
    difficulty: "medium",
    points: 20,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q40",
    text: "立法會的分區直接選舉共劃分了多少個地方選區？",
    options: [
      strip("(A) 三個"),
      strip("(B) 五個"),
      strip("(C) 七個"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "medium",
    points: 20,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q41",
    text: "立法會分區直接地方選區選舉中，每個選區會選舉產生多少名議員？",
    options: [
      strip("(A) 2名"),
      strip("(B) 3名"),
      strip("(C) 4名"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "medium",
    points: 20,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q42",
    text: "科技創新界屬於立法會的哪一類議席？",
    options: [
      strip("(A) 地方選區議席"),
      strip("(B) 選舉委員會議席"),
      strip("(C) 功能界別議席"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "medium",
    points: 20,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q43",
    text: "完善選舉制度後，每屆立法會「勞工界」功能界別會產生多少名議員？",
    options: [
      strip("(A) 1名"),
      strip("(B) 2名"),
      strip("(C) 3名"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "medium",
    points: 20,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q44",
    text: "選舉委員會中，每個界別分配了多少名委員？",
    options: [
      strip("(A) 200名"),
      strip("(B) 250名"),
      strip("(C) 300名"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "medium",
    points: 20,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q47",
    text: "選舉委員會第五界別的組成部分包括甚麼人士？",
    options: [
      strip("(A) 工商界代表"),
      strip("(B) 全國人大代表、全國政協委員及香港地區全國性團體代表"),
      strip("(C) 區議員"),
    ],
    correctIndex: ansIdx("B"),
    difficulty: "hard",
    points: 30,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q48",
    text: "下列哪項是選舉委員會的職權之一？",
    options: [
      strip("(A) 制定特區法律"),
      strip("(B) 批准政府財政預算案公共開支"),
      strip("(C) 提名行政長官候選人"),
    ],
    correctIndex: ansIdx("C"),
    difficulty: "hard",
    points: 30,
    category: "展板三：選舉委員會及立法會",
  },
  {
    id: "Q77",
    text: "完善選舉制度後，立法會90個議席當中，由地方選區（地區直選）選舉產生的立法會議員共有多少席？",
    options: [
      strip("(A) 20席"),
      strip("(B) 30席"),
      strip("(C) 40席"),
    ],
    correctIndex: ansIdx("A"),
    difficulty: "hard",
    points: 30,
    category: "展板三：選舉委員會及立法會",
  },

  // ============================================================
  // 展板四：領航未來 (行政長官與新安排)
  // ============================================================
  {
    id: "Q51",
    text: "行政長官是否由選舉委員會選出？",
    options: ["否", "是"],
    correctIndex: ansIdx("B"),
    difficulty: "easy",
    points: 10,
    category: "展板四：領航未來（行政長官與新安排）",
  },
  {
    id: "Q52",
    text: "行政長官候任人是否由中央人民政府任命？",
    options: ["是", "否"],
    correctIndex: ansIdx("A"),
    difficulty: "easy",
    points: 10,
    category: "展板四：領航未來（行政長官與新安排）",
  },
];
