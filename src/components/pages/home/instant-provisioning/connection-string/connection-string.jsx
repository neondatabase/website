'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useWindowSize } from 'react-use';

import BlurWrapper from '../blur-wrapper';

const DICTIONARY = '0123456789qwertyuiopasdfghjklzxcvbnm!?></\\a~+*=@#$%'.split('');
const COUNT_RANDOM_FRAMES = 36;
const IS_MOBILE_SCREEN_WIDTH = 1023;

const getRandomIndex = () => Math.floor(Math.random() * DICTIONARY.length);

const generateRandomString = (length) => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += DICTIONARY[getRandomIndex()];
  }
  return result;
};

const ConnectionString = ({ url }) => {
  // NOTE: we use two strings array, where the first string is the revealed part of the url and the second string is the random part
  const [currentStringArray, setCurrentStringArr] = useState([url, '']);
  const { width: windowWidth } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const frameRef = useRef();
  const frameCountRef = useRef(0);
  const { ref: animationRef, inView: isVisible } = useInView({ threshold: 0.75 });
  const { ref: containerRef, inView } = useInView({ rootMargin: '100px 0px' });
  const displayText = currentStringArray.join('');
  const isAnimated = displayText !== url;

  useEffect(() => {
    setIsMobile(windowWidth <= IS_MOBILE_SCREEN_WIDTH);
  }, [windowWidth]);

  useEffect(
    () => {
      if (!isVisible || !isAnimated || isMobile) {
        return;
      }

      frameCountRef.current = 0;
      const stringLength = url.length;

      const animate = () => {
        if (frameCountRef.current < COUNT_RANDOM_FRAMES) {
          setCurrentStringArr(['', generateRandomString(stringLength)]);
        } else if (frameCountRef.current / 2 - COUNT_RANDOM_FRAMES / 2 < stringLength) {
          const revealedPart = url.slice(
            0,
            frameCountRef.current / 2 - COUNT_RANDOM_FRAMES / 2 - 1
          );
          const randomPart = generateRandomString(stringLength - revealedPart.length);
          setCurrentStringArr([revealedPart, randomPart]);
        } else {
          setCurrentStringArr([url, '']);
          return;
        }
        frameCountRef.current += 3;
        frameRef.current = requestAnimationFrame(animate);
      };

      frameRef.current = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(frameRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url, isVisible, isMobile]
  );

  useEffect(() => {
    if (!inView && !isMobile) {
      setCurrentStringArr(() => ['', generateRandomString(url.length)]);
    }
  }, [url, inView, isMobile]);

  useEffect(() => {
    if (isMobile) {
      setCurrentStringArr(() => [url, '']);
    }
  }, [isMobile, url]);

  return (
    <>
      <p
        className={clsx(
          'relative mr-3 self-end font-mono text-xs leading-none tracking-extra-tight transition-[opacity,transform] duration-200 lg:mr-2 sm:mr-0',
          'before:pointer-events-none before:absolute before:-inset-x-1.5 before:inset-y-px before:rounded-[100%] before:bg-white before:opacity-[0.22] before:blur-md',
          isAnimated ? 'translate-y-[3px] opacity-0' : 'translate-y-0 opacity-100'
        )}
      >
        <span className="relative text-xs tracking-extra-tight opacity-80 xl:text-[11px]">
          Provisioned in 300ms
        </span>
      </p>
      <BlurWrapper className="mt-2.5 md:mt-8 md:p-1">
        <div
          className="relative z-20 flex h-12 gap-x-3.5 rounded-[10px] border-opacity-[0.05] bg-black-new pl-[18px] pt-4 tracking-extra-tight xl:h-[43px] xl:rounded-lg xl:pl-4 xl:pt-[14px] lg:gap-x-3 md:h-9 md:gap-x-2.5 md:pl-[14px] md:pt-[13px]"
          ref={containerRef}
        >
          <span
            className="absolute left-0 top-1/2 h-[450px] w-px -translate-y-1/2"
            ref={animationRef}
          />
          <span
            className={clsx(
              'relative mt-1 h-1.5 w-1.5 shrink-0 rounded-full transition-[background-color,box-shadow] duration-200 xl:h-[5px] xl:w-[5px]',
              isAnimated
                ? 'animate-pulse bg-[#C0C0C0] shadow-[0px_0px_9px_0px_#BABABA]'
                : 'bg-primary-1 shadow-[0px_0px_9px_0px_#4BFFC3]'
            )}
            aria-hidden
          >
            <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9FDF1] opacity-70 blur-[1px]" />
          </span>
          <span
            className={clsx(
              'line-clamp-1 h-[14px] font-mono text-[13px] leading-none transition-colors duration-200 md:h-3 md:text-[11px]',
              isAnimated ? 'text-gray-new-60' : 'text-white'
            )}
          >
            <span className={clsx(isAnimated ? 'text-gray-new-90' : 'text-white')}>
              {currentStringArray[0]}
            </span>
            <span>{currentStringArray[1]}</span>
          </span>
        </div>
      </BlurWrapper>
    </>
  );
};

ConnectionString.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ConnectionString;
