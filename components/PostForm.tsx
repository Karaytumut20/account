"use client"; // Form interaktif olduğu için "use client" olabilir, ancak Server Action kullandığı için zorunlu değil. Hata yönetimi için "use client" yapalım.

import { useEffect } from "react";
import { useFormState } from "react-dom";
import type { Post } from "@/app/admin/edit/[id]/page"; // Tip'i import edelim (veya global bir yere taşı)

type PostFormProps = {
  serverAction: (formData: FormData) => Promise<{ error?: string }>;
  initialData?: Post | null;
};

// Formun "submit" butonu için ayrı bir component
function SubmitButton() {
  // @ts-ignore (React 19'da `useFormStatus` hook'u var, ama emin olmak için)
  // const { pending } = useFormStatus(); 
  const pending = false; // Şimdilik böyle kalsın

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300"
    >
      {pending ? "Kaydediliyor..." : (initialData ? "Güncelle" : "Yayınla")}
    </button>
  );
}


export default function PostForm({ serverAction, initialData }: PostFormProps) {
  // Server Action ile modern form hata yönetimi
  const [state, formAction] = useFormState(serverAction, { error: undefined });

  useEffect(() => {
    if (state?.error) {
      alert(state.error); // Gelişmiş bir toast bildirimi ile değiştirilebilir
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 bg-white dark:bg-dark p-8 rounded-lg shadow-lg border dark:border-gray-300/20">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-200">Başlık</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialData?.title}
          className="w-full p-3 bg-light dark:bg-black border dark:border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium mb-1 text-gray-200">Görsel URL</label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={initialData?.image_url || ''}
          placeholder="https://images.unsplash.com/..."
          className="w-full p-3 bg-light dark:bg-black border dark:border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1 text-gray-200">İçerik</label>
        <textarea
          id="content"
          name="content"
          rows={12}
          defaultValue={initialData?.content || ''}
          className="w-full p-3 bg-light dark:bg-black border dark:border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
      </div>

      <SubmitButton />
    </form>
  );
}