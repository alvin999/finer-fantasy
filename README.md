# Finer Fantasy - Espresso 萃取物理模擬器

這是一個專為咖啡愛好者與專業咖啡師設計的 Espresso 萃取物理視覺化工具。透過模擬不同的機器類型、出水量（Water Debit）、粉餅阻力與粉頂空間（Headspace），幫助使用者理解影響壓力曲線與流速的核心變數。

## 核心功能

*   **三種機器模式**：
    *   **Rotary Pump (旋轉泵)**：穩定的壓力爬升與恆定的泵浦壓力。
    *   **Vibration Pump (震動泵)**：具有獨特的微振盪壓力特性。
    *   **Synesso 變壓系統**：可自定義預浸、過渡、主萃與收尾的四段壓力曲線。
*   **物理參數動態模擬**：
    *   **WD 值 (Water Debit)**：模擬 10 秒出水量對壓力爬升速度的影響。
    *   **Headspace (粉頂空間)**：視覺化粉頂空間如何造成「自然預浸」的延遲效果。
    *   **手法選擇**：對比「標準」、「重填壓」與「佈粉不均」下的阻力崩潰曲線（偏流）。
*   **即時視覺化圖表**：
    *   壓力 vs 時間、假想流速、手法對比與 WD 參數對照圖。
    *   具備自動播放萃取過程的動態展示功能。

## 技術棧

*   **核心**：原生 HTML5 / CSS3 / JavaScript (Vanilla JS)。
*   **圖表**：Canvas API 原生繪製（無外部依賴）。
*   **佈署**：GitHub Actions 自動化佈署至 GitHub Pages。

## 開發與運行

本專案採用的架構極為簡潔，無需編譯：

1. 克隆專案：`git clone https://github.com/alvin999/finer-fantasy.git`
2. 使用任何靜態伺服器開啟 `index.html`（例如 VSCode Live Server）。

## 貢獻與反饋

如果你有更有趣的物理模型想法或發現 Bug，歡迎提交 Issue 或 Pull Request。

---
*Powered by Coffee & Code.*
