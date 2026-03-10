import {
  createClient as createSupabaseClient,
  SupabaseClient,
} from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // В проде без env просто создаём "пустой" клиент, чтобы билд өтсін.
    // Запростар сәтті болмауы мүмкін, бірақ бет құламайды.
    _client = createSupabaseClient(
      "https://example.supabase.co",
      "public-anon-key-placeholder"
    );
    return _client;
  }
  _client = createSupabaseClient(url, key);
  return _client;
}
