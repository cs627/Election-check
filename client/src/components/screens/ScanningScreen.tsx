// ============================================================
// IES Supermarket Quiz — Scanning Screen
// KIOSK 9:16 fixed — no scroll, laser frame fills available space
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
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #29ABE2 0%, #87CEEB 70%, #B8E8FF 100%)" }}
    >
      {/* Timer bar */}
      <div className="bg-white/90 px-4 py-2.5 flex flex-col items-center border-b-2 border-[#29ABE2]/30 flex-shrink-0">
        <p className="text-[#1a5fa8] text-xs font-black uppercase tracking-widest mb-1">⏰ 剩餘時間</p>
        <CountdownTimer />
      </div>

      {/* Score strip */}
      <div className="bg-[#1a5fa8] px-4 py-1.5 flex justify-around items-center flex-shrink-0">
        {[
          { label: "答題", value: questionsAnswered, color: "text-white" },
          { label: "答對", value: correctAnswers, color: "text-yellow-300" },
          { label: "分數", value: score, color: "text-yellow-300", big: true },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-white/60 text-xs font-bold leading-none">{s.label}</p>
            <p className={`${s.color} font-black ${s.big ? "text-2xl font-orbitron" : "text-lg"} leading-tight`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main scan area — flex-1 fills remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-3 min-h-0">

        <motion.p
          className="text-[#1a5fa8] font-black text-lg text-center flex-shrink-0"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {questionsAnswered === 0 ? "請掃描貨物條碼開始！" : "請掃描下一件貨物！"}
        </motion.p>

        {/* Scan frame — square, fills available width */}
        <motion.div
          onClick={handleScan}
          className="relative rounded-3xl overflow-hidden cursor-pointer flex-shrink-0"
          style={{
            width: "min(100%, calc(100% - 0px))",
            aspectRatio: "1 / 1",
            background: "linear-gradient(135deg, #e8f4ff 0%, #c5e8ff 100%)",
            border: "3px solid rgba(41,171,226,0.4)",
            maxHeight: "55%",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Corner brackets */}
          {[
            "top-4 left-4 border-t-4 border-l-4",
            "top-4 right-4 border-t-4 border-r-4",
            "bottom-4 left-4 border-b-4 border-l-4",
            "bottom-4 right-4 border-b-4 border-r-4",
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-8 h-8 border-white rounded-sm ${cls}`}
              style={{ borderWidth: "4px" }}
            />
          ))}

          {/* Continuous laser sweep */}
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
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* Scanning flash */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(41,171,226,0.15)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute w-full"
                  style={{
                    height: "4px",
                    background: "linear-gradient(90deg, transparent, #ff3333, #ff6666, #ff3333, transparent)",
                    boxShadow: "0 0 20px 8px rgba(255,50,50,0.8)",
                  }}
                  initial={{ top: "10%" }}
                  animate={{ top: "90%" }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
                <div className="bg-white/90 rounded-2xl px-4 py-2 shadow-lg">
                  <p className="text-[#1a5fa8] font-black text-base animate-pulse">掃描中... 🔍</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #1a5fa8 0, #1a5fa8 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #1a5fa8 0, #1a5fa8 1px, transparent 1px, transparent 24px)",
            }}
          />
        </motion.div>

        <p className="text-[#1a5fa8]/70 text-sm font-bold text-center flex-shrink-0">
          請將貨物條碼對準掃描器
        </p>
      </div>

      {/* Checkered floor */}
      <div className="checkered-floor h-5 opacity-40 flex-shrink-0" />
    </div>
  );
}
