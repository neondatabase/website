'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import ApiCliAnimation from '../api-cli-animation';
import ClockAnimation from '../clock-animation';

const animations = {
  api: (
    <ApiCliAnimation
      className="absolute inset-0 h-full w-full overflow-hidden rounded-[inherit] md:top-[-10%] md:min-h-[110%]"
      src="/animations/pages/home/api.riv"
      artboard="main"
      intersectionRootMargin="0px 0px 600px 0px"
      alignment="TopCenter"
      fit="FitWidth"
    />
  ),
  clock: (
    <ClockAnimation
      className="absolute inset-0 h-full w-full overflow-hidden rounded-[inherit] md:top-[-10%] md:min-h-[110%]"
      src="/animations/pages/home/clock.riv"
      artboard="timer"
      intersectionRootMargin="0px 0px 600px 0px"
      alignment="TopCenter"
      fit="FitWidth"
    />
  ),
};

// NOTE: we use visibilityState to remove the animation from the DOM tree, as there is a conflict between the video and the Rive animation.
const RiveCard = ({ animation, children }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState !== 'hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="relative grid min-h-[491px] w-full grid-cols-1 grid-rows-1 overflow-hidden rounded-[10px] xl:min-h-[360px] xl:rounded-lg lg:aspect-[0.9572] md:min-h-min sm:col-span-full sm:aspect-[1.2] sm:min-h-[250px]">
      <div className="relative z-10 col-span-full row-span-full">
        {isVisible && animations[animation]}
      </div>
      {children}
    </div>
  );
};

RiveCard.propTypes = {
  animation: PropTypes.oneOf(['api', 'clock']).isRequired,
  children: PropTypes.node.isRequired,
};

export default RiveCard;
