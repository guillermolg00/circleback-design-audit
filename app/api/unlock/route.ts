import { NextResponse } from 'next/server';
import { AUTH_COOKIE, AUTH_MAX_AGE, authToken, safeEqual, safeNext } from '@/lib/auth';

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(form.get('next'));
  const attempt = form.get('password');
  const password = process.env.SITE_PASSWORD;

  if (password && typeof attempt === 'string' && safeEqual(await authToken(attempt), await authToken(password))) {
    const response = NextResponse.redirect(new URL(next, request.url), 303);
    response.cookies.set(AUTH_COOKIE, await authToken(password), {
      httpOnly: true,
      secure: new URL(request.url).protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_MAX_AGE,
    });
    return response;
  }

  // A short pause on every failed attempt makes guessing slow.
  await new Promise((resolve) => setTimeout(resolve, 800));
  const retry = new URL('/unlock', request.url);
  retry.searchParams.set('error', '1');
  retry.searchParams.set('next', next);
  return NextResponse.redirect(retry, 303);
}
