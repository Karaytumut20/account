'use client';

import { useState } from 'react';

export default function Admin() {
  const [form, setForm] = useState({
    title: '', desc: '', tech: '', link: '', image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tech: form.tech.split(',') })
    });
    if (res.ok) alert('Proje eklendi!');
  };

  return (
    <div className="min-h-screen py-20 px-8 max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-10">Admin Paneli</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          placeholder="Proje Adı"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg"
        />
        <textarea
          placeholder="Açıklama"
          value={form.desc}
          onChange={e => setForm({ ...form, desc: e.target.value })}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg h-24"
        />
        <input
          placeholder="Teknolojiler (virgülle ayrılmış)"
          value={form.tech}
          onChange={e => setForm({ ...form, tech: e.target.value })}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg"
        />
        <input
          placeholder="Link"
          value={form.link}
          onChange={e => setForm({ ...form, link: e.target.value })}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg"
        />
        <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold">
          Proje Ekle
        </button>
      </form>
    </div>
  );
}