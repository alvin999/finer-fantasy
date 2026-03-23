import { state, PUMP_MAX, TOTAL_TIME, N } from './state.js';
import { puckResistance, runExtractionSimulation, getSimulatedValue, mkCurve } from './physics.js';

// ======== CANVAS HELPERS ========

export function prepCanvas(id, h) {
    const el = document.getElementById(id);
    if (!el) return null;
    const W = el.offsetWidth;
    // 使用傳入的 h，或者優先讀取元素本身的 height 屬性，避免 offsetHeight 在 flex 佈局下產生增長循環
    const H = h || parseInt(el.getAttribute('height')) || el.offsetHeight || 230;
    const dpr = window.devicePixelRatio || 1;
    el.width = W * dpr;
    el.height = H * dpr;
    const ctx = el.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, W, H };
}

export function drawAxes(ctx, W, H, PAD, yMax, yTicks) {
    if (!ctx) return null;
    ctx.fillStyle = '#161616'; 
    ctx.fillRect(0, 0, W, H);
    
    const yPx = v => PAD.t + (1 - v / yMax) * (H - PAD.t - PAD.b);
    const xPx = t => PAD.l + (t / TOTAL_TIME) * (W - PAD.l - PAD.r);
    
    // Y-axis grid & labels
    yTicks.forEach(v => {
        const y = yPx(v);
        ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke();
        ctx.fillStyle = '#454040'; ctx.font = '9px DM Mono, monospace'; ctx.textAlign = 'right';
        ctx.fillText(v, PAD.l - 5, y + 3.5);
    });
    
    // X-axis grid & labels
    [0, 5, 10, 15, 20, 25, 30].forEach(t => {
        const x = xPx(t);
        ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, H - PAD.b); ctx.stroke();
        ctx.fillStyle = '#454040'; ctx.font = '9px DM Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText(t + 's', x, H - PAD.b + 13);
    });
    
    return { xPx, yPx };
}

export function strokeLine(ctx, data, count, xPx, yPx, color, lw, alpha, dash) {
    if (count < 2 || !ctx) return;
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.globalAlpha = alpha ?? 1;
    ctx.setLineDash(dash ?? []); ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
        const x = xPx(i / N * TOTAL_TIME), y = yPx(data[i]);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); 
    ctx.restore();
}

export function fillArea(ctx, data, count, xPx, yPx, color, alpha) {
    if (!ctx) return;
    ctx.save(); 
    ctx.globalAlpha = alpha ?? 0.1; ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(xPx(0), yPx(0));
    for (let i = 0; i < count; i++) ctx.lineTo(xPx(i / N * TOTAL_TIME), yPx(data[i]));
    ctx.lineTo(xPx((count - 1) / N * TOTAL_TIME), yPx(0));
    ctx.closePath(); 
    ctx.fill(); 
    ctx.restore();
}

// ======== ROTARY / VIBE CHARTS ========

export function drawPressureChart(progress, updateStatsCallback) {
    const res = prepCanvas('pressure-chart', 230);
    if (!res) return;
    const { ctx, W, H } = res;
    const PAD = { l: 36, r: 16, t: 14, b: 32 };
    const { xPx, yPx } = drawAxes(ctx, W, H, PAD, 13, [0, 3, 6, 9, 12]);
    const maxP = PUMP_MAX[state.currentMachine];
    const drawn = Math.floor(N * progress);

    // 1. Machine max line
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#2980b9'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, yPx(maxP)); ctx.lineTo(W - PAD.r, yPx(maxP)); ctx.stroke();
    ctx.fillStyle = '#2980b9'; ctx.font = '9px DM Mono, monospace'; ctx.textAlign = 'right'; ctx.globalAlpha = 0.6;
    ctx.fillText(maxP + ' bar', W - PAD.r - 2, yPx(maxP) - 4); ctx.restore();

    // 2. Puck resistance reference (gold) - 上帝視角
    const puck = state.simulation.puckResistances;
    if (puck && puck.length > 0) {
        strokeLine(ctx, puck, N, xPx, yPx, '#c8a96e', 1.0, 0.4, []); // 改為細實線
    }

    // 3. Actual Pressure (red)
    const actual = state.simulation.pressures;
    if (actual && actual.length > 0 && drawn > 1) {
        fillArea(ctx, actual, drawn, xPx, yPx, '#e74c3c', 0.09);
        strokeLine(ctx, actual, drawn, xPx, yPx, '#e74c3c', 2.5);

        // Current progress line
        if (progress < 1) {
            const px = xPx((drawn - 1) / N * TOTAL_TIME);
            ctx.save(); ctx.strokeStyle = '#fff'; ctx.globalAlpha = 0.15; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(px, PAD.t); ctx.lineTo(px, H - PAD.b); ctx.stroke(); ctx.restore();
        }

        if (updateStatsCallback) {
            const peak = Math.max(...actual.slice(0, drawn));
            // 計算壓力大於 7 bar 的持續時間
            const highSec = (actual.slice(0, drawn).filter(v => v > 7.0).length / N) * TOTAL_TIME;
            updateStatsCallback(peak, highSec);
        }
    }
}

export function drawCompareChart() {
    const res = prepCanvas('compare-chart', 230);
    if (!res) return;
    const { ctx, W, H } = res;
    const PAD = { l: 36, r: 16, t: 14, b: 32 };
    const { xPx, yPx } = drawAxes(ctx, W, H, PAD, 13, [3, 6, 9, 12]);
    
    const methods = [
        { key: 'heavy', color: '#27ae60', label: '重填壓' },
        { key: 'normal', color: '#c8a96e', label: '標準' },
        { key: 'uneven', color: '#e74c3c', label: '佈粉不均' },
    ];

    methods.forEach(({ key, color, label }) => {
        // 為比較表執行獨立模擬
        const sim = runExtractionSimulation({
            currentWD: state.currentWD,
            currentMethod: key,
            currentMachine: state.currentMachine,
            headspace: state.headspace
        });
        
        strokeLine(ctx, sim.pressures, N, xPx, yPx, color, 2, 0.85);
        
        // 標籤位置：延遲點後 5 秒
        const labelIdx = Math.floor((sim.delay + 5) / TOTAL_TIME * N);
        const idx = Math.min(labelIdx, N - 1);
        ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = 0.9;
        ctx.font = 'bold 10px DM Mono, monospace'; ctx.textAlign = 'left';
        ctx.fillText(label, xPx(idx / N * TOTAL_TIME) + 3, yPx(sim.pressures[idx]) - 8); ctx.restore();
    });
}

export function drawConceptChart() {
    const res = prepCanvas('concept-chart', 270);
    if (!res) return;
    const { ctx, W, H } = res;
    ctx.fillStyle = '#161616'; ctx.fillRect(0, 0, W, H);
    
    const scenarios = [
        { wd: 60, label: 'WD 60  低流量', color: '#3498db' },
        { wd: 80, label: 'WD 80  基準', color: '#c8a96e' },
        { wd: 100, label: 'WD 100  高流量', color: '#e74c3c' },
    ];
    
    const colW = W / 3;
    const PAD = { t: 28, b: 26, l: 30, r: 8 };
    const maxP = PUMP_MAX[state.currentMachine];

    scenarios.forEach(({ wd, label, color }, ci) => {
        const ox = ci * colW;
        const cW2 = colW - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
        const xPx = t => ox + PAD.l + (t / TOTAL_TIME) * cW2;
        const yPx = v => PAD.t + (1 - v / 13) * cH;

        if (ci > 0) {
            ctx.strokeStyle = '#1f1f1f'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
        }

        ctx.fillStyle = color; ctx.font = 'bold 10px DM Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText(label, ox + colW / 2, 18);

        // Grid lines
        [3, 6, 9, 12].forEach(bar => {
            const y = yPx(bar);
            ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
            ctx.beginPath(); ctx.moveTo(ox + PAD.l, y); ctx.lineTo(ox + colW - PAD.r, y); ctx.stroke();
            ctx.setLineDash([]);
            if (ci === 0) {
                ctx.fillStyle = '#3a3535'; ctx.font = '8px DM Mono, monospace'; ctx.textAlign = 'right';
                ctx.fillText(bar, ox + PAD.l - 3, y + 3);
            }
        });

        // Machine limit
        ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = '#2980b9'; ctx.globalAlpha = 0.35; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ox + PAD.l, yPx(maxP)); ctx.lineTo(ox + colW - PAD.r, yPx(maxP)); ctx.stroke(); ctx.restore();

        // 獨立模擬該場景
        const sim = runExtractionSimulation({
            currentWD: wd,
            currentMethod: state.currentMethod,
            currentMachine: state.currentMachine,
            headspace: state.headspace
        });

        // 1. Puck resistance reference
        ctx.strokeStyle = '#c8a96e'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.4;
        ctx.beginPath();
        sim.puckResistances.forEach((v, i) => {
            const x = xPx(i / N * TOTAL_TIME), y = yPx(v);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke(); 
        
        // 2. Pressure area & line
        ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = color;
        ctx.beginPath(); ctx.moveTo(xPx(0), yPx(0));
        sim.pressures.forEach((v, i) => ctx.lineTo(xPx(i / N * TOTAL_TIME), yPx(v)));
        ctx.lineTo(xPx(TOTAL_TIME), yPx(0)); ctx.closePath(); ctx.fill(); ctx.restore();

        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.globalAlpha = 1;
        ctx.beginPath();
        sim.pressures.forEach((v, i) => {
            const x = xPx(i / N * TOTAL_TIME), y = yPx(v);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Peak annotation
        const peak = Math.max(...sim.pressures);
        const peakIdx = sim.pressures.indexOf(peak);
        ctx.fillStyle = color; ctx.font = 'bold 10px DM Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText(peak.toFixed(1) + ' bar', xPx(peakIdx / N * TOTAL_TIME), yPx(peak) - 6);

        [0, 15, 30].forEach(t => {
            ctx.fillStyle = '#3a3535'; ctx.font = '8px DM Mono, monospace'; ctx.textAlign = 'center';
            ctx.fillText(t + 's', xPx(t), H - 5);
        });
    });
}

// ======== PUCK ANIMATION (CROSS-SECTION) ========

/**
 * 繪製萃取剖面圖動畫
 * @param {number} progress 動畫進度 (0-1)
 */
export function drawPuckAnimation(progress) {
    const res = prepCanvas('puck-animation', 120);
    if (!res) return;
    const { ctx, W, H } = res;
    const t = progress * TOTAL_TIME;
    
    // 取得即時物理數據
    const wd = state.currentWD;
    const hs = state.headspace;
    const p = getSimulatedValue(t, state.simulation.pressures);
    
    // 計算 Headspace 填水程度
    const volToFill = hs * 2.64;
    const flowRate = wd / 10;
    const delay = volToFill / flowRate;
    const fillProgress = Math.min(1, t / delay);
    
    // 繪圖參數
    const PAD = 20;
    const basketW = W - PAD * 2;
    const basketH = H - PAD * 2; // 總高度固定 (籃子深度)
    const screenY = PAD;
    
    // 將 0.5~5.0mm 映射至畫布高度
    // 假設 Headspace 越大，粉量 (puckHeight) 越小
    const hsHeight = 8 + (hs - 0.5) * (32 / 4.5); // 8px ~ 40px
    const puckHeight = basketH - hsHeight;
    const puckY = screenY + hsHeight;
    
    // 1. 清空畫布
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, W, H);
    
    // 2. 繪製邊框 (Portafilter Basket)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(PAD, screenY, basketW, basketH);
    
    
    // 4. 繪製分水網 (Shower Screen)
    ctx.fillStyle = '#888';
    ctx.fillRect(PAD - 5, screenY - 2, basketW + 10, 4);
    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = '#555';
        ctx.fillRect(PAD + (i / 14) * basketW - 1, screenY - 1, 2, 2);
    }
    
    // 5. 繪製水流 (Water Flow from Screen)
    if (t > 0 && t < delay + 2) {
        ctx.fillStyle = '#3498db';
        ctx.globalAlpha = 0.6;
        const particleCount = Math.floor(wd / 4);
        for (let i = 0; i < particleCount; i++) {
            const px = PAD + Math.random() * basketW;
            const py = screenY + (Math.random() * hsHeight * Math.min(1, t / 0.5));
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    
    // 6. 繪製 Headspace 中的水積累 (由上而下填滿)
    if (fillProgress > 0) {
        ctx.fillStyle = '#3498db';
        ctx.globalAlpha = 0.45;
        const waterHeight = hsHeight * fillProgress;
        // 水流從分水網(screenY)向下延伸至填滿
        ctx.fillRect(PAD + 2, screenY, basketW - 4, waterHeight);
        ctx.globalAlpha = 1;
    }

    // 7. 繪製粉餅 (Puck) - 具有壓力傳遞效果的漸層
    // 壓力由上往下傳導，頂部顏色較深，底部隨時間跟進
    const grad = ctx.createLinearGradient(0, puckY, 0, puckY + puckHeight);
    const topP = p;
    // 假設壓力傳導有延遲，底部壓力落後頂部
    const bottomP = Math.max(0, p * 0.7 - 1); 
    
    grad.addColorStop(0, `hsl(28, 40%, ${Math.max(8, 35 - topP * 3)}%)`);
    grad.addColorStop(1, `hsl(28, 45%, ${Math.max(10, 38 - bottomP * 3)}%)`);
    
    ctx.fillStyle = grad;
    ctx.fillRect(PAD + 2, puckY, basketW - 4, puckHeight - 2);
    
    // 8. 繪製萃取出的咖啡液 (Bottom of puck)
    if (t > delay + 0.5) {
        ctx.fillStyle = '#4e342e'; 
        const dropCount = Math.floor(p * 1.5);
        for (let i = 0; i < dropCount; i++) {
            const dx = PAD + Math.random() * basketW;
            const dy = H - PAD + (Math.random() * 10);
            ctx.beginPath();
            ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 9. 文字標示
    ctx.fillStyle = '#aaa';
    ctx.font = 'bold 9px DM Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`HEADSPACE: ${hs}mm`, PAD + 5, puckY - 5);
    ctx.textAlign = 'right';
    ctx.fillText(`FLOW (WD): ${wd}`, W - PAD - 5, screenY + 12);
    
}
