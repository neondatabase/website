'use client';

import { useEffect, useRef } from 'react';

// The generated bundle targets modern browsers and contains class static blocks.
// eslint-disable-next-line import/namespace
import { createNeonGlobe } from './neon-globe.mjs';

const GlobeAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const globe = createNeonGlobe(container);

    return () => globe.destroy();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-full w-full"
      ref={containerRef}
    />
  );
};

export default GlobeAnimation;
