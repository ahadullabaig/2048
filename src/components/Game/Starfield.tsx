/**
 * Premium Starfield Background Component
 * Balanced cosmic backdrop - visible but refined
 */

import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// STAR SHADER MATERIAL - Visible stars with soft glow
// ============================================================================
const StarMaterial = shaderMaterial(
    {
        uTime: 0,
        uPixelRatio: 1,
    },
    // Vertex Shader
    `
    uniform float uTime;
    uniform float uPixelRatio;
    attribute float aSize;
    attribute float aPhase;
    attribute float aBrightness;
    varying float vAlpha;
    varying float vSize;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      
      // Gentle twinkle
      float twinkle = sin(uTime * 0.4 + aPhase * 6.28) * 0.25 + 0.75;
      vAlpha = aBrightness * twinkle;
      
      // Distance fade
      float dist = length(viewPosition.xyz);
      float distFade = smoothstep(150.0, 30.0, dist);
      vAlpha *= distFade;
      
      gl_Position = projectionMatrix * viewPosition;
      
      // Star size with perspective
      float size = aSize * uPixelRatio * twinkle;
      gl_PointSize = size * (200.0 / -viewPosition.z);
      gl_PointSize = clamp(gl_PointSize, 0.8, 4.0);
      vSize = gl_PointSize;
    }
  `,
    // Fragment Shader - Soft glowing point
    `
    varying float vAlpha;
    varying float vSize;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      // Soft core with glow falloff
      float core = 1.0 - smoothstep(0.0, 0.3, dist);
      float glow = exp(-dist * 6.0) * 0.4;
      float alpha = (core + glow) * vAlpha;
      
      // Slight warm/cool color variation based on alpha
      vec3 color = mix(vec3(0.9, 0.95, 1.0), vec3(1.0, 0.98, 0.95), vAlpha);
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ StarMaterial });

// ============================================================================
// AMBIENT GLOW MATERIAL - Subtle background atmosphere
// ============================================================================
const AmbientGlowMaterial = shaderMaterial(
    {
        uTime: 0,
    },
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 center = vUv - 0.5;
      float dist = length(center);
      
      // Radial gradient - darker at edges
      float gradient = 1.0 - smoothstep(0.0, 0.7, dist);
      
      // Very subtle color - deep blue/purple tint
      vec3 color1 = vec3(0.04, 0.03, 0.08); // Deep purple
      vec3 color2 = vec3(0.02, 0.04, 0.06); // Deep blue
      
      // Slight animated blend
      float blend = sin(uTime * 0.05) * 0.5 + 0.5;
      vec3 color = mix(color1, color2, blend * 0.3 + dist * 0.3);
      
      float alpha = gradient * 0.25;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ AmbientGlowMaterial });

// ============================================================================
// HELPER: Create star field with good distribution
// ============================================================================
function createStarField(count: number, minRadius: number, maxRadius: number, brightnessRange: [number, number]) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const brightness = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        // Spherical distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = minRadius + Math.random() * (maxRadius - minRadius);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Size distribution: mostly small, some medium, few large
        const sizeRand = Math.random();
        if (sizeRand < 0.7) {
            sizes[i] = 0.5 + Math.random() * 0.8; // Small
        } else if (sizeRand < 0.95) {
            sizes[i] = 1.0 + Math.random() * 1.0; // Medium
        } else {
            sizes[i] = 1.8 + Math.random() * 1.2; // Large (rare)
        }

        phases[i] = Math.random();

        // Brightness in specified range
        const [minB, maxB] = brightnessRange;
        brightness[i] = minB + Math.random() * (maxB - minB);
    }

    return { positions, sizes, phases, brightness };
}

// ============================================================================
// STAR LAYER COMPONENT
// ============================================================================
interface StarLayerProps {
    count: number;
    minRadius: number;
    maxRadius: number;
    rotationSpeed: number;
    brightnessRange: [number, number];
}

function StarLayer({ count, minRadius, maxRadius, rotationSpeed, brightnessRange }: StarLayerProps) {
    const materialRef = useRef<any>(null);
    const groupRef = useRef<THREE.Group>(null);

    const { positions, sizes, phases, brightness } = useMemo(
        () => createStarField(count, minRadius, maxRadius, brightnessRange),
        [count, minRadius, maxRadius, brightnessRange]
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.elapsedTime;
            materialRef.current.uPixelRatio = Math.min(window.devicePixelRatio, 2);
        }
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed;
        }
    });

    return (
        <group ref={groupRef}>
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aSize"
                        count={count}
                        array={sizes}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-aPhase"
                        count={count}
                        array={phases}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-aBrightness"
                        count={count}
                        array={brightness}
                        itemSize={1}
                    />
                </bufferGeometry>
                {/* @ts-ignore */}
                <starMaterial
                    ref={materialRef}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
}

// ============================================================================
// AMBIENT BACKGROUND
// ============================================================================
function AmbientBackground() {
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.elapsedTime;
        }
    });

    return (
        <mesh position={[0, 0, -120]}>
            <planeGeometry args={[400, 300]} />
            {/* @ts-ignore */}
            <ambientGlowMaterial
                ref={materialRef}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

// ============================================================================
// FLOATING DUST PARTICLES 
// ============================================================================
function FloatingDust() {
    const count = 80;
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const data = useMemo(() => {
        const positions: [number, number, number][] = [];
        const phases: number[] = [];
        const baseScales: number[] = [];

        for (let i = 0; i < count; i++) {
            // Spread around the scene
            const x = (Math.random() - 0.5) * 60;
            const y = (Math.random() - 0.5) * 40;
            const z = -20 - Math.random() * 60;
            positions.push([x, y, z]);
            phases.push(Math.random() * Math.PI * 2);
            baseScales.push(0.02 + Math.random() * 0.04);
        }

        return { positions, phases, baseScales };
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;
        const dummy = new THREE.Object3D();

        data.positions.forEach((pos, i) => {
            // Gentle floating motion
            const x = pos[0] + Math.sin(time * 0.1 + data.phases[i]) * 0.5;
            const y = pos[1] + Math.cos(time * 0.08 + data.phases[i]) * 0.3;

            dummy.position.set(x, y, pos[2]);

            // Gentle pulse
            const pulse = 0.8 + Math.sin(time * 0.3 + data.phases[i]) * 0.2;
            dummy.scale.setScalar(data.baseScales[i] * pulse);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial
                color="#7799bb"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    );
}

// ============================================================================
// MAIN STARFIELD COMPONENT
// ============================================================================
export default function Starfield() {
    const groupRef = useRef<THREE.Group>(null);

    // Gentle drift
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime * 0.015;
            groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.05;
            groupRef.current.rotation.x = Math.cos(time * 0.25) * 0.03;
        }
    });

    // Memoize brightness ranges to avoid re-renders
    const farBrightness = useMemo<[number, number]>(() => [0.3, 0.6], []);
    const midBrightness = useMemo<[number, number]>(() => [0.4, 0.8], []);
    const nearBrightness = useMemo<[number, number]>(() => [0.5, 1.0], []);

    return (
        <group ref={groupRef}>
            {/* Ambient background glow */}
            <AmbientBackground />

            {/* Far stars - many, dimmer */}
            <StarLayer
                count={2500}
                minRadius={80}
                maxRadius={130}
                rotationSpeed={0.00003}
                brightnessRange={farBrightness}
            />

            {/* Mid-distance stars */}
            <StarLayer
                count={1200}
                minRadius={45}
                maxRadius={80}
                rotationSpeed={0.00006}
                brightnessRange={midBrightness}
            />

            {/* Near stars - fewer, brighter */}
            <StarLayer
                count={400}
                minRadius={20}
                maxRadius={45}
                rotationSpeed={0.0001}
                brightnessRange={nearBrightness}
            />

            {/* Subtle floating dust particles */}
            <FloatingDust />
        </group>
    );
}
