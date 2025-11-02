// components/LuxuryProjectCard.tsx
'use client';

import { motion } from 'framer-motion';

interface Project {
  title: string;
  desc: string;
  tech: string[];
  link: string;
  image: string;
}

export function LuxuryProjectCard({ title, desc, tech, link, image }: Project) {
  return (
    <motion.a
      href={link}
      target="_blank"
      whileHover={{ y: -20, scale: 1.05 }}
      className="group relative block"
    >
      <div className="relative overflow-hidden rounded-3xl border-4 border-yellow-600/50 shadow-2xl bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
        <img 
          src={image} 
          alt={title} 
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
          <h3 className="text-3xl font-bold text-yellow-400 mb-2">{title}</h3>
          <p className="text-yellow-200 mb-4">{desc}</p>
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <span key={t} className="px-4 py-2 bg-yellow-600/30 rounded-full text-yellow-300 text-sm border border-yellow-500">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
}