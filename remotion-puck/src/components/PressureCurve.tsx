import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import React, { useMemo } from 'react';
import { Theme, Physics } from '../Theme';

export const PressureCurve: React.FC<{ width: number, height: number }> = ({ width, height }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= frame; i++) {
            const val = Physics.puckResistance(i, 600);
            pts.push({ x: (i / 600) * width, y: height - ((val - 6) / (15 - 6)) * height });
        }
        return pts;
    }, [frame, width, height]);

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
            {/* 10 bar 基準線 */}
            <line 
                x1="0" y1={height - ((10 - 6) / (15 - 6)) * height} 
                x2={width} y2={height - ((10 - 6) / (15 - 6)) * height} 
                stroke={Theme.muted} 
                strokeDasharray="4,4" 
                opacity="0.5" 
            />
            <text x={width - 40} y={height - ((10 - 6) / (15 - 6)) * height - 8} fill={Theme.muted} fontSize="10">10 BAR</text>

            {/* 曲線路徑 */}
            <path
                d={pathData}
                fill="none"
                stroke={Theme.amber}
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* 當前點 */}
            {points.length > 0 && (
                <circle 
                    cx={points[points.length - 1].x} 
                    cy={points[points.length - 1].y} 
                    r="5" 
                    fill={Theme.amber} 
                    style={{ filter: 'drop-shadow(0 0 5px rgba(240,184,74,0.8))' }}
                />
            )}
        </svg>
    );
};
