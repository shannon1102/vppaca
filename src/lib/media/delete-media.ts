import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/data/repository";
import {
  extractManagedImageUrlsFromHtml,
  normalizeImageSrc,
  storageKeyFromUrl,
} from "@/lib/media/helpers";
import type { HealthArticle, MediaFile } from "@/lib/types";

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const LOCAL_DB_FILE = path.join(process.cwd(), ".data", "media.json");

function supabaseAdmin() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase env missing");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function collectArticleMediaUrls(article: HealthArticle): string[] {
  const urls = new Set<string>();

  if (article.cover_image_url) {
    const cover = normalizeImageSrc(article.cover_image_url);
    if (storageKeyFromUrl(cover)) urls.add(cover);
  }

  for (const url of extractManagedImageUrlsFromHtml(article.content)) {
    urls.add(url);
  }

  return [...urls];
}

async function deleteMediaByStorageKey(storageKey: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = supabaseAdmin();
    const { error: storageErr } = await sb.storage
      .from("media")
      .remove([storageKey]);
    if (storageErr) {
      console.error("[media] storage remove failed", storageKey, storageErr);
    }

    const { error: dbErr } = await sb
      .from("media_files")
      .delete()
      .eq("storage_key", storageKey);
    if (dbErr && dbErr.code !== "PGRST205") {
      console.error("[media] media_files delete failed", storageKey, dbErr);
    }
    return;
  }

  try {
    await fs.unlink(path.join(LOCAL_UPLOAD_DIR, storageKey));
  } catch {
    /* file may already be gone */
  }

  try {
    const raw = await fs.readFile(LOCAL_DB_FILE, "utf8");
    const list = JSON.parse(raw) as MediaFile[];
    const filtered = list.filter((m) => m.storage_key !== storageKey);
    if (filtered.length !== list.length) {
      await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(filtered, null, 2), "utf8");
    }
  } catch {
    /* local media index may not exist */
  }
}

export async function deleteMediaByUrls(urls: string[]): Promise<void> {
  const keys = new Set<string>();
  for (const url of urls) {
    const key = storageKeyFromUrl(normalizeImageSrc(url));
    if (key) keys.add(key);
  }
  await Promise.all([...keys].map((key) => deleteMediaByStorageKey(key)));
}

export async function deleteArticleMedia(article: HealthArticle): Promise<void> {
  await deleteMediaByUrls(collectArticleMediaUrls(article));
}
