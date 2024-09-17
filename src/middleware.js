/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  // Add any assets or page that you don't want to run middleware on
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req });
  // if token exists, user is authorized
  if (token?.githubHandle) {
    // authorized user should be moved to his ticket edit page from anywhere
    if (
      pathname === '/generate-ticket' ||
      pathname === '/deploy' ||
      pathname.endsWith(`/tickets/${token.githubHandle}`)
    ) {
      return NextResponse.redirect(new URL(`${SITE_URL}/tickets/${token.githubHandle}/edit`));
    }
    // if user is authorized but tries to access another user's edit page, redirect to /tickets/:handle
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
