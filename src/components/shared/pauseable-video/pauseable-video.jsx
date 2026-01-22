'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useCallback, useRef, useImperativeHandle } from 'react';
import { useInView } from 'react-intersection-observer';

const PauseableVideo = forwardRef(
  ({ children, width, height, poster, loop = true, className, videoClassName }, ref) => {
    const videoRef = useRef(null);

    // For lazy loading video element - triggers once and never unmounts
    const [lazyLoadRef, isVideoLoaded] = useInView({
      triggerOnce: true,
      rootMargin: '0px 0px 400px 0px',
    });

    // For play/pause logic - tracks visibility dynamically
    const [playbackRef, isInView] = useInView({
      threshold: 0.1,
    });

    // Combine both refs on the container
    const setContainerRef = useCallback(
      (node) => {
        lazyLoadRef(node);
        playbackRef(node);
      },
      [lazyLoadRef, playbackRef]
    );

    const playVideo = useCallback((videoElement) => {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error attempting to play video:', error);
        });
      }
    }, []);

    useEffect(() => {
      if (!videoRef.current) return;

      const videoElement = videoRef.current;
      videoElement.setAttribute('muted', 'true');

      if (!isInView) {
        videoElement.pause();
      } else {
        // Restart video from beginning when loop is disabled and it comes back into view
        if (!loop) {
          videoElement.currentTime = 0;
        }
        playVideo(videoElement);
      }
    }, [isInView, loop, playVideo]);

    // Combine the external ref with the internal videoRef
    useImperativeHandle(ref, () => videoRef.current);

    return (
      <LazyMotion features={domAnimation}>
        <div className={clsx('relative overflow-hidden', className)} ref={setContainerRef}>
          {/* TODO: Need to reconsider the use of placeholder for video which gets around the layout shift issue */}
          <Image
            className={clsx('relative', videoClassName)}
            src={
              poster ||
              `data:image/svg+xml;charset=utf-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E`
            }
            width={width}
            height={height}
            sizes="100%"
            quality={100}
            alt=""
          />
          <AnimatePresence>
            {isVideoLoaded && (
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
                loop={loop}
                autoPlay
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
  loop: PropTypes.bool,
  className: PropTypes.string,
  videoClassName: PropTypes.string,
};

export default PauseableVideo;
