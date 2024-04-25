import { useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

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
      const progress = progressBarRef.current;
      const percentage = (video.currentTime + 0.2) / video.duration;
      progress.style.transform = `scaleX(${percentage})`;
    },
    [progressBarRef]
  );

  const handleInitialVideoPlay = useCallback(
    (video) => () => {
      const timer = setTimeout(() => {
        video.play();
        setInitialVideoPlayback(false);
        setIsTitleVisible(false);
      }, 1200);

      return () => clearTimeout(timer);
    },
    [setInitialVideoPlayback]
  );

  const handleDesktopVideoPlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video || isMobile) {
      return;
    }

    if (isInView && isActive) {
      if (initialVideoPlayback) {
        video.addEventListener('loadedmetadata', handleInitialVideoPlay(video), { once: true });
      } else {
        video.play();
        setIsTitleVisible(false);
      }
    } else {
      video.pause();
      setIsTitleVisible(true);
    }

    video.addEventListener('timeupdate', updateProgress(video));
    video.addEventListener('ended', switchVideo);

    return () => {
      video.removeEventListener('timeupdate', updateProgress(video));
      video.removeEventListener('ended', switchVideo);
      video.removeEventListener('loadedmetadata', handleInitialVideoPlay(video));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, isInView, isActive, isMobile, switchVideo]);

  // Needed to catch the end of the video when it loops and show the title again
  const handleChangeVisibilityTitle = useCallback(
    (video) => () => {
      if (video.currentTime >= video.duration - 1) {
        return setIsTitleVisible(true);
      }

      setIsTitleVisible(false);
    },
    []
  );

  const handleMobileVideoPlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video || !isMobile) {
      return;
    }

    if (isInView) {
      if (initialVideoPlayback) {
        video.addEventListener('loadedmetadata', handleInitialVideoPlay(video));
      } else {
        video.currentTime = 0;
        video.play();
        setIsTitleVisible(false);
        setActiveVideoIndex();
      }
    } else {
      video.pause();
      setIsTitleVisible(true);
    }

    video.addEventListener('timeupdate', handleChangeVisibilityTitle(video));

    return () => {
      video.removeEventListener('loadedmetadata', handleInitialVideoPlay(video));
      video.removeEventListener('timeupdate', handleChangeVisibilityTitle(video));
    };
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
