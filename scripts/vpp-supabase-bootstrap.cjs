/**
 * Apply SQL migrations + seed VPP catalog on remote Supabase.
 *
 * Requires in .env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_DB_PASSWORD  (Settings → Database → database password)
 *
 * Usage: node scripts/vpp-supabase-bootstrap.cjs
 */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const root = path.join(__dirname, "..");

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      )
        v = v.slice(1, -1);
      if (!env[m[1]]) env[m[1]] = v;
    }
  }
  return env;
}

function projectRef(supabaseUrl) {
  const m = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!m) throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL");
  return m[1];
}

function sbHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

async function sbFetch(env, route, opts = {}) {
  const base = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${base}${route}`, {
    ...opts,
    headers: { ...sbHeaders(key), ...(opts.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${route} (${res.status}): ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function runMigrations(env) {
  const password = env.SUPABASE_DB_PASSWORD || env.DATABASE_PASSWORD;
  if (!password) {
    throw new Error(
      "Missing SUPABASE_DB_PASSWORD in .env — copy from Supabase → Project Settings → Database → Database password",
    );
  }
  const ref = projectRef(env.NEXT_PUBLIC_SUPABASE_URL);
  const poolerHost =
    env.SUPABASE_POOLER_HOST || "aws-0-ap-northeast-1.pooler.supabase.com";
  const connectionString =
    env.DATABASE_URL ||
    `postgresql://postgres.${ref}:${encodeURIComponent(password)}@${poolerHost}:5432/postgres`;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const migDir = path.join(root, "supabase/migrations");
  const files = fs
    .readdirSync(migDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migDir, file), "utf8");
    process.stdout.write(`migration ${file} ... `);
    await client.query(sql);
    console.log("ok");
  }
  await client.end();
}

async function ensureStorage(env) {
  try {
    await sbFetch(env, "/storage/v1/bucket", {
      method: "POST",
      body: JSON.stringify({ name: "media", public: true }),
    });
    console.log("storage bucket media: created");
  } catch (e) {
    if (String(e.message).includes("already exists")) {
      console.log("storage bucket media: exists");
    } else {
      console.warn("storage bucket:", e.message);
    }
  }
}

async function seedFromTsExport(env) {
  // Dynamic import compiled seed via tsx subprocess
  const { execSync } = require("child_process");
  execSync("npx tsx scripts/vpp-supabase-seed.ts", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

async function main() {
  const env = loadEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  }

  await runMigrations(env);
  await ensureStorage(env);
  await seedFromTsExport(env);

  const count = await sbFetch(
    env,
    "/rest/v1/products?select=id&limit=1",
  ).catch(() => null);
  console.log("Bootstrap complete.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
