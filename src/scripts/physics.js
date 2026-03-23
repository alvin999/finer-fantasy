import { TOTAL_TIME, N, PUMP_MAX } from './state.js';

// ======== CALIBRATED PHYSICS ========

/**
 * 計算粉餅假想阻力
 * @param {number} t 當前時間 (s)
 * @param {string} method 佈粉手法 ('normal', 'heavy', 'uneven')
 * @returns {number} 阻力數值 (bar)
 */
export function puckResistance(t, method) {
    let base = 14.0 - 8.5 * (1 - Math.exp(-t / 12.0));
    if (method === 'heavy') base = Math.min(base * 1.08 + 0.5, 15.0);
    else if (method === 'uneven') {
        base = Math.max(base * 0.87 - 0.8 + (t > 7 ? Math.sin(t * 0.95) * 0.55 : 0), 4.0);
    }
    return Math.min(Math.max(base, 5.5), 15.0);
}

/**
 * 計算 Rotary/Vibe 泵浦的實際萃取壓力
 * @param {number} t 當前時間 (s)
 * @param {number} wd 10秒出水量 (g)
 * @param {string} method 佈粉手法
 * @param {string} machine 機器類型 ('rotary', 'vibe')
 * @param {number} headspace 粉頂空間 (mm)
 * @returns {number} 實際壓力 (bar)
 */
export function actualPressure(t, wd, method, machine, headspace = 2.0) {
    const maxP = PUMP_MAX[machine];
    const puck = puckResistance(t, method);
    const wdNorm = (wd - 60) / 40; // 0 at WD60, 1 at WD100
    const alpha = 0.55 + wdNorm * 0.44; // 0.55 at WD60, 0.99 at WD100

    // Headspace 造成的延遲 (大約 1mm = 2.6ml)
    const volToFill = headspace * 2.64;
    const flowRate = wd / 10; // 假設初始填充流速接近 WD/10
    const delay = volToFill / flowRate;

    const target = Math.min(puck, maxP);
    const tEff = Math.max(0, t - delay);
    const raw = target * (1 - Math.exp(-alpha * tEff / 1.0));
    let p = Math.min(raw, target);

    if (machine === 'vibe' && t > delay + 2) p += Math.sin(t * 2.8) * 0.13;
    if (method === 'uneven' && t > delay + 8) p *= (1 - 0.055 * Math.abs(Math.sin(t * 1.3)));

    return Math.min(Math.max(p, 0), maxP + 0.15);
}

/**
 * 生成數據曲線
 * @param {Function} fn 物理量計算函數
 * @returns {Array} 數值數組
 */
export function mkCurve(fn) { 
    return Array.from({ length: N }, (_, i) => fn(i * TOTAL_TIME / N)); 
}
