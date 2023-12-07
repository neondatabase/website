'use client';

import { usePathname } from 'next/navigation';

import Link from 'components/shared/link';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';
import pagesWithNoTopbar from 'utils/pages-with-no-topbar';
import sendGtagEvent from 'utils/send-gtag-event';
import sendSegmentEvent from 'utils/send-segment-event';

// TODO: If you want to change the background color of the topbar, please update the themeColor in function getMetadata (src/utils/get-metadata.js) as well
// It is recommended to set background color for tab bar in safari browser https://github.com/neondatabase/website/assets/48465000/d79fba3a-ac4a-4e81-be64-b2cf371d57bc
const TopBar = () => {
  const pathname = usePathname();

  const isTopBarHidden = pagesWithNoTopbar.includes(pathname);

  return isTopBarHidden ? null : (
    <Link
      className="safe-paddings relative z-40 flex h-11 w-full items-center justify-center bg-primary-1 px-4 py-3 leading-none transition-colors duration-200 hover:bg-[#1AFFB2] xs:h-auto"
      to="/discord"
      onClick={() => {
        sendGtagEvent('click_announcement_banner');
        sendSegmentEvent('click_announcement_banner');
      }}
    >
      <span className="mr-4 py-1 truncate pr-4 text-sm font-medium border-r border-black border-opacity-20 sm:border-none sm:mr-0 sm:pr-0">
        We have launched our Discord server 🚀
      </span>
      <span className="inline-flex items-center text-sm font-bold sm:hidden">
        <span>Join us</span>
        <ArrowRightIcon className="ml-1" />
      </span>
      <ArrowRightIcon className="ml-2 hidden sm:flex" />
    </Link>
  );
};

export default TopBar;
