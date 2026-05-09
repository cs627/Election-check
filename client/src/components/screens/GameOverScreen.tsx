// ============================================================
// IES Supermarket Quiz — Game Over Screen
// KIOSK 9:16 fixed — no page scroll
// Leaderboard list has internal overflow-y-auto scroll only
// ============================================================

import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { formatTimestamp, getLeaderboard } from "@/lib/dataStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// KV Official Mascot — 藍小寶 (Blue Ballot Box) — happy expression
const MASCOT_CORRECT = "/manus-storage/mascot-kv-happy_109923ab.png";

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
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #29ABE2 0%, #87CEEB 50%, #B8E8FF 100%)" }}
    >
      {/* Header */}
      <div className="bg-[#1a5fa8] text-center py-3 px-4 flex-shrink-0">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4 }}>
          <p className="text-white/80 text-xs font-black uppercase tracking-widest">⏰ 時間到！Time's Up!</p>
          <h1 className="text-white font-black text-3xl leading-tight">遊戲結束！</h1>
        </motion.div>
      </div>

      {/* Scrollable content area — only this scrolls internally if needed */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2 flex flex-col gap-2">

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3 border-2 border-[#29ABE2]/30 flex-shrink-0"
        >
          <img src={MASCOT_CORRECT} alt="票箱" className="object-contain flex-shrink-0"
            style={{ height: "70px", width: "70px" }} />
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-xs font-bold">最終得分</p>
            <p className="text-[#1a5fa8] font-black font-orbitron leading-none" style={{ fontSize: "clamp(36px, 10vw, 52px)" }}>{score}</p>
            <p className="text-gray-400 text-xs">分</p>
          </div>
          {/* Rank badge inline */}
          <div className={`rounded-2xl px-3 py-2 text-center flex-shrink-0 border-2 ${
            rank === 1 ? "bg-yellow-50 border-yellow-400" :
            rank === 2 ? "bg-gray-50 border-gray-300" :
            rank === 3 ? "bg-orange-50 border-orange-300" :
            "bg-white border-[#29ABE2]/30"
          }`}>
            <div className="text-2xl">{RANK_MEDALS[rank] || "🏅"}</div>
            <p className="text-[#1a5fa8] font-black text-xs">第</p>
            <p className="text-[#FF8C00] font-black font-orbitron text-2xl leading-none">{rank}</p>
            <p className="text-[#1a5fa8] font-black text-xs">名</p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-2 flex-shrink-0"
        >
          {[
            { label: "答題數", value: questionsAnswered, color: "text-[#1a5fa8]" },
            { label: "答對數", value: correctAnswers, color: "text-green-600" },
            { label: "正確率", value: `${accuracy}%`, color: "text-[#FF8C00]" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl py-2 text-center shadow border border-[#29ABE2]/20">
              <p className="text-gray-400 text-xs font-bold">{s.label}</p>
              <p className={`${s.color} font-black text-xl`}>{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Leaderboard — internal scroll only */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-[#29ABE2]/30 flex flex-col flex-shrink-0"
          style={{ maxHeight: "32%" }}
        >
          <div className="bg-[#1a5fa8] px-4 py-2 flex items-center gap-2 flex-shrink-0">
            <span className="text-xl">🏆</span>
            <h3 className="text-white font-black text-base">排行榜 Leaderboard</h3>
            <span className="text-white/60 text-xs ml-auto">{leaderboard.length} 位</span>
          </div>

          {/* THIS is the only internal scroll in the whole game */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {leaderboard.slice(0, 10).map((entry, i) => {
              const isCurrent = leaderboardEntry && entry.timestamp === leaderboardEntry.timestamp;
              return (
                <div
                  key={entry.timestamp}
                  className={`flex items-center gap-2 px-3 py-2 ${isCurrent ? "bg-yellow-50" : ""}`}
                >
                  <div className="w-7 text-center flex-shrink-0">
                    {RANK_MEDALS[i + 1]
                      ? <span className="text-lg">{RANK_MEDALS[i + 1]}</span>
                      : <span className="text-gray-400 font-bold text-sm">{i + 1}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs truncate">{formatTimestamp(entry.timestamp)}</p>
                    <p className="text-gray-400 text-xs">{entry.questionsAnswered}題 / {entry.correctAnswers}答對</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-black text-lg font-orbitron ${isCurrent ? "text-[#FF8C00]" : "text-[#1a5fa8]"}`}>
                      {entry.score}
                    </p>
                    <p className="text-gray-400 text-xs">分</p>
                  </div>
                </div>
              );
            })}
            {leaderboard.length === 0 && (
              <div className="px-4 py-4 text-center text-gray-400 text-sm">暫無記錄</div>
            )}
          </div>
        </motion.div>

        {/* Thank you + Home button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-1.5 flex-shrink-0"
        >
          <p className="text-[#1a5fa8] font-black text-base text-center">🙏 多謝你嘅參與！</p>
          <p className="text-[#1a5fa8]/60 text-xs text-center">Thank you for participating in IES Supermarket!</p>
          <button
            onClick={() => { playClick(); goHome(); }}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] text-white font-black text-xl py-4 rounded-2xl shadow-xl border-b-4 border-orange-700 transition-all active:scale-95 active:border-b-0"
          >
            🏠 返回主頁
          </button>
        </motion.div>
      </div>

      <div className="checkered-floor h-4 opacity-40 flex-shrink-0" />
    </div>
  );
}
