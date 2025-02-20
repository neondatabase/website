/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { NextResponse } from 'next/server';

import { checkCookie, getReferer } from 'app/actions';
import LINKS from 'constants/links';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function middleware(req) {
  try {
    const { pathname } = req.nextUrl;

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

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware execution error:', error);
    // General error fallback
    return NextResponse.redirect(new URL(SITE_URL));
  }
}

export const config = {
  matcher: ['/', '/home'],
};
