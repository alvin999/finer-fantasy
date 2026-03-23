import React, { useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { Theme } from '../Theme';

const SimpleCube: React.FC = () => {
    const frame = useCurrentFrame();
    const meshRef = useRef<THREE.Mesh>(null);

    return (
        <mesh ref={meshRef} rotation={[frame * 0.05, frame * 0.05, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={Theme.amber} />
        </mesh>
    );
};

export const PuckSimulationR3F: React.FC = () => {
    const { width, height } = useVideoConfig();

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: Theme.bg }}>
            <ThreeCanvas 
                width={width} 
                height={height} 
                camera={{ position: [0, 0, 5], fov: 75 }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SimpleCube />
            </ThreeCanvas>
            
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                color: 'white',
                fontFamily: 'monospace'
            }}>
                DEBUG MODE: SIMPLE CUBE
            </div>
        </div>
    );
};
