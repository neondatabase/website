'use server';

import { cookies, headers } from 'next/headers';

export const checkCookie = async (name) => {
  const cookie = cookies().get(name);

  return Boolean(cookie);
};

export const getReferer = async () => {
  const referer = headers().get('referer') || headers().get('referrer') || '';

  return referer;
};
