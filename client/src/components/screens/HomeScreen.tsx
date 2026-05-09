// ============================================================
// IES Supermarket Quiz — Home Screen
// KIOSK 9:16 fixed — no scroll, all content fits in one view
// ============================================================

import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { motion } from "framer-motion";

const KV_IMAGE = "/manus-storage/ies-kv_6fd4c960.jpg";

export function HomeScreen() {
  const { startGame, goToSettings, totalTimeOption } = useGame();
  const { playClick } = useSounds();

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #e8f4ff 0%, #c5e8ff 50%, #a0d8f0 100%)" }}
    >
      {/* KV Image — takes ~55% of height */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-shrink-0"
        style={{ height: "54%" }}
      >
        <img
          src={KV_IMAGE}
          alt="完善選舉制度巡迴互動展覽 票箱家族超市"
          className="w-full h-full object-cover object-top"
        />
      </motion.div>

      {/* Bottom panel — takes remaining ~46% */}
      <div className="flex-1 flex flex-col px-4 pb-3 pt-2 gap-2 min-h-0">

        {/* Time selector row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl px-3 py-2.5 flex items-center justify-between shadow-md border-2 border-[#29ABE2]/30 flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#29ABE2] rounded-xl flex items-center justify-center text-lg shadow flex-shrink-0">
              ⏱️
            </div>
            <div>
              <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-wide leading-none">挑戰時間</p>
              <p className="text-[#1a5fa8] font-black text-2xl font-orbitron leading-tight">
                {totalTimeOption}<span className="text-sm">秒</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => { playClick(); goToSettings(); }}
            className="bg-[#29ABE2] hover:bg-[#1a90c8] text-white font-black text-xs px-3 py-2 rounded-xl shadow transition-all active:scale-95 border-b-2 border-[#1a5fa8] flex-shrink-0"
          >
            ⚙️ 更改設定
          </button>
        </motion.div>

        {/* Scoring info */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-2 flex-shrink-0"
        >
          {[
            { label: "簡單", pts: "10分", bg: "bg-teal-400", border: "border-b-4 border-teal-600", emoji: "⭐" },
            { label: "中等", pts: "20分", bg: "bg-yellow-400", border: "border-b-4 border-yellow-600", emoji: "⭐⭐" },
            { label: "困難", pts: "30分", bg: "bg-red-400", border: "border-b-4 border-red-600", emoji: "⭐⭐⭐" },
          ].map((item) => (
            <div
              key={item.label}
              className={`${item.bg} ${item.border} rounded-2xl py-2 px-1 text-center shadow`}
            >
              <div className="text-xs leading-none mb-0.5">{item.emoji}</div>
              <div className="text-white font-black text-xl leading-tight">{item.pts}</div>
              <div className="text-white/90 text-xs font-bold">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* START BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => { playClick(); startGame(); }}
          whileTap={{ scale: 0.97 }}
          className="w-full text-white font-black text-2xl py-0 rounded-3xl shadow-2xl transition-all active:translate-y-1 flex-1 min-h-0"
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)",
            borderBottom: "5px solid #cc4400",
          }}
        >
          🛒 開始掃描挑戰！
        </motion.button>
      </div>

      {/* Checkered floor strip */}
      <div className="checkered-floor h-5 opacity-50 flex-shrink-0" />
    </div>
  );
}
