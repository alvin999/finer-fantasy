import { Composition } from 'remotion';
import { PuckResistance } from './PuckResistance';
import { PuckSimulationR3F } from './components/PuckSimulationR3F';

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
            <Composition
                id="PuckSimulation-R3F"
                component={PuckSimulationR3F}
                durationInFrames={600}
                fps={30}
                width={1280}
                height={720}
            />
        </>
    );
};
