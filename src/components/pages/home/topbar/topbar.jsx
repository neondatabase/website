import React from 'react';

import Link from 'components/shared/link';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';

const TopBar = ({ text, to }) => (
  <div className="safe-paddings relative z-40 flex h-11 w-full items-center justify-center bg-primary-1">
    <span className="font-medium">{text}</span>
    <div className="mx-4 h-5 w-px bg-black opacity-20 xs:hidden" />
    <Link to={to}>
      <span className="font-bold xs:hidden">Readmore</span>
      <ArrowRightIcon className="m-1.5 inline" />
    </Link>
  </div>
);

export default TopBar;
