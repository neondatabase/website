import { NextResponse } from 'next/server';

const CLAIMABLE_POSTGRES_API = 'https://pg.new/api/v1/database';
const DEFAULT_REF = 'neon-faster-page';

export async function POST(request) {
  try {
    let ref = DEFAULT_REF;
    try {
      const body = await request.json();
      if (body?.ref && typeof body.ref === 'string') {
        ref = body.ref;
      }
    } catch {
      // no body or invalid JSON – use default ref
    }

    const response = await fetch(CLAIMABLE_POSTGRES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message ?? data?.error?.message ?? response.statusText },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[deploy-postgres] Proxy error:', error);
    return NextResponse.json(
      { message: error?.message ?? 'Failed to create database' },
      { status: 500 }
    );
  }
}
