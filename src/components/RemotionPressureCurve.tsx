import * as React from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { PressureCurve } from '../remotion/components/PressureCurve';

export const RemotionPressureCurve: React.FC = () => {
    const playerRef = React.useRef<PlayerRef>(null);

    React.useEffect(() => {
        if (playerRef.current) {
            (window as any).remotionCurve = playerRef.current;
        }
    }, [playerRef]);

    return (
        <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '20px'
        }}>
            <Player
                ref={playerRef}
                component={PressureCurve}
                inputProps={{ width: 560, height: 300 }}
                durationInFrames={1200}
                compositionWidth={560}
                compositionHeight={300}
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
