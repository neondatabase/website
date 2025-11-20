'use client';

import clsx from 'clsx';
import ImageComponent from 'next/image';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';

import Link from 'components/shared/link';
import { TopbarContext } from 'contexts/topbar-context';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

import leftImageLG from './images/left-pattern-lg.png';
import leftImageSM from './images/left-pattern-sm.png';
import leftImageXL from './images/left-pattern-xl.png';
import leftImageXS from './images/left-pattern-xs.png';
import rightImageLG from './images/right-pattern-lg.png';
import rightImageSM from './images/right-pattern-sm.png';
import rightImageXL from './images/right-pattern-xl.png';

const Image = ({ src, width, isRight, className }) => (
  <ImageComponent
    className={clsx(
      'pointer-events-none absolute top-0 z-0',
      isRight ? 'right-0' : 'left-0',
      className
    )}
    src={src}
    width={width}
    height={36}
    quality={100}
    alt=""
    priority
  />
);

Image.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
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
      className="safe-paddings group relative z-50 flex h-9 w-full items-center justify-center overflow-hidden border-b border-gray-new-80 bg-[#E4F1EB] px-4 py-2.5 dark:border-gray-new-20 dark:bg-black-pure"
      to={link.url}
      target={link.target || undefined}
      onClick={() => {
        sendGtagEvent('click_announcement_banner');
      }}
    >
      <div className="-mb-px grid grid-cols-[1fr_auto] gap-x-1.5">
        <span className="truncate text-sm font-medium leading-none tracking-extra-tight text-black-pure transition-colors duration-200 hover:text-gray-new-40 dark:text-white group-hover:dark:text-gray-new-80">
          {text}
        </span>
        <ChevronIcon className="origin-center -rotate-90 text-black-pure opacity-40 dark:text-white dark:opacity-60" />
      </div>

      <Image className="xl:hidden" src={leftImageXL} width={500} />
      <Image className="xl:hidden" src={rightImageXL} width={500} isRight />
      <Image className="hidden xl:block lg:hidden" src={leftImageLG} width={320} />
      <Image className="hidden xl:block lg:hidden" src={rightImageLG} width={275} isRight />
      <Image className="hidden lg:block sm:hidden" src={leftImageSM} width={250} />
      <Image className="hidden lg:block sm:hidden" src={rightImageSM} width={180} isRight />
      <Image className="hidden sm:block" src={leftImageXS} width={150} />
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
