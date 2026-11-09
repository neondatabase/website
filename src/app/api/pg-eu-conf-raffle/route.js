import { createHmac } from 'node:crypto';

import { NextResponse } from 'next/server';
import * as yup from 'yup';

export const runtime = 'nodejs';
export const maxDuration = 30;

const schema = yup.object({
  requestId: yup.string().uuid().required(),
  firstname: yup.string().trim().max(100).required(),
  lastname: yup.string().trim().max(100).required(),
  email: yup
    .string()
    .trim()
    .email()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .max(254)
    .required(),
});

const reply = (body, status) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return reply({ error: 'Invalid origin' }, 403);
  }

  let data;
  try {
    const text = await request.text();
    if (text.length > 12000) return reply({ error: 'Entry is too large' }, 413);
    const body = JSON.parse(text);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return reply({ error: 'Invalid entry' }, 400);
    }
    data = await schema.validate(body, { stripUnknown: true });
    // Reject coerced numbers/objects instead of saving them as names or emails.
    if (Object.keys(schema.fields).some((field) => typeof body[field] !== 'string')) {
      return reply({ error: 'Invalid entry' }, 400);
    }
    if (
      Object.values(data).some((value) =>
        Array.from(value).some((character) => {
          const code = character.charCodeAt(0);
          return code < 32 || code === 127;
        })
      )
    ) {
      return reply({ error: 'Invalid entry' }, 400);
    }
  } catch {
    return reply({ error: 'Enter your first name, last name, and a valid email address.' }, 400);
  }

  const url = process.env.RAFFLE_APPS_SCRIPT_URL;
  const secret = process.env.RAFFLE_SIGNING_SECRET;
  if (
    !url ||
    !/^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(url) ||
    !secret ||
    secret.length < 32
  ) {
    return reply(
      { error: 'Unable to confirm your entry. Please try the original Google Form.' },
      503
    );
  }

  const payload = JSON.stringify({
    requestId: data.requestId,
    timestamp: Date.now(),
    firstName: data.firstname,
    lastName: data.lastname,
    email: data.email,
    phone: '',
  });
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, signature }),
      redirect: 'follow',
      signal: AbortSignal.timeout(25000),
      cache: 'no-store',
    });
    const result = await response.json();

    // Apps Script returns application errors with HTTP 200; require its storage confirmation.
    if (!response.ok || result?.ok !== true) {
      return reply(
        { error: 'Unable to confirm your entry. Please try the original Google Form.' },
        502
      );
    }

    return reply({ success: true }, 200);
  } catch {
    return reply({ error: 'Unable to confirm your entry. Please try again.' }, 502);
  }
}
