"use client"; // Scroll animasyonu için "use client" ZORUNLUDUR

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PresentationControls, Stage, TorusKnot } from "@react-three/drei";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import Link from "next/link";

// Post tipini tanımla
type Post = {
  id: number;
  title: string;
};

// 3D Model Component'i
function Model({ scrollYProgress }: { scrollYProgress: any }) {
  const ref = useRef<THREE.Group>(null!);

  // Scroll ilerlemesine göre modeli döndür
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = scrollYProgress.get() * 8; // Kaydırdıkça 8 tam tur dönsün
      ref.current.rotation.x = scrollYProgress.get() * 4;
    }
  });

  return (
    <group ref={ref}>
      <TorusKnot args={[1, 0.3, 256, 32]} scale={1.2}>
        <meshStandardMaterial color="#f5f5f7" roughness={0.1} metalness={0.9} />
      </TorusKnot>
    </group>
  );
}

// Ana sayfa
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");
  
  // Bu component "use client" olduğu için, veriyi useEffect ile çekmeliyiz.
  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, title")
        .order("created_at", { ascending: false })
        .limit(5); // Sadece en son 5 postu göster
      setPosts(data || []);
      if (data && data.length > 0) {
        setCurrentTitle(data[0].title);
      }
    };
    fetchPosts();
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Tüm container boyunca
  });

  // Kaydırma pozisyonuna göre hangi başlığın "aktif" olduğunu bul
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * posts.length);
    if (posts[index] && currentTitle !== posts[index].title) {
      setCurrentTitle(posts[index].title);
    }
  });

  return (
    <main className="relative w-full" ref={containerRef}>
      {/* 1. 3D Model Alanı (Sabit Kalacak) */}
      <div className="h-screen w-full sticky top-0 flex flex-col items-center justify-center">
        {/* Başlık alanı */}
        <div className="absolute top-24 text-center z-10 p-4">
          <motion.h1 
            key={currentTitle} // key değiştiğinde animasyon tetiklenir
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold max-w-2xl"
          >
            {currentTitle || "Yükleniyor..."}
          </motion.h1>
        </div>
        
        {/* 3D Canvas */}
        <Canvas dpr={[1, 2]} camera={{ fov: 45 }} className="w-full h-full">
          <color attach="background" args={['#0a0a0a']} />
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Stage environment="city" intensity={0.5}>
              <Model scrollYProgress={scrollYProgress} />
            </Stage>
          </PresentationControls>
        </Canvas>
      </div>
      
      {/* 2. Post Listesi (Kaydırılabilir Alan) */}
      {/* Bu alan 3D modelin "altında" kayar ve scrollYProgress'i tetikler */}
      <div className="relative z-10 bg-dark text-light">
        {posts.map((post) => (
          <div key={post.id} className="h-screen flex items-center justify-center">
            <Link 
              href={`/post/${post.id}`} 
              className="text-3xl font-medium text-gray-200 hover:text-white transition-colors"
            >
              Devamını Oku
            </Link>
          </div>
        ))}
      </div>

      {/* Admin paneline gitmek için gizli bir link :) */}
      <Link href="/admin" className="absolute bottom-10 right-10 z-20 text-xs text-gray-200/50 hover:text-white">
        Admin
      </Link>
    </main>
  );
}