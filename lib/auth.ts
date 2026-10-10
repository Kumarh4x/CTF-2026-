import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'blackvault_super_secret_jwt_key_ctf_2026';

export interface SessionUser {
  id: number;
  username: string;
  role: string;
}

export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  const items = cookieHeader.split(';');
  for (const item of items) {
    const parts = item.trim().split('=');
    const name = parts[0];
    if (name) {
      cookies[name] = decodeURIComponent(parts.slice(1).join('='));
    }
  }
  return cookies;
}

export function verifySession(cookieHeader?: string): SessionUser | null {
  try {
    const cookies = parseCookies(cookieHeader);
    const token = cookies.session;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export function createSessionToken(user: { id: number; username: string; role: string }): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
}
