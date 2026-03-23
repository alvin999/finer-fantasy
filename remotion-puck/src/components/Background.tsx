import { useCurrentFrame, useVideoConfig } from 'remotion';
import React, { useMemo } from 'react';
import { Theme } from '../Theme';

export const Background: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const particles = useMemo(() => {
        return Array.from({ length: 60 }).map((_, i) => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 0.5,
            a: Math.random() * 0.5 + 0.1,
        }));
    }, [width, height]);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            background: Theme.bg,
            overflow: 'hidden',
        }}>
            <svg width={width} height={height}>
                {particles.map((p, i) => {
                    // 根據 frame 計算位移
                    const x = (p.x + p.vx * frame) % width;
                    const y = (p.y + p.vy * frame) % height;
                    return (
                        <circle
                            key={i}
                            cx={x < 0 ? x + width : x}
                            cy={y < 0 ? y + height : y}
                            r={p.r}
                            fill={Theme.caramel}
                            opacity={p.a}
                        />
                    );
                })}
            </svg>
        </div>
    );
};
