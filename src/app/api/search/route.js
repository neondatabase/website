import { NextResponse } from 'next/server';

import {
  composeServerTiming,
  parseSiteSearchHits,
  parseSiteSearchRequest,
} from 'utils/site-search-request';

const SEARCH_FAILED = 'Search failed.';

export async function POST(request) {
  const searchUrl = process.env.NEON_AGENT_SITE_SEARCH_URL?.trim();
  if (!searchUrl) {
    return NextResponse.json({ error: 'Search is not configured' }, { status: 503 });
  }

  let raw;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let body;
  try {
    body = parseSiteSearchRequest(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let response;
  const originStarted = performance.now();
  try {
    response = await fetch(searchUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ error: SEARCH_FAILED }, { status: 502 });
  }
  const proxyMs = performance.now() - originStarted;

  if (!response.ok) {
    return NextResponse.json({ error: SEARCH_FAILED }, { status: 502 });
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    return NextResponse.json({ error: SEARCH_FAILED }, { status: 502 });
  }

  let hits;
  try {
    hits = parseSiteSearchHits(payload);
  } catch {
    return NextResponse.json({ error: SEARCH_FAILED }, { status: 502 });
  }

  return NextResponse.json(
    { hits },
    {
      headers: {
        'Server-Timing': composeServerTiming(response.headers.get('Server-Timing'), proxyMs),
      },
    }
  );
}
