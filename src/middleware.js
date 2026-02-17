/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { NextResponse } from 'next/server';

import { checkCookie, getReferer } from 'app/actions';
import { CONTENT_ROUTES } from 'constants/content';
import LINKS from 'constants/links';

import { isAIAgentRequest, getMarkdownPath } from './utils/ai-agent-detection';
import llmsRedirectMap from './utils/llms-redirect-map.json';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

function isContentRoute(pathname) {
  const path = pathname.slice(1).replace(/\/$/, ''); // strip leading + trailing slashes
  return Object.keys(CONTENT_ROUTES).some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

function applyDocHeaders(response) {
  response.headers.append('Vary', 'Accept');
  response.headers.set('X-LLMs-Txt', '/docs/llms.txt');
  response.headers.append('Link', '</docs/llms.txt>; rel="llms-txt"');
  return response;
}

export async function middleware(req) {
  try {
    const { pathname } = req.nextUrl;

    // Legacy /llms/*.txt redirect (deprecated URLs -> canonical .md URLs)
    if (pathname.startsWith('/llms/')) {
      const filename = pathname.replace('/llms/', '');
      const target = llmsRedirectMap[filename];
      if (target) {
        return NextResponse.redirect(new URL(target, req.url), { status: 301 });
      }
      // No match in map = fall through to 404 naturally
    }

    if (isAIAgentRequest(req)) {
      const markdownPath = getMarkdownPath(pathname);

      if (markdownPath) {
        try {
          const markdownUrl = `${req.nextUrl.origin}${markdownPath}`;

          const response = await fetch(markdownUrl);

          if (!response.ok) {
            // Only log unexpected errors (500, network issues, etc.)
            if (response.status !== 404) {
              console.error('[AI Agent] Failed to fetch markdown', {
                pathname,
                markdownPath,
                status: response.status,
              });
            }
            // Fall through to isContentRoute below
          } else {
            const markdown = await response.text();

            // Return markdown content directly with appropriate headers
            return applyDocHeaders(
              new NextResponse(markdown, {
                status: 200,
                headers: {
                  'Content-Type': 'text/plain; charset=utf-8',
                  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
                  'X-Content-Source': 'markdown',
                  'X-Robots-Tag': 'noindex',
                },
              })
            );
          }
        } catch (error) {
          console.error('[AI Agent] Error serving markdown', { pathname, error: error.message });
          // Fall through to isContentRoute below
        }
      }
    }

    // Apply doc headers to all content route responses (.md URLs and HTML pages)
    // Note: Vary: Accept is set in next.config.js for this path because Next.js's
    // renderer overwrites middleware Vary values. The AI agent path above uses
    // applyDocHeaders() which includes Vary since that response bypasses rendering.
    if (isContentRoute(pathname)) {
      const response = NextResponse.next();
      response.headers.set('X-LLMs-Txt', '/docs/llms.txt');
      response.headers.append('Link', '</docs/llms.txt>; rel="llms-txt"');
      if (pathname.endsWith('.md')) {
        response.headers.set('X-Robots-Tag', 'noindex');
      }
      return response;
    }

    // Check if the user is logged in
    try {
      const isLoggedIn = await checkCookie('neon_login_indicator');
      if (pathname === '/' && isLoggedIn) {
        try {
          const referer = await getReferer();
          // If user is already browsing the site, show them the homepage
          if (
            referer.includes(process.env.VERCEL_BRANCH_URL) ||
            referer.includes(process.env.NEXT_PUBLIC_DEFAULT_SITE_URL)
          ) {
            return NextResponse.redirect(new URL('/home', req.url));
          }
        } catch (error) {
          console.error('Error getting referer:', error);
        }
        // If user came from external source, redirect to console
        return NextResponse.redirect(LINKS.console);
      }
      // If not logged in but on /home, redirect to main homepage
      if (pathname === '/home' && !isLoggedIn) {
        return NextResponse.redirect(new URL(SITE_URL));
      }
    } catch (error) {
      console.error('Error checking login indicator:', error);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware execution error:', error);
    // General error fallback
    return NextResponse.redirect(new URL(SITE_URL));
  }
}

export const config = {
  matcher: [
    '/', // Check if the user is logged in
    '/home', // Check if the user is logged in
    '/llms/:path*', // Legacy .txt redirect
    '/(docs|postgresql|guides|branching|programs|use-cases)/:path*', // All markdown routes
  ],
};
