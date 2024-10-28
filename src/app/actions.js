'use server';

import { cookies, headers } from 'next/headers';

// Simple in-memory cache for cookie results (valid for the request lifecycle)
const cookieCache = {};

// Check if a cookie exists and cache the result
export const checkCookie = async (name) => {
  if (cookieCache[name] !== undefined) {
    return cookieCache[name];
  }

  const cookie = cookies().get(name);
  const isCookieValid = Boolean(cookie);

  // Cache the result to avoid redundant checks
  cookieCache[name] = isCookieValid;

  return isCookieValid;
};

export const getReferer = async () => {
  const referer = headers().get('referer') || headers().get('referrer') || '';

  return referer;
};
