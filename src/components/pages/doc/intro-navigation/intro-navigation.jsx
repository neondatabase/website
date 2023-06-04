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
  'w-5 h-5 shrink-0 transition-colors duration-200 text-secondary-8 dark:text-green-45';

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
  <ul className="not-prose !my-10 grid grid-cols-2 gap-4 !p-0 sm:grid-cols-1">
    {React.Children.map(children, (child, index) => {
      const { children, href, title } = child.props?.children.props ?? {};

      return (
        <li className="!m-0 flex before:hidden">
          <NextLink
            className="relative block grow basis-1/3 rounded-[10px] border border-gray-new-94 p-3.5 transition-colors duration-200 before:absolute before:inset-0 before:rounded-[10px] before:bg-[linear-gradient(275.74deg,#FAFAFA_0%,rgba(250,250,250,0)100%)] before:opacity-0 before:transition-opacity before:duration-200 hover:border-gray-new-80 hover:before:opacity-100 dark:border-gray-new-20 dark:before:bg-[linear-gradient(275.74deg,rgba(36,38,40,0.8)_0%,rgba(36,38,40,0)_100%)] dark:hover:border-gray-new-30 sm:p-3"
            key={index}
            href={href}
          >
            <div className="relative z-10 flex content-center gap-x-2.5">
              {renderIcon(children)}
              <h4 className="text-base font-semibold leading-tight text-black dark:text-white">
                {children}
              </h4>
            </div>
            <p className="relative z-10 !mb-0 !mt-2 ml-[30px] text-sm leading-normal text-gray-4 dark:text-gray-7">
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
