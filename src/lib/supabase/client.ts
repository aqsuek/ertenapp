import {
  createClient as createSupabaseClient,
  SupabaseClient,
} from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (_client) return _client;
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_KEY;

  // Егер Supabase конфигі мүлдем берілмесе, қате лақтырамыз –
  // бұл жағдайда нақты база да жоқ деген сөз.
  if (!url || !key) {
    throw new Error(
      "Supabase env variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_KEY)."
    );
  }

  _client = createSupabaseClient(url, key);
  return _client;
}
