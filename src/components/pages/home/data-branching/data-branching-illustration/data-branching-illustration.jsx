import clsx from 'clsx';
import React from 'react';

import useLottie from 'hooks/use-lottie';

import animationData from './data/data-branching-illustration-lottie-data.json';

const DataBranchingIllustration = () => {
  const { animationRef, isAnimationReady, animationVisibilityRef } = useLottie({
    lottieOptions: {
      animationData,
    },
    useInViewOptions: { threshold: 0.5 },
  });

  return (
    <div
      className="relative max-w-[1920px] mx-auto mt-[-365px] 3xl:mt-[-19.38vw] 2xl:mt-[-18.94vw] xl:mt-[-18.55vw] lg:-mt-5 md:mt-5 sm:mt-[40px]"
      ref={animationVisibilityRef}
      aria-hidden
    >
      <div className="w-[calc(100%+40px)] lg:min-w-[865px] lg:w-auto md:w-[767px] md:min-w-0 sm:w-auto sm:min-w-[700px] xs:min-w-[550px]">
        <img
          src="data:image/svg+xml;charset=utf-8,%3Csvg width='1960' height='800' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E"
          alt=""
          aria-hidden
        />
      </div>
      <div
        className={clsx(
          'absolute top-0 right-1/2 z-[-2] w-[calc(100%+40px)] translate-x-1/2 opacity-0 transition-opacity ease-linear duration-500 lg:-right-2 lg:w-auto lg:min-w-[865px] lg:translate-x-0 md:w-[767px] md:min-w-0 sm:w-auto sm:min-w-[700px] xs:min-w-[550px]',
          isAnimationReady && 'opacity-100'
        )}
        ref={animationRef}
      />
    </div>
  );
};

export default DataBranchingIllustration;
