import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, Group } from "three";
import { useGameStore, LANE_WIDTH } from "../store/gameStore";

export default function Player() {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);

  useFrame(() => {
    const { playerLane, isJumping, jumpProgress, isSliding } =
      useGameStore.getState();

    if (!groupRef.current) return;

    // Smooth lane transition
    const targetX = playerLane * LANE_WIDTH;
    groupRef.current.position.x +=
      (targetX - groupRef.current.position.x) * 0.18;

    // Jump arc
    if (isJumping) {
      groupRef.current.position.y = Math.sin(jumpProgress * Math.PI) * 3.5;
    } else {
      groupRef.current.position.y += (0 - groupRef.current.position.y) * 0.2;
    }

    // Slide scale
    if (bodyRef.current) {
      if (isSliding) {
        bodyRef.current.scale.y += (0.3 - bodyRef.current.scale.y) * 0.2;
        bodyRef.current.position.y += (-0.5 - bodyRef.current.position.y) * 0.2;
      } else {
        bodyRef.current.scale.y += (1 - bodyRef.current.scale.y) * 0.2;
        bodyRef.current.position.y += (0.75 - bodyRef.current.position.y) * 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.0, 1.5, 0.8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#FFD1DC" />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.7, 0.7, 0]} castShadow>
        <boxGeometry args={[0.3, 1.0, 0.3]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.7, 0.7, 0]} castShadow>
        <boxGeometry args={[0.3, 1.0, 0.3]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.25, -0.3, 0]} castShadow>
        <boxGeometry args={[0.35, 0.9, 0.35]} />
        <meshStandardMaterial color="#C71585" />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.25, -0.3, 0]} castShadow>
        <boxGeometry args={[0.35, 0.9, 0.35]} />
        <meshStandardMaterial color="#C71585" />
      </mesh>
    </group>
  );
}
