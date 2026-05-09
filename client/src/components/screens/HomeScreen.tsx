// ============================================================
// IES Supermarket Quiz — Home Screen
// Theme: 完善選舉制度巡迴互動展覽 票箱家族超市
// Sky blue + checkered floor + KV image + big start button
// ============================================================

import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { motion } from "framer-motion";

const KV_IMAGE = "/manus-storage/ies-kv_6fd4c960.jpg";

export function HomeScreen() {
  const { startGame, goToSettings, totalTimeOption } = useGame();
  const { playClick } = useSounds();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #e8f4ff 0%, #c5e8ff 50%, #a0d8f0 100%)" }}>

      {/* KV Image — full width at top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex-shrink-0"
      >
        <img
          src={KV_IMAGE}
          alt="完善選舉制度巡迴互動展覽 票箱家族超市 IES Supermarket"
          className="w-full object-cover object-top"
        />
      </motion.div>

      {/* Bottom panel */}
      <div className="flex-1 flex flex-col px-4 pb-5 pt-3 gap-3">

        {/* Time selector row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl px-4 py-3 flex items-center justify-between shadow-md border-2 border-[#29ABE2]/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#29ABE2] rounded-2xl flex items-center justify-center text-xl shadow flex-shrink-0">
              ⏱️
            </div>
            <div>
              <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-wide">挑戰時間</p>
              <p className="text-[#1a5fa8] font-black text-3xl font-orbitron leading-none">
                {totalTimeOption}<span className="text-lg">秒</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => { playClick(); goToSettings(); }}
            className="bg-[#29ABE2] hover:bg-[#1a90c8] text-white font-black text-sm px-4 py-3 rounded-2xl shadow transition-all active:scale-95 border-b-4 border-[#1a5fa8] flex-shrink-0"
          >
            ⚙️ 更改設定
          </button>
        </motion.div>

        {/* Scoring info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-2"
        >
          {[
            { label: "簡單", pts: "10分", bg: "bg-teal-400", border: "border-b-4 border-teal-600", emoji: "⭐" },
            { label: "中等", pts: "20分", bg: "bg-yellow-400", border: "border-b-4 border-yellow-600", emoji: "⭐⭐" },
            { label: "困難", pts: "30分", bg: "bg-red-400", border: "border-b-4 border-red-600", emoji: "⭐⭐⭐" },
          ].map((item) => (
            <div
              key={item.label}
              className={`${item.bg} ${item.border} rounded-2xl p-3 text-center shadow`}
            >
              <div className="text-sm leading-none mb-0.5">{item.emoji}</div>
              <div className="text-white font-black text-2xl leading-tight">{item.pts}</div>
              <div className="text-white/90 text-xs font-bold">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* START BUTTON — big and prominent */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onClick={() => { playClick(); startGame(); }}
          whileTap={{ scale: 0.97 }}
          className="w-full text-white font-black text-3xl py-7 rounded-3xl shadow-2xl transition-all active:translate-y-1"
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)",
            borderBottom: "6px solid #cc4400",
          }}
        >
          🛒 開始掃描挑戰！
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#1a5fa8]/60 text-xs text-center font-bold"
        >
          點擊掃描區域 或 使用 USB 掃描器掃描貨物條碼
        </motion.p>
      </div>

      {/* Checkered floor strip */}
      <div className="checkered-floor h-6 opacity-50 flex-shrink-0" />
    </div>
  );
}
