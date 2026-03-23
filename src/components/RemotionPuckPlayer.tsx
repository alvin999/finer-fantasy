import * as React from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { PuckResistance } from '../../remotion-puck/src/PuckResistance';

export const RemotionPuckPlayer: React.FC = () => {
    const playerRef = React.useRef<PlayerRef>(null);

    React.useEffect(() => {
        if (playerRef.current) {
            // Expose the player to the window object for GSAP to access
            (window as any).remotionPlayer = playerRef.current;
        }
    }, [playerRef]);

    return (
        <div style={{
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid rgba(184, 103, 30, 0.2)'
        }}>
            <Player
                ref={playerRef}
                component={PuckResistance}
                durationInFrames={1200}
                compositionWidth={1920}
                compositionHeight={1080}
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
