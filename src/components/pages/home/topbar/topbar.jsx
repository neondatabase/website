import React from 'react';

import Link from 'components/shared/link';

const TopBar = () => (
  <div className="safe-paddings relative z-40 flex h-11 w-full items-center justify-center bg-primary-1 px-4 py-3 transition-colors duration-200 hover:bg-[#1AFFB2] xs:h-auto xs:flex-col">
    <span className="mr-4 border-r border-black border-opacity-20 py-1 pr-4 text-sm font-semibold xs:mr-0 xs:border-r-0 xs:pr-0">
      Neon raises 30mln in Series A-1
    </span>
    <Link
      className="font-bold xs:mt-1"
      theme="black-no-hover"
      size="2xs"
      to="/blog/funding-a1/"
      withArrow
    >
      Read More
    </Link>
  </div>
);

export default TopBar;
