import { state } from './state.js';
import { drawPressureChart, drawCompareChart, drawConceptChart, drawSynessoPressure, drawSynessoFlow, drawPuckAnimation } from './charts.js';
import { updateNarrative, updateSynessoStats, toggleAnimation, stopAnimation } from './ui.js';

// 將需要被 HTML 內聯屬性 (如 onclick) 呼叫的函數掛載到 window
window.switchMachine = function(machine, btn) {
    state.currentMachine = machine;
    document.querySelectorAll('.machine-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    const isSyn = machine === 'synesso';
    const isRes = machine === 'resistance';
    
    document.getElementById('panel-rv').style.display = (isSyn || isRes) ? 'none' : '';
    document.getElementById('panel-synesso').style.display = isSyn ? 'flex' : 'none';
    document.getElementById('panel-resistance').style.display = isRes ? 'flex' : 'none';
    
    document.getElementById('subtabs-rv').style.display = (isSyn || isRes) ? 'none' : '';
    document.getElementById('synesso-charts').style.display = isSyn ? 'flex' : 'none';
    document.getElementById('resistance-charts').style.display = isRes ? 'flex' : 'none';
    
    if (!state.isPlaying) {
        setTimeout(() => { 
            if (isSyn) {
                drawSynessoPressure(); 
                drawSynessoFlow(); 
                updateSynessoStats();
            } else {
                redrawRV();
            }
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
    document.getElementById('info-box').innerHTML = info[method];
    if (!state.isPlaying) redrawRV();
};

window.setSynessoMethod = function(method, btn) {
    state.synessoMethod = method;
    document.querySelectorAll('#syn-methods .toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    drawSynessoPressure(); 
    drawSynessoFlow(); 
    updateSynessoStats();
};

window.updateSynesso = function() {
    state.syn.p1 = parseFloat(document.getElementById('s1').value);
    state.syn.p24 = parseFloat(document.getElementById('s24').value);
    state.syn.p3 = parseFloat(document.getElementById('s3').value);
    
    document.getElementById('s1-val').innerHTML = state.syn.p1 + ' <small style="font-size:10px; color:var(--muted)">bar</small>';
    document.getElementById('s24-val').innerHTML = state.syn.p24 + ' <small style="font-size:10px; color:var(--muted)">bar</small>';
    document.getElementById('s3-val').innerHTML = state.syn.p3 + ' <small style="font-size:10px; color:var(--muted)">bar</small>';
    
    drawSynessoPressure(); 
    drawSynessoFlow(); 
    updateSynessoStats();
};

window.switchSubTab = function(name, tabEl) {
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
    document.getElementById('tab-' + name).classList.add('active');
    
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
    drawSynessoPressure(); 
    drawSynessoFlow(); 
    updateSynessoStats();
    
    // 滑動條事件
    const wdSlider = document.getElementById('wd-slider');
    if (wdSlider) {
        wdSlider.addEventListener('input', function() {
            state.currentWD = parseInt(this.value);
            document.getElementById('wd-display').textContent = state.currentWD;
            if (!state.isPlaying) redrawRV();
        });
    }

    const hsSlider = document.getElementById('hs-slider');
    if (hsSlider) {
        hsSlider.addEventListener('input', function() {
            state.headspace = parseFloat(this.value);
            document.getElementById('hs-display').textContent = state.headspace.toFixed(1);
            if (!state.isPlaying) redrawRV();
        });
    }

    // 視窗縮放
    window.addEventListener('resize', () => {
        if (!state.isPlaying) {
            if (state.currentMachine === 'synesso') { 
                drawSynessoPressure(); 
                drawSynessoFlow(); 
            } else {
                redrawRV();
            }
        }
    });
}

document.fonts.ready.then(initAll);
setTimeout(initAll, 80);
