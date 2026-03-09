import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { RepeatWrapping, TextureLoader } from "three";
import { LANE_WIDTH, useGameStore } from "../store/gameStore";

// Create a simple ground texture via canvas
function createGroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Base color - soft pink path
  ctx.fillStyle = "#FFB6C1";
  ctx.fillRect(0, 0, 512, 512);

  // Lane lines
  ctx.strokeStyle = "#FF69B4";
  ctx.lineWidth = 3;

  // Left lane line
  const laneOffset = 512 / 3;
  ctx.beginPath();
  for (let y = 0; y < 512; y += 40) {
    ctx.moveTo(laneOffset, y);
    ctx.lineTo(laneOffset, y + 20);
  }
  ctx.stroke();

  // Right lane line
  ctx.beginPath();
  for (let y = 0; y < 512; y += 40) {
    ctx.moveTo(laneOffset * 2, y);
    ctx.lineTo(laneOffset * 2, y + 20);
  }
  ctx.stroke();

  // Center decoration - small hearts/dots
  ctx.fillStyle = "#FF69B455";
  for (let y = 0; y < 512; y += 80) {
    ctx.beginPath();
    ctx.arc(256, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new TextureLoader().load(canvas.toDataURL());
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 20);
  return texture;
}

export default function Ground() {
  const meshRef = useRef<Mesh>(null);
  const texture = useMemo(() => createGroundTexture(), []);

  useFrame(() => {
    const { speed, status } = useGameStore.getState();
    if (status !== "playing") return;
    if (texture) {
      texture.offset.y += speed * 0.01;
    }
  });

  return (
    <>
      {/* Main ground */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, -50]}
        receiveShadow
      >
        <planeGeometry args={[LANE_WIDTH * 3 + 2, 200]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Side decorations - left */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-(LANE_WIDTH * 1.5 + 3), -0.02, -50]}
        receiveShadow
      >
        <planeGeometry args={[6, 200]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* Side decorations - right */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[LANE_WIDTH * 1.5 + 3, -0.02, -50]}
        receiveShadow
      >
        <planeGeometry args={[6, 200]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* Side trees/bushes */}
      <SideDecorations />
    </>
  );
}

function SideDecorations() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const { speed, status } = useGameStore.getState();
    if (status !== "playing" || !groupRef.current) return;

    groupRef.current.children.forEach((child) => {
      child.position.z += speed;
      if (child.position.z > 20) {
        child.position.z -= 160;
      }
    });
  });

  const trees = useMemo(() => {
    const items = [];
    for (let i = 0; i < 20; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (LANE_WIDTH * 1.5 + 4 + Math.random() * 2);
      const z = -i * 8;
      items.push({ x, z, scale: 0.8 + Math.random() * 0.6, key: i });
    }
    return items;
  }, []);

  return (
    <group ref={groupRef}>
      {trees.map((tree) => (
        <group key={tree.key} position={[tree.x, 0, tree.z]}>
          {/* Trunk */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Leaves */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <sphereGeometry args={[tree.scale, 8, 8]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

import type * as THREE from "three";
