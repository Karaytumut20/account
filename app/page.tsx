// app/page.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, useState, useEffect } from 'react';
import { ProjectCard } from '@/components/ProjectCard'; 
import { projects } from '@/lib/projects'; 
import DeveloperScene from '@/components/DeveloperScene'; 
import { ArrowDown } from 'lucide-react';

function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
      onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
    >
      {/* Zaten mordu, harika */}
      <span className="text-sm text-primary-light">Projelerimi Gör</span>
      <ArrowDown className="w-6 h-6 animate-bounce mt-2 text-primary-light" />
    </motion.div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="bg-background min-h-screen" />;
  }

  return (
    <>
      <div className="fixed inset-0 bg-background -z-10" />
      
      <main className="min-h-screen text-foreground overflow-x-hidden">
        
        {/* 1. BÖLÜM: HERO & 3D SAHNE */}
        <section className="relative h-screen flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-primary-light text-lg">Kod Girdabı Yükleniyor...</div>
              </div>
            }>
              <DeveloperScene />
            </Suspense>
          </div>
          
          <ScrollIndicator />
        </section>

        {/* 2. BÖLÜM: PROJELER */}
        <section id="projects" className="py-32 px-8 relative z-10 bg-background">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-center mb-20"
          >
            <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
              Öne Çıkan Projeler
            </span>
          </motion.h2>

          {/* ProjectCard'ın varsayılan metin rengi artık 'foreground' (açık mor) olacak */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {projects.map((proj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <ProjectCard title={proj.title} desc={proj.desc} tech={proj.tech} link={proj.link} image={proj.image} index={i} /> 
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. BÖLÜM: İLETİŞİM ÇAĞRISI */}
        <section className="py-32 px-8 text-center bg-gradient-to-t from-primary/10 to-transparent">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
              Birlikte harika bir şey inşa edelim.
            </span>
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            // DÜZELTME: Buton metnini de beyazdan (text-white) daha koyu bir mora (primary-dark) çevirdim
            className="px-10 py-4 bg-primary text-primary-dark font-bold text-lg rounded-lg shadow-lg transition-all"
          >
            İletişime Geç
          </motion.button>
        </section>

        {/* 4. BÖLÜM: FOOTER */}
        <footer className="py-16 text-center border-t border-primary-dark/30">
          {/* DÜZELTME: Footer metnini de soluk mor (primary) yaptık */}
          <p className="text-primary/70">
            © 2025 Umut Karaytuğ • Kod ve Tasarım
          </p>
        </footer>
      </main>
    </>
  );
}