// components/ProjectCard.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Project {
  title: string;
  desc: string;
  tech: string[];
  link: string;
  image: string;
}

export function ProjectCard({ title, desc, tech, link, image }: Project) {
  return (
    <motion.a
      href={link}
      target="_blank"
      whileHover={{ y: -8 }}
      className="group block"
    >
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-800/50 hover:border-purple-500 transition-all duration-300">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900 to-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-6 relative z-20">
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-purple-300 text-sm mb-4">{desc}</p>
          <div className="flex flex-wrap gap-2">
            {tech.map(t => (
              <span key={t} className="text-xs px-3 py-1 bg-purple-900/50 rounded-full border border-purple-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
}