// ============================================================
// IES Supermarket Quiz — Settings Screen
// Time selection with big colorful buttons
// ============================================================

import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { motion } from "framer-motion";

const TIME_OPTIONS = [
  { seconds: 60,  label: "60秒",  desc: "適合小朋友 👶",   color: "from-teal-400 to-teal-500",     border: "border-teal-700" },
  { seconds: 90,  label: "90秒",  desc: "輕鬆挑戰 😊",   color: "from-sky-400 to-sky-500",       border: "border-sky-700" },
  { seconds: 120, label: "120秒", desc: "推薦時間 ⭐",    color: "from-[#29ABE2] to-[#1a80c0]",  border: "border-[#1a5fa8]", recommended: true },
  { seconds: 150, label: "150秒", desc: "進階挑戰 🔥",   color: "from-orange-400 to-orange-500", border: "border-orange-700" },
  { seconds: 180, label: "180秒", desc: "高手挑戰 💪",   color: "from-red-400 to-red-500",       border: "border-red-700" },
  { seconds: 200, label: "200秒", desc: "終極挑戰 👑",   color: "from-purple-500 to-purple-600", border: "border-purple-800" },
];

export function SettingsScreen() {
  const { setTotalTime, goHome, totalTimeOption } = useGame();
  const { playClick } = useSounds();

  const handleSelect = (seconds: number) => {
    playClick();
    setTotalTime(seconds);
    goHome();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #29ABE2 0%, #87CEEB 100%)" }}>
      {/* Header */}
      <div className="bg-[#1a5fa8] px-6 py-5 shadow-lg">
        <button
          onClick={() => { playClick(); goHome(); }}
          className="text-white/80 hover:text-white font-bold flex items-center gap-2 mb-3 transition-colors text-base"
        >
          ← 返回主頁
        </button>
        <h1 className="text-white font-black text-3xl">⚙️ 遊戲設定</h1>
        <p className="text-white/80 text-sm mt-1">因應場地人流選擇合適挑戰時間</p>
      </div>

      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {TIME_OPTIONS.map((opt, i) => (
            <motion.button
              key={opt.seconds}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => handleSelect(opt.seconds)}
              className={`relative bg-gradient-to-br ${opt.color} rounded-3xl p-5 text-center shadow-lg transition-all active:scale-95 border-b-4 ${opt.border} ${
                totalTimeOption === opt.seconds ? "ring-4 ring-white ring-offset-2 ring-offset-transparent" : ""
              }`}
            >
              {opt.recommended && (
                <span className="absolute -top-2 -right-2 bg-yellow-300 text-yellow-900 text-xs font-black px-2 py-0.5 rounded-full shadow">
                  推薦
                </span>
              )}
              {totalTimeOption === opt.seconds && (
                <span className="absolute -top-2 -left-2 bg-white text-green-600 text-xs font-black px-2 py-0.5 rounded-full shadow">
                  ✓ 已選
                </span>
              )}
              <div className="text-white font-black text-4xl font-orbitron">{opt.label}</div>
              <div className="text-white/90 text-sm mt-1 font-bold">{opt.desc}</div>
            </motion.button>
          ))}
        </div>

        {/* Score explanation */}
        <div className="mt-5 bg-white/80 rounded-3xl p-5 shadow border border-white/60">
          <p className="text-[#1a5fa8] font-black text-base mb-3">💡 分數說明</p>
          {[
            { label: "⭐ 簡單題目", pts: "+10分", color: "text-teal-600" },
            { label: "⭐⭐ 中等題目", pts: "+20分", color: "text-yellow-600" },
            { label: "⭐⭐⭐ 困難題目", pts: "+30分", color: "text-red-500" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-gray-700 font-bold text-sm">{item.label}</span>
              <span className={`${item.color} font-black text-xl`}>{item.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
