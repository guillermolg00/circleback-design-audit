import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { AUTH_COOKIE, authToken, safeEqual } from '@/lib/auth';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

// The unlock page and its form handler are the only routes reachable without the password.
const PUBLIC_PATHS = new Set(['/unlock', '/api/unlock']);

function noindex(response: NextResponse) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!PUBLIC_PATHS.has(pathname)) {
    const password = process.env.SITE_PASSWORD;
    // Fail closed: without a configured password nothing is served.
    if (!password) {
      return noindex(new NextResponse('SITE_PASSWORD is not configured.', { status: 503 }));
    }

    const cookie = request.cookies.get(AUTH_COOKIE)?.value ?? '';
    if (!safeEqual(cookie, await authToken(password))) {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return noindex(new NextResponse('Unauthorized', { status: 401 }));
      }
      const unlock = new URL('/unlock', request.url);
      unlock.searchParams.set('next', pathname + search);
      return noindex(NextResponse.redirect(unlock));
    }
  }

  const result = rewriteSuffix(pathname);
  if (result) {
    return noindex(NextResponse.rewrite(new URL(result, request.nextUrl)));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(pathname);

    if (result) {
      return noindex(
        NextResponse.rewrite(new URL(result, request.nextUrl), {
          // this URL has two representations, selected by `Accept`
          headers: { Vary: 'Accept' },
        }),
      );
    }
  }

  return noindex(NextResponse.next());
}

export const config = {
  // Everything is gated (pages, screenshots in /img, search, llms.txt, OG images) except the
  // framework's static chunks and the brand assets the unlock page itself needs.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|apple-icon.png|brand/).*)'],
};
