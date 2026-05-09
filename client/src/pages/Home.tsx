// ============================================================
// IES Supermarket Quiz — Main Page (Screen Router)
// KIOSK MODE: Fixed 9:16 viewport, NO page scroll ever.
// Container: max-width 480px, height = width × 16/9
// All screens must fit within this fixed box.
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
    // This div fills the kiosk box exactly — overflow hidden, no scroll
    <div className="relative w-full h-full overflow-hidden">
      {/* Admin button */}
      {(screen === "home" || screen === "settings") && (
        <button
          onClick={() => setShowAdmin(true)}
          className="absolute top-3 right-3 z-40 bg-white/80 hover:bg-white text-[#1a5fa8] font-black text-xs px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 border border-[#29ABE2]/30"
        >
          ⚙️ 管理員
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18, type: "tween" }}
          // Each screen fills the kiosk box exactly
          className="absolute inset-0 w-full h-full"
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
      {/*
        Outer shell: full viewport, dark background, centers the kiosk box.
        overflow-hidden on body is set via CSS to prevent any page scroll.
      */}
      <div
        className="w-screen h-screen bg-gray-400 flex items-center justify-center overflow-hidden"
        style={{ touchAction: "none" }}
      >
        {/*
          Kiosk box: fixed 9:16 aspect ratio, max 480px wide.
          Uses CSS aspect-ratio to maintain 9:16 regardless of screen size.
          On tall screens (portrait phone/tablet) it fills width.
          On wide screens (landscape) it's constrained by height.
        */}
        <div
          className="relative bg-white shadow-2xl overflow-hidden"
          style={{
            aspectRatio: "9 / 16",
            width: "min(480px, 100vw, calc(100vh * 9 / 16))",
            height: "min(calc(480px * 16 / 9), 100vh, calc(100vw * 16 / 9))",
            maxWidth: "480px",
            maxHeight: "100vh",
          }}
        >
          <ScreenRouter />
        </div>
      </div>
    </GameProvider>
  );
}
