"use client"; // 3D sahneler interaktif olduğu için "use client" zorunludur.

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Torus } from '@react-three/drei';

export default function Scene() {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border dark:border-zinc-800 mb-12">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        {/* Işıklandırma */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {/* Obje (Dönen bir torus) */}
        <Torus args={[1, 0.4, 32, 100]}>
          <meshStandardMaterial color="#007bff" />
        </Torus>

        {/* Kontroller (Mouse ile objeyi döndürmeni sağlar) */}
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}