import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SECRET_KEY = new TextEncoder().encode(
  process.env.APP_PASSWORD || "dev-secret-key-change-me"
);
const COOKIE_NAME = "notebook-session";

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);
  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export async function getSessionFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session?.value) return false;
  return verifySession(session.value);
}

export async function verifySessionFromRequest(
  request: NextRequest
): Promise<boolean> {
  const session = request.cookies.get(COOKIE_NAME);
  if (!session?.value) return false;
  return verifySession(session.value);
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
