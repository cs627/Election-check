// ============================================================
// IES Supermarket Quiz — Result Screens (Correct / Wrong)
// KIOSK 9:16 fixed — no scroll, compact layout
// ============================================================

import { CountdownTimer } from "@/components/CountdownTimer";
import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

// KV Official Mascot — 藍小寶 (Blue Ballot Box) — expression-only variants
const MASCOT_CORRECT = "/manus-storage/mascot-kv-happy_109923ab.png";
const MASCOT_WRONG   = "/manus-storage/mascot-kv-sad_27a7a776.png";

function Confetti() {
  const colors = ["#FF6B6B", "#29ABE2", "#FFB800", "#4CAF50", "#FF8C00", "#A78BFA"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            width: Math.random() * 8 + 5,
            height: Math.random() * 8 + 5,
            left: `${Math.random() * 100}%`,
            top: "-10px",
          }}
          animate={{ y: "110vh", rotate: 360 * (Math.random() > 0.5 ? 1 : -1), x: (Math.random() - 0.5) * 80 }}
          transition={{ duration: 1.0 + Math.random() * 1.0, delay: Math.random() * 0.5, ease: "linear" }}
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
    const t = setTimeout(() => nextScan(), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!currentQuestion) return null;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden relative"
      style={{ background: "linear-gradient(180deg, #e8f8ff 0%, #b8eeff 100%)" }}
    >
      <Confetti />
      <motion.div className="absolute inset-0 bg-green-400/20 pointer-events-none z-0"
        initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} />

      {/* Timer */}
      <div className="relative z-10 bg-white/90 px-4 py-2.5 flex flex-col items-center border-b-2 border-[#29ABE2]/30 flex-shrink-0">
        <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-widest mb-1">⏰ 剩餘時間</p>
        <CountdownTimer />
      </div>

      {/* Content — fills remaining space */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-evenly px-5 py-2 min-h-0">

        {/* Mascot */}
        <motion.img
          src={MASCOT_CORRECT}
          alt="答對了！"
          className="object-contain drop-shadow-xl flex-shrink-0"
          style={{ height: "28%", maxHeight: "180px" }}
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
        />

        {/* Correct badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center flex-shrink-0"
        >
          <div className="text-5xl mb-1">🎉</div>
          <h2 className="text-[#1a5fa8] font-black text-4xl leading-none">答對了！</h2>
          <p className="text-[#29ABE2] font-bold text-lg mt-0.5">CORRECT!</p>
        </motion.div>

        {/* Points */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
          className="bg-gradient-to-r from-[#FFB800] to-[#FF8C00] rounded-3xl px-8 py-3 text-center shadow-xl border-b-4 border-orange-700 flex-shrink-0"
        >
          <p className="text-orange-900 text-xs font-black">獲得分數</p>
          <p className="text-white font-black text-5xl font-orbitron leading-none">+{currentQuestion.points}</p>
          <p className="text-orange-900 text-xs font-black mt-0.5">總分: {score}</p>
        </motion.div>

        {/* Next scan */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center flex-shrink-0"
        >
          <p className="text-[#1a5fa8]/60 text-xs mb-1.5">3秒後自動繼續...</p>
          <button
            onClick={nextScan}
            className="bg-[#29ABE2] hover:bg-[#1a90c8] text-white font-black text-base px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95 border-b-4 border-[#1a5fa8]"
          >
            📦 立即掃描下一件
          </button>
        </motion.div>
      </div>

      <div className="checkered-floor h-4 opacity-30 flex-shrink-0 relative z-10" />
    </div>
  );
}

export function WrongResultScreen() {
  const { currentQuestion, nextScan, score } = useGame();
  const { playWrong } = useSounds();

  useEffect(() => {
    playWrong();
    const t = setTimeout(() => nextScan(), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!currentQuestion) return null;
  const correctAnswer = currentQuestion.options[currentQuestion.correctIndex];

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden relative"
      style={{ background: "linear-gradient(180deg, #fff0f0 0%, #ffe0e0 100%)" }}
    >
      <motion.div className="absolute inset-0 bg-red-400/25 pointer-events-none z-0"
        initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} />

      {/* Timer */}
      <div className="relative z-10 bg-white/90 px-4 py-2.5 flex flex-col items-center border-b-2 border-red-200 flex-shrink-0">
        <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-widest mb-1">⏰ 剩餘時間</p>
        <CountdownTimer />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-evenly px-5 py-2 min-h-0">

        {/* Mascot sad */}
        <motion.img
          src={MASCOT_WRONG}
          alt="答錯了！"
          className="object-contain drop-shadow-xl flex-shrink-0"
          style={{ height: "28%", maxHeight: "180px" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1, x: [0, -10, 10, -8, 8, 0] }}
          transition={{ scale: { type: "spring", bounce: 0.5 }, x: { delay: 0.3, duration: 0.5 } }}
        />

        {/* Wrong badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center flex-shrink-0"
        >
          <div className="text-4xl mb-1">😢</div>
          <h2 className="text-red-500 font-black text-4xl leading-none">答錯了！</h2>
          <p className="text-red-400 font-bold text-lg mt-0.5">WRONG ANSWER</p>
        </motion.div>

        {/* Correct answer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="w-full bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-[#29ABE2] flex-shrink-0"
        >
          <p className="text-[#29ABE2] font-black text-xs text-center mb-1">✅ 正確答案是：</p>
          <p className="text-[#1a2a4a] font-black text-center leading-snug"
            style={{ fontSize: "clamp(13px, 3.5vw, 17px)" }}
          >
            {correctAnswer}
          </p>
        </motion.div>

        {/* Score + next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center flex-shrink-0"
        >
          <p className="text-gray-500 text-xs mb-1.5">4秒後自動繼續...</p>
          <button
            onClick={nextScan}
            className="bg-[#29ABE2] hover:bg-[#1a90c8] text-white font-black text-base px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95 border-b-4 border-[#1a5fa8]"
          >
            📦 立即掃描下一件
          </button>
        </motion.div>
      </div>

      <div className="checkered-floor h-4 opacity-30 flex-shrink-0 relative z-10" />
    </div>
  );
}
