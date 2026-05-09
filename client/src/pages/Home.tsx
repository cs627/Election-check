// ============================================================
// IES Supermarket Quiz — Main Page (Screen Router)
// Kiosk portrait layout, max 480px centered
// ScanTransition renders as a full-screen overlay above everything
// ============================================================

import { GameOverScreen } from "@/components/screens/GameOverScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { QuestionScreen } from "@/components/screens/QuestionScreen";
import { CorrectResultScreen, WrongResultScreen } from "@/components/screens/ResultScreen";
import { ScanningScreen } from "@/components/screens/ScanningScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { ScanTransition } from "@/components/ScanTransition";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { AnimatePresence, motion } from "framer-motion";

function ScreenRouter() {
  const { screen, currentQuestion, finishTransition } = useGame();

  // The "base" screen shown underneath the transition
  // When transitioning, we keep scanning screen visible behind
  const baseScreen = screen === "scan-transition" ? "scanning" : screen;

  return (
    <div className="relative w-full min-h-screen">
      {/* Base screen layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={baseScreen}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22 }}
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

      {/* Scan Transition overlay — renders on top of everything */}
      <AnimatePresence>
        {screen === "scan-transition" && currentQuestion && (
          <ScanTransition
            key="scan-transition"
            question={currentQuestion}
            onComplete={finishTransition}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      {/* Kiosk outer shell: centered, max 480px, portrait */}
      <div className="min-h-screen bg-gray-300 flex justify-center">
        <div className="w-full max-w-[480px] relative shadow-2xl overflow-hidden">
          <ScreenRouter />
        </div>
      </div>
    </GameProvider>
  );
}
