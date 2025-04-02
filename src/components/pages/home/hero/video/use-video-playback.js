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
  setInitialVideoPlayback,
  index
) => {
  const [visibilityRef, isInView] = useInView({
    threshold: 0.6,
  });

  const [isTitleVisible, setIsTitleVisible] = useState(true);

  const updateProgress = useCallback(
    (video) => () => {
      const progress = progressBarRef.current;
      if (!progress) return;

      // It is necessary that before switching to the next video progress bar remains filled in those cases
      // when we add a delay before automatic switching to the next video. - handleVideoSwitchDelay
      const { currentTime } = video;
      if (currentTime === 0.1) {
        return;
      }

      const percentage = currentTime / video.duration;
      progress.style.transform = `scaleX(${percentage})`;
    },
    [progressBarRef]
  );

  const handleInitialVideoPlay = useCallback(
    (video) => {
      const timeoutId = setTimeout(() => {
        video.play();
        setInitialVideoPlayback(false);
        setIsTitleVisible(false);
      }, 1200);

      return () => clearTimeout(timeoutId);
    },
    [setInitialVideoPlayback]
  );

  const handleVideoSwitchDelay = useCallback(
    (video) => () => {
      if (index === 1) {
        video.currentTime = 0.1;
        setIsTitleVisible(true);

        // TODO: this timeout needs to be cleared in case of clicking on the first video
        const timeoutId = setTimeout(() => {
          switchVideo();
        }, 5000);

        return () => clearTimeout(timeoutId);
      }

      return switchVideo();
    },
    [switchVideo, index]
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
