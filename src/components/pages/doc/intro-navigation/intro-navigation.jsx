import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import AudioJack from 'icons/audio-jack.inline.svg';
import Filter from 'icons/filter-organization.inline.svg';
import Plug from 'icons/plug.inline.svg';
import Puzzle from 'icons/puzzle.inline.svg';
import SplitBranch from 'icons/split-branch.inline.svg';
import UploadFile from 'icons/upload-file.inline.svg';

const classNames =
  'sm:static sm:transform-none absolute -translate-x-[38px] !transition-colors !duration-200 text-black dark:text-white group-hover:text-secondary-8 dark:group-hover:text-[#00E599]';

const renderIcon = (text) => {
  switch (text) {
    case 'Connect':
      return <AudioJack className={classNames} />;
    case 'Import data':
      return <UploadFile className={classNames} />;
    case 'Manage':
      return <Filter className={classNames} />;
    case 'Branching':
      return <SplitBranch className={classNames} />;
    case 'Extensions':
      return <Puzzle className={classNames} />;
    case 'Neon API':
      return <Plug className={classNames} />;
    default:
      return null;
  }
};

const IntroNavigation = ({ children = null }) => (
  <ul className="not-prose !my-10 grid grid-cols-3 gap-5 !p-0  xl:grid-cols-2 lg:grid-cols-1">
    {React.Children.map(children, (child, index) => {
      const { children, href, title } = child.props?.children.props ?? {};

      return (
        <li className="!m-0 before:hidden">
          <NextLink
            key={index}
            href={href}
            className="group block rounded-[10px] !border-none bg-gray-9 pb-2 pl-[61px] pr-6 pt-6 !transition-colors !duration-200 hover:bg-gray-8 dark:bg-gray-1 dark:hover:bg-gray-2 3xl:min-h-[152px] 2xl:min-h-[145px] xl:min-h-min sm:p-6 sm:pb-2"
          >
            <div className="relative flex content-center gap-[18px]">
              {renderIcon(children)}
              <h4 className="text-xl font-semibold text-black dark:text-white">{children}</h4>
            </div>
            <p className="mt-2 text-sm text-gray-4 dark:text-gray-7">{title}</p>
          </NextLink>
        </li>
      );
    })}
  </ul>
);

IntroNavigation.propTypes = {
  children: PropTypes.node,
};

export default IntroNavigation;
