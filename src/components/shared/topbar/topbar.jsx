import React from 'react';

import Link from 'components/shared/link';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';

const TopBar = () => (
  <Link
    className="safe-paddings relative z-40 flex h-11 w-full items-center justify-center bg-primary-1 px-4 py-3 leading-none transition-colors duration-200 hover:bg-[#1AFFB2] xs:h-auto"
    to="https://neon.tech/blog/postgres-autoscaling"
  >
    <span className="mr-4 truncate border-r border-black border-opacity-20 py-1 pr-4 text-sm font-semibold">
      Announcing autoscaling in feature-preview!
    </span>
    <span className="inline-flex items-center text-sm font-bold sm:hidden">
      <span>Learn More</span>
      <ArrowRightIcon className="ml-1" />
    </span>
    <ArrowRightIcon className="ml-2 hidden sm:flex" />
  </Link>
);

export default TopBar;
