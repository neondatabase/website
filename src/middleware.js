/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { checkCookie, getReferer } from 'app/actions';
import LINKS from 'constants/links';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req });
  const isLoggedIn = await checkCookie('neon_login_indicator', req);
  const referer = await getReferer(req);

  if (process.env.NODE_ENV === 'production' && isLoggedIn) {
    if (
      referer.includes(process.env.VERCEL_BRANCH_URL) ||
      referer.includes(process.env.NEXT_PUBLIC_DEFAULT_SITE_URL)
    ) {
      return NextResponse.redirect(new URL(`${SITE_URL}/home`));
    }
    return NextResponse.redirect(new URL(LINKS.console));
  }

  if (token?.githubHandle) {
    if (pathname === '/generate-ticket' || pathname.endsWith(`/tickets/${token.githubHandle}`)) {
      return NextResponse.redirect(new URL(`${SITE_URL}/tickets/${token.githubHandle}/edit`));
    }
    if (pathname.endsWith(`/edit`) && token?.githubHandle !== pathname.split('/').slice(-2)[0]) {
      return NextResponse.redirect(
        new URL(`${SITE_URL}${pathname.split('/').slice(0, -1).join('/')}`)
      );
    }
  } else if (pathname.endsWith(`/edit`)) {
    if (!token?.githubHandle) {
      return NextResponse.redirect(
        new URL(`${SITE_URL}${pathname.split('/').slice(0, -1).join('/')}`)
      );
    }
  }

  return NextResponse.next();
}
