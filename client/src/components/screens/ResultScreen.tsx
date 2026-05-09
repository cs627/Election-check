// ============================================================
// IES Supermarket Quiz — Result Screens (Correct / Wrong)
// Blue ballot box mascot with happy/sad animations
// ============================================================

import { CountdownTimer } from "@/components/CountdownTimer";
import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

// KV Official Mascot — 藍小寶 (Blue Ballot Box) — expression-only variants
const MASCOT_CORRECT = "/manus-storage/mascot-kv-happy_109923ab.png";
const MASCOT_WRONG   = "/manus-storage/mascot-kv-sad_27a7a776.png";

// Confetti
function Confetti() {
  const colors = ["#FF6B6B", "#29ABE2", "#FFB800", "#4CAF50", "#FF8C00", "#A78BFA"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            width: Math.random() * 10 + 6,
            height: Math.random() * 10 + 6,
            left: `${Math.random() * 100}%`,
            top: "-20px",
          }}
          animate={{ y: "110vh", rotate: 360 * (Math.random() > 0.5 ? 1 : -1), x: (Math.random() - 0.5) * 120 }}
          transition={{ duration: 1.2 + Math.random() * 1.2, delay: Math.random() * 0.6, ease: "linear" }}
        />
      ))}
    </div>
  );
}

export function CorrectResultScreen() {
  const { currentQuestion, score, nextScan } = useGame();
  const { playCorrect } = useSounds();

  useEffect(() => {
    playCorrect();
    const t = setTimeout(() => nextScan(), 3500);
    return () => clearTimeout(t);
  }, []);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "linear-gradient(180deg, #e8f8ff 0%, #b8eeff 100%)" }}>
      <Confetti />

      {/* Green flash */}
      <motion.div className="absolute inset-0 bg-green-400/25 pointer-events-none z-0"
        initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} />

      {/* Timer */}
      <div className="relative z-10 bg-white/90 px-5 py-4 flex flex-col items-center shadow-sm border-b-2 border-[#29ABE2]/30">
        <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-widest mb-2">⏰ 剩餘時間</p>
        <CountdownTimer />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-5">

        {/* Mascot */}
        <motion.img
          src={MASCOT_CORRECT}
          alt="答對了！"
          className="w-48 h-48 object-contain drop-shadow-xl"
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.6, duration: 0.7 }}
        />

        {/* Correct badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="text-6xl mb-1">🎉</div>
          <h2 className="text-[#1a5fa8] font-black text-5xl">答對了！</h2>
          <p className="text-[#29ABE2] font-bold text-xl mt-1">CORRECT!</p>
        </motion.div>

        {/* Points */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.35, type: "spring", bounce: 0.5 }}
          className="bg-gradient-to-r from-[#FFB800] to-[#FF8C00] rounded-3xl px-10 py-5 text-center shadow-xl border-b-4 border-orange-700"
        >
          <p className="text-orange-900 text-sm font-black">獲得分數</p>
          <p className="text-white font-black text-6xl font-orbitron leading-none">+{currentQuestion.points}</p>
          <p className="text-orange-900 text-sm font-black mt-1">總分: {score}</p>
        </motion.div>

        {/* Next scan */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-center">
          <p className="text-[#1a5fa8]/60 text-sm mb-2">3.5秒後自動繼續...</p>
          <button
            onClick={nextScan}
            className="bg-[#29ABE2] hover:bg-[#1a90c8] text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg transition-all active:scale-95 border-b-4 border-[#1a5fa8]"
          >
            📦 立即掃描下一件
          </button>
        </motion.div>
      </div>

      <div className="checkered-floor h-8 opacity-30 relative z-10" />
    </div>
  );
}

export function WrongResultScreen() {
  const { currentQuestion, nextScan, score } = useGame();
  const { playWrong } = useSounds();

  useEffect(() => {
    playWrong();
    const t = setTimeout(() => nextScan(), 4500);
    return () => clearTimeout(t);
  }, []);

  if (!currentQuestion) return null;

  const correctAnswer = currentQuestion.options[currentQuestion.correctIndex];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "linear-gradient(180deg, #fff0f0 0%, #ffe0e0 100%)" }}>

      {/* Red flash */}
      <motion.div className="absolute inset-0 bg-red-400/30 pointer-events-none z-0"
        initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} />

      {/* Timer */}
      <div className="relative z-10 bg-white/90 px-5 py-4 flex flex-col items-center shadow-sm border-b-2 border-red-200">
        <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-widest mb-2">⏰ 剩餘時間</p>
        <CountdownTimer />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-5">

        {/* Mascot sad with shake */}
        <motion.img
          src={MASCOT_WRONG}
          alt="答錯了！"
          className="w-44 h-44 object-contain drop-shadow-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1, x: [0, -12, 12, -10, 10, -6, 6, 0] }}
          transition={{ scale: { type: "spring", bounce: 0.5 }, x: { delay: 0.4, duration: 0.6 } }}
        />

        {/* Wrong badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="text-5xl mb-1">😢</div>
          <h2 className="text-red-500 font-black text-5xl">答錯了！</h2>
          <p className="text-red-400 font-bold text-xl mt-1">WRONG ANSWER</p>
        </motion.div>

        {/* Correct answer reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-white rounded-3xl p-5 shadow-lg border-2 border-[#29ABE2]"
        >
          <p className="text-[#29ABE2] font-black text-sm text-center mb-2">✅ 正確答案是：</p>
          <p className="text-[#1a2a4a] font-black text-xl text-center leading-snug">{correctAnswer}</p>
        </motion.div>

        {/* Score */}
        <div className="bg-white/80 rounded-2xl px-8 py-3 text-center border-2 border-gray-200 shadow">
          <p className="text-gray-500 text-xs font-bold">當前分數</p>
          <p className="text-[#1a5fa8] font-black text-4xl font-orbitron">{score}</p>
        </div>

        {/* Next scan */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="text-center">
          <p className="text-gray-500 text-sm mb-2">4.5秒後自動繼續...</p>
          <button
            onClick={nextScan}
            className="bg-[#29ABE2] hover:bg-[#1a90c8] text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg transition-all active:scale-95 border-b-4 border-[#1a5fa8]"
          >
            📦 立即掃描下一件
          </button>
        </motion.div>
      </div>

      <div className="checkered-floor h-8 opacity-30 relative z-10" />
    </div>
  );
}
