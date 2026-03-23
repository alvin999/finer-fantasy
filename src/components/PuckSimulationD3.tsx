import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
// @ts-ignore
import { actualPressure } from '../scripts/physics';

interface Props {
    // 供 Astro 使用的進度更新介面
}

export const PuckSimulationD3: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState({
        progress: 0,
        wd: 80,
        method: 'normal',
        machine: 'rotary',
        headspace: 2.0
    });

    useEffect(() => {
        // 向全域註冊更新函數
        (window as any).updatePuckR3F = (p: number, s: any) => {
            if (s) {
                setData({
                    progress: p,
                    wd: s.currentWD,
                    method: s.currentMethod,
                    machine: s.currentMachine,
                    headspace: s.headspace
                });
            } else {
                setData(prev => ({ ...prev, progress: p }));
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 處理畫布解析度 (DPR)
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        if (canvas.width !== displayWidth * dpr) {
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const { progress, wd, method, machine, headspace } = data;
        const width = displayWidth;
        const height = displayHeight;
        const margin = { top: 40, right: 100, bottom: 20, left: 30 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const time = progress * 30; // TOTAL_TIME = 30s
        const pressure = actualPressure(time, wd, method, machine, headspace);

        // 時間與狀態計算
        const fillTime = (headspace * 2.64) / (wd / 10 || 1);
        const isFilling = time < fillTime;
        const fillProgress = Math.min(1, time / fillTime);
        const saturationProgress = time <= fillTime ? 0 : Math.min(1, (time - fillTime) / 12); 

        // 清除畫布
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(margin.left, margin.top);

        const centerX = innerWidth / 2;
        const basketW = innerWidth * 0.8;
        
        // --- 動態高度計算 (固定籃筐高度 = innerHeight * 0.8) ---
        const totalBasketH = innerHeight * 0.8;
        const maxHS = 5; // 假設最大 5mm
        const hsH = (headspace / maxHS) * (totalBasketH * 0.4); // Headspace 佔最多 40%
        const puckH = totalBasketH - hsH; // 剩下的就是粉餅高度

        // 1. Group Head & Shower Screen
        ctx.fillStyle = '#2c3e50';
        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.fillRect(centerX - basketW/2 - 5, -25, basketW + 10, 25);
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#95a5a6';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('GROUP HEAD', centerX + basketW/2 + 15, -12);

        // 2. Headspace (水流填充)
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - basketW/2, 0, basketW, hsH);
        
        if (progress > 0) {
            const waterLevel = hsH * fillProgress;
            ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
            ctx.fillRect(centerX - basketW/2, 0, basketW, waterLevel);
            
            // 標註水流
            ctx.fillStyle = '#3498db';
            ctx.font = '9px Inter';
            ctx.fillText('WATER FLOW', centerX + basketW/2 + 15, hsH / 2);
        }

        // 3. Coffee Puck
        const puckY = hsH;
        ctx.strokeStyle = '#555';
        ctx.strokeRect(centerX - basketW/2, puckY, basketW, puckH);

        // 乾粉底色
        ctx.fillStyle = '#4b3621';
        ctx.fillRect(centerX - basketW/2, puckY, basketW, puckH);

        // 飽和進度
        if (saturationProgress > 0) {
            const satH = puckH * saturationProgress;
            const puckGrad = ctx.createLinearGradient(0, puckY, 0, puckY + satH);
            puckGrad.addColorStop(0, '#1c0f06'); // 出水口處更深
            puckGrad.addColorStop(1, '#3d2b1f');
            ctx.fillStyle = puckGrad;
            ctx.fillRect(centerX - basketW/2, puckY, basketW, satH);

            // 壓力漸層遮罩 (展現壓力的視覺化)
            const pressOpacity = Math.min(0.6, pressure / 15);
            ctx.fillStyle = `rgba(240, 184, 74, ${pressOpacity * 0.3})`;
            ctx.fillRect(centerX - basketW/2, puckY, basketW, satH);

            // 微粒子流
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            for(let i=0; i< (saturationProgress < 1 ? 15 : 5); i++) {
                const px = centerX - basketW/2 + (Math.sin(time*2 + i) * 0.5 + 0.5) * basketW;
                const py = puckY + ((time + i*0.5) % 1) * satH;
                ctx.beginPath(); ctx.arc(px, py, 1, 0, Math.PI*2); ctx.fill();
            }
        }
        
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 10px Inter';
        ctx.fillText('COFFEE PUCK', centerX + basketW/2 + 15, puckY + puckH / 2);

        // 4. Extraction & Drips
        if (saturationProgress >= 1) {
            const basketBottomY = puckY + puckH;
            for(let i=0; i<4; i++) {
                const dripShift = (time * 1.5 + i * 0.25) % 1;
                const dx = centerX - basketW/3 + i * (basketW/3 * 0.6);
                const dy = basketBottomY + dripShift * 15;
                ctx.fillStyle = `rgba(61, 31, 13, ${1 - dripShift})`;
                ctx.beginPath(); ctx.arc(dx, dy, 2.5, 0, Math.PI*2); ctx.fill();
            }
        }

        // 5. Status Text
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`${pressure.toFixed(1)} BAR`, centerX + basketW/2 + 15, puckY + puckH + 15);

        ctx.restore();
    }, [data]);

    return (
        <div style={{ width: '100%', padding: '10px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
            <canvas 
                ref={canvasRef} 
                width={800} 
                height={320} 
                style={{ width: '100%', height: '160px' }} 
            />
        </div>
    );
};
