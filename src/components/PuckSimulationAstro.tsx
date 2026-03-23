import React, { useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
// @ts-ignore
import { actualPressure } from '../scripts/physics';
import { Theme } from '../remotion/Theme';
import { ContactShadows, Instance, Instances, Text, Float } from '@react-three/drei';

const HALF_PI = Math.PI / 2;

const GroupHead: React.FC = () => (
    <group position={[0, 1.4, 0]}>
        {/* 沖煮頭本體 - 半截 */}
        <mesh rotation={[-HALF_PI, 0, 0]}>
            <cylinderGeometry args={[2.18, 2.18, 0.8, 48, 1, false, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#95a5a6" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* 沖煮頭剖面封口 */}
        <mesh rotation={[0, HALF_PI, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[4.36, 0.8]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* 分水網底部 (Shower Screen) */}
        <mesh position={[0, -0.4, 0]} rotation={[-HALF_PI, 0, 0]}>
            <circleGeometry args={[2.08, 48, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#bdc3c7" metalness={0.9} roughness={0.1} />
        </mesh>
    </group>
);

const Basket: React.FC = () => (
    <group rotation={[-HALF_PI, 0, 0]} position={[0, -0.2, 0]}>
        {/* 濾杯外壁 - 半截 */}
        <mesh>
            <cylinderGeometry args={[2.12, 2.12, 3.2, 48, 1, true, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#ecf0f1" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* 濾杯頂部邊緣 (Rim) */}
        <mesh position={[0, 1.6, 0]}>
            <ringGeometry args={[2.12, 2.3, 48, 1, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#fff" metalness={1} roughness={0} />
        </mesh>
        {/* 濾杯底部 */}
        <mesh position={[0, -1.6, 0]}>
            <circleGeometry args={[2.12, 48, -HALF_PI, Math.PI]} />
            <meshStandardMaterial color="#95a5a6" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* 剖面封口板 */}
        <mesh rotation={[0, HALF_PI, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[4.24, 3.2]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.5} roughness={0.5} transparent opacity={0.15} />
        </mesh>
    </group>
);

const CoffeePuck: React.FC<{ progress: number, state: any }> = ({ progress, state }) => {
    const t = progress * 30;
    const p = actualPressure(t, state.currentWD, state.currentMethod, state.currentMachine, state.headspace);
    
    const color = useMemo(() => {
        // 初始狀態為顯眼的咖啡褐色，受壓後變深
        const baseColor = new THREE.Color("#6f4e37"); // 淺褐色
        const darkColor = new THREE.Color('#211208'); // 深褐色
        return baseColor.lerp(darkColor, Math.min(1, (p + progress * 5) / 15));
    }, [p, progress]);

    const puckHeight = 1.35;
    const hsHeight = (state.headspace / 5) * 1.5;
    const puckY = 1.2 - hsHeight - puckHeight / 2;

    return (
        <group position={[0, puckY - 0.2, 0]} rotation={[-HALF_PI, 0, 0]}>
            <mesh>
                <cylinderGeometry args={[2.08, 2.08, puckHeight, 48, 1, false, -HALF_PI, Math.PI]} />
                <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
            </mesh>
            <mesh rotation={[0, HALF_PI, 0]}>
                <planeGeometry args={[4.16, puckHeight]} />
                <meshStandardMaterial color={color} roughness={1} />
            </mesh>
        </group>
    );
};

const WaterParticles: React.FC<{ progress: number, wd: number, headspace: number }> = ({ progress, wd, headspace }) => {
    const count = 30;
    const frame = progress * 900;
    
    const particles = useMemo(() => {
        return Array.from({ length: 60 }).map((_, i) => ({
            offset: Math.random() * 60,
            x: (Math.random() - 0.5) * 3.6,
            z: (Math.random() * 1.8),
        }));
    }, []);

    const waterY = 1.2 - (headspace / 5) * 1.5;

    return (
        <group>
            <Instances>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="#5dade2" transparent opacity={0.8} />
                {particles.slice(0, count).map((p, i) => {
                    const t = ((frame + p.offset) % 60) / 60;
                    const y = waterY + 0.2 - t * 3.0;
                    const scale = t < 0.1 ? t * 10 : (t > 0.9 ? (1 - t) * 10 : 1);
                    return (
                        <Instance key={i} position={[p.x, y, p.z]} scale={scale > 0 ? scale : 0} />
                    );
                })}
            </Instances>
            {/* 充滿 Headspace 的水體 */}
            {progress > 0 && (
                <mesh position={[0, waterY + 0.2, 0]} rotation={[-HALF_PI, 0, 0]}>
                    <circleGeometry args={[2.05, 32, -HALF_PI, Math.PI]} />
                    <meshStandardMaterial color="#5dade2" transparent opacity={0.4} />
                </mesh>
            )}
        </group>
    );
};

const Labels: React.FC = () => (
    <group position={[2.5, 0, 0]}>
        <Text position={[0, 1.4, 0]} fontSize={0.2} color="#95a5a6" anchorX="left">GROUP HEAD</Text>
        <Text position={[0, 0.4, 0]} fontSize={0.2} color="#f0b84a" anchorX="left">COFFEE PUCK</Text>
        <Text position={[0, -0.8, 0]} fontSize={0.2} color="#dcdde1" anchorX="left">BASKET</Text>
    </group>
);

export const PuckSimulationAstro: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [appState, setAppState] = useState({
        currentWD: 80,
        currentMethod: 'normal',
        currentMachine: 'rotary',
        headspace: 2.0
    });

    useEffect(() => {
        (window as any).updatePuckR3F = (p: number, s: any) => {
            setProgress(p);
            if (s) setAppState({...s});
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '160px', borderRadius: '12px', background: '#0d0d0d', position: 'relative' }}>
            <Suspense fallback={null}>
                <Canvas 
                    orthographic
                    camera={{ zoom: 36, position: [0, 0, 20] }}
                    gl={{ antialias: true, alpha: true }}
                >
                    <ambientLight intensity={1.5} />
                    <pointLight position={[10, 10, 10]} intensity={2} />
                    
                    <group rotation={[0.1, -0.4, 0]} position={[-1.2, 0, 0]}>
                        <GroupHead />
                        <Basket />
                        <CoffeePuck progress={progress} state={appState} />
                        {(progress > 0 || appState.currentWD > 0) && (
                            <WaterParticles progress={progress} wd={appState.currentWD} headspace={appState.headspace} />
                        )}
                        <Labels />
                    </group>

                    <ContactShadows position={[0, -2.5, 0]} resolution={512} scale={15} blur={3} opacity={0.5} color="#000" />
                </Canvas>
            </Suspense>
        </div>
    );
};
