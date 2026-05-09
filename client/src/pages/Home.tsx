// ============================================================
// IES Supermarket Quiz — Main Page (Screen Router)
// Kiosk portrait layout, max 480px centered
// ============================================================

import { GameOverScreen } from "@/components/screens/GameOverScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { QuestionScreen } from "@/components/screens/QuestionScreen";
import { CorrectResultScreen, WrongResultScreen } from "@/components/screens/ResultScreen";
import { ScanningScreen } from "@/components/screens/ScanningScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { AnimatePresence, motion } from "framer-motion";

function ScreenRouter() {
  const { screen } = useGame();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.22 }}
        className="w-full min-h-screen"
      >
        {screen === "home"           && <HomeScreen />}
        {screen === "settings"       && <SettingsScreen />}
        {screen === "scanning"       && <ScanningScreen />}
        {screen === "question"       && <QuestionScreen />}
        {screen === "result-correct" && <CorrectResultScreen />}
        {screen === "result-wrong"   && <WrongResultScreen />}
        {screen === "game-over"      && <GameOverScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  return (
    <GameProvider>
      {/* Kiosk outer shell: centered, max 480px, portrait */}
      <div className="min-h-screen bg-gray-200 flex justify-center">
        <div className="w-full max-w-[480px] relative shadow-2xl">
          <ScreenRouter />
        </div>
      </div>
    </GameProvider>
  );
}
