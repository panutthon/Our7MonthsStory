import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useGameStore, LANE_WIDTH } from "../store/gameStore";

export default function Player() {
  const groupRef = useRef<Group>(null);
  const visualRef = useRef<Group>(null);

  useFrame(() => {
    const { playerLane, isJumping, jumpProgress, isSliding, jumpPower } =
      useGameStore.getState();

    if (!groupRef.current) return;

    // Smooth lane transition
    const targetX = playerLane * LANE_WIDTH;
    groupRef.current.position.x +=
      (targetX - groupRef.current.position.x) * 0.18;

    // Jump arc — move the whole group up
    if (isJumping) {
      groupRef.current.position.y =
        Math.sin(jumpProgress * Math.PI) * jumpPower;
    } else {
      groupRef.current.position.y += (0 - groupRef.current.position.y) * 0.2;
    }

    // Slide — squash the entire visual group so ALL parts collapse
    if (visualRef.current) {
      if (isSliding) {
        visualRef.current.scale.y += (0.42 - visualRef.current.scale.y) * 0.2;
        visualRef.current.position.y +=
          (-0.65 - visualRef.current.position.y) * 0.2;
      } else {
        visualRef.current.scale.y += (1 - visualRef.current.scale.y) * 0.2;
        visualRef.current.position.y +=
          (0 - visualRef.current.position.y) * 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group ref={visualRef}>
        {/* Body */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.0, 1.5, 0.8]} />
          <meshStandardMaterial color="#F48FB1" />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2.0, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#FFDDE5" />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 2.35, 0]}>
          <sphereGeometry args={[0.47, 12, 8]} />
          <meshStandardMaterial color="#7B4A3A" />
        </mesh>

        {/* Left eye */}
        <mesh position={[-0.15, 2.1, 0.38]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#4A2A4A" />
        </mesh>

        {/* Right eye */}
        <mesh position={[0.15, 2.1, 0.38]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#4A2A4A" />
        </mesh>

        {/* Smile */}
        <mesh position={[0, 1.93, 0.41]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.1, 0.02, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#E8789A" />
        </mesh>

        {/* Left arm */}
        <mesh position={[-0.68, 0.72, 0]} rotation={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[0.28, 1.0, 0.28]} />
          <meshStandardMaterial color="#F48FB1" />
        </mesh>

        {/* Right arm */}
        <mesh position={[0.68, 0.72, 0]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.28, 1.0, 0.28]} />
          <meshStandardMaterial color="#F48FB1" />
        </mesh>

        {/* Left leg */}
        <mesh position={[-0.25, -0.32, 0]} castShadow>
          <boxGeometry args={[0.34, 0.9, 0.34]} />
          <meshStandardMaterial color="#CE93D8" />
        </mesh>

        {/* Right leg */}
        <mesh position={[0.25, -0.32, 0]} castShadow>
          <boxGeometry args={[0.34, 0.9, 0.34]} />
          <meshStandardMaterial color="#CE93D8" />
        </mesh>

        {/* Left shoe */}
        <mesh position={[-0.25, -0.86, 0.1]} castShadow>
          <boxGeometry args={[0.36, 0.2, 0.52]} />
          <meshStandardMaterial color="#E91E8C" />
        </mesh>

        {/* Right shoe */}
        <mesh position={[0.25, -0.86, 0.1]} castShadow>
          <boxGeometry args={[0.36, 0.2, 0.52]} />
          <meshStandardMaterial color="#E91E8C" />
        </mesh>
      </group>
    </group>
  );
}
