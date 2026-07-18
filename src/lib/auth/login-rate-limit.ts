import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import { headers } from "next/headers";
import path from "path";
import { isSupabaseConfigured } from "@/lib/data/repository";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCAL_FILE = path.join(process.cwd(), ".data", "login-attempts.json");

type AttemptStore = Record<string, number[]>;

const memoryStore: AttemptStore = globalThis.__medistoreLoginAttempts ?? {};
globalThis.__medistoreLoginAttempts = memoryStore;

declare global {
  // eslint-disable-next-line no-var
  var __medistoreLoginAttempts: AttemptStore | undefined;
}

function readMemoryAttempts(ip: string, now = Date.now()): number[] {
  return pruneAttempts(memoryStore[ip] ?? [], now);
}

function writeMemoryAttempt(ip: string, now = Date.now()) {
  memoryStore[ip] = pruneAttempts([...(memoryStore[ip] ?? []), now], now);
}

function clearMemoryAttempts(ip: string) {
  delete memoryStore[ip];
}

async function readFallbackAttempts(ip: string, now = Date.now()): Promise<number[]> {
  if (!isSupabaseConfigured()) {
    const store = await readLocalAttempts();
    return pruneAttempts(store[ip] ?? [], now);
  }
  return readMemoryAttempts(ip, now);
}

async function writeFallbackAttempt(ip: string, now = Date.now()) {
  if (!isSupabaseConfigured()) {
    const store = await readLocalAttempts();
    store[ip] = pruneAttempts([...(store[ip] ?? []), now], now);
    await writeLocalAttempts(store);
    return;
  }
  writeMemoryAttempt(ip, now);
}

async function clearFallbackAttempts(ip: string) {
  if (!isSupabaseConfigured()) {
    const store = await readLocalAttempts();
    delete store[ip];
    await writeLocalAttempts(store);
    return;
  }
  clearMemoryAttempts(ip);
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip")?.trim() || "unknown";
}

function pruneAttempts(timestamps: number[], now = Date.now()): number[] {
  return timestamps.filter((t) => now - t < WINDOW_MS);
}

function isMissingTableError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("Could not find the table"))
  );
}

async function readLocalAttempts(): Promise<AttemptStore> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as AttemptStore;
  } catch {
    return {};
  }
}

async function writeLocalAttempts(store: AttemptStore) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(store), "utf8");
}

async function countRecentAttempts(ip: string): Promise<number[]> {
  const now = Date.now();
  if (isSupabaseConfigured()) {
    const sb = supabaseAdmin();
    if (sb) {
      const since = new Date(now - WINDOW_MS).toISOString();
      const { data, error } = await sb
        .from("admin_login_attempts")
        .select("attempted_at")
        .eq("ip", ip)
        .gte("attempted_at", since)
        .order("attempted_at", { ascending: false });
      if (!error && data) {
        return data.map((row) => new Date(String(row.attempted_at)).getTime());
      }
      if (error && !isMissingTableError(error)) {
        console.error("[login-rate-limit] read failed", error.message);
      }
    }
  }

  const store = await readFallbackAttempts(ip, now);
  return store;
}

export async function isLoginRateLimited(
  ip: string,
): Promise<{ limited: boolean; retryAfterSec?: number }> {
  const attempts = await countRecentAttempts(ip);
  if (attempts.length < MAX_ATTEMPTS) {
    return { limited: false };
  }
  const oldest = attempts[attempts.length - 1] ?? Date.now();
  const retryAfterMs = WINDOW_MS - (Date.now() - oldest);
  return {
    limited: true,
    retryAfterSec: Math.max(60, Math.ceil(retryAfterMs / 1000)),
  };
}

export async function recordFailedLogin(ip: string): Promise<void> {
  const now = Date.now();
  if (isSupabaseConfigured()) {
    const sb = supabaseAdmin();
    if (sb) {
      const { error } = await sb
        .from("admin_login_attempts")
        .insert({ ip, attempted_at: new Date(now).toISOString() });
      if (!error) return;
      if (!isMissingTableError(error)) {
        console.error("[login-rate-limit] insert failed", error.message);
      }
    }
  }

  await writeFallbackAttempt(ip, now);
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = supabaseAdmin();
    if (sb) {
      const { error } = await sb.from("admin_login_attempts").delete().eq("ip", ip);
      if (!error) return;
      if (!isMissingTableError(error)) {
        console.error("[login-rate-limit] clear failed", error.message);
      }
    }
  }

  await clearFallbackAttempts(ip);
}

export const LOGIN_RATE_LIMIT = {
  maxAttempts: MAX_ATTEMPTS,
  windowMinutes: WINDOW_MS / 60_000,
} as const;
