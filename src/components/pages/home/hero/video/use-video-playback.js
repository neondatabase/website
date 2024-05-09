import { useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

// TODO: revise and optimize logic
const useVideoPlayback = (
  videoRef,
  progressBarRef,
  isActive,
  isMobile,
  switchVideo,
  setActiveVideoIndex,
  initialVideoPlayback,
  setInitialVideoPlayback
) => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [visibilityRef, isInView] = useInView({
    threshold: 0.6,
  });

  const updateProgress = useCallback(
    (video) => () => {
      const { currentTime } = video;

      // It is necessary that before switching to the next video progress bar remains filled in those cases
      // when we add a delay before automatic switching to the next video. - handleVideoSwitchDelay
      if (currentTime === 0.1) {
        return;
      }

      const progress = progressBarRef.current;
      const percentage = currentTime / video.duration;
      progress.style.transform = `scaleX(${percentage})`;
    },
    [progressBarRef]
  );

  const handleInitialVideoPlay = useCallback(
    (video) => {
      const timer = setTimeout(() => {
        video.play();
        setInitialVideoPlayback(false);
        setIsTitleVisible(false);
      }, 1200);

      return () => clearTimeout(timer);
    },
    [setInitialVideoPlayback]
  );

  const handleVideoSwitchDelay = useCallback(
    (video) => () => {
      video.currentTime = 0.1;
      setIsTitleVisible(true);

      const timer = setTimeout(() => {
        switchVideo();
      }, 5000);

      return () => clearTimeout(timer);
    },
    [switchVideo]
  );

  const handleDesktopVideoPlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video || isMobile) {
      return;
    }

    if (isInView && isActive) {
      if (initialVideoPlayback) {
        handleInitialVideoPlay(video);
      } else {
        video.play();
        setIsTitleVisible(false);
      }
    } else {
      video.pause();

      if (video.currentTime === 0) {
        setIsTitleVisible(true);
      }
    }

    video.addEventListener('timeupdate', updateProgress(video));
    video.addEventListener('ended', handleVideoSwitchDelay(video));

    return () => {
      video.removeEventListener('timeupdate', updateProgress(video));
      video.removeEventListener('ended', handleVideoSwitchDelay(video));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, isInView, isActive, isMobile, switchVideo]);

  const handleMobileVideoPlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video || !isMobile) {
      return;
    }

    if (isInView) {
      if (initialVideoPlayback) {
        handleInitialVideoPlay(video);
      } else {
        video.play();
        setIsTitleVisible(false);
        setActiveVideoIndex();
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setIsTitleVisible(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, isInView, isMobile, initialVideoPlayback]);

  return {
    visibilityRef,
    isTitleVisible,
    handleDesktopVideoPlayback,
    handleMobileVideoPlayback,
  };
};

export default useVideoPlayback;
