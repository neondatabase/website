import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';

export const runtime = 'nodejs';

const SECRET = process.env.PIXEL_HMAC_SECRET;
const FIVE_MIN = 5 * 60 * 1000;
const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64');

const actions = ['set', 'clear'] as const;
type Action = (typeof actions)[number];
const COOKIE_NAME = '__Secure-neon_login_indicator';

export async function GET(req: NextRequest) {
  if (!SECRET) {
    console.error('PIXEL_HMAC_SECRET missing');
    return NextResponse.json({ error: 'server config' }, { status: 500 });
  }

  const sp = req.nextUrl.searchParams;
  const action = sp.get('action') as Action;
  const t = Number(sp.get('t'));
  const s = sp.get('s');

  if (!action || !actions.includes(action) || !t || !s)
    return NextResponse.json({ error: 'bad request' }, { status: 400 });

  if (Date.now() - t > FIVE_MIN) return NextResponse.json({ error: 'expired' }, { status: 400 });

  const expected = createHmac('sha256', SECRET).update(`${action}:${t}`).digest('base64url');
  if (expected !== s) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const res = new NextResponse(GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });

  const cookieBase = {
    domain: '.neon.com',
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'none' as const,
  };

  if (action === 'set') {
    res.cookies.set({
      ...cookieBase,
      name: COOKIE_NAME,
      value: '1',
      maxAge: 60 * 60 * 24 * 7,
    });
  } else {
    res.cookies.set({ ...cookieBase, name: COOKIE_NAME, value: '', maxAge: 0 });
  }

  return res;
}
