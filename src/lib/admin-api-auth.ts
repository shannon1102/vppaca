import { isAdminAuthenticated } from "@/lib/auth-admin";

export async function requireAdminApi(): Promise<Response | null> {
  const token = process.env.ADMIN_API_TOKEN;
  const authHeader = (globalThis as unknown as { __lastAuth?: string }).__lastAuth;

  if (token && authHeader === `Bearer ${token}`) return null;
  if (await isAdminAuthenticated()) return null;
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function readBearerToken(request: Request): string | undefined {
  const h = request.headers.get("authorization");
  if (!h?.startsWith("Bearer ")) return undefined;
  return h.slice(7);
}

export async function guardAdminApi(request: Request): Promise<Response | null> {
  const bearer = readBearerToken(request);
  (globalThis as unknown as { __lastAuth?: string }).__lastAuth = bearer
    ? `Bearer ${bearer}`
    : undefined;
  return requireAdminApi();
}
