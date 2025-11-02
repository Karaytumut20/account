"use server"; 

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache"; 
import { redirect } from "next/navigation";

// Tip güvenliği için Post arayüzü
interface PostData {
  title: string;
  content: string;
  image_url?: string;
}

// CREATE
export async function createPost(formData: FormData) {
  const data: PostData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    image_url: formData.get("image_url") as string | undefined,
  };

  if (!data.title) return { error: "Başlık zorunludur." };

  const { error } = await supabase.from("posts").insert([data]);
  if (error) return { error: `Supabase Hatası: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// UPDATE
export async function updatePost(formData: FormData) {
  const id = formData.get("id") as string;
  const data: PostData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    image_url: formData.get("image_url") as string | undefined,
  };

  if (!id || !data.title) return { error: "ID ve Başlık zorunludur." };

  const { error } = await supabase.from("posts").update(data).match({ id });
  if (error) return { error: `Supabase Hatası: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/post/${id}`);
  redirect("/admin");
}

// DELETE
export async function deletePost(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { error: "ID zorunludur." };

  const { error } = await supabase.from("posts").delete().match({ id });
  if (error) return { error: `Supabase Hatası: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin");
}