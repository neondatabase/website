'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const PauseableVideo = ({ children, className, width, height }) => {
  const videoRef = useRef(null);

  const [videoVisibilityRef, isInView] = useInView({
    triggerOnce: true,
    rootMargin: '0px 0px 400px 0px',
  });
  const { inView, ref: setVideoRef } = useInView({ threshold: 0.1 });

  useEffect(() => {
    setVideoRef(videoRef.current);
  }, [setVideoRef]);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;

    if (!inView) {
      videoElement.pause();
    } else {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error attempting to play video:', error);
        });
      }
    }
  }, [inView]);

  return (
    <LazyMotion features={domAnimation}>
      <div ref={videoVisibilityRef}>
        <AnimatePresence>
          {isInView && (
            <m.video
              className={clsx(className)}
              ref={videoRef}
              controls={false}
              width={width}
              height={height}
              initial={{
                opacity: 0,
              }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              autoPlay
              loop
              playsInline
              muted
            >
              {children}
            </m.video>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

PauseableVideo.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default PauseableVideo;
