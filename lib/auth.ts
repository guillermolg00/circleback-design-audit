/**
 * Password gate for the whole site. The password lives only in the SITE_PASSWORD env var;
 * the cookie holds an HMAC of it, so changing the password signs everyone out.
 */
export const AUTH_COOKIE = 'cb_audit';
export const AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const encoder = new TextEncoder();

export async function authToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode('circleback-design-audit'));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time comparison, so response timing reveals nothing about the token. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Only same-site paths are valid destinations after unlocking. */
export function safeNext(next: unknown): string {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/';
}
