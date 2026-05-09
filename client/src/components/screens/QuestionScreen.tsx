// ============================================================
// IES Supermarket Quiz — Question Screen
// Big colored answer buttons, difficulty badge, timer bar
// ============================================================

import { CountdownTimer } from "@/components/CountdownTimer";
import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/lib/gameData";
import { motion } from "framer-motion";

// Korean kiosk-style: each answer has a distinct color + letter label
const ANSWER_STYLES = [
  { bg: "from-[#FF6B6B] to-[#E84040]", border: "border-red-700",    shadow: "shadow-red-300",    label: "A", text: "text-white" },
  { bg: "from-[#29ABE2] to-[#1a80c0]", border: "border-blue-800",   shadow: "shadow-blue-300",   label: "B", text: "text-white" },
  { bg: "from-[#FFB800] to-[#E09000]", border: "border-yellow-700", shadow: "shadow-yellow-300", label: "C", text: "text-white" },
  { bg: "from-[#4CAF50] to-[#388E3C]", border: "border-green-800",  shadow: "shadow-green-300",  label: "D", text: "text-white" },
];

export function QuestionScreen() {
  const { currentQuestion, selectAnswer, score, timeLeft } = useGame();
  const { playClick } = useSounds();

  if (!currentQuestion) return null;

  const diffColor = DIFFICULTY_COLORS[currentQuestion.difficulty];
  const diffLabel = DIFFICULTY_LABELS[currentQuestion.difficulty];
  const stars = currentQuestion.difficulty === "easy" ? "⭐" : currentQuestion.difficulty === "medium" ? "⭐⭐" : "⭐⭐⭐";

  const handleAnswer = (index: number) => {
    playClick();
    selectAnswer(index);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #29ABE2 0%, #87CEEB 60%, #B8E8FF 100%)" }}>

      {/* Timer */}
      <div className="bg-white/90 backdrop-blur-sm px-5 py-4 flex flex-col items-center shadow-sm border-b-2 border-[#29ABE2]/30">
        <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-widest mb-2">⏰ 剩餘時間</p>
        <CountdownTimer />
      </div>

      {/* Score + difficulty */}
      <div className="bg-[#1a5fa8] px-5 py-2.5 flex justify-between items-center">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-black"
          style={{ backgroundColor: diffColor + "30", border: `2px solid ${diffColor}`, color: diffColor === "#4ECDC4" ? "#0a7a70" : diffColor }}
        >
          <span>{stars}</span>
          <span className="text-white" style={{ color: "white" }}>{diffLabel}</span>
          <span className="bg-white/30 text-white rounded-full px-2 py-0.5 text-xs font-black">+{currentQuestion.points}分</span>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs">分數</p>
          <p className="text-yellow-300 font-black text-2xl font-orbitron">{score}</p>
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-lg border-2 border-[#29ABE2]/30"
        >
          <p className="text-[#29ABE2] text-xs font-black uppercase tracking-wider mb-2">
            📋 {currentQuestion.category}
          </p>
          <p className="text-[#1a2a4a] font-black text-xl leading-relaxed">
            {currentQuestion.text}
          </p>
        </motion.div>

        {/* Answer buttons — big kiosk style */}
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, index) => {
            const style = ANSWER_STYLES[index];
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleAnswer(index)}
                className={`
                  w-full bg-gradient-to-r ${style.bg}
                  rounded-2xl p-0 text-left
                  flex items-stretch
                  shadow-lg ${style.shadow}
                  border-b-4 ${style.border}
                  transition-all duration-100 active:border-b-0 active:translate-y-1
                  hover:brightness-105 overflow-hidden
                `}
              >
                {/* Letter label */}
                <div className="w-16 flex-shrink-0 bg-black/20 flex items-center justify-center">
                  <span className="text-white font-black text-3xl">{style.label}</span>
                </div>
                {/* Answer text */}
                <div className="flex-1 px-4 py-5 flex items-center">
                  <span className={`${style.text} font-black text-lg leading-snug`}>
                    {option}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Checkered floor */}
      <div className="checkered-floor h-6 opacity-30" />
    </div>
  );
}
