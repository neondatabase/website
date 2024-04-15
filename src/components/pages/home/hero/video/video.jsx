import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import Link from 'components/shared/link';

const Video = forwardRef(
  (
    {
      className,
      videoClassName,
      video: { icon, title: videoTitle, mp4, webm },
      title,
      description,
      linkLabel,
      linkUrl,
      isActive,
      switchVideo,
    },
    videoRef
  ) => {
    const [visibilityRef, isInView] = useInView();
    const progressBarRef = useRef(null);

    useEffect(() => {
      const video = videoRef.current;

      const updateProgress = () => {
        const progress = progressBarRef.current;
        const percentage = (video.currentTime + 0.2) / video.duration;
        progress.style.transform = `scaleX(${percentage})`;
      };

      if (isInView && isActive) {
        video.play();
      } else {
        video.pause();
      }

      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('ended', switchVideo);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('ended', switchVideo);
      };
    }, [isInView, isActive, videoRef, switchVideo]);

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className={clsx(
          'cursor-pointer',
          {
            'pointer-events-none cursor-default': isActive,
          },
          className
        )}
        ref={visibilityRef}
        onClick={switchVideo}
      >
        <div className={clsx('relative rounded-[14px] bg-black-pure p-1')}>
          <div className="relative h-[466px] overflow-hidden rounded-[14px] 2xl:h-[430px] md:h-[317px] sm:h-auto">
            <div
              className={clsx(
                'absolute left-10 top-11 opacity-0 transition-opacity duration-300 lt:left-8 lt:top-10 md:left-4 md:top-6',
                {
                  'opacity-100': !isActive,
                }
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="ml-auto w-auto md:h-6 xs:h-4"
                height={32}
                width={32}
                src={icon}
                alt=""
                loading="eager"
              />
              <h2 className="font-title text-[64px] font-medium leading-none tracking-[-0.04em] text-white lt:text-[48px] md:text-[42px] xs:text-[30px]">
                {videoTitle}
              </h2>
            </div>
            <video
              className={clsx(
                'absolute left-0 top-0 h-auto min-w-[704px] rounded-[14px] mix-blend-lighten transition-all duration-300 2xl:min-w-[652px] md:min-w-[480px] sm:static sm:h-auto sm:min-w-0',
                videoClassName,
                isActive && '!left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0'
              )}
              height={466}
              width={704}
              controls={false}
              ref={videoRef}
              muted
              playsInline
            >
              <source src={mp4} type="video/mp4" />
              <source src={webm} type="video/webm" />
            </video>
          </div>
        </div>
        <div className="mt-5 px-1">
          <h3 className="text-xl leading-dense tracking-tighter text-white md:text-lg">{title}</h3>
          <div className="mt-3.5 h-px w-full overflow-hidden bg-gray-new-15" aria-hidden>
            <div
              className={clsx(
                'h-full w-full origin-left scale-x-0 bg-[linear-gradient(90deg,rgba(228,229,231,0.10)_0%,#E4E5E7_100%)] opacity-0 transition-[transform,opacity] duration-[400ms] ease-linear',
                isActive && 'opacity-100'
              )}
              ref={progressBarRef}
            />
          </div>
          <p
            className={clsx(
              'mt-3.5 max-w-[366px] font-light tracking-extra-tight transition-colors duration-200 md:text-[15px]',
              isActive ? 'text-gray-new-80' : 'text-gray-new-40'
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
  videoClassName: PropTypes.string,
  video: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    mp4: PropTypes.string.isRequired,
    webm: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  switchVideo: PropTypes.func.isRequired,
};

export default Video;
