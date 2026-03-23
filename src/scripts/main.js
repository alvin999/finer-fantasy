import { state } from './state.js';
import { drawPressureChart, drawCompareChart, drawConceptChart, drawPuckAnimation } from './charts.js';
import { updateNarrative, toggleAnimation } from './ui.js';

// 將需要被 HTML 內聯屬性 (如 onclick) 呼叫的函數掛載到 window
window.switchMachine = function(machine, btn) {
    state.currentMachine = machine;
    document.querySelectorAll('.machine-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    if (!state.isPlaying) {
        setTimeout(() => { 
            redrawRV();
        }, 10);
    }
};

window.setMethod = function(method, btn) {
    state.currentMethod = method;
    document.querySelectorAll('#rv-methods .toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const info = {
        normal: '<strong>標準手法</strong>：WDT 佈粉 + 輕填壓，粉餅均勻，阻力曲線平滑穩定。',
        heavy: '<strong>重填壓</strong>：粉餅結構緊密，初期阻力略高。差異不如 WD 值明顯。',
        uneven: '<strong>佈粉不均</strong>：偏流（Channeling）導致阻力提前崩潰。'
    };
    const infoBox = document.getElementById('info-box');
    if (infoBox) infoBox.innerHTML = info[method];
    if (!state.isPlaying) redrawRV();
};

window.switchSubTab = function(name, tabEl) {
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
    const targetTab = document.getElementById('tab-' + name);
    if (targetTab) targetTab.classList.add('active');
    
    setTimeout(() => {
        if (name === 'pressure') drawPressureChart(1, (peak, dur) => updateNarrative(peak, dur));
        if (name === 'compare') drawCompareChart();
        if (name === 'concept') drawConceptChart();
    }, 10);
};

window.toggleAnimation = function() {
    toggleAnimation(redrawRV);
};

function redrawRV() {
    const active = document.querySelector('.tab-content.active');
    if (!active) return;
    if (active.id === 'tab-pressure') {
        drawPressureChart(1, (peak, dur) => updateNarrative(peak, dur));
        drawPuckAnimation(0);
    }
    if (active.id === 'tab-compare') drawCompareChart();
    if (active.id === 'tab-concept') drawConceptChart();
}

// 初始化
function initAll() {
    drawPressureChart(1, (peak, dur) => updateNarrative(peak, dur)); 
    drawPuckAnimation(0);
    drawCompareChart(); 
    drawConceptChart();
    
    // 滑動條事件
    const wdSlider = document.getElementById('wd-slider');
    if (wdSlider) {
        wdSlider.addEventListener('input', function() {
            state.currentWD = parseInt(this.value);
            const wdDisp = document.getElementById('wd-display');
            if (wdDisp) wdDisp.textContent = state.currentWD;
            if (!state.isPlaying) redrawRV();
        });
    }

    const hsSlider = document.getElementById('hs-slider');
    if (hsSlider) {
        hsSlider.addEventListener('input', function() {
            state.headspace = parseFloat(this.value);
            const hsDisp = document.getElementById('hs-display');
            if (hsDisp) hsDisp.textContent = state.headspace.toFixed(1);
            if (!state.isPlaying) redrawRV();
        });
    }

    // 視窗縮放
    window.addEventListener('resize', () => {
        if (!state.isPlaying) {
            redrawRV();
        }
    });
}

document.fonts.ready.then(initAll);
setTimeout(initAll, 80);
