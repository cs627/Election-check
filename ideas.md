# 掃碼問答挑戰 — 設計構思

## 設計靈感來源
參考韓式自助點餐機風格：大按鈕、高對比色塊、卡通吉祥物、清晰層次感

---

<response>
<probability>0.07</probability>
<idea>

**Design Movement:** Neo-Kawaii Kiosk — 日韓可愛風格自助機介面

**Core Principles:**
1. 超大觸控按鈕，最小 120px 高度，確保易按
2. 高飽和度色塊分區，每個選項用不同顏色區分
3. 卡通吉祥物（票箱寶寶）作為情感反饋核心
4. 動畫過渡流暢，每個狀態切換有明確視覺反饋

**Color Philosophy:**
- 主色：珊瑚紅 #FF6B6B（熱情、活力）
- 副色：天藍 #4ECDC4（清新、信任）
- 強調：金黃 #FFE66D（獎勵、成就）
- 背景：深藍 #1A1A2E（專業、沉穩）
- 文字：純白 #FFFFFF

**Layout Paradigm:**
垂直全屏堆疊，模擬實體自助機比例（9:16 portrait），每個畫面只有一個主要動作

**Signature Elements:**
1. 圓角大色塊按鈕（border-radius: 20px），帶陰影浮起效果
2. 票箱寶寶吉祥物 SVG 動畫（搖頭、跳躍、哭泣等狀態）
3. 掃描條碼時的雷射掃描線動畫

**Interaction Philosophy:**
每個互動都有即時視覺+聲音反饋，答對閃綠光，答錯震動+紅光+吉祥物出現

**Animation:**
- 頁面切換：slide-up 0.4s ease-out
- 按鈕按下：scale(0.95) + 陰影縮小
- 倒數計時：最後10秒數字變紅色 + pulse 動畫
- 掃描動畫：雷射線從上到下掃描 1.5s loop
- 答題結果：confetti 彩帶（答對）/ shake 震動（答錯）

**Typography System:**
- 標題：Nunito Black 900 — 圓潤有力
- 按鈕：Nunito Bold 700
- 計分：Orbitron 數字字體（科技感）
- 內文：Nunito Regular 400

</idea>
</response>

<response>
<probability>0.05</probability>
<idea>

**Design Movement:** Retro Arcade Neon — 復古電玩霓虹風

**Core Principles:**
1. 霓虹發光效果，深色背景配亮色文字
2. 像素/8-bit 風格元素混合現代圓角
3. 電玩積分板美學，強調競爭排名
4. 閃爍動畫模擬真實電玩機台

**Color Philosophy:**
- 背景：極深紫黑 #0D0D1A
- 霓虹粉：#FF2D78
- 霓虹藍：#00F5FF
- 霓虹綠：#39FF14
- 金色：#FFD700

**Layout Paradigm:**
電玩機台風格，頂部分數欄，中間主遊戲區，底部操作區

**Signature Elements:**
1. 文字霓虹發光 text-shadow 效果
2. 掃描線 scanline overlay 全屏效果
3. 像素化邊框和分隔線

**Interaction Philosophy:**
強調競技感，每次答題都有電玩音效，排行榜用滾動動畫展示

**Animation:**
- 霓虹閃爍 flicker 動畫
- 分數跳動 counter 動畫
- 排行榜滾入效果

**Typography System:**
- 標題：Press Start 2P（像素字體）
- 分數：Orbitron
- 內文：Share Tech Mono

</idea>
</response>

<response>
<probability>0.08</probability>
<idea>

**Design Movement:** Playful Flat Kiosk — 現代扁平可愛風

**Core Principles:**
1. 明亮白底配彩色色塊，乾淨清爽
2. 插畫風格圖示和吉祥物
3. 大量留白，資訊層次清晰
4. 觸控優先設計，按鈕間距充足

**Color Philosophy:**
- 背景：米白 #FFF8F0
- 主色：活力橙 #FF8C42
- 副色：薄荷綠 #6BCB77
- 強調：天空藍 #4D96FF
- 危險：玫瑰紅 #FF6B6B

**Layout Paradigm:**
卡片式佈局，每個功能區域用不同顏色卡片區分

**Signature Elements:**
1. 圓形圖示配色塊背景
2. 波浪形分隔線
3. 插畫風吉祥物

**Interaction Philosophy:**
輕鬆愉快，適合親子互動，動畫柔和不刺激

**Animation:**
- bounce 彈跳效果
- 顏色漸變過渡
- 吉祥物搖擺動畫

**Typography System:**
- 標題：Fredoka One
- 內文：Nunito

</idea>
</response>

---

## 選定方案：Neo-Kawaii Kiosk（第一方案）

**理由：** 最貼近韓式自助機參考圖的風格，大按鈕+高飽和色塊+吉祥物，適合展覽場地使用，視覺衝擊力強，老少咸宜。
