// ============================================================
// IES Supermarket Quiz — Question Screen
// KIOSK 9:16 fixed — no scroll, 4 answer buttons always visible
// Enhanced MC animations: stagger, ripple, shine, letter pop
// ============================================================

import { CountdownTimer } from "@/components/CountdownTimer";
import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/lib/dataStore";
import { motion } from "framer-motion";
import { useState } from "react";

const ANSWER_STYLES = [
  { bg: "from-[#FF6B6B] to-[#E84040]", border: "border-red-700",    shadow: "0 6px 18px rgba(255,107,107,0.45)", label: "A" },
  { bg: "from-[#29ABE2] to-[#1a80c0]", border: "border-blue-800",   shadow: "0 6px 18px rgba(41,171,226,0.45)",  label: "B" },
  { bg: "from-[#FFB800] to-[#E09000]", border: "border-yellow-700", shadow: "0 6px 18px rgba(255,184,0,0.45)",   label: "C" },
  { bg: "from-[#4CAF50] to-[#388E3C]", border: "border-green-800",  shadow: "0 6px 18px rgba(76,175,80,0.45)",   label: "D" },
];

function Ripple({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/40 pointer-events-none"
      style={{ left: x - 40, top: y - 40, width: 80, height: 80 }}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  );
}

export function QuestionScreen() {
  const { currentQuestion, selectAnswer, score } = useGame();
  const { playClick } = useSounds();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; idx: number }[]>([]);
  const [pressedIdx, setPressedIdx] = useState<number | null>(null);

  if (!currentQuestion) return null;

  const diffColor = DIFFICULTY_COLORS[currentQuestion.difficulty];
  const diffLabel = DIFFICULTY_LABELS[currentQuestion.difficulty];
  const stars = currentQuestion.difficulty === "easy" ? "⭐" : currentQuestion.difficulty === "medium" ? "⭐⭐" : "⭐⭐⭐";

  const handleAnswer = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (pressedIdx !== null) return;
    playClick();
    setPressedIdx(index);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, idx: index }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    setTimeout(() => selectAnswer(index), 180);
  };

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #29ABE2 0%, #87CEEB 60%, #B8E8FF 100%)" }}
    >
      {/* Timer */}
      <div className="bg-white/90 px-4 py-2.5 flex flex-col items-center border-b-2 border-[#29ABE2]/30 flex-shrink-0">
        <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-widest mb-1">⏰ 剩餘時間</p>
        <CountdownTimer />
      </div>

      {/* Score + difficulty */}
      <div className="bg-[#1a5fa8] px-4 py-1.5 flex justify-between items-center flex-shrink-0">
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black"
          style={{ backgroundColor: diffColor + "30", border: `2px solid ${diffColor}`, color: "white" }}
        >
          <span>{stars}</span>
          <span>{diffLabel}</span>
          <span className="bg-white/30 rounded-full px-1.5 py-0.5 text-xs font-black">+{currentQuestion.points}分</span>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs leading-none">分數</p>
          <p className="text-yellow-300 font-black text-xl font-orbitron leading-tight">{score}</p>
        </div>
      </div>

      {/* Question card */}
      <div className="px-3 pt-2.5 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, type: "tween" }}
          className="bg-white rounded-2xl px-4 py-3 shadow-md border-2 border-[#29ABE2]/30"
        >
          <p className="text-[#29ABE2] text-xs font-black uppercase tracking-wider mb-1 leading-none">
            📋 {currentQuestion.category}
          </p>
          <p className="text-[#1a2a4a] font-black leading-snug"
            style={{ fontSize: "clamp(14px, 3.5vw, 18px)" }}
          >
            {currentQuestion.text}
          </p>
        </motion.div>
      </div>

      {/* Answer buttons — fill remaining space evenly */}
      <div className="flex-1 flex flex-col px-3 py-2 gap-2 min-h-0">
        {currentQuestion.options.map((option, index) => {
          const style = ANSWER_STYLES[index];
          const isPressed = pressedIdx === index;
          const btnRipples = ripples.filter((r) => r.idx === index);

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0, scale: isPressed ? 0.97 : 1 }}
              transition={{
                opacity: { delay: index * 0.06, duration: 0.2, type: "tween" },
                x: { delay: index * 0.06, duration: 0.25, type: "spring", stiffness: 300, damping: 25 },
                scale: { duration: 0.1, type: "tween" },
              }}
              onClick={(e) => handleAnswer(index, e)}
              disabled={pressedIdx !== null}
              className={`
                relative flex-1 bg-gradient-to-r ${style.bg}
                rounded-2xl overflow-hidden flex items-stretch min-h-0
                border-b-4 ${style.border}
                transition-all duration-100
                ${pressedIdx !== null && pressedIdx !== index ? "opacity-60" : ""}
                ${isPressed ? "translate-y-0.5 border-b-0" : ""}
              `}
              style={{ boxShadow: isPressed ? "none" : style.shadow }}
            >
              {btnRipples.map((r) => <Ripple key={r.id} x={r.x} y={r.y} />)}

              {/* Letter badge */}
              <motion.div
                className="w-14 flex-shrink-0 bg-black/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.06 + 0.12, type: "spring", bounce: 0.5 }}
              >
                <span className="text-white font-black text-2xl">{style.label}</span>
              </motion.div>

              {/* Answer text */}
              <div className="flex-1 px-3 flex items-center">
                <span className="text-white font-black leading-snug"
                  style={{ fontSize: "clamp(13px, 3.2vw, 17px)" }}
                >
                  {option}
                </span>
              </div>

              {/* Shine sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Checkered floor */}
      <div className="checkered-floor h-4 opacity-30 flex-shrink-0" />
    </div>
  );
}
