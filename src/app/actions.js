'use server';

import { cookies, headers } from 'next/headers';

export const checkCookie = async (name) => {
  const cookie = (await cookies()).get(name);

  return Boolean(cookie);
};

export const getReferer = async () => {
  const referer = (await headers()).get('referer') || (await headers()).get('referrer') || '';

  return referer;
};
