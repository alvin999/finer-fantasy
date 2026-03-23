import { state, PUMP_MAX, TOTAL_TIME, N } from './state.js';
import { drawPressureChart, drawCompareChart, drawConceptChart, drawPuckAnimation } from './charts.js';
import { mkCurve, getSimulatedValue } from './physics.js';

// ======== NARRATIVE (RV) ========

export function updateNarrative(peak, dur) {
    const wd = state.currentWD;
    const maxP = PUMP_MAX[state.currentMachine];
    const narrativeEl = document.getElementById('narrative-text');
    if (!narrativeEl) return;

    let text = '';
    if (wd <= 68) text = `<strong>WD ${wd} — 低流量</strong>：水流緩，壓力爬升慢，峰值 <em>${peak.toFixed(1)} bar</em>，高壓維持 <em>${dur.toFixed(1)} 秒</em>。風味溫和、甜感明顯，Body 較低。`;
    else if (wd <= 88) text = `<strong>WD ${wd} — 中等流量</strong>：曲線平衡，峰值 <em>${peak.toFixed(1)} bar</em>，高壓維持 <em>${dur.toFixed(1)} 秒</em>。甜感、酸度與醇厚度取得較佳平衡。`;
    else text = `<strong>WD ${wd} — 高流量</strong>：迅速追上粉餅阻力，峰值 <em>${peak.toFixed(1)} bar</em>，高壓持續 <em>${dur.toFixed(1)} 秒</em>。萃取效率高，風味鮮明強烈。`;

    if (state.currentMachine === 'vibe') text += ` <strong>Vibration Pump</strong> 最高可達 ${maxP} bar，曲線略有震動特性。`;
    else text += ` <strong>Rotary Pump</strong> 定壓 ${maxP} bar，曲線穩定平滑。`;

    if (state.headspace > 2.5) {
        text += ` <br><br>較大的 <strong>Headspace (${state.headspace}mm)</strong> 增加了注水填滿時間，形成了約 ${(state.headspace * 2.64 / (wd / 10)).toFixed(1)} 秒的自然預浸效果，延緩了壓力爬升。`;
    }

    let c = '', n = '';
    if (wd <= 68) { c = '柔和'; n = '酸明、Body 輕'; }
    else if (wd <= 88) { c = '均衡'; n = '甜酸醇平衡'; }
    else { c = '強烈'; n = '鮮明、醇厚'; }

    const charEl = document.getElementById('stat-character');
    const noteEl = document.getElementById('stat-note');
    if (charEl) charEl.textContent = c;
    if (noteEl) noteEl.textContent = n;
    narrativeEl.innerHTML = text;
}

// ======== ANIMATION ========

export function toggleAnimation(redrawRV) {
    state.isPlaying ? stopAnimation() : startAnimation(redrawRV);
}

export function startAnimation(redrawRV) {
    state.isPlaying = true;
    state.animProgress = 0;

    const animBtn = document.getElementById('animate-btn');
    const animLabel = document.getElementById('animate-label');
    const playIcon = document.getElementById('play-icon');
    const timeDisplay = document.getElementById('time-display');

    if (animBtn) animBtn.classList.add('playing');
    if (animLabel) animLabel.textContent = '暫停';
    if (playIcon) playIcon.setAttribute('d', 'M2,1 L5,1 L5,13 L2,13 Z M9,1 L12,1 L12,13 L9,13 Z');

    function step() {
        if (!state.isPlaying) return;
        state.animProgress = Math.min(state.animProgress + 1 / (N * 2.0), 1);

        drawPressureChart(state.animProgress, (peak, dur) => {
            const peakEl = document.getElementById('stat-peak');
            const durEl = document.getElementById('stat-duration');
            const wdEl = document.getElementById('stat-wd');

            if (peakEl) {
                peakEl.textContent = peak.toFixed(1);
                const maxP = PUMP_MAX[state.currentMachine];
                peakEl.className = 'stat-value ' + (peak >= maxP - 0.2 ? 'high' : peak > 7 ? 'medium' : 'low');
            }
            if (durEl) durEl.textContent = dur.toFixed(1);
            if (wdEl) wdEl.textContent = state.currentWD;

            const rtEl = document.getElementById('stat-realtime');
            if (rtEl) {
                const t = state.animProgress * TOTAL_TIME;
                const curP = getSimulatedValue(t, state.simulation.pressures);
                rtEl.textContent = curP.toFixed(1);
            }

            updateNarrative(peak, dur);
            drawPuckAnimation(state.animProgress);
            if (window.updatePuckR3F) window.updatePuckR3F(state.animProgress, state);
        });

        if (timeDisplay) {
            timeDisplay.textContent = (state.animProgress * TOTAL_TIME).toFixed(1) + 's / ' + TOTAL_TIME + 's';
        }

        if (state.animProgress < 1) {
            state.animFrame = requestAnimationFrame(step);
        } else {
            stopAnimation(true);
        }
    }
    state.animFrame = requestAnimationFrame(step);
}

export function stopAnimation(fin) {
    state.isPlaying = false;
    cancelAnimationFrame(state.animFrame);

    const animBtn = document.getElementById('animate-btn');
    const animLabel = document.getElementById('animate-label');
    const playIcon = document.getElementById('play-icon');
    const timeDisplay = document.getElementById('time-display');

    if (animBtn) animBtn.classList.remove('playing');
    if (animLabel) animLabel.textContent = fin ? '重新播放' : '播放萃取過程';
    if (playIcon) playIcon.setAttribute('d', 'M3,1 L13,7 L3,13 Z');
    if (timeDisplay) timeDisplay.textContent = fin ? '萃取完成 ✓' : '準備就緒';

    if (!fin) {
        state.animProgress = 0;
        drawPressureChart(1, (peak, dur) => updateStats(peak, dur));
        drawPuckAnimation(0);
        if (window.updatePuckR3F) window.updatePuckR3F(0, state);
        const rtEl = document.getElementById('stat-realtime');
        if (rtEl) rtEl.textContent = '0.0';
    }
}

function updateStats(peak, dur) {
    const peakEl = document.getElementById('stat-peak');
    const durEl = document.getElementById('stat-duration');
    const wdEl = document.getElementById('stat-wd');

    if (peakEl) {
        peakEl.textContent = peak.toFixed(1);
        const maxP = PUMP_MAX[state.currentMachine];
        peakEl.className = 'stat-value ' + (peak >= maxP - 0.2 ? 'high' : peak > 7 ? 'medium' : 'low');
    }
    if (durEl) durEl.textContent = dur.toFixed(1);
    if (wdEl) wdEl.textContent = state.currentWD;

    const rtEl = document.getElementById('stat-realtime');
    if (rtEl) {
        const t = state.animProgress * TOTAL_TIME;
        const curP = getSimulatedValue(t, state.simulation.pressures);
        rtEl.textContent = curP.toFixed(1);
    }
    updateNarrative(peak, dur);
}
