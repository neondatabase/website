/* eslint-disable @next/next/no-img-element */

'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import ICONS_CONFIG from 'config/docs-icons-config';
import CheckIcon from 'icons/check.inline.svg';
import ChevronRight from 'icons/chevron-right-sm.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const CARDS_TO_SHOW = 12;
const GRID_CLASS_NAMES = {
  2: 'grid-cols-2 gap-x-20 gap-y-7 xl:gap-x-8 lg:gap-5 md:grid-cols-1',
  4: 'grid-cols-4 gap-x-20 gap-y-7 xl:gap-x-8 lg:gap-5 md:grid-cols-3 sm:grid-cols-2',
};

const CompactCards = ({ className, children = null, cols = 2, withToggler = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const childrenArray = React.Children.toArray(children).filter(Boolean);
  const displayedChildren =
    withToggler && !isOpen ? childrenArray.slice(0, CARDS_TO_SHOW) : childrenArray;
  const columns = Number(cols);
  const gridClassName = GRID_CLASS_NAMES[columns] || GRID_CLASS_NAMES[2];

  return (
    <div className={cn('compact-cards not-prose my-7', className)}>
      <ul className={cn('my-0! grid p-0!', gridClassName)}>
        {displayedChildren.map((child, index) => {
          if (!child) return null;

          const { title: titleProp, description, icon, promptSrc, href } = child.props;
          const title = titleProp || child.props.children;
          const iconConfig = ICONS_CONFIG[icon];

          if (!title) {
            console.warn('CompactCards item is missing a title');
            return null;
          }

          if (!iconConfig) {
            console.warn(`Icon "${icon}" not found in ICONS_CONFIG`);
            return null;
          }

          const { lightIconPath, darkIconPath } = iconConfig;

          return (
            <CompactCard
              key={index}
              title={title}
              description={description}
              icon={icon}
              lightIconPath={lightIconPath}
              darkIconPath={darkIconPath}
              promptSrc={promptSrc}
              href={href}
              index={index}
            />
          );
        })}
      </ul>
      {withToggler && (
        <button
          type="button"
          className="mx-auto mt-7 flex items-center rounded-full border border-gray-new-80 py-1.5 pr-4 pl-4.5 text-black-new transition-colors duration-200 hover:bg-gray-new-94 dark:border-gray-new-20 dark:text-white dark:hover:bg-gray-new-15"
          onClick={handleToggle}
        >
          <span className="text-sm tracking-extra-tight">
            {isOpen
              ? 'Hide'
              : childrenArray.length > CARDS_TO_SHOW
                ? `${childrenArray.length - CARDS_TO_SHOW}+ more`
                : 'Show more'}
          </span>
          <span className="ml-1.5 flex h-auto w-3 shrink-0 items-center justify-center">
            <ChevronRight
              className={cn(
                'block shrink-0 text-black-pure/50 transition-[rotate,color] duration-200 dark:text-white/50',
                isOpen ? '-rotate-90' : 'rotate-90'
              )}
            />
          </span>
        </button>
      )}
    </div>
  );
};

const CompactCard = ({
  title,
  description = null,
  icon,
  lightIconPath,
  darkIconPath,
  promptSrc = null,
  href = null,
  index,
}) => {
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

  const sharedClassName = cn(
    'group/card relative flex min-h-10 w-full items-start gap-3 overflow-hidden text-left transition-colors duration-200',
    'focus:ring-2 focus:ring-green-45 focus:ring-offset-2 focus:outline-hidden dark:focus:ring-offset-gray-new-8',
    promptSrc && 'pr-7'
  );

  const innerContent = (
    <>
      <div
        className={cn(
          'relative flex size-10 shrink-0 items-center justify-center border border-gray-new-80 bg-gray-new-98 transition-colors duration-200 group-hover/card:border-gray-new-70 dark:border-gray-new-20 dark:bg-gray-new-8 dark:group-hover/card:border-gray-new-40',
          !!description && 'top-0.5'
        )}
      >
        <img
          className={cn('size-6', darkIconPath && 'dark:hidden')}
          src={lightIconPath}
          width={24}
          height={24}
          alt={`${icon} logo`}
          loading={index > 7 ? 'lazy' : 'eager'}
        />
        {darkIconPath && (
          <img
            className="hidden size-6 dark:block"
            src={darkIconPath}
            width={24}
            height={24}
            alt={`${icon} logo`}
            loading={index > 7 ? 'lazy' : 'eager'}
          />
        )}
      </div>
      <div className="relative z-10 min-w-0 flex-1 self-center">
        <span className="compact-card-title block text-base leading-snug font-medium tracking-extra-tight text-black-pure transition-colors duration-200 group-hover/card:text-green-45 dark:text-white dark:group-hover/card:text-green-45">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-[0.9375rem] leading-snug tracking-extra-tight text-gray-new-50">
            {description}
          </span>
        )}
      </div>

      {promptSrc && (
        <div
          className={cn(
            'absolute top-1/2 right-2 -translate-y-1/2 text-gray-new-60 transition-opacity duration-200',
            isCopied ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
          )}
        >
          {isCopied ? (
            <CheckIcon className="h-3.5 w-3.5 text-green-45" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
        </div>
      )}
    </>
  );

  if (promptSrc) {
    return (
      <li className="m-0! before:hidden">
        <button type="button" className={sharedClassName} disabled={!markdown} onClick={handleCopy}>
          {innerContent}
        </button>
      </li>
    );
  }

  if (href) {
    return (
      <li className="m-0! before:hidden">
        <Link
          href={href}
          className={sharedClassName}
          onClick={() => sendGtagEvent('Card Clicked', { text: `Compact card link - ${title}` })}
        >
          {innerContent}
        </Link>
      </li>
    );
  }

  return (
    <li className="m-0! before:hidden">
      <div className={sharedClassName}>{innerContent}</div>
    </li>
  );
};

CompactCard.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.string,
  icon: PropTypes.string.isRequired,
  lightIconPath: PropTypes.string.isRequired,
  darkIconPath: PropTypes.string,
  promptSrc: PropTypes.string,
  href: PropTypes.string,
  index: PropTypes.number.isRequired,
};

CompactCards.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  cols: PropTypes.oneOfType([PropTypes.oneOf([2, 4]), PropTypes.oneOf(['2', '4'])]),
  withToggler: PropTypes.bool,
};

export { CompactCards };
export default CompactCards;
