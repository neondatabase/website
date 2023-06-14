'use client';

import clsx from 'clsx';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ArrowRightIcon from 'icons/arrow-right.inline.svg';
import ChevronRight from 'icons/chevron-right-sm.inline.svg';

const TechnologyNavigation = ({ children = null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <ul className="not-prose !mb-2 !mt-9 grid grid-cols-12 gap-5 !p-0 xs:grid-cols-1">
        {React.Children.map(children, (child, index) => {
          const {
            children: {
              props: { alt, src, title },
            },
            href,
          } = child.props?.children.props ?? {};
          const isHiddenItem = index > 3 && !isOpen;

          return (
            <li
              className={clsx(
                'col-span-3 before:hidden md:col-span-6',
                isHiddenItem ? 'hidden' : 'block'
              )}
            >
              <NextLink
                className="flex h-full flex-col justify-between overflow-hidden rounded-[10px] border border-gray-new-90 p-6 transition-colors duration-200 before:absolute before:inset-px before:rounded-[10px] before:bg-[linear-gradient(275.74deg,#FAFAFA_0%,rgba(250,250,250,0)100%)] before:opacity-0 before:transition-opacity before:duration-200 hover:border-gray-new-80 hover:before:opacity-100 dark:border-gray-new-20 dark:before:bg-[linear-gradient(275.74deg,rgba(36,38,40,0.8)_0%,rgba(36,38,40,0)_100%)] dark:hover:border-gray-new-30 xl:p-5"
                key={index}
                href={href}
              >
                <div className="relative z-10">
                  <img
                    className="h-9 w-auto shrink-0 dark:invert"
                    src={src}
                    height={36}
                    alt={`${alt} logo`}
                    loading={index > 3 ? 'lazy' : 'eager'}
                  />

                  <h3 className="mt-4 text-xl font-semibold leading-tight text-black-new dark:text-white">
                    {alt}
                  </h3>
                  <p className="mb-2.5 mt-2.5 text-sm text-gray-new-50 dark:text-gray-new-80">
                    {title}
                  </p>
                </div>
                <span className="relative z-10 mt-auto inline-flex items-center text-base font-medium text-secondary-8 dark:text-green-45 2xl:text-sm lg:text-base sm:text-sm">
                  <span>Learn more</span>
                  <ArrowRightIcon className="ml-1" />
                </span>
              </NextLink>
            </li>
          );
        })}
      </ul>
      <button
        className="mx-auto flex items-center rounded-full bg-gray-new-98 px-5 py-2 text-sm font-medium text-black-new transition-colors duration-200 hover:bg-gray-new-94 dark:bg-gray-new-15 dark:text-white dark:hover:bg-gray-2"
        type="button"
        onClick={handleClick}
      >
        <span>{isOpen ? 'Hide' : 'Show more'}</span>
        <ChevronRight
          className={clsx(
            'ml-2 block shrink-0 text-black-new transition-[transform,color] duration-200 dark:text-white',
            isOpen ? '-rotate-90' : 'rotate-90'
          )}
        />
      </button>
    </>
  );
};

TechnologyNavigation.propTypes = {
  children: PropTypes.node,
};

export default TechnologyNavigation;
