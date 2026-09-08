import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  console.warn("Supabase is not configured. Public pages will remain available, but account features are disabled.");
}

export const supabase = createClient(
  supabaseUrl ?? "https://missing-config.supabase.co",
  supabaseAnonKey ?? "missing-config",
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  },
);
