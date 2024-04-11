import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'components/shared/link';

const Video = forwardRef(
  // eslint-disable-next-line react/prop-types
  (
    { className, videoUrl, title, description, linkLabel, linkUrl, isPlayVideo, switchVideo },
    videoRef
  ) => {
    const [visibilityRef, isInView] = useInView();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const video = videoRef.current;

      const updateProgress = () => {
        requestAnimationFrame(() => {
          const { currentTime } = video;
          const { duration } = video;
          setProgress((currentTime / duration) * 100);
        });
      };

      if (isInView && isPlayVideo) {
        video.play();
      } else {
        video.pause();
      }

      video.addEventListener('timeupdate', updateProgress);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
      };
    }, [isInView, isPlayVideo, videoRef]);

    const progressBarWidth = `${progress}%`;

    return (
      <div className={className} ref={visibilityRef} onClick={switchVideo}>
        <div className="rounded-[14px] bg-black-pure/40 p-1">
          <video
            className="h-[466px] rounded-[14px] mix-blend-lighten"
            height={466}
            width={704}
            controls={false}
            ref={videoRef}
            muted
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
        <div className="mt-5 px-1">
          <h2 className="text-xl leading-dense tracking-tighter text-white">{title}</h2>
          <div className="relative mt-3.5 h-px w-full bg-gray-new-15" aria-hidden>
            <span
              className="absolute left-0 top-0 h-full bg-[linear-gradient(90deg,rgba(228,229,231,0.10)_0%,#E4E5E7_100%)] duration-500"
              style={{ width: progressBarWidth }}
            />
          </div>
          <p
            className={clsx(
              'mt-3.5 max-w-[366px] font-light tracking-extra-tight transition-colors duration-200',
              isPlayVideo ? 'text-gray-new-80' : 'text-gray-new-40'
            )}
          >
            {description}
          </p>
          <Link
            className="mt-2.5 flex w-fit items-center text-sm font-medium leading-none tracking-[-0.03em] text-white"
            to={linkUrl}
            withArrow
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    );
  }
);

Video.propTypes = {
  className: PropTypes.string,
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  isPlayVideo: PropTypes.bool.isRequired,
  switchVideo: PropTypes.func.isRequired,
};

export default Video;
