/* eslint-disable @next/next/no-img-element */

'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import ICONS_CONFIG from 'config/docs-icons-config';
import CheckIcon from 'icons/check.inline.svg';
import ChevronRight from 'icons/chevron-right-sm.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

const PromptCards = ({ children = null, withToggler = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const childrenArray = React.Children.toArray(children).filter(Boolean);
  const displayedChildren = withToggler && !isOpen ? childrenArray.slice(0, 10) : childrenArray;

  return (
    <>
      <ul className="not-prose !my-7 grid grid-cols-5 gap-3 !p-0 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {displayedChildren.map((child, index) => {
          if (!child) return null;

          const { title, icon, promptSrc } = child.props;
          const iconConfig = ICONS_CONFIG[icon];

          if (!iconConfig) {
            console.warn(`Icon "${icon}" not found in ICONS_CONFIG`);
            return null;
          }

          const { lightIconPath, darkIconPath } = iconConfig;

          return (
            <PromptCard
              key={index}
              title={title}
              icon={icon}
              lightIconPath={lightIconPath}
              darkIconPath={darkIconPath}
              promptSrc={promptSrc}
              index={index}
            />
          );
        })}
      </ul>
      {withToggler && (
        <button
          type="button"
          className="mx-auto mt-4 flex items-center rounded-full bg-gray-new-98 px-[18px] py-1.5 text-black-new transition-colors duration-200 hover:bg-gray-new-94 dark:bg-gray-new-10 dark:text-gray-new-80 dark:hover:bg-gray-new-15"
          onClick={handleToggle}
        >
          <span className="text-sm font-medium">{isOpen ? 'Hide' : 'Show more'}</span>
          <span className="ml-2.5 flex size-3 items-center justify-center">
            <ChevronRight
              className={clsx(
                'block shrink-0 transition-[transform,color] duration-200',
                isOpen ? '-rotate-90' : 'rotate-90'
              )}
            />
          </span>
        </button>
      )}
    </>
  );
};

const PromptCard = ({ title, icon, lightIconPath, darkIconPath, promptSrc, index }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (promptSrc) {
      fetch(promptSrc)
        .then((res) => res.text())
        .then(setMarkdown)
        .catch((err) => console.error(`Failed to fetch prompt: ${promptSrc}`, err));
    }
  }, [promptSrc]);

  const handleCopy = async (e) => {
    e.preventDefault();
    if (!markdown) return;

    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      sendGtagEvent('Button Clicked', { text: `Copy prompt - ${title}` });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <li className="!m-0 before:hidden">
      <button
        type="button"
        className={clsx(
          'group relative flex h-full w-full items-center gap-2.5 overflow-hidden rounded-lg border px-3 py-2.5 transition-all duration-200',
          'border-gray-new-90 bg-white hover:border-gray-new-80 hover:shadow-sm',
          'dark:border-gray-new-15 dark:bg-gray-new-8 dark:hover:border-gray-new-30',
          'focus:outline-none focus:ring-2 focus:ring-green-45 focus:ring-offset-2 dark:focus:ring-offset-gray-new-8',
          isCopied && 'border-green-45 dark:border-green-45'
        )}
        disabled={!markdown}
        onClick={handleCopy}
      >
        <div className="relative z-10 flex min-w-0 flex-1 items-center gap-2.5">
          <div className="relative h-6 w-6 shrink-0">
            <img
              className={clsx('h-full w-full object-contain', darkIconPath && 'dark:hidden')}
              src={lightIconPath}
              width={24}
              height={24}
              alt={`${icon} logo`}
              loading={index > 7 ? 'lazy' : 'eager'}
            />
            {darkIconPath && (
              <img
                className="hidden h-full w-full object-contain dark:block"
                src={darkIconPath}
                width={24}
                height={24}
                alt={`${icon} logo`}
                loading={index > 7 ? 'lazy' : 'eager'}
              />
            )}
          </div>
          <span className="truncate text-sm font-medium leading-tight text-black-new dark:text-white">
            {title}
          </span>
        </div>

        {/* Copy indicator */}
        <div
          className={clsx(
            'absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-200',
            isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          {isCopied ? (
            <CheckIcon className="h-3.5 w-3.5 text-green-45" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5 text-gray-new-30 dark:text-gray-new-60" />
          )}
        </div>
      </button>
    </li>
  );
};

PromptCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  lightIconPath: PropTypes.string.isRequired,
  darkIconPath: PropTypes.string,
  promptSrc: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

PromptCards.propTypes = {
  children: PropTypes.node,
  withToggler: PropTypes.bool,
};

export default PromptCards;
