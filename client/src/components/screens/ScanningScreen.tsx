// ============================================================
// IES Supermarket Quiz — Scanning Screen
// Big tap area with laser animation, IES blue theme
// ============================================================

import { CountdownTimer } from "@/components/CountdownTimer";
import { useGame } from "@/contexts/GameContext";
import { useSounds } from "@/hooks/useSounds";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const SCAN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663437368766/J2Z2DFnF4NuZM2o5YquhpC/ies-scan-screen-3hvwGZSq4oC2x7i6cTrkM3.webp";
const MASCOT_HAPPY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663437368766/J2Z2DFnF4NuZM2o5YquhpC/ies-mascot-correct-hZ4ckqDbX73rChBL4dnhJG.webp";

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
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #29ABE2 0%, #87CEEB 70%, #B8E8FF 100%)" }}>

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

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-between p-5 gap-4">

        {/* Instruction */}
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <p className="text-[#1a5fa8] font-black text-xl">
            {questionsAnswered === 0 ? "準備好了嗎？" : "掃描下一件貨物！"}
          </p>
          <p className="text-[#1a5fa8]/70 text-sm mt-1">
            點擊下方圖片 = 模擬掃描條碼
          </p>
        </motion.div>

        {/* Big scan tap button */}
        <motion.button
          onClick={handleScan}
          whileTap={{ scale: 0.97 }}
          className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 transition-all"
          style={{ aspectRatio: "9/10" }}
        >
          <img
            src={SCAN_BG}
            alt="掃描區域"
            className="w-full h-full object-cover"
          />

          {/* Scanning overlay */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                className="absolute inset-0 bg-white/30 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Laser line */}
                <motion.div
                  className="absolute w-full h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
                  style={{ boxShadow: "0 0 12px 4px rgba(239,68,68,0.7)" }}
                  initial={{ top: "20%" }}
                  animate={{ top: "80%" }}
                  transition={{ duration: 0.7, ease: "linear" }}
                />
                <div className="bg-white/90 rounded-2xl px-6 py-3 shadow-lg">
                  <p className="text-[#1a5fa8] font-black text-2xl animate-pulse">掃描中... 🔍</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tap hint when idle */}
          {!scanning && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-[#1a5fa8]/90 text-white font-black text-lg px-6 py-3 rounded-2xl shadow-lg"
              >
                👆 點此掃描貨物
              </motion.div>
            </div>
          )}
        </motion.button>

        {/* Mascot hint */}
        <div className="flex items-center gap-3 bg-white/80 rounded-3xl px-4 py-3 shadow border border-white/60 w-full max-w-sm">
          <img src={MASCOT_HAPPY} alt="票箱" className="w-14 h-14 object-contain flex-shrink-0" />
          <div>
            <p className="text-[#1a5fa8] font-black text-sm">🔌 已連接 USB 掃描器？</p>
            <p className="text-[#1a5fa8]/70 text-xs">直接掃描貨物條碼即可觸發題目！</p>
          </div>
        </div>

      </div>

      {/* Checkered floor strip */}
      <div className="checkered-floor h-8 opacity-40" />
    </div>
  );
}
