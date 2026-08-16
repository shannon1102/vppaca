import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/data/repository";
import {
  extFromMime,
  safeFilename,
  uploadDatePrefix,
  validateImageFile,
} from "@/lib/media/helpers";
import type { MediaFile } from "@/lib/types";

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

function mapRow(row: Record<string, unknown>): MediaFile {
  return {
    id: String(row.id),
    original_name: String(row.original_name ?? ""),
    filename: String(row.filename),
    mime_type: String(row.mime_type),
    size_bytes: Number(row.size_bytes ?? 0),
    url: String(row.url),
    storage_key: String(row.storage_key),
    created_at: String(row.created_at),
  };
}

async function localSaveRecord(record: MediaFile): Promise<MediaFile> {
  await fs.mkdir(path.dirname(LOCAL_DB_FILE), { recursive: true });
  let list: MediaFile[] = [];
  try {
    list = JSON.parse(await fs.readFile(LOCAL_DB_FILE, "utf8")) as MediaFile[];
  } catch {
    list = [];
  }
  list.unshift(record);
  await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(list, null, 2), "utf8");
  return record;
}

export async function saveUploadedImage(file: File): Promise<MediaFile> {
  validateImageFile(file);

  const id = `${uploadDatePrefix()}-media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const ext = extFromMime(file.type);
  const storageKey = `${id}.${ext}`;
  const originalName = safeFilename(file.name || `image.${ext}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const sb = supabaseAdmin();
    const { error: upErr } = await sb.storage
      .from("media")
      .upload(storageKey, buffer, {
        contentType: file.type,
        upsert: false,
      });
    if (upErr) throw upErr;

    const { data: pub } = sb.storage.from("media").getPublicUrl(storageKey);
    const record: MediaFile = {
      id,
      original_name: originalName,
      filename: storageKey,
      mime_type: file.type,
      size_bytes: file.size,
      url: pub.publicUrl,
      storage_key: storageKey,
      created_at: now,
    };

    const { data, error } = await sb
      .from("media_files")
      .insert(record)
      .select("*")
      .single();
    if (error) throw error;
    return mapRow(data as Record<string, unknown>);
  }

  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, storageKey), buffer);

  const record: MediaFile = {
    id,
    original_name: originalName,
    filename: storageKey,
    mime_type: file.type,
    size_bytes: file.size,
    url: `/uploads/${storageKey}`,
    storage_key: storageKey,
    created_at: now,
  };
  return localSaveRecord(record);
}

export async function listMediaFiles(): Promise<MediaFile[]> {
  if (isSupabaseConfigured()) {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("media_files")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      if (error.code === "PGRST205") return [];
      throw error;
    }
    return (data ?? []).map((r) => mapRow(r as Record<string, unknown>));
  }

  try {
    const raw = await fs.readFile(LOCAL_DB_FILE, "utf8");
    return JSON.parse(raw) as MediaFile[];
  } catch {
    return [];
  }
}
