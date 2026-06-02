import { useState, useEffect, useRef } from 'react';

import { ANIMATION_CONFIG, ANIMATION_DURATION } from './data';

const useAnimationTimeline = (inView = false) => {
  const [currentFrame, setCurrentFrame] = useState('INITIAL');
  const [animationKey, setAnimationKey] = useState(0);
  const startTimeRef = useRef(null);
  const rafIdRef = useRef(null);

  // Reset frame when component goes out of view
  useEffect(() => {
    if (!inView) {
      setCurrentFrame('INITIAL');
      setAnimationKey((previousKey) => previousKey + 1);
      startTimeRef.current = null;
    }
  }, [inView]);

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    startTimeRef.current = Date.now();

    const updateFrame = () => {
      if (!inView || startTimeRef.current === null) {
        return;
      }

      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;

      // Find current frame based on elapsed time
      let newFrame = 'INITIAL';
      Object.entries(ANIMATION_CONFIG).forEach(([frameKey, config]) => {
        if (elapsedTime >= config.start) {
          newFrame = frameKey;
        }
      });
      setCurrentFrame(newFrame);

      // Loop animation
      if (elapsedTime >= ANIMATION_DURATION) {
        setAnimationKey((previousKey) => previousKey + 1);
        setCurrentFrame('INITIAL');
        startTimeRef.current = Date.now();
      } else {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      }
    };

    rafIdRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
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
