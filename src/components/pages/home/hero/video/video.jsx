import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef } from 'react';

import Link from 'components/shared/link';

import useVideoPlayback from './use-video-playback';

const Video = forwardRef(
  (
    {
      className,
      videoClassName,
      video: { icon, title: videoTitle, bgImage },
      title,
      description,
      linkLabel,
      linkUrl,
      isActive,
      isMobile,
      switchVideo,
      setActiveVideoIndex,
      initialVideoPlayback,
      setInitialVideoPlayback,
      index,
    },
    videoRef
  ) => {
    const progressBarRef = useRef(null);

    const { visibilityRef, isTitleVisible, handleDesktopVideoPlayback, handleMobileVideoPlayback } =
      useVideoPlayback(
        videoRef,
        progressBarRef,
        isActive,
        isMobile,
        switchVideo,
        setActiveVideoIndex,
        initialVideoPlayback,
        setInitialVideoPlayback,
        index
      );

    useEffect(() => {
      handleDesktopVideoPlayback();
    }, [handleDesktopVideoPlayback]);

    useEffect(() => {
      handleMobileVideoPlayback();
    }, [handleMobileVideoPlayback]);

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div className={clsx(className)} ref={visibilityRef}>
        <div
          className={clsx(
            'group relative cursor-pointer rounded-2xl bg-[linear-gradient(180deg,#111313_51.48%,#050505_100%)] p-1.5 shadow-[-2px_0px_2px_0px_rgba(0,0,0,0.25)_inset,2px_0px_2px_0px_rgba(0,0,0,0.25)_inset,0px_2px_2px_0px_rgba(0,0,0,0.30)_inset,0px_1.4px_0px_0px_rgba(255,255,255,0.03)]',
            {
              'pointer-events-none cursor-default': isActive || isMobile,
            }
          )}
          onClick={!isMobile ? switchVideo : undefined}
        >
          <div
            className={clsx(
              'relative h-[466px] overflow-hidden rounded-[10px] group-hover:after:opacity-0 2xl:h-[430px] xl:h-[403px] lg:h-[340px] md:h-[317px] sm:aspect-[1.51] sm:h-auto sm:after:hidden',
              'after:pointer-events-none after:absolute after:-inset-px after:z-10 after:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(12,13,13,.3)_0%,#0C0D0D_100%)] after:transition-opacity after:duration-300',
              !isActive ? 'after:opacity-70' : 'after:opacity-0'
            )}
          >
            <video
              className={clsx(
                'pointer-events-none absolute left-0 top-0 z-0 h-auto min-w-[704px] 2xl:min-w-[652px] xl:min-w-[608px] lg:min-w-[514px] md:min-w-[480px] sm:!left-0 sm:h-auto sm:min-w-0 sm:translate-x-0',
                videoClassName,
                !isActive && 'transition-all delay-700 duration-700',
                isActive && '!left-0 lg:!left-1/2 lg:-translate-x-1/2'
              )}
              height={466}
              width={704}
              controls={false}
              ref={videoRef}
              loop={isMobile}
              poster={bgImage || undefined}
              muted
              playsInline
            />

            <div
              className={clsx(
                'absolute left-10 transition-all delay-200 duration-1000 lt:left-8 lt:top-10 md:left-4 md:top-6',
                !isTitleVisible ? '!-top-full opacity-0' : 'top-11 opacity-100 lt:top-10 md:top-6'
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
          </div>
        </div>
        <div className="mt-5 px-1 md:min-h-[209px] sm:min-h-0">
          <h3 className="text-xl leading-dense tracking-tighter text-white lg:text-lg sm:text-[20px]">
            {title}
          </h3>
          <div className="mt-3.5 h-px w-full overflow-hidden bg-gray-new-15 sm:hidden" aria-hidden>
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
              'mt-3.5 max-w-[366px] font-light tracking-extra-tight transition-colors duration-200 xl:max-w-[350px] lg:max-w-[245px] lg:text-[15px] md:mt-2.5 sm:max-w-none',
              isActive ? 'text-gray-new-80' : 'text-gray-new-40'
            )}
          >
            {description}
          </p>
          <Link
            className="mt-2.5 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em]"
            to={linkUrl}
            theme="white"
            withArrow
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    );
  }
);

export default Video;

Video.propTypes = {
  className: PropTypes.string,
  videoClassName: PropTypes.string,
  video: PropTypes.shape({
    icon: PropTypes.string,
    title: PropTypes.string,
    bgImage: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  switchVideo: PropTypes.func.isRequired,
  setActiveVideoIndex: PropTypes.func.isRequired,
  initialVideoPlayback: PropTypes.bool.isRequired,
  setInitialVideoPlayback: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
