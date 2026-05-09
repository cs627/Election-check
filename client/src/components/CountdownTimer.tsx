// ============================================================
// IES Supermarket Quiz — Countdown Timer
// Large Orbitron display, red urgent state at ≤10s
// ============================================================

import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

export function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const { timeLeft, totalTime } = useGame();

  const pct = Math.max(0, (timeLeft / totalTime) * 100);
  const isUrgent = timeLeft <= 10;
  const isWarning = timeLeft <= 30 && !isUrgent;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (compact) {
    return (
      <div className={cn(
        "font-orbitron font-black text-3xl tabular-nums",
        isUrgent ? "text-red-500 animate-pulse" : isWarning ? "text-orange-500" : "text-[#1a5fa8]"
      )}>
        {display}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div
        className={cn(
          "font-orbitron font-black tabular-nums transition-all duration-300 leading-none",
          isUrgent
            ? "text-red-500 text-8xl animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]"
            : isWarning
              ? "text-orange-500 text-8xl"
              : "text-[#1a5fa8] text-8xl"
        )}
      >
        {display}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-4 bg-white/50 rounded-full overflow-hidden border border-white/60">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            isUrgent ? "bg-red-500" : isWarning ? "bg-orange-400" : "bg-[#29ABE2]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {isUrgent && (
        <p className="text-red-600 text-sm font-black animate-bounce">
          ⚠️ 快啲！Hurry up!
        </p>
      )}
    </div>
  );
}
