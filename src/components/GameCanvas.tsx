import { Canvas } from "@react-three/fiber";
import GameScene from "./GameScene";
import UIOverlay from "./UIOverlay";

export default function GameCanvas() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        shadows
        camera={{ position: [0, 6, 12], fov: 60 }}
        style={{
          background:
            "linear-gradient(180deg, #FFB6C1 0%, #FF69B4 50%, #C71585 100%)",
        }}
      >
        <GameScene />
      </Canvas>
      <UIOverlay />
    </div>
  );
}
