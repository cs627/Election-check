// ============================================================
// IES Supermarket Quiz — Admin Panel
// Non-programmer friendly: upload Excel → instant game update
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  DEFAULT_PRODUCTS,
  GameData,
  clearGameData,
  loadGameData,
  parseExcelFile,
  saveGameData,
} from "@/lib/dataStore";

const TEMPLATE_URL = "/manus-storage/IES_Quiz_Template_93ce497d.xlsx";

interface AdminPanelProps {
  onClose: () => void;
  onDataLoaded: (data: GameData) => void;
}

export function AdminPanel({ onClose, onDataLoaded }: AdminPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "success" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [preview, setPreview] = useState<GameData | null>(null);
  const currentData = loadGameData();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setErrors(["請上傳 .xlsx 或 .xls 格式的 Excel 檔案"]);
      setStatus("error");
      return;
    }

    setStatus("parsing");
    setErrors([]);
    setWarnings([]);
    setPreview(null);

    const result = await parseExcelFile(file);

    if (result.success && result.data) {
      setPreview(result.data);
      setWarnings(result.warnings);
      setStatus("success");
    } else {
      setErrors(result.errors);
      setWarnings(result.warnings);
      setStatus("error");
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirmLoad = () => {
    if (!preview) return;
    saveGameData(preview);
    onDataLoaded(preview);
    onClose();
  };

  const handleClearData = () => {
    if (confirm("確定要清除已載入的 Excel 數據，恢復使用預設數據嗎？")) {
      clearGameData();
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="bg-[#1a5fa8] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-white font-black text-xl">⚙️ 管理員設定</h2>
            <p className="text-white/70 text-xs mt-0.5">上傳 Excel 更新遊戲數據</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">

          {/* Current data status */}
          <div className="bg-[#EBF5FF] rounded-2xl p-4 border border-[#29ABE2]/30">
            <p className="text-[#1a5fa8] font-black text-sm mb-2">📊 目前數據狀態</p>
            {currentData ? (
              <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                  📁 檔案：<span className="font-bold">{currentData.fileName}</span>
                </p>
                <p className="text-gray-700 text-sm">
                  📦 貨物：<span className="font-bold text-[#1a5fa8]">{currentData.products.length} 件</span>
                  　📋 題目：<span className="font-bold text-[#FF6B35]">{currentData.questions.length} 條</span>
                </p>
                <p className="text-gray-400 text-xs">
                  載入時間：{new Date(currentData.loadedAt).toLocaleString("zh-HK")}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                使用預設數據（{DEFAULT_PRODUCTS.length} 件貨物）
              </p>
            )}
          </div>

          {/* Download template */}
          <a
            href={TEMPLATE_URL}
            download="IES_Quiz_Template.xlsx"
            className="flex items-center gap-3 bg-green-50 border-2 border-green-300 rounded-2xl p-4 hover:bg-green-100 transition-colors"
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              📥
            </div>
            <div>
              <p className="text-green-800 font-black text-base">下載 Excel 範本</p>
              <p className="text-green-600 text-xs">包含20件貨物及15條題目示例</p>
            </div>
          </a>

          {/* Upload area */}
          <div>
            <p className="text-[#1a5fa8] font-black text-sm mb-2">📤 上傳新版 Excel</p>
            <label
              className="flex flex-col items-center justify-center gap-2 border-3 border-dashed border-[#29ABE2] rounded-2xl p-6 cursor-pointer hover:bg-[#EBF5FF] transition-colors"
              style={{ borderWidth: "3px" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-4xl">📊</div>
              <p className="text-[#1a5fa8] font-black text-base">點此選擇 Excel 檔案</p>
              <p className="text-gray-400 text-xs">支援 .xlsx / .xls 格式</p>
            </label>
          </div>

          {/* Parsing status */}
          {status === "parsing" && (
            <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-[#29ABE2] border-t-transparent rounded-full animate-spin flex-shrink-0" style={{ borderWidth: "3px" }} />
              <p className="text-[#1a5fa8] font-bold text-sm">正在讀取 Excel 檔案...</p>
            </div>
          )}

          {/* Errors */}
          {status === "error" && errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 font-black text-sm mb-2">❌ 發現以下錯誤，請修正後重新上傳：</p>
              <ul className="space-y-1">
                {errors.map((e, i) => (
                  <li key={i} className="text-red-600 text-xs">• {e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <p className="text-yellow-700 font-black text-sm mb-2">⚠️ 注意事項：</p>
              <ul className="space-y-1">
                {warnings.map((w, i) => (
                  <li key={i} className="text-yellow-600 text-xs">• {w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success preview */}
          {status === "success" && preview && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-green-700 font-black text-sm mb-3">✅ 讀取成功！請確認以下數據：</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                  <p className="text-2xl font-black text-[#1a5fa8]">{preview.products.length}</p>
                  <p className="text-gray-500 text-xs">件貨物</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                  <p className="text-2xl font-black text-[#FF6B35]">{preview.questions.length}</p>
                  <p className="text-gray-500 text-xs">條題目</p>
                </div>
              </div>

              {/* Product list preview */}
              <p className="text-gray-600 font-bold text-xs mb-2">貨物列表預覽：</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {preview.products.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-100">
                    <span className="text-lg">{p.emoji}</span>
                    <span className="text-gray-700 text-xs font-bold">{p.nameZH}</span>
                    <span className="text-gray-400 text-xs ml-auto font-mono">{p.barcode}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConfirmLoad}
                className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-black text-lg py-4 rounded-2xl shadow-lg transition-all active:scale-95 border-b-4 border-green-800"
              >
                ✅ 確認載入數據
              </button>
            </div>
          )}

          {/* Clear data */}
          {currentData && (
            <button
              onClick={handleClearData}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold text-sm py-3 rounded-2xl transition-all active:scale-95"
            >
              🗑️ 清除已載入數據，恢復預設
            </button>
          )}

          {/* Instructions */}
          <div className="bg-[#F0F8FF] rounded-2xl p-4 border border-[#29ABE2]/20">
            <p className="text-[#1a5fa8] font-black text-sm mb-2">📖 使用步驟</p>
            {[
              "1. 下載 Excel 範本",
              "2. 填入貨物條碼、名稱及題目",
              "3. 儲存為 .xlsx 格式",
              "4. 點擊上方「選擇 Excel 檔案」上傳",
              "5. 確認數據後點「載入」，遊戲即時更新！",
            ].map((step, i) => (
              <p key={i} className="text-gray-600 text-xs mb-1">{step}</p>
            ))}
          </div>

          <div className="h-4" />
        </div>
      </motion.div>
    </motion.div>
  );
}
