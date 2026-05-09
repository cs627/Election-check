// ============================================================
// IES Supermarket Quiz — Scan Transition Animation
// Product-aware: shows the ACTUAL scanned product
// Spectacular reveal: laser scan → product flies in →
// spotlight burst → difficulty badge → transition to question
//
// FIX: All multi-keyframe animations use type:"tween" (not spring)
// Spring only used for simple 2-frame (from→to) transitions
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Question, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/lib/dataStore";
import { Product } from "@/lib/dataStore";

// Fallback emoji images for products without custom imageUrl
const EMOJI_BG_COLORS: Record<string, string> = {
  "🍎": "#FFE0E0", "🥛": "#E8F4FF", "🍞": "#FFF3E0", "🍊": "#FFF0D0",
  "🥣": "#F0F8E8", "🥚": "#FFFDE8", "🍌": "#FFFBE0", "🍅": "#FFE8E8",
  "🥔": "#F5EDD8", "🍫": "#F0E8E0", "🍪": "#FFF0E0", "🥫": "#E8F0FF",
  "🍝": "#FFF5E0", "🧀": "#FFFBE0", "🍯": "#FFF3D0", "🍵": "#E8F5E8",
  "💧": "#E8F4FF", "🥕": "#FFE8D0", "🥦": "#E8F5E8",
};

// Sparkle particle — tween only (multi-keyframe safe)
function Sparkle({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 1, y: 0 }}
      animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0], y: [0, -30, -60] }}
      transition={{ duration: 0.8, delay, ease: "easeOut", type: "tween" }}
    >
      <div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
    </motion.div>
  );
}

// Radial burst rays — tween (multi-keyframe safe)
function BurstRays({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute origin-center"
          style={{ rotate: `${i * 30}deg` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut", type: "tween" }}
        >
          <div
            className="w-48 h-1.5 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${color}99, transparent)`,
              marginLeft: "50px",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Score badge — simple spring (2 keyframes only)
function ScoreBadge({ points, color }: { points: number; color: string }) {
  return (
    <motion.div
      className="absolute top-8 right-6 z-20"
      initial={{ scale: 0, rotate: -20, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
    >
      <div
        className="rounded-2xl px-4 py-2 text-center shadow-xl border-b-4"
        style={{ backgroundColor: color, borderColor: color + "aa", boxShadow: `0 8px 24px ${color}60` }}
      >
        <p className="text-white text-xs font-black">獲得</p>
        <p className="text-white font-black text-3xl font-orbitron leading-none">+{points}</p>
        <p className="text-white text-xs font-black">分</p>
      </div>
    </motion.div>
  );
}

// Difficulty ribbon — simple spring (2 keyframes only)
function DifficultyRibbon({ question }: { question: Question }) {
  const color = DIFFICULTY_COLORS[question.difficulty];
  const label = DIFFICULTY_LABELS[question.difficulty];
  const stars = question.difficulty === "easy" ? "⭐" : question.difficulty === "medium" ? "⭐⭐" : "⭐⭐⭐";

  return (
    <motion.div
      className="absolute top-8 left-0 z-20"
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-r-2xl shadow-lg"
        style={{ backgroundColor: color, boxShadow: `4px 4px 16px ${color}80` }}
      >
        <span className="text-lg">{stars}</span>
        <span className="text-white font-black text-sm">{label}</span>
      </div>
    </motion.div>
  );
}

// Product display: shows custom image URL or large emoji
function ProductDisplay({ product, diffColor }: { product: Product; diffColor: string }) {
  const bgColor = EMOJI_BG_COLORS[product.emoji] || "#F0F8FF";

  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.nameZH}
        className="w-52 h-52 object-contain drop-shadow-2xl"
        style={{ filter: `drop-shadow(0 12px 24px ${diffColor}60)` }}
        onError={(e) => {
          // Fallback to emoji if image fails
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className="w-52 h-52 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/60"
      style={{
        backgroundColor: bgColor,
        filter: `drop-shadow(0 12px 24px ${diffColor}60)`,
      }}
    >
      <span style={{ fontSize: "100px", lineHeight: 1 }}>{product.emoji}</span>
    </div>
  );
}

interface ScanTransitionProps {
  question: Question;
  product: Product | null;
  phase: "laser" | "reveal" | "burst" | "hold" | "exit";
  onComplete: () => void;
}

export function ScanTransition({ question, product, phase, onComplete }: ScanTransitionProps) {
  const diffColor = DIFFICULTY_COLORS[question.difficulty];

  // Default product display if none matched
  const displayProduct: Product = product || {
    id: "default",
    barcode: "",
    nameZH: "神秘貨物",
    nameEN: "Mystery Item",
    emoji: "📦",
    imageUrl: "",
    notes: "",
  };

  const sparkles = [
    { x: 20, y: 20, color: "#FFB800", delay: 0.3 },
    { x: 75, y: 15, color: "#FF6B6B", delay: 0.35 },
    { x: 10, y: 60, color: "#4ECDC4", delay: 0.4 },
    { x: 85, y: 55, color: "#A78BFA", delay: 0.45 },
    { x: 50, y: 10, color: "#FFB800", delay: 0.5 },
    { x: 30, y: 80, color: "#FF6B6B", delay: 0.55 },
    { x: 70, y: 75, color: "#4ECDC4", delay: 0.6 },
    { x: 90, y: 30, color: "#A78BFA", delay: 0.38 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: phase === "laser"
          ? "linear-gradient(180deg, #0d1a2e 0%, #1a3a5c 100%)"
          : "linear-gradient(180deg, #e8f4ff 0%, #c5e8ff 100%)",
        transition: "background 0.3s ease",
      }}
    >
      {/* === PHASE 1: LASER SCAN === */}
      <AnimatePresence>
        {phase === "laser" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, type: "tween" }}
          >
            <div className="relative w-64 h-64 border-2 border-white/30 rounded-2xl overflow-hidden">
              {["top-0 left-0 border-t-4 border-l-4", "top-0 right-0 border-t-4 border-r-4",
                "bottom-0 left-0 border-b-4 border-l-4", "bottom-0 right-0 border-b-4 border-r-4"].map((cls, i) => (
                <div key={i} className={`absolute w-8 h-8 border-[#29ABE2] ${cls}`} />
              ))}
              <motion.div
                className="absolute w-full h-1"
                style={{
                  background: "linear-gradient(90deg, transparent, #ff3333, #ff6666, #ff3333, transparent)",
                  boxShadow: "0 0 12px 4px rgba(255,50,50,0.8)",
                }}
                initial={{ top: "10%" }}
                animate={{ top: "90%" }}
                transition={{ duration: 0.35, ease: "linear", type: "tween" }}
              />
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "repeating-linear-gradient(0deg, #29ABE2 0, #29ABE2 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #29ABE2 0, #29ABE2 1px, transparent 1px, transparent 20px)",
              }} />
            </div>
            <motion.p
              className="text-white/80 font-black text-lg mt-6 tracking-widest"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.4, repeat: Infinity, type: "tween" }}
            >
              掃描中... SCANNING
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === PHASES 2-4: PRODUCT REVEAL === */}
      <AnimatePresence>
        {(phase === "reveal" || phase === "burst" || phase === "hold" || phase === "exit") && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.25, type: "tween" }}
          >
            {/* Flash burst */}
            {phase === "reveal" && (
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none z-30"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.35, type: "tween" }}
              />
            )}

            {/* Spotlight */}
            <motion.div
              className="absolute rounded-full"
              style={{ background: `radial-gradient(circle, ${diffColor}40 0%, transparent 70%)`, width: "320px", height: "320px" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 0.4, type: "tween", ease: "easeOut" }}
            />

            {(phase === "burst" || phase === "hold") && <BurstRays color={diffColor} />}
            {(phase === "burst" || phase === "hold") && sparkles.map((s, i) => <Sparkle key={i} {...s} />)}
            {(phase === "hold" || phase === "exit") && <DifficultyRibbon question={question} />}
            {(phase === "hold" || phase === "exit") && <ScoreBadge points={question.points} color={diffColor} />}

            {/* Product — tween for multi-keyframe, spring for y only */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0, y: 120, rotate: -20, opacity: 0 }}
              animate={{ scale: phase === "exit" ? 0.7 : 1, y: 0, rotate: 0, opacity: 1 }}
              transition={{
                scale: { type: "tween", duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                y: { type: "spring", stiffness: 300, damping: 20 },
                rotate: { type: "tween", duration: 0.6, ease: "easeOut" },
                opacity: { duration: 0.2, type: "tween" },
              }}
            >
              <ProductDisplay product={displayProduct} diffColor={diffColor} />
            </motion.div>

            {/* Glow ring — tween only */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{ width: "220px", height: "220px", background: `radial-gradient(circle, ${diffColor}50 0%, transparent 70%)`, zIndex: 9 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phase === "exit" ? 0.5 : [0, 1.3, 1.0, 1.2, 1.1],
                opacity: phase === "exit" ? 0 : [0, 0.8, 0.6, 0.7, 0.6],
              }}
              transition={{ duration: 1.2, delay: 0.2, type: "tween", ease: "easeOut" }}
            />

            {/* Product name tag */}
            <motion.div
              className="relative z-10 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: "tween" }}
            >
              <div className="bg-white rounded-2xl px-6 py-3 shadow-xl border-2 border-[#29ABE2]/30 text-center">
                <p className="text-[#1a5fa8] font-black text-xl">{displayProduct.nameZH}</p>
                {displayProduct.nameEN && displayProduct.nameEN !== displayProduct.nameZH && (
                  <p className="text-[#29ABE2] text-sm font-bold">{displayProduct.nameEN}</p>
                )}
                <p className="text-green-500 text-sm font-bold mt-0.5">✅ 已掃描！Scanned!</p>
              </div>
            </motion.div>

            {/* "Question coming!" banner */}
            {(phase === "hold" || phase === "exit") && (
              <motion.div
                className="absolute bottom-16 left-0 right-0 flex justify-center z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "tween" }}
              >
                <div
                  className="px-8 py-3 rounded-2xl shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${diffColor}, ${diffColor}cc)`, boxShadow: `0 8px 24px ${diffColor}60` }}
                >
                  <p className="text-white font-black text-xl tracking-wide">🧠 題目來了！</p>
                </div>
              </motion.div>
            )}

            <div className="absolute bottom-0 left-0 right-0 checkered-floor h-8 opacity-40" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
