// ============================================================
// IES Supermarket Quiz — Countdown Timer
// KIOSK 9:16 — compact layout, no extra spacing
// Ticking sounds: 30-11s soft, 10-4s urgent, 3-1s alarm
// ============================================================

import { useGame } from "@/contexts/GameContext";
import { useCountdownTick } from "@/hooks/useSounds";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const { timeLeft, totalTime, screen } = useGame();

  const isActiveGame =
    screen === "scanning" || screen === "question" ||
    screen === "result-correct" || screen === "result-wrong" ||
    screen === "scan-transition";

  useCountdownTick(timeLeft, isActiveGame);

  const pct = Math.max(0, (timeLeft / totalTime) * 100);
  const isCritical = timeLeft <= 3 && timeLeft > 0;
  const isUrgent   = timeLeft <= 10 && !isCritical;
  const isWarning  = timeLeft <= 30 && !isUrgent && !isCritical;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (compact) {
    return (
      <div className={cn(
        "font-orbitron font-black text-3xl tabular-nums",
        isCritical ? "text-red-600 animate-pulse" :
        isUrgent   ? "text-red-500 animate-pulse" :
        isWarning  ? "text-orange-500" : "text-[#1a5fa8]"
      )}>
        {display}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 w-full relative">
      {/* Critical flash */}
      <AnimatePresence>
        {isCritical && (
          <motion.div
            key={timeLeft}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ backgroundColor: "rgba(239,68,68,0.12)" }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Timer number */}
      <motion.div
        key={isCritical ? `crit-${timeLeft}` : "timer"}
        className={cn(
          "font-orbitron font-black tabular-nums leading-none select-none",
          isCritical ? "text-red-600 text-7xl" :
          isUrgent   ? "text-red-500 text-7xl" :
          isWarning  ? "text-orange-500 text-7xl" :
          "text-[#1a5fa8] text-7xl"
        )}
        style={
          isCritical ? { filter: "drop-shadow(0 0 14px rgba(239,68,68,0.8))" } :
          isUrgent   ? { filter: "drop-shadow(0 0 10px rgba(239,68,68,0.5))" } :
          isWarning  ? { filter: "drop-shadow(0 0 6px rgba(249,115,22,0.4))" } : {}
        }
        animate={
          isCritical ? { scale: [1, 1.07, 1], transition: { duration: 0.25 } } :
          isUrgent   ? { scale: [1, 1.03, 1], transition: { duration: 0.3 } } : {}
        }
      >
        {display}
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-3 bg-white/50 rounded-full overflow-hidden border border-white/60">
        <motion.div
          className={cn(
            "h-full rounded-full",
            isCritical ? "bg-red-600" : isUrgent ? "bg-red-500" : isWarning ? "bg-orange-400" : "bg-[#29ABE2]"
          )}
          style={{ width: `${pct}%` }}
          animate={isCritical ? { opacity: [1, 0.5, 1] } : {}}
          transition={isCritical ? { duration: 0.5, repeat: Infinity } : {}}
        />
      </div>

      {/* Urgency messages — compact */}
      {isCritical && (
        <motion.p
          className="text-red-600 text-sm font-black leading-none"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          🚨 最後 {timeLeft} 秒！
        </motion.p>
      )}
      {isUrgent && !isCritical && (
        <p className="text-red-500 text-xs font-black animate-bounce leading-none">⚠️ 快啲！Hurry up!</p>
      )}
    </div>
  );
}
