import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const TRANSIENT =
  /UND_ERR_SOCKET|UND_ERR_CONNECT_TIMEOUT|ECONNRESET|ECONNREFUSED|ETIMEDOUT|fetch failed|other side closed|socket/i;

function errorText(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = "cause" in error && error.cause instanceof Error ? error.cause.message : "";
  return `${error.message} ${cause}`;
}

/** Retry undici keep-alive drops that Vercel serverless hits against Supabase. */
export const fetchWithRetry: typeof fetch = async (input, init) => {
  const headers = new Headers(init?.headers);
  headers.set("connection", "close");
  const nextInit = { ...init, headers };
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fetch(input, nextInit);
    } catch (error) {
      lastError = error;
      if (attempt === 2 || !TRANSIENT.test(errorText(error))) throw error;
      await new Promise((resolve) => setTimeout(resolve, 150 * 2 ** attempt));
    }
  }
  throw lastError;
};

let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env missing");
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchWithRetry },
  });
  return cached;
}
