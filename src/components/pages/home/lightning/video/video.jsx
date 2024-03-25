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
      className="relative z-10 -mt-10 ml-32 aspect-[1.181818] max-w-[431px] mix-blend-plus-lighter xl:-mt-14 xl:ml-24 xl:max-w-[333px] lg:-mt-[72px] lg:ml-8 lg:max-w-[297px] md:ml-0 md:max-w-[277px] sm:mt-[-60px] sm:max-w-[226px]"
      ref={ref}
    >
      <video ref={videoRef} controls={false} width={431} height={365} loop playsInline muted>
        <source src="/videos/pages/home/lightning-loop-crf-22.mp4" type="video/mp4" />
        <source src="/videos/pages/home/lightning-loop-crf-20.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default Video;
