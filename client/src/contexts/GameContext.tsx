// ============================================================
// IES Supermarket Quiz — Game State Context
// Supports: USB barcode scanner (keyboard input) + mouse click
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
  LeaderboardEntry,
  Question,
  getRandomQuestion,
  saveToLeaderboard,
} from "@/lib/gameData";

export type GameScreen =
  | "home"
  | "settings"
  | "scanning"
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
  scanBarcode: () => void;
  selectAnswer: (index: number) => void;
  nextScan: () => void;
  setTotalTime: (seconds: number) => void;
  totalTimeOption: number;
}

const GameContext = createContext<GameContextValue | null>(null);

const DEFAULT_TIME = 120;

const INITIAL_STATE: GameState = {
  screen: "home",
  score: 0,
  timeLeft: DEFAULT_TIME,
  totalTime: DEFAULT_TIME,
  currentQuestion: null,
  selectedAnswer: null,
  usedQuestionIds: [],
  questionsAnswered: 0,
  correctAnswers: 0,
  rank: 0,
  leaderboardEntry: null,
  gameStartTime: 0,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [totalTimeOption, setTotalTimeOptionState] = useState(DEFAULT_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // USB scanner buffer
  const scanBufferRef = useRef<string>("");
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const endGameNow = useCallback((s: GameState) => {
    const entry: LeaderboardEntry = {
      timestamp: s.gameStartTime,
      score: s.score,
      duration: s.totalTime,
      questionsAnswered: s.questionsAnswered,
      correctAnswers: s.correctAnswers,
    };
    const rank = saveToLeaderboard(entry);
    return { rank, entry };
  }, []);

  const startTimer = useCallback(
    (duration: number) => {
      clearTimer();
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.screen === "game-over") {
            clearTimer();
            return prev;
          }
          const newTime = prev.timeLeft - 1;
          if (newTime <= 0) {
            clearTimer();
            const { rank, entry } = endGameNow({ ...prev, timeLeft: 0 });
            return {
              ...prev,
              timeLeft: 0,
              screen: "game-over",
              rank,
              leaderboardEntry: entry,
            };
          }
          return { ...prev, timeLeft: newTime };
        });
      }, 1000);
    },
    [clearTimer, endGameNow]
  );

  const startGame = useCallback(() => {
    clearTimer();
    const now = Date.now();
    setState({
      ...INITIAL_STATE,
      screen: "scanning",
      totalTime: totalTimeOption,
      timeLeft: totalTimeOption,
      gameStartTime: now,
    });
    startTimer(totalTimeOption);
  }, [clearTimer, startTimer, totalTimeOption]);

  const goToSettings = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, screen: "settings" }));
  }, [clearTimer]);

  const goHome = useCallback(() => {
    clearTimer();
    setState({ ...INITIAL_STATE, totalTime: totalTimeOption, timeLeft: totalTimeOption });
  }, [clearTimer, totalTimeOption]);

  const scanBarcode = useCallback(() => {
    setState((prev) => {
      if (prev.screen !== "scanning") return prev;
      const question = getRandomQuestion(prev.usedQuestionIds);
      if (!question) return prev;
      return {
        ...prev,
        screen: "question",
        currentQuestion: question,
        selectedAnswer: null,
      };
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
      return { ...prev, screen: "scanning", currentQuestion: null, selectedAnswer: null };
    });
  }, []);

  const setTotalTime = useCallback((seconds: number) => {
    setTotalTimeOptionState(seconds);
    setState((prev) => ({ ...prev, totalTime: seconds, timeLeft: seconds }));
  }, []);

  // ============================================================
  // USB Barcode Scanner support
  // USB scanners type characters rapidly then send Enter key.
  // We buffer keystrokes and trigger scan on Enter.
  // ============================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      setState((prev) => {
        // Only active during scanning screen
        if (prev.screen !== "scanning") return prev;
        return prev;
      });

      if (e.key === "Enter") {
        // Scanner completed — trigger scan
        const buf = scanBufferRef.current.trim();
        scanBufferRef.current = "";
        if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
        if (buf.length > 0) {
          // Trigger barcode scan
          setState((prev) => {
            if (prev.screen !== "scanning") return prev;
            const question = getRandomQuestion(prev.usedQuestionIds);
            if (!question) return prev;
            return {
              ...prev,
              screen: "question",
              currentQuestion: question,
              selectedAnswer: null,
            };
          });
        }
      } else if (e.key.length === 1) {
        // Buffer character
        scanBufferRef.current += e.key;
        // Auto-clear buffer after 100ms of inactivity (human typing is slower)
        if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
        scanTimerRef.current = setTimeout(() => {
          scanBufferRef.current = "";
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        startGame,
        goToSettings,
        goHome,
        scanBarcode,
        selectAnswer,
        nextScan,
        setTotalTime,
        totalTimeOption,
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
