'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { cn } from 'utils/cn';

const VIDEO_VERSION = '20260615';
const SLIDER_VIEWPORT_QUERY = '(max-width: 63.9375rem)';
const COMPACT_SLIDER_VIEWPORT_QUERY = '(max-width: 33.6875rem)';
const VIDEO_SWITCH_DELAY_MS = 2000;

const getScrollPaddingLeft = (element) => {
  const scrollPaddingLeft = Number.parseFloat(window.getComputedStyle(element).scrollPaddingLeft);

  return Number.isNaN(scrollPaddingLeft) ? 0 : scrollPaddingLeft;
};

/*
  Service video optimization:
    webm: ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 18 -b:v 0 -pix_fmt yuv420p -vf "scale=512:-2:flags=lanczos" -deadline best -row-mt 1 -threads 8 -an output.webm
    mp4:  ffmpeg -i input.mp4 -c:v libx265 -crf 14 -pix_fmt yuv420p -vf "scale=512:-2:flags=lanczos" -preset veryslow -tag:v hvc1 -movflags faststart -an output.mp4
    poster: ffmpeg -ss 00:00:00 -i sources/input.mp4 -frames:v 1 -vf "scale=512:-2:flags=lanczos" -q:v 1 output.jpg
*/

const HeroServiceVideo = ({ height, isActive, onEnded, shouldLoop, title, videoBase, width }) => {
  const videoRef = useRef(null);
  const endDelayTimeoutRef = useRef(null);
  const shouldLoopRef = useRef(shouldLoop);
  const onEndedRef = useRef(onEnded);
  const posterImagePath = `/videos/pages/home/hero/${videoBase}.jpg`;
  const posterVideoPath = `${posterImagePath}?updated=${VIDEO_VERSION}`;

  useEffect(() => {
    shouldLoopRef.current = shouldLoop;
  }, [shouldLoop]);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error(`Error attempting to play ${title} video:`, error);
      });
    }
  }, [isActive, title]);

  useEffect(() => () => window.clearTimeout(endDelayTimeoutRef.current), []);

  useEffect(() => {
    if (!isActive) {
      window.clearTimeout(endDelayTimeoutRef.current);
    }
  }, [isActive]);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;

    window.clearTimeout(endDelayTimeoutRef.current);
    endDelayTimeoutRef.current = window.setTimeout(() => {
      if (shouldLoopRef.current && video) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error(`Error attempting to loop ${title} video:`, error);
          });
        }
        return;
      }

      onEndedRef.current();
    }, VIDEO_SWITCH_DELAY_MS);
  }, [title]);

  return (
    <>
      <Image
        className="absolute inset-0 h-full w-full object-cover"
        src={posterImagePath}
        alt=""
        width={width}
        height={height}
        loading="eager"
        decoding="async"
        aria-hidden="true"
      />
      <video
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-200',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
        ref={videoRef}
        preload="auto"
        muted
        playsInline
        poster={posterVideoPath}
        width={width}
        height={height}
        aria-hidden="true"
        onEnded={handleEnded}
      >
        <source
          src={`/videos/pages/home/hero/${videoBase}.webm?updated=${VIDEO_VERSION}`}
          type="video/webm"
        />
        <source
          src={`/videos/pages/home/hero/${videoBase}.mp4?updated=${VIDEO_VERSION}`}
          type="video/mp4"
        />
      </video>
    </>
  );
};

HeroServiceVideo.propTypes = {
  height: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onEnded: PropTypes.func.isRequired,
  shouldLoop: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  videoBase: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};

const HeroServices = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [autoPlayIndex, setAutoPlayIndex] = useState(null);
  const [isSliderViewport, setIsSliderViewport] = useState(false);
  const [trailingSpacerWidth, setTrailingSpacerWidth] = useState(0);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const isUserScrollingRef = useRef(false);
  const { ref: inViewRef, inView: isListInView } = useInView({ threshold: 0.2 });
  const { ref: autoPlayInViewRef, inView: isAutoPlayInView } = useInView({ threshold: 0.5 });

  const setListRef = useCallback(
    (node) => {
      listRef.current = node;
      inViewRef(node);
      autoPlayInViewRef(node);
    },
    [autoPlayInViewRef, inViewRef]
  );

  const updateTrailingSpacerWidth = useCallback(() => {
    const list = listRef.current;
    const lastItem = itemRefs.current[items.length - 1];
    if (!list || !lastItem) return;

    if (window.matchMedia(COMPACT_SLIDER_VIEWPORT_QUERY).matches) {
      setTrailingSpacerWidth(0);
      return;
    }

    const nextWidth = Math.max(
      0,
      list.clientWidth - getScrollPaddingLeft(list) - lastItem.offsetWidth
    );

    setTrailingSpacerWidth((currentWidth) =>
      Math.abs(currentWidth - nextWidth) > 1 ? nextWidth : currentWidth
    );
  }, [items.length]);

  const syncAutoPlayIndexWithSliderScroll = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const scrollPosition = list.scrollLeft + getScrollPaddingLeft(list);
    const closestIndex = itemRefs.current.reduce(
      (closest, item, index) => {
        if (!item) return closest;

        const distance = Math.abs(item.offsetLeft - scrollPosition);

        return distance < closest.distance ? { distance, index } : closest;
      },
      { distance: Number.POSITIVE_INFINITY, index: null }
    ).index;

    if (closestIndex !== null) {
      setAutoPlayIndex((currentIndex) =>
        currentIndex === closestIndex ? currentIndex : closestIndex
      );
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(SLIDER_VIEWPORT_QUERY);
    const update = () => {
      setIsSliderViewport(mediaQuery.matches);

      if (!mediaQuery.matches) {
        setTrailingSpacerWidth(0);
      }
    };

    update();
    mediaQuery.addEventListener('change', update);

    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isSliderViewport) {
      setHoveredIndex(null);
    }
  }, [isSliderViewport]);

  useEffect(() => {
    if (isAutoPlayInView && hoveredIndex === null) {
      setAutoPlayIndex((currentIndex) => currentIndex ?? 0);
    }
  }, [hoveredIndex, isAutoPlayInView]);

  useEffect(() => {
    if (!isSliderViewport || !isAutoPlayInView || hoveredIndex !== null || autoPlayIndex === null) {
      return;
    }

    const list = listRef.current;
    const item = itemRefs.current[autoPlayIndex];
    if (!list || !item || isUserScrollingRef.current) return;

    list.scrollTo({
      left: item.offsetLeft - getScrollPaddingLeft(list),
      behavior: 'smooth',
    });
  }, [autoPlayIndex, hoveredIndex, isAutoPlayInView, isSliderViewport]);

  useEffect(() => {
    const list = listRef.current;
    if (!isSliderViewport || !isAutoPlayInView || !list) {
      return undefined;
    }

    let animationFrameId;
    let userScrollTimeoutId;

    const finishUserScroll = () => {
      syncAutoPlayIndexWithSliderScroll();
      isUserScrollingRef.current = false;
    };

    const scheduleUserScrollEnd = () => {
      window.clearTimeout(userScrollTimeoutId);
      userScrollTimeoutId = window.setTimeout(finishUserScroll, 250);
    };

    const markUserScroll = () => {
      isUserScrollingRef.current = true;
      scheduleUserScrollEnd();
    };

    const handleScroll = () => {
      if (!isUserScrollingRef.current || hoveredIndex !== null) return;

      scheduleUserScrollEnd();
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(syncAutoPlayIndexWithSliderScroll);
    };

    list.addEventListener('pointerdown', markUserScroll, { passive: true });
    list.addEventListener('touchstart', markUserScroll, { passive: true });
    list.addEventListener('wheel', markUserScroll, { passive: true });
    list.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(userScrollTimeoutId);
      list.removeEventListener('pointerdown', markUserScroll);
      list.removeEventListener('touchstart', markUserScroll);
      list.removeEventListener('wheel', markUserScroll);
      list.removeEventListener('scroll', handleScroll);
    };
  }, [hoveredIndex, isAutoPlayInView, isSliderViewport, syncAutoPlayIndexWithSliderScroll]);

  useEffect(() => {
    if (!isSliderViewport || !isListInView) {
      return undefined;
    }

    let animationFrameId;
    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(updateTrailingSpacerWidth);
    };

    requestUpdate();
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [isListInView, isSliderViewport, updateTrailingSpacerWidth]);

  const handleAutoPlayVideoEnd = useCallback(() => {
    if (!isAutoPlayInView || hoveredIndex !== null) return;

    setAutoPlayIndex((currentIndex) =>
      currentIndex === null ? 0 : (currentIndex + 1) % items.length
    );
  }, [hoveredIndex, isAutoPlayInView, items.length]);

  const handleMouseEnter = useCallback(
    (index) => {
      if (isSliderViewport) return;

      setHoveredIndex(index);
      setAutoPlayIndex(index);
    },
    [isSliderViewport]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isSliderViewport) {
      setHoveredIndex(null);
    }
  }, [isSliderViewport]);

  return (
    <ul
      className="grid grid-cols-5 grid-rows-[auto_auto] gap-x-16 gap-y-8 2xl:gap-x-6 xl:gap-x-6 xl:gap-y-6 lg:-mx-5 lg:no-scrollbars lg:flex lg:snap-x lg:snap-mandatory lg:scroll-px-5 lg:gap-x-8 lg:gap-y-0 lg:overflow-x-auto lg:px-5 md:gap-x-6"
      ref={setListRef}
    >
      {items.map(({ title, description, videoBase, aspectRatio, width, height }, index) => {
        const activeIndex = hoveredIndex ?? (isAutoPlayInView ? autoPlayIndex : null);
        const isActive = activeIndex === index;

        return (
          <li
            className={cn(
              'group row-span-2 grid w-full max-w-64 cursor-default grid-rows-subgrid content-start text-white transition-opacity duration-200 lg:shrink-0 lg:snap-start lg:grid-rows-[auto_auto] lg:gap-y-8 lg:self-start md:gap-y-6',
              isActive
                ? 'opacity-100'
                : cn('opacity-80', !isSliderViewport && 'group-hover:opacity-100')
            )}
            key={title}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <p className="block max-w-sm text-base tracking-extra-tight text-pretty text-gray-new-60 xl:text-sm/normal lg:text-base">
              <span className="font-semibold text-white">{title}.</span> {description}
            </p>
            <span
              className={cn(
                'relative block overflow-hidden bg-[#111315] ring-1 ring-white/5',
                aspectRatio
              )}
            >
              <HeroServiceVideo
                height={height}
                isActive={isActive}
                onEnded={handleAutoPlayVideoEnd}
                shouldLoop={!isSliderViewport && hoveredIndex === index}
                title={title}
                videoBase={videoBase}
                width={width}
              />
            </span>
          </li>
        );
      })}
      <li
        className="hidden shrink-0 lg:block"
        style={{ width: trailingSpacerWidth }}
        aria-hidden="true"
      />
    </ul>
  );
};

HeroServices.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      videoBase: PropTypes.string.isRequired,
      aspectRatio: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default HeroServices;
