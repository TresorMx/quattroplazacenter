import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

// Acceso al panel /inventario: una contraseña compartida del equipo comercial
// (INVENTARIO_PASSWORD en Vercel) + el nombre de quien entra, que queda en
// la bitácora de cada cambio. La cookie va firmada con la contraseña: si se
// cambia la contraseña, todas las sesiones abiertas se invalidan.
const COOKIE = 'qinv';
const MAX_AGE = 60 * 60 * 12; // 12 h

const secret = () => process.env.INVENTARIO_PASSWORD ?? '';
const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url');

export const isConfigured = () => secret().length >= 8;

export function checkPassword(pw: string) {
  const a = Buffer.from(pw);
  const b = Buffer.from(secret());
  return isConfigured() && a.length === b.length && timingSafeEqual(a, b);
}

export async function startSession(name: string) {
  const payload = Buffer.from(JSON.stringify({ n: name.slice(0, 60), e: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/inventario', maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: '/inventario' });
}

/** Nombre de quien tiene sesión, o null. */
export async function currentUser(): Promise<string | null> {
  if (!isConfigured()) return null;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { n, e } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof n === 'string' && Date.now() < e ? n : null;
  } catch {
    return null;
  }
}
