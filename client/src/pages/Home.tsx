// ============================================================
// IES Supermarket Quiz — Main Page (Screen Router)
// Kiosk portrait layout, max 480px centered
// Scan → directly to question (no full-screen transition overlay)
// Admin button (⚙️) in top-right corner for data management
// ============================================================

import { GameOverScreen } from "@/components/screens/GameOverScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { QuestionScreen } from "@/components/screens/QuestionScreen";
import { CorrectResultScreen, WrongResultScreen } from "@/components/screens/ResultScreen";
import { ScanningScreen } from "@/components/screens/ScanningScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { AdminPanel } from "@/components/AdminPanel";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

function ScreenRouter() {
  const { screen, reloadData } = useGame();
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="relative w-full min-h-screen">
      {/* Admin button — visible on home/settings screens only */}
      {(screen === "home" || screen === "settings") && (
        <button
          onClick={() => setShowAdmin(true)}
          className="absolute top-3 right-3 z-40 bg-white/80 hover:bg-white text-[#1a5fa8] font-black text-xs px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 border border-[#29ABE2]/30"
        >
          ⚙️ 管理員
        </button>
      )}

      {/* Screen router with smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.2, type: "tween" }}
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
