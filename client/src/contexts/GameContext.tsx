// ============================================================
// IES Supermarket Quiz — Game State Context
// Data-driven: reads products + questions from Excel upload
// USB barcode scanner support (keyboard buffer)
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_PRODUCTS,
  GameData,
  LeaderboardEntry,
  Product,
  Question,
  findProductByBarcode,
  getRandomQuestion,
  loadGameData,
  saveToLeaderboard,
} from "@/lib/dataStore";
import { DEFAULT_QUESTIONS } from "@/lib/defaultQuestions";

export type GameScreen =
  | "home"
  | "settings"
  | "scanning"
  | "scan-transition"
  | "question"
  | "result-correct"
  | "result-wrong"
  | "game-over";

interface GameState {
  screen: GameScreen;
  score: number;
  timeLeft: number;
  totalTime: number;
  currentQuestion: Question | null;
  currentProduct: Product | null;    // the scanned product for animation
  selectedAnswer: number | null;
  usedQuestionIds: string[];
  questionsAnswered: number;
  correctAnswers: number;
  rank: number;
  leaderboardEntry: LeaderboardEntry | null;
  gameStartTime: number;
}

interface GameContextValue extends GameState {
  startGame: () => void;
  goToSettings: () => void;
  goHome: () => void;
  scanBarcode: (barcode?: string) => void;
  finishTransition: () => void;
  selectAnswer: (index: number) => void;
  nextScan: () => void;
  setTotalTime: (seconds: number) => void;
  totalTimeOption: number;
  // Data management
  gameData: GameData;
  reloadData: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const DEFAULT_TIME = 120;

function buildInitialState(totalTime: number): GameState {
  return {
    screen: "home",
    score: 0,
    timeLeft: totalTime,
    totalTime,
    currentQuestion: null,
    currentProduct: null,
    selectedAnswer: null,
    usedQuestionIds: [],
    questionsAnswered: 0,
    correctAnswers: 0,
    rank: 0,
    leaderboardEntry: null,
    gameStartTime: 0,
  };
}

function getActiveGameData(): GameData {
  const stored = loadGameData();
  return stored || {
    products: DEFAULT_PRODUCTS,
    questions: DEFAULT_QUESTIONS,
    loadedAt: 0,
    fileName: "預設數據",
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [totalTimeOption, setTotalTimeOptionState] = useState(DEFAULT_TIME);
  const [state, setState] = useState<GameState>(() => buildInitialState(DEFAULT_TIME));
  const [gameData, setGameData] = useState<GameData>(getActiveGameData);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanBufferRef = useRef<string>("");
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reloadData = useCallback(() => {
    setGameData(getActiveGameData());
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((duration: number) => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.screen === "game-over") { clearTimer(); return prev; }
        const newTime = prev.timeLeft - 1;
        if (newTime <= 0) {
          clearTimer();
          const entry: LeaderboardEntry = {
            timestamp: prev.gameStartTime,
            score: prev.score,
            duration: prev.totalTime,
            questionsAnswered: prev.questionsAnswered,
            correctAnswers: prev.correctAnswers,
          };
          const rank = saveToLeaderboard(entry);
          return { ...prev, timeLeft: 0, screen: "game-over", rank, leaderboardEntry: entry };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 1000);
  }, [clearTimer]);

  const startGame = useCallback(() => {
    clearTimer();
    const now = Date.now();
    setState({ ...buildInitialState(totalTimeOption), screen: "scanning", gameStartTime: now });
    startTimer(totalTimeOption);
  }, [clearTimer, startTimer, totalTimeOption]);

  const goToSettings = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, screen: "settings" }));
  }, [clearTimer]);

  const goHome = useCallback(() => {
    clearTimer();
    setState(buildInitialState(totalTimeOption));
  }, [clearTimer, totalTimeOption]);

  // scanBarcode: accepts optional barcode string (from USB scanner)
  // or picks a random product if no barcode given (mouse click simulation)
  const scanBarcode = useCallback((barcode?: string) => {
    setState((prev) => {
      if (prev.screen !== "scanning") return prev;

      // Find product by barcode or pick random
      let product: Product | null = null;
      if (barcode) {
        product = findProductByBarcode(barcode, gameData.products);
        if (!product) {
          // Barcode not found — pick random product
          product = gameData.products[Math.floor(Math.random() * gameData.products.length)] || null;
        }
      } else {
        // Mouse click simulation: random product
        product = gameData.products[Math.floor(Math.random() * gameData.products.length)] || null;
      }

      const question = getRandomQuestion(gameData.questions, prev.usedQuestionIds);
      if (!question) return prev;

      // Go directly to question — no full-screen transition overlay
      return {
        ...prev,
        screen: "question",
        currentQuestion: question,
        currentProduct: product,
        selectedAnswer: null,
      };
    });
  }, [gameData]);

  const finishTransition = useCallback(() => {
    setState((prev) => {
      if (prev.screen !== "scan-transition") return prev;
      return { ...prev, screen: "question" };
    });
  }, []);

  const selectAnswer = useCallback((index: number) => {
    setState((prev) => {
      if (prev.screen !== "question" || !prev.currentQuestion) return prev;
      const isCorrect = index === prev.currentQuestion.correctIndex;
      return {
        ...prev,
        selectedAnswer: index,
        score: isCorrect ? prev.score + prev.currentQuestion.points : prev.score,
        screen: isCorrect ? "result-correct" : "result-wrong",
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        usedQuestionIds: [...prev.usedQuestionIds, prev.currentQuestion.id],
      };
    });
  }, []);

  const nextScan = useCallback(() => {
    setState((prev) => {
      if (prev.timeLeft <= 0) return prev;
      return { ...prev, screen: "scanning", currentQuestion: null, currentProduct: null, selectedAnswer: null };
    });
  }, []);

  const setTotalTime = useCallback((seconds: number) => {
    setTotalTimeOptionState(seconds);
    setState((prev) => ({ ...prev, totalTime: seconds, timeLeft: seconds }));
  }, []);

  // USB Barcode Scanner keyboard buffer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "Enter") {
        const buf = scanBufferRef.current.trim();
        scanBufferRef.current = "";
        if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
        if (buf.length > 0) {
          setState((prev) => {
            if (prev.screen !== "scanning") return prev;
            return prev; // trigger via scanBarcode with barcode
          });
          // Call scanBarcode with the actual barcode
          scanBarcode(buf);
        }
      } else if (e.key.length === 1) {
        scanBufferRef.current += e.key;
        if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
        scanTimerRef.current = setTimeout(() => {
          scanBufferRef.current = "";
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scanBarcode]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        startGame,
        goToSettings,
        goHome,
        scanBarcode,
        finishTransition,
        selectAnswer,
        nextScan,
        setTotalTime,
        totalTimeOption,
        gameData,
        reloadData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
