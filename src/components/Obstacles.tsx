import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { InstancedMesh } from "three";
import { Object3D } from "three";
import { useGameStore, LANE_WIDTH } from "../store/gameStore";

const tempObject = new Object3D();

export default function Obstacles() {
  const boxRef = useRef<InstancedMesh>(null);
  const barrierRef = useRef<InstancedMesh>(null);

  useFrame(() => {
    const { obstacles } = useGameStore.getState();

    const boxes = obstacles.filter((o) => o.type === "box");
    const barriers = obstacles.filter((o) => o.type === "barrier");

    // Update box instances
    if (boxRef.current) {
      boxes.forEach((obs, i) => {
        tempObject.position.set(obs.lane * LANE_WIDTH, 0.75, obs.z);
        tempObject.scale.set(1, 1, 1);
        tempObject.updateMatrix();
        boxRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      boxRef.current.count = boxes.length;
      boxRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update barrier instances
    if (barrierRef.current) {
      barriers.forEach((obs, i) => {
        tempObject.position.set(obs.lane * LANE_WIDTH, 2.0, obs.z);
        tempObject.scale.set(1, 1, 1);
        tempObject.updateMatrix();
        barrierRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      barrierRef.current.count = barriers.length;
      barrierRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Boxes - ground level obstacles (jump over) */}
      <instancedMesh ref={boxRef} args={[undefined, undefined, 50]} castShadow>
        <boxGeometry args={[1.8, 1.5, 1.8]} />
        <meshStandardMaterial color="#8B4513" />
      </instancedMesh>

      {/* Barriers - high obstacles (slide under) */}
      <instancedMesh
        ref={barrierRef}
        args={[undefined, undefined, 50]}
        castShadow
      >
        <boxGeometry args={[2.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#DC143C" />
      </instancedMesh>
    </>
  );
}
