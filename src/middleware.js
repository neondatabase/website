/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { checkCookie, getReferer } from 'app/actions';
import LINKS from 'constants/links';

import { isAIAgentRequest, getMarkdownPath } from './utils/ai-agent-detection';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

const ticketsProtectedRoutes = ['/generate-ticket', '/tickets'];

const extractHandleFromPath = (pathname) => pathname.split('/').slice(-2)[0];

const generateEditPageURL = (handle) => `${SITE_URL}/tickets/${handle}/edit`;

export async function middleware(req) {
  try {
    const { pathname } = req.nextUrl;

    // Handle AI agent requests - serve markdown instead of HTML
    const userAgent = req.headers.get('user-agent') || '';
    const accept = req.headers.get('accept') || '';

    // Temporary logging for debugging
    if (
      pathname.startsWith('/docs') ||
      pathname.startsWith('/guides') ||
      pathname.startsWith('/postgresql')
    ) {
      console.log('[AI Agent Detection]', {
        pathname,
        userAgent: userAgent.substring(0, 100),
        accept: accept.substring(0, 100),
        isAIAgent: isAIAgentRequest(req),
      });
    }

    if (isAIAgentRequest(req)) {
      const markdownPath = getMarkdownPath(pathname);

      if (markdownPath) {
        // Redirect to GitHub raw markdown file
        const githubRawBase = process.env.NEXT_PUBLIC_GITHUB_RAW_PATH;
        const markdownUrl = `${githubRawBase}${markdownPath}`;
        console.log('[AI Agent Redirect]', { pathname, markdownUrl });
        return NextResponse.redirect(markdownUrl);
      }
    }

    // Check if the user is logged in
    try {
      const isLoggedIn = await checkCookie('neon_login_indicator');
      if (pathname === '/' && isLoggedIn) {
        try {
          const referer = await getReferer();
          if (
            referer.includes(process.env.VERCEL_BRANCH_URL) ||
            referer.includes(process.env.NEXT_PUBLIC_DEFAULT_SITE_URL)
          ) {
            return NextResponse.redirect(new URL('/home', req.url));
          }
        } catch (error) {
          console.error('Error getting referer:', error);
        }
        return NextResponse.redirect(LINKS.console);
      }
      if (pathname === '/home' && !isLoggedIn) return NextResponse.redirect(new URL(SITE_URL));
    } catch (error) {
      console.error('Error checking login indicator:', error);
    }

    // Check for tickets protected routes
    if (ticketsProtectedRoutes.some((route) => pathname.startsWith(route))) {
      try {
        const token = await getToken({ req });
        const isAuthenticated = !!token?.gitHubHandle;

        if (isAuthenticated) {
          const userHandle = token.gitHubHandle;

          // Redirect authorized user to their edit page
          if (pathname === '/generate-ticket' || pathname.endsWith(`/tickets/${userHandle}`)) {
            return NextResponse.redirect(generateEditPageURL(userHandle));
          }

          // Prevent access to another user's edit page
          if (pathname.endsWith(`/edit`)) {
            const handleInPath = extractHandleFromPath(pathname);
            if (userHandle !== handleInPath) {
              return NextResponse.redirect(new URL(`${SITE_URL}/tickets/${handleInPath}`));
            }
          }
        }

        // Redirect unauthorized user trying to access an edit page
        if (pathname.endsWith(`/edit`)) {
          const handleInPath = extractHandleFromPath(pathname);
          return NextResponse.redirect(new URL(`${SITE_URL}/tickets/${handleInPath}`));
        }
      } catch (error) {
        console.error('Error during token processing:', error);
        // Fallback for token-related errors
        return NextResponse.redirect(new URL(SITE_URL));
      }
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
    '/',
    '/home',
    '/generate-ticket/:path*',
    '/tickets/:path*',
    '/docs/:path*',
    '/postgresql/:path*',
    '/guides/:path*',
    '/branching/:path*',
    '/programs/:path*',
  ],
};
