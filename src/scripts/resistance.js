
// src/resistance.js
// 資深工程師提示：這裡我們模擬 Remotion 的 Composition 概念
// 使用 GSAP 處理補間動畫 (Tweens)，模擬粉餅結構在萃取過程中的動態變化。

export function initResistance() {
    const grainContainer = document.getElementById('puck-grains');
    if (!grainContainer) return;

    // 清空並重新生成顆粒 (10x8 網格)
    grainContainer.innerHTML = '';
    for (let i = 0; i < 80; i++) {
        const grain = document.createElement('div');
        grain.className = 'grain';
        grainContainer.appendChild(grain);
    }
}

window.playResistanceDemo = function() {
    const grains = document.querySelectorAll('.grain');
    const water = document.getElementById('water-head');
    const progress = document.getElementById('timeline-progress');
    const frameCounter = document.getElementById('res-frame');
    const statusText = document.getElementById('res-status');

    // 重置狀態
    initResistance();
    gsap.set(water, { height: 0, opacity: 1 });
    gsap.set(progress, { width: '0%' });
    statusText.textContent = 'Status: INITIALIZING';
    frameCounter.textContent = 'Frame: 0';

    const tl = gsap.timeline({
        onUpdate: function() {
            const frame = Math.floor(tl.progress() * 300); // 模擬 300 影格 (10秒 @ 30fps)
            frameCounter.textContent = `Frame: ${frame}`;
            gsap.set(progress, { width: (tl.progress() * 100) + '%' });
        },
        onStart: () => {
            statusText.textContent = 'Status: WATER CONTACT';
        },
        onComplete: () => {
            statusText.textContent = 'Status: EXTRACTION COMPLETE';
        }
    });

    // 1. 水頭下降
    tl.to(water, { height: '100%', duration: 1.5, ease: 'power1.inOut' });

    // 2. 顆粒逐層浸潤與阻力演進
    // 每一層顆粒 (10個) 依序變色
    for (let row = 0; row < 8; row++) {
        const rowGrains = Array.from(grains).slice(row * 10, (row + 1) * 10);
        tl.to(rowGrains, {
            backgroundColor: '#1a0f08', // 變深，表示濕潤
            duration: 0.4,
            stagger: 0.05,
            ease: 'none'
        }, `-=0.2`);
    }

    // 3. 模擬可溶物釋出 (顏色變淡)
    tl.to(grains, {
        backgroundColor: '#5d4037', // 萃取後的淺色
        duration: 3,
        stagger: {
            each: 0.02,
            from: 'top'
        },
        onStart: () => {
            statusText.textContent = 'Status: SOLUBLES EXTRACTION';
        }
    }, '+=0.5');

    // 4. 模擬阻力崩解 (部分顆粒偏移或消失)
    tl.to(grains, {
        opacity: 0.3,
        scale: 0.8,
        duration: 2,
        stagger: {
            amount: 1.5,
            grid: [8, 10],
            from: 'center'
        },
        onStart: () => {
            statusText.textContent = 'Status: RESISTANCE DECAY / CHANNELING';
        }
    }, '-=1.5');
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initResistance();
});
