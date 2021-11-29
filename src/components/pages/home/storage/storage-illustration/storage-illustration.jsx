import clsx from 'clsx';
import React from 'react';

import useLottie from 'hooks/use-lottie';

import animationData from './data/storage-illustration-lottie-data.json';

const StorageIllustration = () => {
  const { animationRef, isAnimationReady, animationVisibilityRef } = useLottie({
    lottieOptions: { animationData },
    useInViewOptions: { threshold: 0.5 },
  });

  return (
    <div
      className="relative order-first w-full max-w-[880px] 3xl:max-w-[735px] 2xl:max-w-[605px] xl:max-w-[465px] lg:order-last lg:max-w-[475px] lg:mt-[46px]"
      ref={animationVisibilityRef}
      aria-hidden
    >
      <img
        src="data:image/svg+xml;charset=utf-8,%3Csvg width='880' height='800' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
        alt=""
      />
      <div
        className={clsx(
          'absolute top-0 right-0 w-full opacity-0 transition-opacity ease-linear duration-500',
          isAnimationReady && 'opacity-100'
        )}
        ref={animationRef}
      />
    </div>
  );
};

export default StorageIllustration;
