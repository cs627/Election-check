// ============================================================
// IES Supermarket Quiz — Main Page (Screen Router)
// Kiosk portrait layout, max 480px centered
// ScanTransition renders as a full-screen overlay above everything
// Admin button (⚙️) in top-right corner for data management
// ============================================================

import { GameOverScreen } from "@/components/screens/GameOverScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { QuestionScreen } from "@/components/screens/QuestionScreen";
import { CorrectResultScreen, WrongResultScreen } from "@/components/screens/ResultScreen";
import { ScanningScreen } from "@/components/screens/ScanningScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { ScanTransition } from "@/components/ScanTransition";
import { AdminPanel } from "@/components/AdminPanel";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

type TransitionPhase = "laser" | "reveal" | "burst" | "hold" | "exit";

function ScreenRouter() {
  const { screen, currentQuestion, currentProduct, finishTransition, reloadData } = useGame();
  const [showAdmin, setShowAdmin] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>("laser");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Manage transition phases
  useEffect(() => {
    if (screen === "scan-transition") {
      setTransitionPhase("laser");
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [
        setTimeout(() => setTransitionPhase("reveal"), 500),
        setTimeout(() => setTransitionPhase("burst"), 900),
        setTimeout(() => setTransitionPhase("hold"), 1100),
        setTimeout(() => setTransitionPhase("exit"), 2400),
        setTimeout(() => finishTransition(), 2800),
      ];
    }
    return () => timersRef.current.forEach(clearTimeout);
  }, [screen, finishTransition]);

  const baseScreen = screen === "scan-transition" ? "scanning" : screen;

  return (
    <div className="relative w-full min-h-screen">
      {/* Admin button — visible on home screen only */}
      {(screen === "home" || screen === "settings") && (
        <button
          onClick={() => setShowAdmin(true)}
          className="absolute top-3 right-3 z-40 bg-white/80 hover:bg-white text-[#1a5fa8] font-black text-xs px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 border border-[#29ABE2]/30"
        >
          ⚙️ 管理員
        </button>
      )}

      {/* Base screen layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={baseScreen}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22, type: "tween" }}
          className="w-full min-h-screen"
        >
          {baseScreen === "home"           && <HomeScreen />}
          {baseScreen === "settings"       && <SettingsScreen />}
          {baseScreen === "scanning"       && <ScanningScreen />}
          {baseScreen === "question"       && <QuestionScreen />}
          {baseScreen === "result-correct" && <CorrectResultScreen />}
          {baseScreen === "result-wrong"   && <WrongResultScreen />}
          {baseScreen === "game-over"      && <GameOverScreen />}
        </motion.div>
      </AnimatePresence>

      {/* Scan Transition overlay */}
      <AnimatePresence>
        {screen === "scan-transition" && currentQuestion && (
          <ScanTransition
            key="scan-transition"
            question={currentQuestion}
            product={currentProduct}
            phase={transitionPhase}
            onComplete={finishTransition}
          />
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPanel
            onClose={() => setShowAdmin(false)}
            onDataLoaded={() => {
              reloadData();
              setShowAdmin(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-300 flex justify-center">
        <div className="w-full max-w-[480px] relative shadow-2xl overflow-hidden">
          <ScreenRouter />
        </div>
      </div>
    </GameProvider>
  );
}
