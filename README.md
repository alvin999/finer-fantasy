# Finer Fantasy - Espresso 萃取物理模擬器

[繁體中文](#finer-fantasy---espresso-萃取物理模擬器) | [English](#finer-fantasy---espresso-extraction-physics-simulator) | [日本語](#finer-fantasy---エスプレッソ抽出物理シミュレーター)

---

### 主畫面 (Main Simulator)
![Main Simulator](./screenshots/screenshot1.png)

### 概念導覽 (Concept Interactive Guide)
![Concept Guide](./screenshots/screenshot2.png)


## ☕ 關於專案 (The Origins)


「為什麼要叫 **Finer Fantasy**？」

這不僅是對經典 RPG *Final Fantasy* 的致敬，更是無數咖啡職人對那一杯「完美濃縮」的終極幻想。在咖啡界，有一個傳說中的解決方案：「**Grind Finer** (磨細一點)」。這個專案，就是將這場關於「研磨」與「萃取」的浪漫幻想，轉化為精確的物理模擬。

### 建立你的「物理直覺」與心智表徵

在實際的咖啡沖煮中，**WD 值 (Water Debit, 出水量)** 與 **Headspace (粉頂空間)** 往往是極其抽象的概念。我們很難直接觀察到水流在填壓後的粉餅內部是如何移動的，且並非每一台義式咖啡機都能顯示即時的萃取壓力或流速。

**Finer Fantasy** 引入了「**假想粉餅阻力** (Fictitious Puck Resistance)」的概念，這是一個連結「現象」與「物理」的橋樑：
- **視覺化不可見之物**：透過模擬水流穿過粉餅時的動態阻力，幫助你在腦中建構出一個清晰的**心智表徵**。
- **更有感的萃取環節**：當你調整填壓力度、佈粉方式或機器參數時，你能即時看到模擬曲線的反應，進而讓你在實際操作（填壓、佈粉、觀察流速）時，對每一個細微動作所產生的物理意義「更有感」。


## 🌟 核心特色

- **靈魂機器模擬**：
  - **Rotary Pump (旋轉泵)**：穩定的壓力，職人的精準。
  - **Vibration Pump (震動泵)**：具有生命力的微細脈動。
- **物理參數的華麗舞步**：
  - **WD (Water Debit)**：10 秒出水量如何左右壓力的爬升？
  - **Headspace (粉頂空間)**：揭開「自然預浸」的延遲美學。
  - **偏流 (Channeling) 模擬**：體驗「佈粉不均」與「阻力崩潰」對萃取帶來的致命傷。
- **數據與視覺的交織**：
  - 即時 Canvas 渲染，捕捉每一毫秒的壓力起伏。
  - 支援動態播放，像觀看一部微型物理紀錄片。

## 🧭 導覽：假想粉餅阻力互動網頁

想要更深入地理解物理細節嗎？我們準備了一個專屬的 **[教育導覽頁面](./src/pages/learning.astro)**。

在這個由 **GSAP** 驅動的互動頁面中，你可以透過滾動來觀看：
1. **水滴的舞動**：水穿過粉餅的物理模型分解。
2. **阻力曲線分析**：不同壓力和手法下的物理反應。
3. **從 0 到 9 bar**：完整的萃取過程。

> [!TIP]
> 建議在桌面端開啟，體驗最流暢的滾動視覺衝擊。

## 🛠️ 技術棧

- **Frontend**: [Astro](https://astro.build/) - 打造極速的開發與運行體驗。
- **Animation**: [GSAP](https://greensock.com/gsap/) - 驅動細膩的互動導覽。
- **Graphics**: 原生 Canvas API - 追求無懈可擊的效能。

## 🚀 立即啟動

```bash
# 克隆本專案
git clone https://github.com/alvin999/finer-fantasy.git

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

---

# Finer Fantasy - Espresso Extraction Physics Simulator

## ☕ The Origins

"Why name it **Finer Fantasy**?"

It's not just a tribute to the classic RPG *Final Fantasy*, but also the ultimate fantasy of countless baristas for that "perfect shot." In the coffee world, there's a legendary solution: "**Grind Finer**." This project transforms the romantic fantasy of "grinding" and "extraction" into precise physics simulation.

### Build Your "Physics Intuition" and Mental Models

In actual coffee brewing, **WD (Water Debit)** and **Headspace** are often extremely abstract concepts. It's hard to directly observe how water moves inside the tamped puck, and not every espresso machine displays real-time extraction pressure or flow rate.

**Finer Fantasy** introduces the concept of "**Fictitious Puck Resistance**," a bridge between "phenomena" and "physics":
- **Visualize the Invisible**: By simulating dynamic resistance as water flows through the puck, it helps you build a clear **mental model** in your head.
- **Enhanced Extraction Feel**: When you adjust tamping force, distribution, or machine parameters, you see immediate responses in the simulation curves, making you feel "more connected" to the physical meaning of every subtle movement during actual operation.

## 🌟 Core Features

- **Soul Machine Simulation**:
  - **Rotary Pump**: Stable pressure, professional precision.
  - **Vibration Pump**: Subtle pulsations with a life of their own.
- **A Dance of Physical Parameters**:
  - **WD (Water Debit)**: How does 10-second water output dictate pressure buildup?
  - **Headspace**: Unveiling the aesthetics of "natural pre-infusion" delay.
  - **Channeling Simulation**: Experience the fatal impact of "uneven distribution" and "resistance collapse."
- **Intertwining Data and Visuals**:
  - Real-time Canvas rendering capturing every millisecond of pressure fluctuation.
  - Dynamic playback support, like watching a miniature physics documentary.

## 🧭 Interactive Guide: Fictitious Puck Resistance

Want to dive deeper into physics details? We've prepared a dedicated **Educational Guide**.

On this **GSAP**-powered interactive page, you can scroll through:
1. **The Dance of Water**: Physics model breakdown of water passing through the puck.
2. **Resistance Curve Analysis**: Physical reactions under different pressures and techniques.
3. **From 0 to 9 bar**: The complete extraction process.

## 🛠️ Tech Stack

- **Frontend**: [Astro](https://astro.build/) - For a blazing fast development and runtime experience.
- **Animation**: [GSAP](https://greensock.com/gsap/) - Driving delicate interactive navigation.
- **Graphics**: Native Canvas API - For uncompromising performance.

---

# Finer Fantasy - エスプレッソ抽出物理シミュレーター

## ☕ プロジェクトについて (The Origins)

「なぜ **Finer Fantasy** なのか？」

これは名作RPG『*Final Fantasy*』へのオマージュであると同時に、数多くのバリスタが追い求める「完璧な一杯」への究極の幻想でもあります。コーヒーの世界には、「**Grind Finer**（もっと細く挽け）」という伝説的な解決策があります。このプロジェクトは、「グラインド」と「抽出」にまつわるロマンチックな幻想を、正確な物理シミュレーションへと昇華させたものです。

### 「物理的直感」とメンタルモデルの構築

実際のコーヒー抽出において、**WD値（Water Debit、吐出量）**や **Headspace（ヘッドスペース）**は非常に抽象的な概念になりがちです。タンピングされた粉の中を水がどのように移動するかを直接観察することは難しく、すべてのマシンがリアルタイムの圧力や流速を表示できるわけではありません。

**Finer Fantasy** は「**仮想粉体抵抗** (Fictitious Puck Resistance)」という概念を導入しました。これは「現象」と「物理」を繋ぐ架け橋です。
- **不可視の可視化**：粉の中を流れる水の動的抵抗をシミュレートすることで、頭の中に明確な**メンタルモデル**を構築するのを助けます。
- **抽出をより「感じる」**：タンピングの強さ、ディストリビューション、マシンのパラメータを調整すると、シミュレーション曲線が即座に反応します。これにより、実際の操作（タンピング、レベリング、流速の観察）における細かな微調整が持つ物理的な意味を、より深く「実感」できるようになります。

## 🌟 主な特徴

- **マシンの魂をシミュレート**：
  - **ロータリーポンプ (Rotary Pump)**：安定した圧力、プロフェッショナルの精度。
  - **バイブレーションポンプ (Vibration Pump)**：生命感のある微細な脈動。
- **物理パラメータの華麗なダンス**：
  - **WD (Water Debit)**：10秒間の吐出量が圧力の上昇をどう左右するか？
  - **Headspace (ヘッドスペース)**： 「自然な蒸らし（プリインフュージョン）」がもたらす遅延の美学。
  - **チャネリング (Channeling) シミュレート**：「偏った粉」や「抵抗の崩壊」が抽出に與える致命的な影響を體驗。
- **データとビジュアルの融合**：
  - リアルタイム Canvas レンダリングにより、ミリ秒単位の圧力変動をキャプチャ。
  - ダイナミックな再生に対応。まるでミクロな物理ドキュメンタリーを見ているかのような體驗。

## 🧭 インタクティブガイド：仮想粉体抵抗

物理的な詳細をより深く理解したいですか？ 特設の **教育ガイドページ** を用意しました。

**GSAP** を駆使したこのインタラクティブページでは、スクロールすることで以下の內容を確認できます：
1. **水の舞い**：粉を通り抜ける水の物理モデルの分解。
2. **抵抗曲線分析**：異なる圧力や手法下での物理的反應。
3. **0から9barまで**：抽出の全プロセス。

## 🛠️ 技術スタック

- **Frontend**: [Astro](https://astro.build/) - 高速な開發と實行體驗。
- **Animation**: [GSAP](https://greensock.com/gsap/) - 繊細なインタラクションを驅動。
- **Graphics**: Native Canvas API - 妥協のないパフォーマンス。

---
*Powered by Coffee, Code, and the never-ending dream of a perfect shot.*

