import { Series, useVideoConfig, useCurrentFrame, interpolate } from 'remotion';
import React from 'react';
import { Background } from './components/Background';
import { Gauge } from './components/Gauge';
import { PuckSimulation } from './components/PuckSimulation';
import { Theme } from './Theme';

export const PuckResistance: React.FC = () => {
    const { width, height } = useVideoConfig();

    return (
        <div style={{
            flex: 1,
            backgroundColor: Theme.bg,
            position: 'relative',
            color: Theme.text,
            fontFamily: "'Noto Serif TC', serif",
        }}>
            {/* 全域背景 */}
            <Background />

            {/* 教學分鏡 */}
            <Series>
                <Series.Sequence durationInFrames={150}>
                    <Intro />
                </Series.Sequence>
                <Series.Sequence durationInFrames={150}>
                    <GaugeSection />
                </Series.Sequence>
                <Series.Sequence durationInFrames={600}>
                    <SimulationSection />
                </Series.Sequence>
                <Series.Sequence durationInFrames={300}>
                    <Conclusion />
                </Series.Sequence>
            </Series>
        </div>
    );
};

const Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 40, 110, 150], [0, 1, 1, 0]);
    const y = interpolate(frame, [0, 40], [20, 0]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            opacity,
            transform: `translateY(${y}px)`,
        }}>
            <h1 style={{
                fontSize: 120,
                margin: 0,
                color: Theme.amber,
                letterSpacing: '0.15em',
                fontWeight: 900,
            }}>假想粉餅阻力</h1>
            <div style={{ width: 200, height: 4, backgroundColor: Theme.caramel, margin: '40px 0' }} />
            <p style={{
                fontSize: 50,
                opacity: 0.8,
                letterSpacing: '0.2em',
                color: Theme.muted,
            }}>讀懂壓力的語言</p>
        </div>
    );
};

const GaugeSection: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <h2 style={{ fontSize: 40, color: Theme.muted, marginBottom: 40 }}>觀察：壓力表的細微波動</h2>
            <Gauge />
        </div>
    );
};

const SimulationSection: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
            <PuckSimulation />
        </div>
    );
};

const Conclusion: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 50], [0, 1]);
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            opacity,
            textAlign: 'center',
        }}>
            <div style={{
                position: 'absolute',
                fontSize: 400,
                color: 'rgba(184, 103, 30, 0.05)',
                zIndex: -1,
            }}>∞</div>
            <h2 style={{ fontSize: 80, color: Theme.amber, marginBottom: 20 }}>假想粉餅阻力</h2>
            <p style={{ fontSize: 40, color: Theme.caramel }}>是讀懂壓力的語言</p>
            <div style={{ width: 300, height: 2, backgroundColor: 'rgba(242, 236, 224, 0.2)', margin: '40px 0' }} />
            <p style={{ fontSize: 24, color: Theme.muted, lineHeight: 1.6 }}>
                均勻度影響曲線形狀<br />
                WD 值決定曲線高低<br />
                每次萃取，都是一條獨特的故事
            </p>
        </div>
    );
};
