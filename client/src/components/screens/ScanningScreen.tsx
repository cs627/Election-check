// ============================================================
// IES Supermarket Quiz — Scanning Screen
// Shows laser scan frame animation while waiting for barcode.
// NO touch hints, NO USB hint bar, NO food images.
// Click anywhere on scan area = simulate scan (dev mode only).
// ============================================================

import { CountdownTimer } from "@/components/CountdownTimer";
import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function ScanningScreen() {
  const { scanBarcode, score, questionsAnswered, correctAnswers } = useGame();
  const { playScan } = useSounds();
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    if (scanning) return;
    setScanning(true);
    playScan();
    setTimeout(() => {
      setScanning(false);
      scanBarcode();
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #29ABE2 0%, #87CEEB 70%, #B8E8FF 100%)" }}
    >
      {/* Timer bar */}
      <div className="bg-white/90 backdrop-blur-sm px-5 py-4 flex flex-col items-center shadow-sm border-b-2 border-[#29ABE2]/30">
        <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-widest mb-2">⏰ 剩餘時間</p>
        <CountdownTimer />
      </div>

      {/* Score strip */}
      <div className="bg-[#1a5fa8] px-5 py-2 flex justify-around items-center">
        {[
          { label: "答題", value: questionsAnswered, color: "text-white" },
          { label: "答對", value: correctAnswers, color: "text-yellow-300" },
          { label: "分數", value: score, color: "text-yellow-300", big: true },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-white/60 text-xs font-bold">{s.label}</p>
            <p className={`${s.color} font-black ${s.big ? "text-3xl font-orbitron" : "text-xl"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main scan area — fills remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-4">

        {/* Instruction text — no touch hints */}
        <motion.p
          className="text-[#1a5fa8] font-black text-xl text-center"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {questionsAnswered === 0 ? "請掃描貨物條碼開始！" : "請掃描下一件貨物！"}
        </motion.p>

        {/* Scan frame — clickable for dev simulation */}
        <motion.div
          onClick={handleScan}
          className="relative w-full max-w-sm rounded-3xl overflow-hidden cursor-pointer"
          style={{
            aspectRatio: "1 / 1",
            background: "linear-gradient(135deg, #e8f4ff 0%, #c5e8ff 100%)",
            border: "3px solid rgba(41,171,226,0.4)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Corner bracket decorations */}
          {[
            "top-4 left-4 border-t-4 border-l-4",
            "top-4 right-4 border-t-4 border-r-4",
            "bottom-4 left-4 border-b-4 border-l-4",
            "bottom-4 right-4 border-b-4 border-r-4",
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-10 h-10 border-white rounded-sm ${cls}`}
              style={{ borderWidth: "4px" }}
            />
          ))}

          {/* Continuous laser scan line — always animating */}
          <AnimatePresence>
            {!scanning && (
              <motion.div
                className="absolute w-full"
                style={{
                  height: "3px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,50,50,0.3) 10%, #ff3333 40%, #ff6666 50%, #ff3333 60%, rgba(255,50,50,0.3) 90%, transparent 100%)",
                  boxShadow: "0 0 16px 6px rgba(255,50,50,0.5)",
                }}
                initial={{ top: "15%" }}
                animate={{ top: ["15%", "85%", "15%"] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </AnimatePresence>

          {/* Scanning flash overlay */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(41,171,226,0.15)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Fast laser sweep */}
                <motion.div
                  className="absolute w-full"
                  style={{
                    height: "4px",
                    background:
                      "linear-gradient(90deg, transparent, #ff3333, #ff6666, #ff3333, transparent)",
                    boxShadow: "0 0 20px 8px rgba(255,50,50,0.8)",
                  }}
                  initial={{ top: "10%" }}
                  animate={{ top: "90%" }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
                <div className="bg-white/90 rounded-2xl px-5 py-2.5 shadow-lg">
                  <p className="text-[#1a5fa8] font-black text-lg animate-pulse">
                    掃描中... 🔍
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #1a5fa8 0, #1a5fa8 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #1a5fa8 0, #1a5fa8 1px, transparent 1px, transparent 24px)",
            }}
          />
        </motion.div>

        {/* "Scan product" label — no touch hint */}
        <p className="text-[#1a5fa8]/70 text-sm font-bold text-center">
          請將貨物條碼對準掃描器
        </p>
      </div>

      {/* Checkered floor */}
      <div className="checkered-floor h-8 opacity-40 flex-shrink-0" />
    </div>
  );
}
