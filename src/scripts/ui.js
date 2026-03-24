import { state, PUMP_MAX, TOTAL_TIME, N } from './state.js';
import { drawPressureChart, drawCompareChart, drawConceptChart, drawPuckAnimation } from './charts.js';
import { mkCurve, getSimulatedValue } from './physics.js';
import { t, initI18n } from './i18n.js';

// 初始化語系
initI18n();

// ======== NARRATIVE (RV) ========

export function updateNarrative(peak, dur) {
    const wd = state.currentWD;
    const maxP = PUMP_MAX[state.currentMachine];
    const narrativeEl = document.getElementById('narrative-text');
    if (!narrativeEl) return;

    let text = '';
    const params = { wd, peak: peak.toFixed(1), dur: dur.toFixed(1), maxP, hs: state.headspace, delay: (state.headspace * 2.64 / (wd / 10)).toFixed(1) };
    
    if (wd <= 68) text = t('narrative.low', params);
    else if (wd <= 88) text = t('narrative.medium', params);
    else text = t('narrative.high', params);

    if (state.currentMachine === 'vibe') text += t('narrative.vibe', params);
    else text += t('narrative.rotary', params);

    if (state.headspace > 2.5) {
        text += t('narrative.headspace', params);
    }

    let c = '', n = '';
    if (wd <= 68) { c = t('char.soft'); n = t('note.soft'); }
    else if (wd <= 88) { c = t('char.balanced'); n = t('note.balanced'); }
    else { c = t('char.strong'); n = t('note.strong'); }

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
    if (animLabel) animLabel.textContent = t('anim.pause');
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
    if (animLabel) animLabel.textContent = fin ? t('anim.replay') : t('anim.play');
    if (playIcon) playIcon.setAttribute('d', 'M3,1 L13,7 L3,13 Z');
    if (timeDisplay) timeDisplay.textContent = fin ? t('anim.done') : t('anim.ready');

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
