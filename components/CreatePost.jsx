"use client"; // Form ve state yönetimi için bu zorunlu

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation'; // Sayfayı yenilemek için

function CreatePost() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter(); // Next.js App Router hook'u

  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun sayfayı yeniden yüklemesini engelle
    setLoading(true);
    setError(null);

    if (!title) {
      setError('Başlık boş olamaz.');
      setLoading(false);
      return;
    }

    try {
      // Supabase 'posts' tablosuna yeni veriyi ekle
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          { title: title } // 'title' kolonuna state'deki 'title' değerini ata
        ]);

      if (insertError) {
        throw insertError; // Hata varsa yakala
      }

      setTitle(''); // Başarılıysa input'u temizle
      alert('Gönderi başarıyla eklendi!');
      
      // ÇOK ÖNEMLİ:
      // Yeni postun listede görünmesi için sayfadaki veriyi yeniden çekmemiz lazım.
      // router.refresh() komutu, sunucudan veriyi tekrar çeker ve MyPostsComponent'in güncellenmesini sağlar.
      router.refresh(); 

    } catch (error) {
      console.error("Ekleme hatası:", error.message);
      setError(error.message);
    } finally {
      setLoading(false); // İşlem bitince butonu tekrar aktif et
    }
  };

  return (
    <div className="w-full max-w-md p-6 mb-8 bg-white rounded-lg shadow-md dark:bg-zinc-900 border dark:border-zinc-800">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
        Yeni Gönderi Ekle
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Başlık
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black dark:text-white"
            placeholder="Gönderi başlığı girin..."
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Ekleniyor...' : 'Ekle'}
        </button>
        
        {error && <p className="mt-2 text-sm text-red-600">Hata: {error}</p>}
      </form>
    </div>
  );
}

export default CreatePost;