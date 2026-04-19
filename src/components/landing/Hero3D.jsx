import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Text, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function GlowRing({ color }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.014;
    ref.current.material.opacity = 0.38 + Math.sin(state.clock.elapsedTime * 2.2) * 0.16;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.9, 0.028, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        transparent
        opacity={0.55}
        toneMapped={false}
      />
    </mesh>
  );
}

function Coin({ position, color, label, speed = 1 }) {
  const ref = useRef(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.008 * speed;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.18;
  });

  return (
    <group ref={ref} position={position} rotation={[0.7, 0.2, -0.2]}>
      <mesh>
        <cylinderGeometry args={[0.74, 0.74, 0.19, 72]} />
        <meshStandardMaterial
          color={color}
          metalness={0.92}
          roughness={0.08}
          emissive={color}
          emissiveIntensity={0.55}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, 0, 0.12]}
        fontSize={0.52}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={color}
      >
        {label}
      </Text>
      <GlowRing color={color} />
    </group>
  );
}

function FlowRibbon() {
  const meshRef = useRef(null);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5.6, -1.6, 0),
        new THREE.Vector3(-3.2, -0.7, 0.8),
        new THREE.Vector3(-0.7, -1.15, -0.4),
        new THREE.Vector3(1.6, -0.52, 0.55),
        new THREE.Vector3(5.3, -1.25, 0.08),
      ]),
    [],
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.09;
    meshRef.current.material.emissiveIntensity = 0.45 + Math.sin(state.clock.elapsedTime * 0.9) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={[0, -0.25, -0.15]}>
      <tubeGeometry args={[curve, 180, 0.16, 20, false]} />
      <MeshDistortMaterial
        color="#cdc9ff"
        emissive="#8b5cf6"
        emissiveIntensity={0.55}
        roughness={0.1}
        metalness={0.72}
        distort={0.22}
        speed={1.6}
        toneMapped={false}
      />
    </mesh>
  );
}

function HologramPanel({ position, rotation }) {
  const ref = useRef(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.09;
    const pulse = 0.65 + Math.sin(state.clock.elapsedTime * 1.4 + position[0]) * 0.12;
    if (ref.current.children[0]?.material) {
      ref.current.children[0].material.opacity = pulse;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1.7, 1.0, 0.04]} />
        <meshStandardMaterial
          color="#0a1535"
          transparent
          opacity={0.72}
          emissive="#06b6d4"
          emissiveIntensity={0.28}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.18, 0.18, 0.06]}>
        <boxGeometry args={[0.9, 0.055, 0.02]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[-0.15, -0.06, 0.06]}>
        <boxGeometry args={[1.04, 0.055, 0.02]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0.04, -0.3, 0.06]}>
        <boxGeometry args={[0.62, 0.04, 0.02]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  );
}

function HeroScene() {
  return (
    <>
      <color attach="background" args={["#05050d"]} />
      <Stars radius={90} depth={55} count={2800} factor={3.2} saturation={0} fade speed={0.7} />
      <ambientLight intensity={0.45} />
      <pointLight position={[2.5, 4, 4]} intensity={32} color="#ec4899" />
      <pointLight position={[-5, -1, 3]} intensity={24} color="#06b6d4" />
      <pointLight position={[4, -2, 2]} intensity={18} color="#8b5cf6" />
      <pointLight position={[0, 6, -2]} intensity={10} color="#f0abfc" />
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <FlowRibbon />
        <Coin position={[-2.4, 0.4, 0.2]} color="#a3e635" label="$" speed={0.8} />
        <Coin position={[-0.1, -1.2, 0.4]} color="#ec4899" label="₿" speed={1.1} />
        <Coin position={[1.2, -0.6, 0.15]} color="#d946ef" label="↗" speed={0.9} />
        <Coin position={[2.8, 0.2, -0.15]} color="#7c3aed" label="₹" speed={0.7} />
        <HologramPanel position={[-2.0, 1.4, -1.0]} rotation={[0.78, -0.2, 0.14]} />
        <HologramPanel position={[2.2, 1.1, -0.9]} rotation={[0.65, 0.28, -0.16]} />
      </Float>
      <Environment preset="city" />
    </>
  );
}

function Hero3D() {
  return (
    <div className="hero-canvas ribbon-depth" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.4, 6.2], fov: 45 }} dpr={[1, 1.85]}>
        <HeroScene />
      </Canvas>
    </div>
  );
}

export default Hero3D;
