import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import React from 'react';
import { Theme } from '../Theme';

export const Gauge: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 模擬指針的微小跳動 (Noise)
    const noise = Math.sin(frame * 0.5) * 2 + Math.cos(frame * 0.3) * 1.5;
    const baseValue = 9;
    const value = baseValue + (frame > 20 ? noise * 0.2 : 0);

    // 進場動畫: 從 0 彈到 9
    const entrance = spring({
        frame,
        fps,
        config: {
            stiffness: 100,
        },
    });

    const angle = interpolate(entrance * value, [0, 15], [-90, 90]);

    return (
        <div style={{ position: 'relative', width: 400, height: 400 }}>
            <svg viewBox="0 0 200 200" width="100%" height="100%">
                {/* 錶盤背景 */}
                <circle cx="100" cy="100" r="90" fill="rgba(61,31,13,0.3)" stroke={Theme.caramel} strokeWidth="1" />
                <circle cx="100" cy="100" r="82" fill="none" stroke={Theme.muted} strokeWidth="0.5" strokeDasharray="2,4" />

                {/* 刻度 */}
                {[0, 3, 6, 9, 12, 15].map(v => {
                    const a = (v / 15) * 180 - 180;
                    const x1 = 100 + Math.cos((a * Math.PI) / 180) * 75;
                    const y1 = 100 + Math.sin((a * Math.PI) / 180) * 75;
                    const x2 = 100 + Math.cos((a * Math.PI) / 180) * 85;
                    const y2 = 100 + Math.sin((a * Math.PI) / 180) * 85;
                    return (
                        <g key={v}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={Theme.amber} strokeWidth="2" />
                            <text
                                x={100 + Math.cos((a * Math.PI) / 180) * 60}
                                y={100 + Math.sin((a * Math.PI) / 180) * 60 + 5}
                                textAnchor="middle"
                                fill={Theme.muted}
                                fontSize="10"
                                fontFamily="monospace"
                            >{v}</text>
                        </g>
                    );
                })}

                {/* 指針 */}
                <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.1s linear' }}>
                    <line x1="100" y1="100" x2="100" y2="30" stroke={Theme.amber} strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="100" r="8" fill={Theme.amber} />
                </g>

                {/* 數字顯示 */}
                <text x="100" y="140" textAnchor="middle" fill={Theme.text} fontSize="24" fontWeight="bold" fontFamily="monospace">
                    {value.toFixed(1)}
                </text>
                <text x="100" y="160" textAnchor="middle" fill={Theme.muted} fontSize="12" letterSpacing="2">BAR</text>
            </svg>
        </div>
    );
};
