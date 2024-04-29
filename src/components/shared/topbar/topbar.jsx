'use client';

import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

import patternImage from './images/pattern.svg';

// TODO: If you want to change the background color of the topbar, please update the themeColor in function getMetadata (src/utils/get-metadata.js) as well
// It is recommended to set background color for tab bar in safari browser https://github.com/neondatabase/website/assets/48465000/d79fba3a-ac4a-4e81-be64-b2cf371d57bc
const TopBar = ({ isThemeBlack }) => (
  <Link
    className={clsx(
      'safe-paddings relative z-40 flex h-9 w-full items-center justify-center gap-x-2.5 overflow-hidden px-4 py-2.5 leading-none transition-colors duration-200 dark:bg-[#0B0C0F] dark:hover:bg-gray-new-8',
      isThemeBlack ? 'bg-[#0B0C0F] hover:bg-gray-new-8' : 'bg-[#F5FBFD] hover:bg-[#f1fcff]'
    )}
    to="https://neon.tech/blog/neon-ga"
    onClick={() => {
      sendGtagEvent('click_announcement_banner');
    }}
  >
    <span
      className={clsx(
        'absolute left-1/2 -z-20 h-[106px] w-[29px] origin-center -translate-y-1/2 rotate-[226deg] rounded-[100%] mix-blend-plus-lighter blur-lg dark:opacity-100',
        isThemeBlack
          ? 'top-1/2 translate-x-[-280px] bg-[linear-gradient(-19deg,#FFF_51%,rgba(255,255,255,0)_30.57%)]'
          : '-top-2 z-40 -translate-x-60 bg-[linear-gradient(265.08deg,#FFFFFF_52.92%,rgba(255,255,255,0)_53.57%)] opacity-50'
      )}
    />
    <span
      className={clsx(
        'absolute left-1/2 top-1/2 -z-10 h-[188px] w-[60px] origin-center -translate-y-[43%] translate-x-[-290px] rotate-[226deg] rounded-[100%] bg-[linear-gradient(-45deg,_#6DC5D8_40.06%,_#6A77E8_48.11%)] mix-blend-plus-lighter blur-2xl dark:opacity-100',
        !isThemeBlack && 'opacity-70'
      )}
    />
    {!isThemeBlack && (
      <span className="absolute left-1/2 top-1/2 z-0 h-[188px] w-[60px] origin-center -translate-y-[43%] translate-x-[-290px] rotate-[226deg] rounded-[100%] bg-[linear-gradient(-45deg,_#6DC5D8_40.06%,_#6A77E8_48.11%)] opacity-100 blur-2xl dark:hidden" />
    )}
    <Image
      className={clsx(
        'absolute left-1/2 top-0 z-10 -translate-x-[440px] [mask-image:linear-gradient(90deg,rgba(0,0,0,.1)_15%,black_70%,rgba(0,0,0,.1)_100%)] dark:opacity-100',
        !isThemeBlack && 'opacity-80 mix-blend-overlay'
      )}
      src={patternImage}
      width={345}
      height={35}
      alt=""
      priority
    />
    {!isThemeBlack && (
      <span
        className="absolute inset-x-0 bottom-0 z-10 block h-px w-full bg-gray-new-98 bg-opacity-40 dark:hidden"
        aria-hidden
      />
    )}
    <span
      className={clsx(
        'absolute inset-x-0 bottom-0 z-10 block h-px w-full mix-blend-overlay dark:bg-white',
        isThemeBlack ? 'bg-white' : 'bg-black-new'
      )}
      aria-hidden
    />
    <span
      className={clsx(
        'relative z-50 truncate py-1 text-sm font-medium tracking-extra-tight dark:text-gray-new-80 dark:opacity-95 sm:text-[13px]',
        isThemeBlack ? 'text-gray-new-80 opacity-95' : 'text-gray-new-15'
      )}
    >
      Neon is Generally Available! Serverless Postgres with branching to boost your development
      velocity.
    </span>
    <ChevronIcon
      className={clsx(
        'relative z-50 w-[9px] origin-center -rotate-90 opacity-60 dark:text-white',
        isThemeBlack ? 'text-white' : 'text-black-new'
      )}
    />
  </Link>
);

TopBar.propTypes = {
  isThemeBlack: PropTypes.bool,
};

export default TopBar;
