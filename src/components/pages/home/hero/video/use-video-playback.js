import { useCallback } from 'react';
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
  const [visibilityRef, isInView] = useInView({
    threshold: 0.5,
  });

  const updateProgress = useCallback(
    (video) => () => {
      const progress = progressBarRef.current;
      const percentage = (video.currentTime + 0.2) / video.duration;
      progress.style.transform = `scaleX(${percentage})`;
    },
    [progressBarRef]
  );

  const handleInitialPlayVideo = useCallback(
    (video) => () => {
      const timer = setTimeout(() => {
        video.play();
        setInitialVideoPlayback(false);
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
        video.addEventListener('loadedmetadata', handleInitialPlayVideo(video), { once: true });
      } else {
        video.play();
      }
    } else {
      video.pause();
    }

    video.addEventListener('timeupdate', updateProgress(video));
    video.addEventListener('ended', switchVideo);

    return () => {
      video.removeEventListener('timeupdate', updateProgress(video));
      video.removeEventListener('ended', switchVideo);
      video.removeEventListener('loadedmetadata', handleInitialPlayVideo(video));
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
        video.addEventListener('loadedmetadata', handleInitialPlayVideo(video));
      } else {
        video.currentTime = 0;
        video.play();
        setActiveVideoIndex();
      }
    } else {
      video.pause();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleInitialPlayVideo(video));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, isInView, isMobile, initialVideoPlayback]);

  return {
    visibilityRef,
    handleDesktopVideoPlayback,
    handleMobileVideoPlayback,
  };
};

export default useVideoPlayback;
