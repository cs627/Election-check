// ============================================================
// IES Supermarket Quiz — Countdown Timer
// Large Orbitron display with ticking sound effects:
//   30-11s: soft clock tick-tock
//   10-4s:  urgent sharp tick (orange)
//   3-1s:   loud alarm beep (red + screen flash)
// ============================================================

import { useGame } from "@/contexts/GameContext";
import { useCountdownTick } from "@/hooks/useSounds";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const { timeLeft, totalTime, screen } = useGame();

  // Only tick during active game screens (not home/settings/game-over)
  const isActiveGame = screen === "scanning" || screen === "question" ||
    screen === "result-correct" || screen === "result-wrong" || screen === "scan-transition";

  // Wire up the ticking sound — fires on every timeLeft change
  useCountdownTick(timeLeft, isActiveGame);

  const pct = Math.max(0, (timeLeft / totalTime) * 100);
  const isCritical = timeLeft <= 3 && timeLeft > 0;
  const isUrgent = timeLeft <= 10 && !isCritical;
  const isWarning = timeLeft <= 30 && !isUrgent && !isCritical;

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
    <div className="flex flex-col items-center gap-2 w-full relative">

      {/* Critical flash overlay — full-width red flash on each tick at ≤3s */}
      <AnimatePresence>
        {isCritical && (
          <motion.div
            key={timeLeft}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
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
          isCritical
            ? "text-red-600 text-8xl"
            : isUrgent
              ? "text-red-500 text-8xl"
              : isWarning
                ? "text-orange-500 text-8xl"
                : "text-[#1a5fa8] text-8xl"
        )}
        style={
          isCritical
            ? { filter: "drop-shadow(0 0 18px rgba(239,68,68,0.9))" }
            : isUrgent
              ? { filter: "drop-shadow(0 0 12px rgba(239,68,68,0.6))" }
              : isWarning
                ? { filter: "drop-shadow(0 0 8px rgba(249,115,22,0.5))" }
                : {}
        }
        // Micro-scale pulse on each tick during warning/critical
        animate={
          isCritical
            ? { scale: [1, 1.08, 1], transition: { duration: 0.25 } }
            : isUrgent
              ? { scale: [1, 1.04, 1], transition: { duration: 0.3 } }
              : {}
        }
      >
        {display}
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-4 bg-white/50 rounded-full overflow-hidden border border-white/60">
        <motion.div
          className={cn(
            "h-full rounded-full",
            isCritical ? "bg-red-600" :
            isUrgent   ? "bg-red-500" :
            isWarning  ? "bg-orange-400" : "bg-[#29ABE2]"
          )}
          style={{ width: `${pct}%` }}
          animate={isCritical ? { opacity: [1, 0.5, 1] } : {}}
          transition={isCritical ? { duration: 0.5, repeat: Infinity } : {}}
        />
      </div>

      {/* Urgency messages */}
      {isCritical && (
        <motion.p
          className="text-red-600 text-base font-black"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          🚨 最後 {timeLeft} 秒！
        </motion.p>
      )}
      {isUrgent && !isCritical && (
        <p className="text-red-500 text-sm font-black animate-bounce">
          ⚠️ 快啲！Hurry up!
        </p>
      )}
      {isWarning && (
        <p className="text-orange-500 text-xs font-bold">
          ⏰ 剩餘 {timeLeft} 秒
        </p>
      )}
    </div>
  );
}
