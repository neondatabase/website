'use client';

import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import RiveAnimation from 'components/shared/rive-animation';
import diagram from 'images/pages/auth/branching/diagram.png';

const BranchingAnimation = ({ description }) => {
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className="pointer-events-none relative aspect-1344/422 w-full overflow-hidden select-none"
      data-figma-node-id="2131:7001"
      role="img"
      aria-label={description}
    >
      {isMounted && shouldReduceMotion === true && (
        <Image
          className="h-auto w-full"
          src={diagram}
          width={1344}
          height={422}
          alt=""
          unoptimized
        />
      )}
      {isMounted && shouldReduceMotion === false && (
        <RiveAnimation
          className="pointer-events-none size-full select-none"
          wrapperClassName="absolute inset-0 size-full"
          src="/animations/pages/auth/branching.riv?v=fe58f210"
        />
      )}
    </div>
  );
};

BranchingAnimation.propTypes = {
  description: PropTypes.string.isRequired,
};

export default BranchingAnimation;
