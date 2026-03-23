/**
 * Learning Astro 頁面的工具函數與繪圖邏輯
 */

export const setupCanvas = (id: string) => {
    const c = document.getElementById(id) as HTMLCanvasElement;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return { c: null, ctx: null, w: 0, h: 0 };
    const dpr = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    ctx.scale(dpr, dpr);
    return { c, ctx, w: r.width, h: r.height };
};

export const puckCurve = (t: number) => {
    if (t < 0.2) return 15;
    if (t > 0.8) return 6;
    return 15 - (t - 0.2) * (1 / 0.6) * 9;
};

export const drawPuckCurve = (progress: number) => {
    const { ctx, w, h } = setupCanvas("puck-canvas");
    if (!ctx) return;
    const pad = { l: 40, r: 20, t: 20, b: 20 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    for (let i = 0; i <= 100 * progress; i++) {
        const t = i / 100;
        const x = pad.l + t * cw;
        const y = pad.t + ch * (1 - (puckCurve(t) - 6) / (15 - 6));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const lg = ctx.createLinearGradient(pad.l, 0, pad.l + cw, 0);
    lg.addColorStop(0, "#f0b84a"); lg.addColorStop(1, "#7a3012");
    ctx.strokeStyle = lg; ctx.lineWidth = 2.5; ctx.stroke();
    if (progress > 0.01) {
        const t = progress;
        const x = pad.l + t * cw, y = pad.t + ch * (1 - (puckCurve(t) - 6) / (15 - 6));
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#f0b84a"; ctx.fill();
    }
};

export const drawWDChart = (progress: number) => {
    const { ctx, w, h } = setupCanvas("wd-canvas");
    if (!ctx) return;
    const pad = { l: 40, r: 20, t: 15, b: 20 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    ctx.clearRect(0, 0, w, h);
    function wdHigh(t: number) { return t < 0.15 ? 6 + 9 * Math.pow(t / 0.15, 0.5) : puckCurve(t) * 0.97 + 0.3; }
    function wdLow(t: number) { return t < 0.4 ? 6 + 5 * Math.pow(t / 0.4, 0.7) : Math.max(6, 6 + 5 * (1 - (t - 0.4) * 0.3)); }
    ctx.setLineDash([4, 4]); ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const t = i / 100, x = pad.l + t * cw, y = pad.t + ch * (1 - (puckCurve(t) - 6) / (15 - 6));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(184,103,30,0.3)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath();
    for (let i = 0; i <= 100 * progress; i++) {
        const t = i / 100, x = pad.l + t * cw, y = pad.t + ch * (1 - (wdHigh(t) - 6) / (15 - 6));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#f0b84a"; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 100 * progress; i++) {
        const t = i / 100, x = pad.l + t * cw, y = pad.t + ch * (1 - (wdLow(t) - 6) / (15 - 6));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(139,115,85,0.65)"; ctx.lineWidth = 2; ctx.stroke();
};

export const drawDurChart = (progress: number) => {
    const { ctx, w, h } = setupCanvas("dur-canvas");
    if (!ctx) return;
    const pad = { l: 10, r: 10, t: 15, b: 30 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    ctx.clearRect(0, 0, w, h);
    function wdHigh(t: number) { return t < 0.15 ? 6 + 9 * Math.pow(t / 0.15, 0.5) : puckCurve(t) * 0.97 + 0.3; }
    function wdLow(t: number) { return t < 0.4 ? 6 + 5 * Math.pow(t / 0.4, 0.7) : Math.max(6, 6 + 5 * (1 - (t - 0.4) * 0.3)); }
    ctx.beginPath();
    for (let i = 0; i <= 100 * progress; i++) {
        const t = i / 100, x = pad.l + t * cw, y = pad.t + ch * (1 - (wdHigh(t) - 6) / (15 - 6));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#f0b84a"; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 100 * progress; i++) {
        const t = i / 100, x = pad.l + t * cw, y = pad.t + ch * (1 - (wdLow(t) - 6) / (15 - 6));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(139,115,85,0.7)"; ctx.lineWidth = 2; ctx.stroke();
};

export const drawHSChart = (progress: number) => {
    const { ctx, w, h } = setupCanvas("hs-canvas");
    if (!ctx) return;
    const pad = { l: 40, r: 20, t: 15, b: 15 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    ctx.clearRect(0, 0, w, h);
    function hsSmall(t: number) { return t < 0.12 ? 6 + 9 * Math.pow(t / 0.12, 0.6) : puckCurve(t) * 0.97 + 0.3; }
    function hsLarge(t: number) {
        const ts = Math.max(0, t - 0.22);
        return ts < 0.001 ? 6 : (ts < 0.15 ? 6 + 8 * Math.pow(ts / 0.15, 0.6) : Math.max(6, puckCurve(ts) * 0.9 + 0.5));
    }
    ctx.beginPath();
    for (let i = 0; i <= 100 * progress; i++) {
        const t = i / 100, x = pad.l + t * cw, y = pad.t + ch * (1 - (hsSmall(t) - 6) / (15 - 6));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#f0b84a"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 100 * progress; i++) {
        const t = i / 100, x = pad.l + t * cw, y = pad.t + ch * (1 - (hsLarge(t) - 6) / (15 - 6));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(139,115,85,0.65)"; ctx.lineWidth = 2; ctx.stroke();
};

export const drawABChart = (progress: number) => {
    const { ctx, w, h } = setupCanvas("ab-canvas");
    if (!ctx) return;
    const pad = { l: 60, r: 20, t: 15, b: 40 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    ctx.clearRect(0, 0, w, h);
    const items = [
        { label: "WD 值", val: 73, color: "#f0b84a" },
        { label: "Headspace", val: 55, color: "rgba(184,103,30,0.65)" },
        { label: "填壓力道", val: 30, color: "rgba(184,103,30,0.5)" },
        { label: "佈粉均勻度", val: 90, color: "rgba(184,103,30,0.38)" }
    ];
    items.forEach((item, i) => {
        const y = pad.t + i * (26 + 16);
        ctx.fillStyle = "rgba(61,31,13,0.4)"; ctx.fillRect(pad.l, y, cw, 26);
        ctx.fillStyle = item.color; ctx.fillRect(pad.l, y, cw * (item.val / 100) * progress, 26);
        ctx.fillStyle = "rgba(242,236,224,0.8)"; ctx.font = "11px Noto Serif TC"; ctx.textAlign = "right"; ctx.fillText(item.label, pad.l - 8, y + 17);
    });
};
