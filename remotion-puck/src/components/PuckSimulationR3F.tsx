import React, { useMemo, Suspense } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { Theme, Physics } from '../Theme';
import { ContactShadows, Instance, Instances, Text } from '@react-three/drei';

const HALF_PI = Math.PI / 2;

const GroupHead: React.FC = () => (
    <group position={[0, 1.4, 0]}>
        <mesh rotation={[-HALF_PI, 0, 0]}>
            <cylinderGeometry args={[2.18, 2.18, 0.8, 48, 1, false, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#95a5a6" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[0, HALF_PI, 0]}>
            <planeGeometry args={[4.36, 0.8]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.4, 0]} rotation={[-HALF_PI, 0, 0]}>
            <circleGeometry args={[2.08, 48, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#bdc3c7" metalness={0.9} roughness={0.1} />
        </mesh>
    </group>
);

const Basket: React.FC = () => (
    <group rotation={[-HALF_PI, 0, 0]} position={[0, -0.2, 0]}>
        <mesh>
            <cylinderGeometry args={[2.12, 2.12, 3.2, 64, 1, true, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#ecf0f1" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
            <ringGeometry args={[2.12, 2.3, 48, 1, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#fff" metalness={1} roughness={0} />
        </mesh>
        <mesh rotation={[0, HALF_PI, 0]}>
            <planeGeometry args={[4.24, 3.2]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.5} roughness={0.5} transparent opacity={0.15} />
        </mesh>
    </group>
);

const CoffeePuck: React.FC = () => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    const resistance = Physics.puckResistance(frame, durationInFrames);
    
    const color = useMemo(() => {
        const baseColor = new THREE.Color("#6f4e37");
        const darkColor = new THREE.Color('#211208');
        return baseColor.lerp(darkColor, Math.min(1, (resistance - 6) / 9));
    }, [resistance]);

    const puckHeight = 1.35;
    return (
        <group position={[0, 0.4, 0]} rotation={[-HALF_PI, 0, 0]}>
            <mesh>
                <cylinderGeometry args={[2.08, 2.08, puckHeight, 64, 1, false, -HALF_PI, Math.PI]} />
                <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
            </mesh>
            <mesh rotation={[0, HALF_PI, 0]}>
                <planeGeometry args={[4.16, puckHeight]} />
                <meshStandardMaterial color={color} roughness={1} />
            </mesh>
        </group>
    );
};

const WaterParticles: React.FC = () => {
    const frame = useCurrentFrame();
    const count = 40;
    
    const particles = useMemo(() => {
        return Array.from({ length: 60 }).map((_, i) => ({
            offset: Math.random() * 60,
            x: (Math.random() - 0.5) * 3.6,
            z: (Math.random() * 1.8),
        }));
    }, []);

    return (
        <Instances>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#3498db" transparent opacity={0.8} />
            {particles.slice(0, count).map((p, i) => {
                const t = ((frame + p.offset) % 60) / 60;
                const y = 1.4 - t * 3.0;
                const scale = interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
                return (
                    <Instance key={i} position={[p.x, y, p.z]} scale={scale > 0 ? scale : 0} />
                );
            })}
        </Instances>
    );
};

const Labels: React.FC = () => (
    <group position={[2.5, 0, 0]}>
        <Text position={[0, 1.4, 0]} fontSize={0.25} color="#95a5a6" anchorX="left">GROUP HEAD</Text>
        <Text position={[0, 0.4, 0]} fontSize={0.25} color="#f0b84a" anchorX="left">COFFEE PUCK</Text>
        <Text position={[0, -0.8, 0]} fontSize={0.25} color="#dcdde1" anchorX="left">BASKET</Text>
    </group>
);

export const PuckSimulationR3F: React.FC = () => {
    const { width, height } = useVideoConfig();

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: Theme.bg }}>
            <Suspense fallback={null}>
                <ThreeCanvas 
                    width={width} 
                    height={height} 
                    orthographic
                    camera={{ zoom: 120, position: [0, 0, 20] }}
                    gl={{ antialias: true }}
                >
                    <ambientLight intensity={1.5} />
                    <pointLight position={[10, 10, 10]} intensity={2} />
                    
                    <group rotation={[0.1, -0.3, 0]} position={[-1, 0, 0]}>
                        <GroupHead />
                        <Basket />
                        <CoffeePuck />
                        <WaterParticles />
                        <Labels />
                    </group>

                    <ContactShadows position={[0, -2.5, 0]} resolution={512} scale={15} blur={3} opacity={0.5} color="#000" />
                </ThreeCanvas>
            </Suspense>
        </div>
    );
};
