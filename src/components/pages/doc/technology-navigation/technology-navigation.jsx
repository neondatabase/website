'use client';

import clsx from 'clsx';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ChevronRight from 'icons/chevron-right-sm.inline.svg';

const IMAGE_PATH = '/images/technology-logos';

const TechnologyNavigation = ({ children = null, open = false }) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <ul className="not-prose !mb-0 !mt-7 grid grid-cols-3 gap-5 !p-0 sm:grid-cols-1">
        {React.Children.map(children, (child, index) => {
          if (!child) return null;

          const { href, title, description, icon } = child.props;

          const isHiddenItem = index > 2 && !isOpen;

          return (
            <li className={clsx('!m-0 before:hidden', isHiddenItem ? 'hidden' : 'block')}>
              <NextLink
                className={clsx(
                  'flex h-full flex-col justify-between overflow-hidden rounded-[10px] border border-gray-new-90 px-6 py-5 transition-colors duration-200',
                  'before:absolute before:inset-px before:rounded-[10px] before:bg-[linear-gradient(275.74deg,#FAFAFA_0%,rgba(250,250,250,0)100%)] before:opacity-0 before:transition-opacity before:duration-200',
                  'hover:border-gray-new-80 hover:before:opacity-100',
                  'dark:border-gray-new-15 dark:before:bg-[linear-gradient(275.74deg,rgba(36,38,40,0.8)_0%,rgba(36,38,40,0)_100%)] dark:hover:border-gray-new-30 xl:p-5'
                )}
                key={index}
                href={href}
              >
                <div className="relative z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-9 w-auto shrink-0 dark:hidden"
                    src={`${IMAGE_PATH}/${icon}.svg`}
                    width={36}
                    height={36}
                    alt={`${icon} logo`}
                    loading={index > 3 ? 'lazy' : 'eager'}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="hidden dark:block"
                    src={`${IMAGE_PATH}/${icon}-dark.svg`}
                    width={36}
                    height={36}
                    alt={`${icon} logo`}
                    loading={index > 3 ? 'lazy' : 'eager'}
                  />
                  <h3 className="mt-[18px] text-xl font-semibold leading-tight text-black-new dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-new-50 dark:text-gray-new-80">
                    {description}
                  </p>
                </div>
              </NextLink>
            </li>
          );
        })}
      </ul>
      {!open && (
        <button
          type="button"
          className="mx-auto mt-4 flex items-center rounded-full bg-gray-new-98 px-[18px] py-1.5 text-black-new transition-colors duration-200 hover:bg-gray-new-94 dark:bg-gray-new-10 dark:text-gray-new-80 dark:hover:bg-gray-new-15"
          onClick={handleClick}
        >
          <span className="text-sm font-medium">{isOpen ? 'Hide' : 'Show more'}</span>
          <span className="ml-2.5 flex size-3 items-center justify-center">
            <ChevronRight
              className={clsx(
                'block shrink-0 transition-[transform,color] duration-200 ',
                isOpen ? '-rotate-90' : 'rotate-90'
              )}
            />
          </span>
        </button>
      )}
    </>
  );
};

TechnologyNavigation.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
};

export default TechnologyNavigation;
