'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const PauseableVideo = ({ children, className, width, height }) => {
  const videoRef = useRef(null);
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
    <video
      className={clsx(className)}
      ref={videoRef}
      controls={false}
      width={width}
      height={height}
      autoPlay
      loop
      playsInline
      muted
    >
      {children}
    </video>
  );
};

PauseableVideo.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default PauseableVideo;
