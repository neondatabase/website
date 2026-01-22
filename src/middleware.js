/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { NextResponse } from 'next/server';

import { checkCookie, getReferer } from 'app/actions';
import LINKS from 'constants/links';

import { isAIAgentRequest, getMarkdownPath } from './utils/ai-agent-detection';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function middleware(req) {
  try {
    const { pathname } = req.nextUrl;

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

            return NextResponse.next(); // Serve HTML page instead
          }

          const markdown = await response.text();

          // Return markdown content directly with appropriate headers
          return new NextResponse(markdown, {
            status: 200,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'public, max-age=3600, s-maxage=86400',
              'X-Content-Source': 'markdown',
              'X-Robots-Tag': 'noindex',
            },
          });
        } catch (error) {
          console.error('[AI Agent] Error serving markdown', { pathname, error: error.message });
          return NextResponse.next();
        }
      }
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
    '/(docs|postgresql|guides|branching|programs|use-cases)/:path*', // All markdown routes
  ],
};
