import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions";

async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export default async function AdminDashboard() {
  const posts = await getPosts();

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Gönderi Yönetimi</h1>
      <div className="bg-white dark:bg-dark p-6 rounded-lg shadow-lg border dark:border-gray-300/20">
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="flex justify-between items-center border-b dark:border-gray-300/20 pb-4 last:border-b-0">
              <div>
                <span className="text-lg font-medium">{post.title}</span>
                <p className="text-sm text-gray-200">
                  {new Date(post.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/edit/${post.id}`} className="text-blue-500 hover:text-blue-400">
                  <Pencil size={18} />
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="text-red-500 hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}