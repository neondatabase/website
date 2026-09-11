'use client';

import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import RiveAnimation from 'components/shared/rive-animation';
import { objectStoragePageContent } from 'constants/object-storage-page-content';
import heroImage from 'images/pages/object-storage/hero.jpg';

const HeroAnimation = () => {
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className="pointer-events-none relative aspect-1344/502 w-full overflow-hidden bg-gray-new-8 select-none"
      data-figma-node-id="2070:4706"
      role="img"
      aria-label={objectStoragePageContent.hero.illustrationDescription}
    >
      {isMounted && shouldReduceMotion === true && (
        <Image
          className="h-auto w-full"
          src={heroImage}
          alt=""
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1408px) calc(100vw - 64px), 1344px"
          priority
          unoptimized
        />
      )}
      {isMounted && shouldReduceMotion === false && (
        <RiveAnimation
          className="pointer-events-none size-full select-none"
          wrapperClassName="absolute inset-0 size-full bg-gray-new-8"
          src="/animations/pages/object-storage/hero.riv?20260907"
        />
      )}
    </div>
  );
};

export default HeroAnimation;
