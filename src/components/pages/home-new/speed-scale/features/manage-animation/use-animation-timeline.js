import { useState, useEffect } from 'react';

import { ANIMATION_CONFIG, ANIMATION_DURATION } from './data';

const useAnimationTimeline = (inView = false) => {
  const [currentFrame, setCurrentFrame] = useState('INITIAL');
  const [animationKey, setAnimationKey] = useState(0);

  // Reset frame when component goes out of view
  useEffect(() => {
    if (!inView) {
      setCurrentFrame('INITIAL');
      setAnimationKey((previousKey) => previousKey + 1);
    }
  }, [inView]);

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    const timers = [];

    Object.entries(ANIMATION_CONFIG).forEach(([frameKey, config]) => {
      const timer = setTimeout(() => {
        setCurrentFrame(frameKey);
      }, config.start * 1000);

      timers.push(timer);
    });

    // Loop animation
    const loopTimer = setTimeout(() => {
      setAnimationKey((previousKey) => previousKey + 1);
      setCurrentFrame('INITIAL');
    }, ANIMATION_DURATION * 1000);
    timers.push(loopTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [animationKey, inView]);

  const isFrameActive = (targetFrame) => {
    const currentFrameStart = ANIMATION_CONFIG[currentFrame]?.start;
    const targetFrameStart = ANIMATION_CONFIG[targetFrame]?.start;

    if (currentFrameStart === undefined || targetFrameStart === undefined) {
      return false;
    }

    return currentFrameStart >= targetFrameStart;
  };

  return {
    isFrameActive,
  };
};

export default useAnimationTimeline;
