import { createPost } from "@/app/actions";
import PostForm from "@/components/PostForm"; // Formu component haline getirelim

export default function NewPostPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Yeni Gönderi Oluştur</h1>
      {/* Formu component'leştirmek (PostForm), hem 'new' hem de 'edit' 
        sayfalarında aynı formu kullanmamızı sağlar. Bu, temiz koddur.
      */}
      <PostForm serverAction={createPost} />
    </div>
  );
}