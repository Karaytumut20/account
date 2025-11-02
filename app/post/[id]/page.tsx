import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) notFound();
  return data;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    // <main> etiketine layout'tan kaldırdığımız kısıtlamaları ekledik.
    // Artık 3D ana sayfa tam ekran olurken, bu sayfa okunaklı kalacak.
    <main className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
      <Link href="/" className="flex items-center gap-2 text-gray-200 hover:text-white mb-8">
        <ArrowLeft size={16} />
        Geri Dön
      </Link>
      
      <article>
        {post.image_url && (
          <div className="relative w-full h-[500px] mb-8 rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          {post.title}
        </h1>
        
        <p className="text-lg text-gray-200 mb-8">
          Yayınlanma: {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="prose prose-invert prose-lg max-w-none text-light/90 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>
    </main>
  );
}

// Bu fonksiyon, Next.js'e bu sayfaların statik olarak oluşturulabileceğini söyler (performans için)
export async function generateStaticParams() {
  const { data: posts } = await supabase.from('posts').select('id');
  return posts?.map(post => ({
    id: post.id.toString(),
  })) || [];
}