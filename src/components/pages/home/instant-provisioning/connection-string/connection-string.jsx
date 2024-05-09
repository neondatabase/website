'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const DICTIONARY = '0123456789qwertyuiopasdfghjklzxcvbnm!?></\\a~+*=@#$%'.split('');
const COUNT_RANDOM_FRAMES = 40;

const getRandomIndex = () => Math.floor(Math.random() * DICTIONARY.length);

const generateRandomString = (length) => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += DICTIONARY[getRandomIndex()];
  }
  return result;
};

const ConnectionString = ({ url }) => {
  const [displayText, setDisplayText] = useState(url);
  const frameRef = useRef();
  const frameCountRef = useRef(0);
  const { ref: animationRef, inView: isVisible } = useInView({ threshold: 0.75 });
  const { ref: containerRef, inView } = useInView({ rootMargin: '100px 0px' });

  const isAnimated = displayText !== url;

  useEffect(
    () => {
      if (!isVisible || displayText === url) {
        return;
      }

      setDisplayText('');
      frameCountRef.current = 0;
      const stringLength = url.length;

      const animate = () => {
        if (frameCountRef.current % 2 === 0) {
          if (frameCountRef.current < COUNT_RANDOM_FRAMES) {
            setDisplayText(generateRandomString(stringLength));
          } else if (frameCountRef.current / 2 - COUNT_RANDOM_FRAMES / 2 < stringLength) {
            const revealedPart = url.slice(
              0,
              frameCountRef.current / 2 - COUNT_RANDOM_FRAMES / 2 - 1
            );
            const randomPart = generateRandomString(stringLength - revealedPart.length);
            setDisplayText(revealedPart + randomPart);
          } else {
            setDisplayText(url);
            return;
          }
        }
        frameCountRef.current += 1;
        frameRef.current = requestAnimationFrame(animate);
      };

      frameRef.current = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(frameRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url, isVisible]
  );

  useEffect(() => {
    if (!inView) {
      setDisplayText(() => generateRandomString(url.length));
    }
  }, [url, inView]);

  return (
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
          'relative mt-1 h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-300 xl:h-[5px] xl:w-[5px]',
          isAnimated
            ? 'animate-pulse bg-[#C0C0C0] shadow-[0px_0px_9px_0px_#BABABA]'
            : 'bg-primary-1 shadow-[0px_0px_9px_0px_#4BFFC3]'
        )}
        aria-hidden
      >
        <span className="absolute inset-px h-1 w-1 rounded-full bg-[#D9FDF1] opacity-70 blur-[1px]" />
      </span>
      <span
        className={clsx(
          'line-clamp-1 h-[14px] font-mono text-[13px] leading-none transition-colors duration-300 md:h-3 md:text-[11px]',
          isAnimated ? 'text-gray-new-60' : 'text-white'
        )}
      >
        {displayText}
      </span>
    </div>
  );
};

ConnectionString.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ConnectionString;
