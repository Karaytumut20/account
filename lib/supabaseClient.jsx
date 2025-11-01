import { createClient } from "@supabase/supabase-js";

// Bu dosya bir JSX bileşeni DEĞİLDİR. Bu bir yardımcı (utility) dosyasıdır.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);