import { TOTAL_TIME, N, PUMP_MAX } from './state.js';

// ======== 上帝視角 (Static) + 跟隨者 (Follower) 模型 ========

/**
 * 計算粉餅本質強度 (上帝視角 - 黃線)
 * @param {number} t 當前時間 (s)
 * @param {string} method 佈粉手法
 * @returns {number} 阻力上限 (bar)
 */
export function puckResistance(t, method) {
    let base = 13.5 * (0.45 + 0.55 * Math.exp(-t / 14.0));
    if (method === 'heavy') base = 15.0 * (0.5 + 0.5 * Math.exp(-t / 18.0));
    else if (method === 'uneven') {
        base = 11.5 * (0.35 + 0.65 * Math.exp(-t / 10.0));
        // 額外的隨機脆弱性 (上帝視角的基石就在崩潰)
        if (t > 8) base *= (1 - 0.08 * Math.abs(Math.sin(t * 1.5)));
    }
    return Math.min(Math.max(base, 4.0), 15.0);
}

/**
 * 執行即時模擬 (上帝視角 vs 跟隨者)
 * @param {object} s 當前狀態 (state)
 * @returns {object} 模擬結果
 */
export function runExtractionSimulation(s) {
    const { currentWD: wd, currentMethod: method, currentMachine: machine, headspace } = s;
    const P_pump = PUMP_MAX[machine];
    const dt = TOTAL_TIME / N;
    
    // 1. 延遲 (由 Headspace 體積與流速決定)
    const V_hs_max = headspace * 2.64;
    const delay = V_hs_max / (wd / 10);
    
    // 2. 爬壓斜率與跟隨效應參數
    // WD 越大，爬升越快 (alpha 越大)，且最終壓力越接近黃線 (scaling 越大)
    const wdNorm = (wd - 60) / 40; // 0 to 1
    const alpha = 0.55 + wdNorm * 0.75; // 0.55 ~ 1.3 (爬坡陡度)
    const follower_scaling = 0.65 + wdNorm * 0.35; // 0.65 ~ 1.0 (跟隨程度)

    let pressures = [];
    let flows = [];
    let puckResistances = []; // 黃線數據

    for (let i = 0; i < N; i++) {
        const t = i * dt;
        
        // 黃線：靜態公式，不受任何機器參數影響
        const p_hypo = puckResistance(t, method);
        puckResistances.push(p_hypo);

        let p_actual = 0;
        if (t > delay) {
            const tEff = t - delay;
            // 紅線目標值：受限於上帝視角 (黃線) 且隨 WD 縮放
            const target = Math.min(P_pump, p_hypo * follower_scaling);
            
            // 使用飽和曲線模擬爬坡 (斜率由 alpha 控制)
            p_actual = target * (1 - Math.exp(-alpha * tEff / 0.85));
            
            // 佈粉不均的微觀擾動
            if (method === 'uneven' && tEff > 2) {
                p_actual *= (1 - 0.12 * Math.abs(Math.sin(t * 1.5)));
            }
        }

        // Vibe Pump 震盪特性
        if (machine === 'vibe' && p_actual > 0.6) {
            p_actual += Math.sin(t * 3.8) * 0.13;
        }

        pressures.push(Math.min(Math.max(p_actual, 0), P_pump + 0.15));
        
        // 虛擬流量：壓力越高，流量越大 (簡化模型)
        const q = p_actual > 0 ? (wd/10) * (p_actual/P_pump) * 1.1 : 0;
        flows.push(q);
    }

    return { pressures, flows, puckResistances, delay };
}

/**
 * 取得模擬曲線特定時間的值 (查表法)
 */
export function getSimulatedValue(t, dataArray) {
    if (!dataArray || dataArray.length === 0) return 0;
    const idx = Math.min(Math.floor((t / TOTAL_TIME) * N), N - 1);
    return dataArray[idx];
}

/**
 * [兼容性用] 計算單點壓力
 */
export function actualPressure(t, wd, method, machine, headspace) {
    const sim = runExtractionSimulation({ currentWD: wd, currentMethod: method, currentMachine: machine, headspace });
    return getSimulatedValue(t, sim.pressures);
}

/**
 * 生成數據曲線
 */
export function mkCurve(fn) { 
    return Array.from({ length: N }, (_, i) => fn(i * TOTAL_TIME / N)); 
}
