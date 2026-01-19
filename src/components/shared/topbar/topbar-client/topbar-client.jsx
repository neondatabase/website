'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';

import Link from 'components/shared/link';
import { TopbarContext } from 'contexts/topbar-context';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

import leftPatternLG from './images/left-pattern-lg.png';
import leftPatternSM from './images/left-pattern-sm.png';
import leftPatternXL from './images/left-pattern-xl.png';
import leftPatternXS from './images/left-pattern-xs.png';
import leftPattern from './images/left-pattern.png';
import rightPatternLG from './images/right-pattern-lg.png';
import rightPatternSM from './images/right-pattern-sm.png';
import rightPatternXL from './images/right-pattern-xl.png';
import rightPattern from './images/right-pattern.png';

const Pattern = ({ src, isRight, className }) => (
  <Image
    className={clsx(
      'pointer-events-none absolute top-0 z-0 h-9 w-auto',
      isRight ? 'right-0' : 'left-0',
      className
    )}
    src={src}
    quality={100}
    alt=""
    priority
  />
);

Pattern.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  isRight: PropTypes.bool,
};

const TopbarClient = ({ text, link }) => {
  const { setHasTopbar } = useContext(TopbarContext);

  useEffect(() => {
    setHasTopbar(true);

    return () => {
      setHasTopbar(false);
    };
  }, [setHasTopbar]);

  return (
    <Link
      className={clsx(
        'safe-paddings group relative z-50 h-9 w-full overflow-hidden px-4 py-2.5',
        'flex items-center justify-center',
        'border-b border-gray-new-90 bg-[#EBF5F0]',
        'focus-visible:-outline-offset-2',
        'dark:border-gray-new-20 dark:bg-gray-new-10'
      )}
      to={link.url}
      target={link.target || undefined}
      onClick={() => sendGtagEvent('click_announcement_banner')}
    >
      <div className="relative z-10 -mb-px grid grid-cols-[1fr_auto] gap-x-1.5">
        <span
          className={clsx(
            'truncate text-sm font-medium leading-none tracking-extra-tight',
            'xl:max-w-[790px] lg:max-w-[482px] sm:max-w-[calc(100vw-64px)]',
            'text-black-pure transition-colors duration-200 group-hover:text-gray-new-40',
            'dark:text-white group-hover:dark:text-gray-new-70'
          )}
        >
          {text}
        </span>
        <ChevronIcon className="origin-center -rotate-90 text-black-pure opacity-40 dark:text-white dark:opacity-60" />
      </div>

      <Pattern className="2xl:hidden" src={leftPattern} />
      <Pattern className="2xl:hidden" src={rightPattern} isRight />
      <Pattern className="hidden 2xl:block xl:hidden" src={leftPatternXL} />
      <Pattern className="hidden 2xl:block xl:hidden" src={rightPatternXL} isRight />
      <Pattern className="hidden xl:block lg:hidden" src={leftPatternLG} />
      <Pattern className="hidden xl:block lg:hidden" src={rightPatternLG} isRight />
      <Pattern className="hidden lg:block md:hidden" src={leftPatternSM} />
      <Pattern className="hidden lg:block md:hidden" src={rightPatternSM} isRight />
      <Pattern className="hidden md:block" src={leftPatternXS} />
    </Link>
  );
};

TopbarClient.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.shape({
    url: PropTypes.string.isRequired,
    target: PropTypes.string,
  }).isRequired,
};

export default TopbarClient;
