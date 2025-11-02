// app/portfolio/page.tsx
'use client';

import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/lib/projects';

export default function Portfolio() {
  return (
    <section className="min-h-screen py-20 px-8">
      <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        Projelerim
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((proj, i) => (
          <ProjectCard key={i} {...proj} index={i} />
        ))}
      </div>
    </section>
  );
}