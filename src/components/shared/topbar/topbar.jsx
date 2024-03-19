'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import pagesWithNoTopbar from 'utils/pages-with-no-topbar';
import sendGtagEvent from 'utils/send-gtag-event';

import patternImage from './images/pattern.svg';

// TODO: If you want to change the background color of the topbar, please update the themeColor in function getMetadata (src/utils/get-metadata.js) as well
// It is recommended to set background color for tab bar in safari browser https://github.com/neondatabase/website/assets/48465000/d79fba3a-ac4a-4e81-be64-b2cf371d57bc
const TopBar = () => {
  const pathname = usePathname();

  const isTopBarHidden = pagesWithNoTopbar.includes(pathname);

  if (isTopBarHidden) {
    return null;
  }

  return (
    <Link
      className="safe-paddings relative z-40 flex h-9 w-full items-center justify-center overflow-hidden bg-gray-new-8 px-4 py-2.5 leading-none transition-colors duration-200 hover:bg-gray-new-10 xs:h-auto"
      to="https://console.neon.tech/signup"
      onClick={() => {
        sendGtagEvent('click_announcement_banner');
      }}
    >
      <span className="mr-4 truncate border-r border-black border-opacity-20 py-1 text-sm font-medium tracking-extra-tight text-gray-new-80 mix-blend-plus-lighter sm:mr-0 sm:border-none sm:pr-0">
        Hello Australia! Sydney region is officially live on Neon.
      </span>
      <ChevronIcon className="-ml-[7px] w-[9px] origin-center -rotate-90 text-white opacity-60" />
      <span
        className="absolute inset-x-0 bottom-0 z-10 block h-px w-full bg-white mix-blend-overlay"
        aria-hidden
      />
      <span className="absolute left-1/2 top-1/2 -z-30 h-[188px] w-[60px] origin-center -translate-y-[43%] translate-x-[-290px] rotate-[226deg] rounded-[100%] bg-[linear-gradient(-45deg,_#6DC5D8_40.06%,_#6A77E8_48.11%)] mix-blend-plus-lighter blur-2xl" />
      <span className="absolute left-1/2 top-1/2 -z-20 h-[106px] w-[29px] origin-center -translate-y-1/2 translate-x-[-280px] rotate-[226deg] rounded-[100%] bg-[linear-gradient(-19deg,#FFF_51%,rgba(255,255,255,0)_30.57%)] mix-blend-plus-lighter blur-lg" />
      <Image
        className="absolute left-1/2 top-0 -z-10 -translate-x-[440px] [mask-image:linear-gradient(90deg,rgba(0,0,0,.1)_15%,black_70%,rgba(0,0,0,.1)_100%)]"
        src={patternImage}
        width={345}
        height={35}
        alt=""
        priority
      />
    </Link>
  );
};

export default TopBar;
