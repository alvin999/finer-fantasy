import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { InteractiveVideo } from './InteractiveVideo';

gsap.registerPlugin(ScrollTrigger);

export const ScrollyVideoWrapper: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [frame, setFrame] = useState(0);
    const totalFrames = 900;

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: '+=3000', // 滾動 3000px 來完成影片
                pin: true,
                scrub: true,
                onUpdate: (self) => {
                    // 將 0-1 的進度映射到 0-900 影格
                    const currentFrame = Math.floor(self.progress * (totalFrames - 1));
                    setFrame(currentFrame);
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} style={{ 
            height: '100vh', 
            width: '100vw', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#0d0d0d',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ width: '80%', maxWidth: '1200px', aspectRatio: '16/9' }}>
                <InteractiveVideo frame={frame} />
            </div>
            
            {/* 滾動提示 */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#c8a96e',
                fontSize: '14px',
                fontFamily: 'monospace',
                opacity: frame > 50 ? 0 : 0.6,
                transition: 'opacity 0.5s',
                pointerEvents: 'none'
            }}>
                ▼ SCROLL TO EXPLORE THE PUCK
            </div>
        </div>
    );
};
