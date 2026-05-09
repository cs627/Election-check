// ============================================================
// IES Supermarket Quiz — Sound Effects (Web Audio API)
// No external files needed — all synthesized
//
// Countdown ticking system:
//   30-11s: soft mechanical tick (clock tock)
//   10-4s:  louder urgent tick (higher pitch)
//   3-1s:   loud alarm beep (very urgent)
// ============================================================

import { useCallback, useEffect, useRef } from "react";

function getCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  if (!ref.current) {
    try {
      ref.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch { return null; }
  }
  if (ref.current.state === "suspended") ref.current.resume();
  return ref.current;
}

// Shared AudioContext across all hook instances
let sharedCtx: AudioContext | null = null;
function getSharedCtx(): AudioContext | null {
  if (!sharedCtx) {
    try {
      sharedCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch { return null; }
  }
  if (sharedCtx.state === "suspended") sharedCtx.resume();
  return sharedCtx;
}

// ============================================================
// Single tick sound — mechanical clock style
// ============================================================
function playTickSound(ctx: AudioContext, urgency: "normal" | "warning" | "critical") {
  const now = ctx.currentTime;

  if (urgency === "critical") {
    // 3-1s: loud double beep alarm
    [0, 0.08].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      osc.type = "square";
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
      osc.start(now + offset);
      osc.stop(now + offset + 0.15);
    });
  } else if (urgency === "warning") {
    // 10-4s: sharp urgent tick (higher pitch, louder)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 900;
    osc1.type = "square";
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.008);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // Subtle resonance tail
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 450;
    osc2.type = "sine";
    gain2.gain.setValueAtTime(0, now + 0.01);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.18);
  } else {
    // 30-11s: soft mechanical clock tick-tock
    // "Tick" — high click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 700;
    osc1.type = "sine";
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.006);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc1.start(now);
    osc1.stop(now + 0.07);

    // "Tock" — low resonance
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 350;
    osc2.type = "sine";
    gain2.gain.setValueAtTime(0, now + 0.008);
    gain2.gain.linearRampToValueAtTime(0.06, now + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc2.start(now + 0.008);
    osc2.stop(now + 0.14);
  }
}

// ============================================================
// Hook: useCountdownTick
// Call this in any component that shows the countdown.
// It automatically plays ticking sounds based on timeLeft.
// ============================================================
export function useCountdownTick(timeLeft: number, isActive: boolean) {
  const prevTimeRef = useRef<number>(timeLeft);

  useEffect(() => {
    // Only tick when time actually decrements by 1
    if (!isActive) return;
    if (timeLeft <= 0) return;
    if (timeLeft >= 31) return; // only tick last 30s
    if (timeLeft === prevTimeRef.current) return;

    prevTimeRef.current = timeLeft;

    const ctx = getSharedCtx();
    if (!ctx) return;

    let urgency: "normal" | "warning" | "critical";
    if (timeLeft <= 3) {
      urgency = "critical";
    } else if (timeLeft <= 10) {
      urgency = "warning";
    } else {
      urgency = "normal";
    }

    playTickSound(ctx, urgency);
  }, [timeLeft, isActive]);
}

// ============================================================
// Main useSounds hook — all one-shot sound effects
// ============================================================
export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playCorrect = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    // Happy ascending arpeggio C-E-G-C
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = "sine";
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.35);
    });
  }, []);

  const playWrong = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    // Descending sad tones
    [392, 349.23, 311.13, 261.63].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = "sawtooth";
      const t = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t); osc.stop(t + 0.45);
    });
  }, []);

  const playScan = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.08);
    osc.type = "square";
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.25);
  }, []);

  const playGameOver = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const durs = [0.15, 0.15, 0.15, 0.3, 0.15, 0.5];
    let t = ctx.currentTime;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = "sine";
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + durs[i]);
      osc.start(t); osc.stop(t + durs[i] + 0.05);
      t += durs[i] + 0.02;
    });
  }, []);

  const playClick = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 700; osc.type = "sine";
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1);
  }, []);

  return { playCorrect, playWrong, playScan, playGameOver, playClick };
}
