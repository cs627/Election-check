// ============================================================
// IES Supermarket Quiz — Game Over Screen
// Final score + rank + leaderboard + thank you
// ============================================================

import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { formatTimestamp, getLeaderboard } from "@/lib/gameData";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MASCOT_CORRECT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663437368766/J2Z2DFnF4NuZM2o5YquhpC/ies-mascot-correct-hZ4ckqDbX73rChBL4dnhJG.webp";
const KV_IMAGE = "/manus-storage/ies-kv_6fd4c960.jpg";

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function GameOverScreen() {
  const { score, rank, questionsAnswered, correctAnswers, goHome, leaderboardEntry } = useGame();
  const { playGameOver, playClick } = useSounds();
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());

  useEffect(() => {
    playGameOver();
    setLeaderboard(getLeaderboard());
  }, []);

  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #29ABE2 0%, #87CEEB 50%, #B8E8FF 100%)" }}>

      {/* Header with KV strip */}
      <div className="bg-[#1a5fa8] text-center py-4 px-5 shadow-lg">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4 }}>
          <p className="text-white/80 text-sm font-black uppercase tracking-widest">⏰ 時間到！Time's Up!</p>
          <h1 className="text-white font-black text-4xl mt-1">遊戲結束！</h1>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-lg flex items-center gap-4 border-2 border-[#29ABE2]/30"
        >
          <img src={MASCOT_CORRECT} alt="票箱" className="w-24 h-24 object-contain flex-shrink-0" />
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-bold">最終得分</p>
            <p className="text-[#1a5fa8] font-black text-7xl font-orbitron leading-none">{score}</p>
            <p className="text-gray-400 text-sm">分</p>
          </div>
        </motion.div>

        {/* Rank */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className={`rounded-3xl p-5 text-center border-3 shadow-lg ${
            rank === 1 ? "bg-yellow-50 border-yellow-400 border-4" :
            rank === 2 ? "bg-gray-50 border-gray-300 border-4" :
            rank === 3 ? "bg-orange-50 border-orange-300 border-4" :
            "bg-white border-[#29ABE2]/30 border-2"
          }`}
        >
          <div className="text-5xl mb-1">{RANK_MEDALS[rank] || "🏅"}</div>
          <p className="text-[#1a5fa8] font-black text-2xl">
            第 <span className="text-5xl font-orbitron text-[#FF8C00]">{rank}</span> 名
          </p>
          <p className="text-gray-400 text-sm mt-1">共 {leaderboard.length} 位參與者</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "答題數", value: questionsAnswered, color: "text-[#1a5fa8]" },
            { label: "答對數", value: correctAnswers, color: "text-green-600" },
            { label: "正確率", value: `${accuracy}%`, color: "text-[#FF8C00]" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow border border-[#29ABE2]/20">
              <p className="text-gray-400 text-xs font-bold">{s.label}</p>
              <p className={`${s.color} font-black text-2xl`}>{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-[#29ABE2]/30"
        >
          <div className="bg-[#1a5fa8] px-5 py-3 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h3 className="text-white font-black text-lg">排行榜 Leaderboard</h3>
          </div>

          <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
            {leaderboard.slice(0, 10).map((entry, i) => {
              const isCurrent = leaderboardEntry && entry.timestamp === leaderboardEntry.timestamp;
              return (
                <div
                  key={entry.timestamp}
                  className={`flex items-center gap-3 px-5 py-3 ${isCurrent ? "bg-yellow-50" : ""}`}
                >
                  <div className="w-8 text-center flex-shrink-0">
                    {RANK_MEDALS[i + 1]
                      ? <span className="text-xl">{RANK_MEDALS[i + 1]}</span>
                      : <span className="text-gray-400 font-bold text-sm">{i + 1}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs truncate">{formatTimestamp(entry.timestamp)}</p>
                    <p className="text-gray-400 text-xs">{entry.questionsAnswered}題 / {entry.correctAnswers}答對</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-black text-xl font-orbitron ${isCurrent ? "text-[#FF8C00]" : "text-[#1a5fa8]"}`}>
                      {entry.score}
                    </p>
                    <p className="text-gray-400 text-xs">分</p>
                  </div>
                </div>
              );
            })}
            {leaderboard.length === 0 && (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">暫無記錄</div>
            )}
          </div>
        </motion.div>

        {/* Thank you */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pb-2"
        >
          <p className="text-[#1a5fa8] font-black text-xl mb-1">🙏 多謝你嘅參與！</p>
          <p className="text-[#1a5fa8]/60 text-sm mb-5">Thank you for participating in IES Supermarket!</p>

          <button
            onClick={() => { playClick(); goHome(); }}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] text-white font-black text-2xl py-6 rounded-3xl shadow-xl border-b-4 border-orange-700 transition-all active:scale-95 active:border-b-0"
          >
            🏠 返回主頁
          </button>
        </motion.div>
      </div>

      <div className="checkered-floor h-8 opacity-40" />
    </div>
  );
}
