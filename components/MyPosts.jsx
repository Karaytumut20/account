import React, { useState, useEffect } from 'react';
// 1. Adım'da oluşturduğun istemciyi import et
import { supabase } from '../lib/supabaseClient'; 

function MyPostsComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Veriyi çekmek için asenkron bir fonksiyon oluştur
    async function fetchPosts() {
      try {
        setLoading(true);
        // 2. Supabase istemcisini kullanarak 'posts' tablosundan veri çek
        // ('posts' yerine kendi tablo adını yazmalısın)
        let { data, error } = await supabase
          .from('posts')
          .select('*'); // Tüm kolonları seç

        if (error) {
          throw error;
        }
        
        if (data) {
          setPosts(data);
        }
      } catch (error) {
        console.error("Veri çekerken hata:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []); // Boş dizi, bu fonksiyonun sadece component ilk yüklendiğinde çalışmasını sağlar

  if (loading) {
    return <div>Yükleniyor...</div>; // Bu bir JSX elementidir
  }

  // 3. Veriyi JSX kullanarak ekrana bas
  return (
    <div> {/* <-- JSX burada başlıyor */}
      <h1>Gönderilerim</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title} {/* 'title' yerine kendi kolon adını yaz */}
          </li>
        ))}
      </ul>
    </div> /* <-- JSX burada bitiyor */
  );
}

export default MyPostsComponent;