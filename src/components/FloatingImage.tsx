import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, DoubleSide } from "three";
import type { Mesh } from "three";
import image from "../assets/image.png";

export default function FloatingImage() {
  const meshRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, image);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Floating animation
    meshRef.current.position.y = 20 + Math.sin(t * 0.8) * 2;
    meshRef.current.position.x = Math.sin(t * 0.3) * 3;

    // Gentle rotation
    meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 20, -50]}>
      <planeGeometry args={[8, 6]} />
      <meshStandardMaterial
        map={texture}
        transparent
        side={DoubleSide}
        emissive="#FFB6C1"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}
