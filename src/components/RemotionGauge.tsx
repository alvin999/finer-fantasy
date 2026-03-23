import * as React from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { Gauge } from '../remotion/components/Gauge';

export const RemotionGauge: React.FC = () => {
    const playerRef = React.useRef<PlayerRef>(null);

    React.useEffect(() => {
        if (playerRef.current) {
            (window as any).remotionGauge = playerRef.current;
        }
    }, [playerRef]);

    return (
        <div style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            aspectRatio: '1/1',
            borderRadius: '12px',
            overflow: 'hidden',
        }}>
            <Player
                ref={playerRef}
                component={Gauge}
                durationInFrames={1200}
                compositionWidth={400}
                compositionHeight={400}
                fps={30}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                controls={false}
                autoPlay={false}
                loop={false}
            />
        </div>
    );
};
