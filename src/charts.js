import { state, PUMP_MAX, TOTAL_TIME, N, STAGE_DUR } from './state.js';
import { puckResistance, actualPressure, mkCurve, synessoP, synessoFlow } from './physics.js';

// ======== CANVAS HELPERS ========

export function prepCanvas(id, h) {
    const el = document.getElementById(id);
    if (!el) return null;
    const W = el.offsetWidth;
    const H = h || el.offsetHeight || 230; // Use provided H or detect from DOM
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
    const res = prepCanvas('pressure-chart'); // Remove fixed height
    if (!res) return;
    const { ctx, W, H } = res;
    const PAD = { l: 36, r: 16, t: 14, b: 32 };
    const { xPx, yPx } = drawAxes(ctx, W, H, PAD, 13, [0, 3, 6, 9, 12]);
    const maxP = PUMP_MAX[state.currentMachine];
    const drawn = Math.floor(N * progress);

    // Machine max line
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#2980b9'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, yPx(maxP)); ctx.lineTo(W - PAD.r, yPx(maxP)); ctx.stroke();
    ctx.fillStyle = '#2980b9'; ctx.font = '9px DM Mono, monospace'; ctx.textAlign = 'right'; ctx.globalAlpha = 0.6;
    ctx.fillText(maxP + ' bar', W - PAD.r - 2, yPx(maxP) - 4); ctx.restore();

    // Puck resistance (gold)
    const puck = mkCurve(t => puckResistance(t, state.currentMethod));
    strokeLine(ctx, puck, N, xPx, yPx, '#c8a96e', 1.5, 0.65);

    if (drawn > 1) {
        const actual = mkCurve(t => actualPressure(t, state.currentWD, state.currentMethod, state.currentMachine, state.headspace));
        fillArea(ctx, actual, drawn, xPx, yPx, '#e74c3c', 0.09);
        strokeLine(ctx, actual, drawn, xPx, yPx, '#e74c3c', 2.5);

        if (progress < 1) {
            const px = xPx((drawn - 1) / N * TOTAL_TIME);
            ctx.save(); ctx.strokeStyle = '#fff'; ctx.globalAlpha = 0.15; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(px, PAD.t); ctx.lineTo(px, H - PAD.b); ctx.stroke(); ctx.restore();
        }

        if (updateStatsCallback) {
            const peak = Math.max(...actual.slice(0, drawn));
            const highSec = (actual.slice(0, drawn).filter(v => v > 7.5).length / N) * TOTAL_TIME;
            updateStatsCallback(peak, highSec);
        }
    }
}

export function drawCompareChart() {
    const res = prepCanvas('compare-chart'); // Remove fixed height
    if (!res) return;
    const { ctx, W, H } = res;
    const PAD = { l: 36, r: 16, t: 14, b: 32 };
    const { xPx, yPx } = drawAxes(ctx, W, H, PAD, 13, [3, 6, 9, 12]);
    const methods = [
        { key: 'heavy', color: '#27ae60', label: '重填壓', lt: 0.82 },
        { key: 'normal', color: '#c8a96e', label: '標準', lt: 0.70 },
        { key: 'uneven', color: '#e74c3c', label: '佈粉不均', lt: 0.88 },
    ];
    methods.forEach(({ key, color, label, lt }) => {
        const puck = mkCurve(t => puckResistance(t, key));
        const actual = mkCurve(t => actualPressure(t, state.currentWD, key, state.currentMachine, state.headspace));
        strokeLine(ctx, puck, N, xPx, yPx, color, 2, 1);
        strokeLine(ctx, actual, N, xPx, yPx, color, 1, 0.35, [4, 4]);
        const idx = Math.floor(N * lt);
        ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = 0.85;
        ctx.font = 'bold 10px DM Mono, monospace'; ctx.textAlign = 'left';
        ctx.fillText(label, xPx(idx / N * TOTAL_TIME) + 3, yPx(puck[idx]) - 5); ctx.restore();
    });
}

export function drawConceptChart() {
    const res = prepCanvas('concept-chart'); // Remove fixed height
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

        if (ci > 0) { ctx.strokeStyle = '#1f1f1f'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke(); }

        ctx.fillStyle = color; ctx.font = 'bold 10px DM Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText(label, ox + colW / 2, 18);

        [3, 6, 9, 12].forEach(bar => {
            const y = yPx(bar);
            ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
            ctx.beginPath(); ctx.moveTo(ox + PAD.l, y); ctx.lineTo(ox + colW - PAD.r, y); ctx.stroke();
            ctx.setLineDash([]);
            if (ci === 0) { ctx.fillStyle = '#3a3535'; ctx.font = '8px DM Mono, monospace'; ctx.textAlign = 'right'; ctx.fillText(bar, ox + PAD.l - 3, y + 3); }
        });

        ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = '#2980b9'; ctx.globalAlpha = 0.35; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ox + PAD.l, yPx(maxP)); ctx.lineTo(ox + colW - PAD.r, yPx(maxP)); ctx.stroke(); ctx.restore();

        const puck = mkCurve(t => puckResistance(t, state.currentMethod));
        ctx.strokeStyle = '#c8a96e'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.5;
        ctx.beginPath(); puck.forEach((v, i) => { const x = xPx(i / N * TOTAL_TIME), y = yPx(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke(); ctx.globalAlpha = 1;

        const actual = mkCurve(t => actualPressure(t, wd, state.currentMethod, state.currentMachine, state.headspace));
        ctx.save(); ctx.globalAlpha = 0.11; ctx.fillStyle = color;
        ctx.beginPath(); ctx.moveTo(xPx(0), yPx(0));
        actual.forEach((v, i) => ctx.lineTo(xPx(i / N * TOTAL_TIME), yPx(v)));
        ctx.lineTo(xPx(TOTAL_TIME), yPx(0)); ctx.closePath(); ctx.fill(); ctx.restore();

        ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.beginPath(); actual.forEach((v, i) => { const x = xPx(i / N * TOTAL_TIME), y = yPx(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); ctx.stroke();

        const peak = Math.max(...actual); const peakIdx = actual.indexOf(peak);
        ctx.fillStyle = color; ctx.font = 'bold 10px DM Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText(peak.toFixed(1) + ' bar', xPx(peakIdx / N * TOTAL_TIME), yPx(peak) - 6);

        [0, 15, 30].forEach(t => { ctx.fillStyle = '#3a3535'; ctx.font = '8px DM Mono, monospace'; ctx.textAlign = 'center'; ctx.fillText(t + 's', xPx(t), H - 5); });
    });
}

// ======== SYNESSO CHARTS ========

export function drawSynessoPressure() {
    const res = prepCanvas('synesso-pressure-chart'); // Remove fixed height
    if (!res) return;
    const { ctx, W, H } = res;
    const PAD = { l: 36, r: 16, t: 28, b: 32 };
    const { xPx, yPx } = drawAxes(ctx, W, H, PAD, 13, [0, 3, 6, 9, 12]);

    const [d0, d1, d2, d3] = STAGE_DUR.map(d => d * TOTAL_TIME);
    const stageBounds = [0, d0, d0 + d1, d0 + d1 + d2, TOTAL_TIME];
    const stageColors = ['#9b59b6', '#e67e22', '#e74c3c', '#e67e22'];
    const stageLabels = ['① 預浸', '② 過渡', '③ 主萃', '④ 收尾'];

    stageColors.forEach((color, i) => {
        const x1 = xPx(stageBounds[i]), x2 = xPx(stageBounds[i + 1]);
        ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = 0.06;
        ctx.fillRect(x1, PAD.t, x2 - x1, H - PAD.t - PAD.b); ctx.restore();
        ctx.fillStyle = color; ctx.font = '9px DM Mono, monospace'; ctx.textAlign = 'center'; ctx.globalAlpha = 0.7;
        ctx.fillText(stageLabels[i], (x1 + x2) / 2, PAD.t - 8); ctx.globalAlpha = 1;
    });

    const x2start = xPx(stageBounds[1]), x4end = xPx(stageBounds[4]);
    const bracketY = PAD.t - 16;
    ctx.save(); ctx.strokeStyle = '#e67e22'; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(xPx((stageBounds[1] + stageBounds[2]) / 2), bracketY + 5);
    ctx.lineTo(xPx((stageBounds[3] + stageBounds[4]) / 2), bracketY + 5);
    ctx.stroke();
    ctx.restore();

    const puck = mkCurve(t => puckResistance(t, state.synessoMethod));
    strokeLine(ctx, puck, N, xPx, yPx, '#c8a96e', 1.5, 0.65);

    const pressData = mkCurve(t => synessoP(t, state.syn));
    fillArea(ctx, pressData, N, xPx, yPx, '#e8e8e8', 0.07);
    strokeLine(ctx, pressData, N, xPx, yPx, '#e8e8e8', 2.2, 0.9);

    const pts = [
        { t: stageBounds[0], p: state.syn.p1, color: '#9b59b6' },
        { t: stageBounds[2], p: state.syn.p3, color: '#e74c3c' },
        { t: stageBounds[3], p: state.syn.p3, color: '#e74c3c' },
        { t: TOTAL_TIME, p: state.syn.p24, color: '#e67e22' },
    ];
    pts.forEach(({ t, p, color }) => {
        ctx.beginPath(); ctx.arc(xPx(t), yPx(p), 4, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
    });

    ctx.fillStyle = '#9b59b6'; ctx.font = 'bold 10px DM Mono, monospace'; ctx.textAlign = 'left';
    ctx.fillText(state.syn.p1 + ' bar', xPx(0) + 4, yPx(state.syn.p1) - 6);
    ctx.fillStyle = '#e74c3c'; ctx.textAlign = 'center';
    ctx.fillText(state.syn.p3 + ' bar', xPx((stageBounds[2] + stageBounds[3]) / 2), yPx(state.syn.p3) - 6);
    ctx.fillStyle = '#e67e22'; ctx.textAlign = 'right';
    ctx.fillText(state.syn.p24 + ' bar', xPx(TOTAL_TIME) - 4, yPx(state.syn.p24) - 6);
}

export function drawSynessoFlow() {
    const res = prepCanvas('synesso-flow-chart'); // Remove fixed height
    if (!res) return;
    const { ctx, W, H } = res;
    const PAD = { l: 36, r: 16, t: 14, b: 32 };
    const flowData = mkCurve(t => synessoFlow(t, state.synessoMethod, state.syn));
    const maxFlow = Math.max(...flowData, 5);
    const yMax = Math.ceil(maxFlow / 2) * 2;
    const { xPx, yPx } = drawAxes(ctx, W, H, PAD, yMax, [0, 2, 4, 6].filter(v => v <= yMax + 1));
    ctx.fillStyle = '#454040'; ctx.font = '9px DM Mono, monospace'; ctx.textAlign = 'left';
    ctx.fillText('ml/s', PAD.l - 32, PAD.t - 2);

    fillArea(ctx, flowData, N, xPx, yPx, '#27ae60', 0.12);
    strokeLine(ctx, flowData, N, xPx, yPx, '#27ae60', 2);

    ctx.save(); ctx.globalAlpha = 0.12; ctx.font = 'bold 18px DM Mono, monospace';
    ctx.fillStyle = '#c8a96e'; ctx.textAlign = 'center';
    ctx.fillText('ESTIMATED', W / 2, H / 2 + 7); ctx.restore();
}
