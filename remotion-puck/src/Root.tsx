import { Composition } from 'remotion';
import { PuckResistance } from './PuckResistance';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="PuckResistance"
                component={PuckResistance}
                durationInFrames={900} // 30 seconds at 30 fps
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
