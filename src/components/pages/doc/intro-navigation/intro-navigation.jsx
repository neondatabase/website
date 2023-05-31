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
  'w-5 h-5 shrink-0 !transition-colors !duration-200 text-black dark:text-white group-hover:text-secondary-8 dark:group-hover:text-[#00E599]';

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
    case 'PostgreSQL extensions':
      return <Puzzle className={classNames} />;
    case 'Neon API Reference':
      return <Plug className={classNames} />;
    default:
      return null;
  }
};

const IntroNavigation = ({ children = null }) => (
  <ul className="not-prose !my-10 grid grid-cols-3 gap-4 !p-0 md:grid-cols-2 sm:grid-cols-1">
    {React.Children.map(children, (child, index) => {
      const { children, href, title } = child.props?.children.props ?? {};

      return (
        <li className="!m-0 flex before:hidden">
          <NextLink
            key={index}
            href={href}
            className="group block grow basis-1/3 rounded-[10px] !border-none bg-gray-9 p-3.5 !transition-colors !duration-200 hover:bg-gray-8 dark:bg-gray-1 dark:hover:bg-gray-2 sm:p-3"
          >
            <div className="relative flex content-center gap-x-2.5">
              {renderIcon(children)}
              <h4 className="text-base font-semibold leading-tight text-black dark:text-white">
                {children}
              </h4>
            </div>
            <p className="!mb-0 !mt-2 text-sm leading-normal text-gray-4 dark:text-gray-7">
              {title}
            </p>
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
