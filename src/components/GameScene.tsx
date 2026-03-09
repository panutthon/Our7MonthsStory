import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import Player from "./Player";
import Obstacles from "./Obstacles";
import Hearts from "./Hearts";
import Ground from "./Ground";
import FloatingImage from "./FloatingImage";
import { useGameStore, LANE_WIDTH } from "../store/gameStore";

function CameraController() {
  const { camera } = useThree();
  const cameraRef = useRef(camera as PerspectiveCamera);

  useFrame(() => {
    const { playerLane } = useGameStore.getState();
    const cam = cameraRef.current;

    // Chase camera behind player
    const targetX = playerLane * LANE_WIDTH * 0.3;
    cam.position.x += (targetX - cam.position.x) * 0.05;
    cam.position.y = 6;
    cam.position.z = 12;
    cam.lookAt(targetX * 0.5, 1.5, -15);
  });

  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#FFF0F5" />
      <directionalLight
        position={[5, 15, 10]}
        intensity={1.2}
        color="#FFE4E1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 10, -30]} intensity={0.5} color="#FF69B4" />
    </>
  );
}

function FloatingHearts() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      child.position.y = 8 + Math.sin(t * 0.5 + i * 2) * 3;
      child.position.x = Math.sin(t * 0.3 + i * 1.5) * 15;
      child.rotation.z = Math.sin(t + i) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[i * 5 - 15, 10, -40 - i * 5]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial
            color="#FF1493"
            emissive="#FF69B4"
            emissiveIntensity={0.8}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Sky gradient
function Sky() {
  return (
    <mesh position={[0, 30, -80]}>
      <planeGeometry args={[200, 100]} />
      <meshBasicMaterial color="#FFB6C1" />
    </mesh>
  );
}

function GameLoop() {
  const tick = useGameStore((s) => s.tick);

  useFrame(() => {
    tick();
  });

  return null;
}

function KeyboardControls() {
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const jump = useGameStore((s) => s.jump);
  const slide = useGameStore((s) => s.slide);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          moveLeft();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          moveRight();
          break;
        case "ArrowUp":
        case "w":
        case "W":
        case " ":
          jump();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          slide();
          break;
      }
    },
    [moveLeft, moveRight, jump, slide],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return null;
}

export default function GameScene() {
  return (
    <>
      <CameraController />
      <Lighting />
      <Sky />
      <FloatingHearts />
      <FloatingImage />
      <Ground />
      <Player />
      <Obstacles />
      <Hearts />
      <GameLoop />
      <KeyboardControls />
      <fog attach="fog" args={["#FFB6C1", 30, 120]} />
    </>
  );
}

import type * as THREE from "three";
