'use client';

import dynamic from 'next/dynamic';

const GlobeAnimation = dynamic(() => import('./globe-animation'), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden="true" />,
});

export default GlobeAnimation;
