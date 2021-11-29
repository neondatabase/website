import clsx from 'clsx';
import React from 'react';

import useLottie from 'hooks/use-lottie';

import animationData from './data/saas-illustration-lottie-data.json';

const SaasIllustration = () => {
  const { animationRef, isAnimationReady, animationVisibilityRef } = useLottie({
    lottieOptions: {
      animationData,
    },
    useInViewOptions: { threshold: 0.5 },
  });

  return (
    <div
      id="saas-illustration"
      className="relative 3xl:max-w-[813px] 2xl:max-w-[672px] xl:max-w-[500px] lg:hidden"
      ref={animationVisibilityRef}
      aria-hidden
    >
      <img
        src="data:image/svg+xml;charset=utf-8,%3Csvg width='976' height='624' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
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

export default SaasIllustration;
