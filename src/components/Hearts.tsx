import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { InstancedMesh } from "three";
import { Object3D, ShapeGeometry, Shape, DoubleSide } from "three";
import { useGameStore, LANE_WIDTH } from "../store/gameStore";

const tempObject = new Object3D();

function createHeartShape(): ShapeGeometry {
  const shape = new Shape();

  // Create a proper heart shape using bezier curves
  const scale = 0.8;

  // Start from top center of heart
  shape.moveTo(0, 0.5 * scale);

  // Left curve of heart
  shape.bezierCurveTo(
    -0.5 * scale,
    0.3 * scale, // control point 1
    -0.8 * scale,
    -0.2 * scale, // control point 2
    -0.5 * scale,
    -0.5 * scale, // end point
  );

  // Bottom point of heart
  shape.bezierCurveTo(
    -0.3 * scale,
    -0.8 * scale, // control point 1
    0,
    -0.6 * scale, // control point 2
    0,
    -0.3 * scale, // end point
  );

  // Right curve of heart
  shape.bezierCurveTo(
    0,
    -0.6 * scale, // control point 1
    0.3 * scale,
    -0.8 * scale, // control point 2
    0.5 * scale,
    -0.5 * scale, // end point
  );

  // Right top curve
  shape.bezierCurveTo(
    0.8 * scale,
    -0.2 * scale, // control point 1
    0.5 * scale,
    0.3 * scale, // control point 2
    0,
    0.5 * scale, // back to start
  );

  const geometry = new ShapeGeometry(shape);
  geometry.center();
  return geometry;
}

export default function Hearts() {
  const meshRef = useRef<InstancedMesh>(null);
  const heartGeo = useMemo(() => createHeartShape(), []);

  useFrame(({ clock }) => {
    const { hearts } = useGameStore.getState();
    const time = clock.getElapsedTime();

    if (meshRef.current) {
      hearts.forEach((heart, i) => {
        tempObject.position.set(
          heart.lane * LANE_WIDTH,
          1.8 + Math.sin(time * 3 + i) * 0.3,
          heart.z,
        );
        tempObject.rotation.set(Math.PI, time * 2, 0);
        tempObject.scale.set(1.2, 1.2, 1.2);
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      meshRef.current.count = hearts.length;
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[heartGeo, undefined, 30]}>
      <meshStandardMaterial
        color="#FF1493"
        emissive="#FF69B4"
        emissiveIntensity={0.5}
        side={DoubleSide}
      />
    </instancedMesh>
  );
}
