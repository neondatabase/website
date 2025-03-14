import { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { useInView } from 'react-intersection-observer';

// Array of time intervals during which the video should not play
const restrictedTimeIntervals = [
  [0.529137, 2.057776],
  [2.228894, 4.078483],
  [4.202068, 6],
];

const useLightningAnimation = () => {
  const [visibilityRef, isInView] = useInView({
    triggerOnce: true,
    threshold: 0.7,
  });

  const videoContainerRef = useRef(null);
  const videoActiveRef = useRef(null);
  const videoIdleRef = useRef(null);

  const [isVideoActive, setIsVideoActive] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Ref to track if the mouse is currently hovering over the video container
  const isHoveredRef = useRef(false);

  const handleVideoOnFocus = useCallback(() => {
    const video = videoActiveRef?.current;

    if (!video) return;

    const { currentTime } = video;

    // Clear any previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    for (let i = 0; i < restrictedTimeIntervals.length; i++) {
      const [start, end] = restrictedTimeIntervals[i];

      if (currentTime >= start && currentTime <= end) {
        // Calculate the delay to setTimeout based on the end of the current interval
        const delay = (end - currentTime) * 1000; // Convert to milliseconds

        const newTimeoutId = setTimeout(() => {
          if (isHoveredRef.current) {
            setIsVideoActive(true);
          }
        }, delay);

        setTimeoutId(newTimeoutId);
        return;
      }
    }

    if (isHoveredRef.current) {
      setIsVideoActive(true);
    }
  }, [timeoutId]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    handleVideoOnFocus();
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsVideoActive(false);

    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  useEffect(() => {
    const container = videoContainerRef?.current;

    if (!container) return;

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoContainerRef]);

  // Effect to show active phase when the section first enters the viewport
  useEffect(() => {
    if (!isInView || isVideoActive || isHoveredRef.current) {
      return;
    }

    videoActiveRef.current.currentTime = 0;
    videoIdleRef.current.currentTime = 0;

    setIsVideoActive(true);

    const timeout = setTimeout(() => {
      if (!isHoveredRef.current) {
        setIsVideoActive(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  useImperativeHandle(visibilityRef, () => videoContainerRef.current);

  return { visibilityRef, videoContainerRef, videoActiveRef, videoIdleRef, isVideoActive };
};

export default useLightningAnimation;
