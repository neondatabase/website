'use client';

import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import RiveAnimation from 'components/shared/rive-animation';
import heroImage from 'images/pages/auth/hero/hero.jpg';

const HeroAnimation = ({ description }) => {
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className="pointer-events-none relative aspect-1344/551 w-full overflow-hidden bg-gray-new-8 select-none"
      data-figma-node-id="2131:7308"
      role="img"
      aria-label={description}
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
          wrapperClassName="pointer-events-none absolute inset-0 size-full bg-gray-new-8"
          src="/animations/pages/auth/hero.riv?20260908"
        />
      )}
    </div>
  );
};

HeroAnimation.propTypes = {
  description: PropTypes.string.isRequired,
};

export default HeroAnimation;
