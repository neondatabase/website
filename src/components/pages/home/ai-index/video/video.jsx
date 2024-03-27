'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const Video = () => {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (inView) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [inView, ref]);

  return (
    <div
      className="relative z-0 mx-auto -mt-48 aspect-square max-w-[1160px] mix-blend-plus-lighter xl:mt-[-152px] xl:max-w-[860px] lg:mt-[-117px] lg:max-w-[680px] sm:-mt-[52px] sm:max-w-[91%]"
      ref={ref}
    >
      <video ref={videoRef} controls={false} width={1160} height={1160} loop playsInline muted>
        <source src="/videos/pages/home/ai-loop-crf-32.mp4" type="video/mp4" />
        <source src="/videos/pages/home/ai-loop-crf-40.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default Video;
