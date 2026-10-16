<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Dependencies: `npm ci` (Node 22, lockfile at the repo root). Dev server: `npm run dev` on port 3000. `next dev` listens on `0.0.0.0` by default.
- Open the UI at `http://localhost:3000`. Next.js 16 blocks dev assets and hot reload when the host is `127.0.0.1`, so the storefront does not hydrate on that host. API routes such as `/api/health` still respond there.
- Supabase is optional. With no Supabase URL and key, the app uses `.data/store.json` and seeds it on the first request (`dataSource` is `local` on `/api/health`).
- `npm run lint` and `npm run build` match CI. For the production build, set `USE_SUPABASE=false`.
- When `ADMIN_EMAIL` and `ADMIN_PASSWORD` are unset, admin login is `admintamduc` / `admin123` at `/admin/login`.
- The README mentions `.env.example`, but that file is not in the repo. Local development does not need an env file.
