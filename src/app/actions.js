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

// Memoization for referer headers to avoid repeated lookups
let refererCache = null;

export const getReferer = async () => {
  if (refererCache !== null) {
    return refererCache;
  }

  const referer = headers().get('referer') || headers().get('referrer') || '';

  // Cache the referer for future use during the same request lifecycle
  refererCache = referer;

  return referer;
};
