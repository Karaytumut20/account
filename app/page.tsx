// app/page.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Trail, MeshDistortMaterial, Stars, Text3D, Center } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, useRef, useState, useEffect } from 'react';
import { Howl } from 'howler';
import { LuxuryProjectCard } from '@/components/LuxuryProjectCard';
import { projects } from '@/lib/projects';

function LuxuryRolex() {
  const meshRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Trail width={10} length={12} color="#ffd700" attenuation={(t) => t * t}>
        <group
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <mesh ref={meshRef} scale={[2.5, 2.5, 0.6]}>
            <cylinderGeometry args={[1, 1, 1, 64]} />
            <MeshDistortMaterial
              color="#1a1a1a"
              metalness={1}
              roughness={0.05}
              emissive="#ffd700"
              emissiveIntensity={hovered ? 2 : 1}
              distort={hovered ? 0.3 : 0.1}
              speed={3}
            />
          </mesh>

          <mesh position={[0, 0, 0.31]}>
            <circleGeometry args={[0.9, 64]} />
            <meshStandardMaterial color="#000" emissive="#ffd700" emissiveIntensity={1.5} />
          </mesh>

          <Center position={[0, 0.6, 0.32]}>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={0.25}
              height={0.05}
            >
              XII
              <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} />
            </Text3D>
          </Center>

          <Sparkles count={200} scale={6} size={4} speed={1.2} opacity={0.9} color="#ffd700" />
        </group>
      </Trail>

      <Stars radius={120} depth={60} count={7000} factor={5} saturation={1} fade speed={2} />
    </Float>
  );
}

function Luxury3DScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={3} color="#ffd700" />
      <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#b8860b" />
      <Suspense fallback={null}>
        <LuxuryRolex />
      </Suspense>
    </Canvas>
  );
}

function AIAssistant() {
  const [listening, setListening] = useState(false);

  const speak = () => {
    setListening(true);
    const sound = new Howl({ src: ['https://www.soundjay.com/buttons/button-09.mp3'], volume: 0.5 });
    sound.play();
    const utterance = new SpeechSynthesisUtterance("Lüks bir deneyim sunuyorum, efendim.");
    utterance.lang = 'tr-TR';
    speechSynthesis.speak(utterance);
    setTimeout(() => setListening(false), 3000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      onClick={speak}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-2xl flex items-center justify-center z-50"
    >
      <motion.div
        animate={{ rotate: listening ? 360 : 0 }}
        transition={{ duration: 1, repeat: listening ? Infinity : 0 }}
        className="w-8 h-8 bg-black rounded-full"
      />
    </motion.button>
  );
}

function ScrollStory() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20"
    >
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
        LUXURY DEVELOPER
      </h1>
      <p className="text-2xl text-yellow-300 mt-4">Scroll to explore excellence</p>
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-10" />
      <AIAssistant />
      
      <main className="min-h-screen text-white overflow-x-hidden">
        <section className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0">
            <Luxury3DScene />
          </div>
          <ScrollStory />
        </section>

        <section className="py-32 px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent"
          >
            Umut Karaytuğ
          </motion.h2>
          <p className="text-2xl text-yellow-300 mt-6 max-w-4xl mx-auto">
            Lüks web deneyimleri tasarlayan, AI ve 3D teknolojilerini birleştiren bir Full-Stack Developer.
          </p>
        </section>

        <section className="py-32 px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-6xl font-bold text-center mb-20 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent"
          >
            Lüks Projelerim
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {projects.map((proj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <LuxuryProjectCard {...proj} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-32 px-8 text-center bg-gradient-to-t from-yellow-900/20 to-transparent">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent"
          >
            Birlikte Lüks Bir Şeyler Yaratabiliriz
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="px-12 py-6 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full text-black font-bold text-xl shadow-2xl"
          >
            İletişime Geç
          </motion.button>
        </section>

        <footer className="py-16 text-center border-t border-yellow-600/30">
          <p className="text-yellow-400 text-lg">
            © 2025 Umut Karaytuğ • Lüks Web Deneyimleri
          </p>
        </footer>
      </main>
    </>
  );
}