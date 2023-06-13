import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import useLottie from 'hooks/use-lottie';

import animationData from './data/scalability-illustration-lottie-data.json';

const ScalabilityIllustration = ({ isInView }) => {
  const { animationRef, isAnimationReady } = useLottie({
    lottieOptions: { animationData },
    isInView,
  });

  return (
    <div
      className={clsx(
        'absolute right-0 top-0 w-full opacity-0 transition-opacity duration-500 ease-linear',
        isAnimationReady && 'opacity-100'
      )}
      ref={animationRef}
    />
  );
};

ScalabilityIllustration.propTypes = {
  isInView: PropTypes.bool.isRequired,
};

export default ScalabilityIllustration;
