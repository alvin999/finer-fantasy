import React from 'react';
import { Player } from '@remotion/player';
import { PuckResistance } from '../remotion/PuckResistance';

interface Props {
    frame: number;
}

export const InteractiveVideo: React.FC<Props> = ({ frame }) => {
    return (
        <Player
            component={PuckResistance}
            durationInFrames={900}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
            inputProps={{}}
            // 精華：將 frame 綁定
            frame={frame}
        />
    );
};
