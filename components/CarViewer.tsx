"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CarModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.6, 1.8]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Cabin — slightly rearward */}
      <mesh position={[-0.2, 0.55, 0]}>
        <boxGeometry args={[2, 0.5, 1.6]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.1} />
    </mesh>
  );
}

export default function CarViewer() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 45 }}
        style={{ background: "#0A0A0A" }}
      >
        <ambientLight intensity={0.15} />
        {/* Key light — warm white, top-right, mimics showroom spotlight */}
        <directionalLight color="#FFF5E0" intensity={1.2} position={[5, 8, 3]} />
        {/* Rim light — cool blue-grey, behind model */}
        <directionalLight color="#8899BB" intensity={0.4} position={[-3, 2, -5]} />
        <CarModel />
        <GroundPlane />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}
