import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import React from 'react';
import { Theme, Physics } from '../Theme';
import { PressureCurve } from './PressureCurve';

export const PuckSimulation: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height, fps } = useVideoConfig();

    const resistance = Physics.puckResistance(frame, 600); // 假設這段 600 frames
    const opacity = interpolate(resistance, [6, 15], [0.3, 1]);
    const arrowScale = interpolate(resistance, [6, 15], [0.5, 1.2]);

    // 水滴動畫 (Loop every 60 frames)
    const dropFrame = frame % 60;
    const dropY = interpolate(dropFrame, [0, 60], [150, 450]);
    const dropOpacity = interpolate(dropFrame, [0, 10, 50, 60], [0, 1, 1, 0]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '80%',
            height: '100%',
        }}>
            {/* 左側：物理示意圖 */}
            <div style={{ position: 'relative', width: 400, height: 600 }}>
                <svg viewBox="0 0 200 300" width="100%" height="100%">
                    {/* 沖煮頭 */}
                    <rect x="20" y="20" width="160" height="40" rx="4" fill={Theme.espresso} stroke={Theme.caramel} />
                    <text x="100" y="45" textAnchor="middle" fill={Theme.muted} fontSize="8">GROUP HEAD</text>

                    {/* 水滴 */}
                    <circle cx="100" cy={dropY / 2} r="3" fill="#64b5f6" opacity={dropOpacity} />

                    {/* 粉餅區域 */}
                    <rect x="30" y="80" width="140" height="100" rx="2" fill={`rgba(90,45,15,${opacity})`} stroke={Theme.caramel} strokeWidth="1" />
                    
                    {/* 壓力箭頭 (動態縮放) */}
                    <g transform={`translate(100, 130) scale(${arrowScale})`}>
                        <line x1="0" y1="-30" x2="0" y2="30" stroke={Theme.amber} strokeWidth="4" strokeLinecap="round" />
                        <path d="M -10 10 L 0 30 L 10 10" fill="none" stroke={Theme.amber} strokeWidth="4" strokeLinecap="round" />
                    </g>

                    {/* 底部濾網 */}
                    <rect x="30" y="180" width="140" height="10" rx="1" fill={Theme.espresso} />
                    
                    {/* 文字標籤 */}
                    <text x="100" y="220" textAnchor="middle" fill={Theme.amber} fontSize="14" fontWeight="bold">
                        阻力: {resistance.toFixed(1)} bar
                    </text>
                </svg>
            </div>

            {/* 右側：曲線動態 */}
            <div style={{ width: 600, height: 400, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 20, position: 'relative' }}>
                <h3 style={{ color: Theme.muted, margin: '0 0 20px 0', fontSize: 20 }}>假想壓力曲線 (Real-time)</h3>
                <div style={{ height: 300, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                    <PressureCurve width={560} height={300} />
                </div>
            </div>
        </div>
    );
};
