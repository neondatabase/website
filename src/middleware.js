/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { checkCookie, getReferer } from 'app/actions';
import LINKS from 'constants/links';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

const protectedRoutes = ['/generate-ticket', '/tickets'];

const extractHandleFromPath = (pathname) => pathname.split('/').slice(-2)[0];

const generateEditPageURL = (handle) => `${SITE_URL}/tickets/${handle}/edit`;

export async function middleware(req) {
  try {
    const { pathname } = req.nextUrl;

    // Exclude static files and API routes
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/api/')
    ) {
      return NextResponse.next();
    }

    // Check if user is logged in
    const is_logged_in = await checkCookie('neon_login_indicator');
    if (process.env.NODE_ENV === 'production' && is_logged_in) {
      const referer = await getReferer();
      if (
        referer.includes(process.env.VERCEL_BRANCH_URL) ||
        referer.includes(process.env.NEXT_PUBLIC_DEFAULT_SITE_URL)
      ) {
        return NextResponse.redirect('/home');
      }

      return NextResponse.redirect(LINKS.console);
    }

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      try {
        const token = await getToken({ req });
        const isAuthenticated = !!token?.githubHandle;

        if (isAuthenticated) {
          const userHandle = token.githubHandle;

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
