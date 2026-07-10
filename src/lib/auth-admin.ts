import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE = "ms_admin_session";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function expectedAdminToken(): string {
  const email = process.env.ADMIN_EMAIL ?? "admin@medistore.vn";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  return hash(`${email}:${password}:medistore`);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  const expected = expectedAdminToken();
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE, expectedAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "admin@medistore.vn";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  return email === expectedEmail && password === expectedPassword;
}
