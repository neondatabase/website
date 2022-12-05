import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const useVideo = () => {
  const [containerRef, isContainerInView] = useInView();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isContainerInView) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isContainerInView]);

  return { containerRef, videoRef };
};

export default useVideo;
