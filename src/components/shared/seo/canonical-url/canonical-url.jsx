'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

const CanonicalUrl = () => {
  const pathname = usePathname();
  const canonicalUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL + pathname;
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
    </>
  );
};

export default CanonicalUrl;
