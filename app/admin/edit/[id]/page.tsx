import { updatePost } from "@/app/actions";
import PostForm from "@/components/PostForm";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) notFound();
  return data;
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Gönderiyi Düzenle</h1>
      <PostForm 
        serverAction={updatePost} 
        initialData={post} // Mevcut veriyi forma yolla
      />
    </div>
  );
}