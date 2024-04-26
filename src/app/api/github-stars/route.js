/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';

const API_URL = 'https://api.github.com/repos/neondatabase/neon';

export async function GET() {
  try {
    const response = await fetch(API_URL, { next: { revalidate: 60 * 60 * 12 } });

    if (response.status >= 400) {
      const { message } = await response.json();

      return NextResponse.json(message, { status: response.status });
    }

    const json = await response.json();
    const updatedStarsCount = json.stargazers_count;

    return NextResponse.json({ starsCount: updatedStarsCount }, { status: 200 });
  } catch (err) {
    const errMessage = err instanceof Error ? err?.message ?? err?.toString() ?? '' : '';

    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
