'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { useInView } from 'react-intersection-observer';

const PauseableVideo = forwardRef(
  ({ children, className, videoClassName, width, height, poster }, ref) => {
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

    // Combine the external ref with the internal videoRef
    useImperativeHandle(ref, () => videoRef.current);

    return (
      <LazyMotion features={domAnimation}>
        <div className={clsx('relative overflow-hidden', className)} ref={videoVisibilityRef}>
          {/* TODO: Need to reconsider the use of placeholder for video which gets around the layout shift issue */}
          <img
            className={clsx('relative', videoClassName)}
            src={
              poster ||
              `data:image/svg+xml;charset=utf-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`
            }
            width={width}
            height={height}
            alt=""
            aria-hidden
          />
          <AnimatePresence>
            {isInView && (
              <m.video
                className={clsx('absolute inset-0', videoClassName)}
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
  }
);

PauseableVideo.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  poster: PropTypes.string,
  className: PropTypes.string,
  videoClassName: PropTypes.string,
};

export default PauseableVideo;
