import * as React from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { PuckSimulation } from '../remotion/components/PuckSimulation';

// 我們需要一個只顯示左側物理示意圖的包裝，或者直接在組件內判斷
// 這裡我們先建立一個簡單的包裝器
export const RemotionPuckSim: React.FC = () => {
    const playerRef = React.useRef<PlayerRef>(null);

    React.useEffect(() => {
        if (playerRef.current) {
            (window as any).remotionPuck = playerRef.current;
        }
    }, [playerRef]);

    return (
        <div style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            borderRadius: '12px',
            overflow: 'hidden',
        }}>
            <Player
                ref={playerRef}
                component={PuckSimulation}
                durationInFrames={1200}
                compositionWidth={1000} // 原本是 row 佈局，我們需要大寬度
                compositionHeight={600}
                fps={30}
                style={{
                    width: '100%',
                }}
                controls={false}
                autoPlay={false}
                loop={false}
            />
        </div>
    );
};
