'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right-sm.inline.svg';

const isActiveItem = (items, currentSlug) =>
  items?.some(
    ({ slug, items }) => slug === currentSlug || (items && isActiveItem(items, currentSlug))
  );

const Item = ({ title, slug = null, isStandalone = null, items = null, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(slug === currentSlug);

  if (!isOpen && isActiveItem(items, currentSlug)) {
    setIsOpen(true);
  }

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const externalSlug = slug && slug.startsWith('http') ? slug : null;
  const docSlug = isStandalone ? `/${slug}` : `${DOCS_BASE_PATH}${slug}/`;
  const Tag = slug ? Link : 'button';

  return (
    <li className="flex flex-col">
      <Tag
        className={clsx(
          'group flex w-full items-start justify-between py-2 text-left text-sm transition-colors duration-200',
          currentSlug === slug
            ? 'font-medium text-black-new dark:text-white'
            : 'font-normal text-gray-new-40 hover:text-black-new dark:text-gray-new-90 dark:hover:text-white'
        )}
        type={slug ? undefined : 'button'}
        to={slug ? externalSlug || docSlug : undefined}
        target={externalSlug ? '_blank' : '_self'}
        onClick={handleClick}
      >
        <span className="leading-snug">{title}</span>
        <ChevronRight
          className={clsx(
            'mx-2 mt-[5px] shrink-0 transition-[transform,color] duration-200',
            currentSlug === slug
              ? 'text-black-new dark:text-white'
              : 'text-gray-new-40 group-hover:text-black-new dark:text-gray-new-90 dark:group-hover:text-white',

            items?.length ? 'block' : 'hidden',
            isOpen ? 'rotate-90' : 'rotate-0'
          )}
        />
      </Tag>
      {!!items?.length && (
        <ul
          className={clsx(
            'relative pl-5 before:absolute before:left-[3px] before:h-full before:w-px before:bg-gray-new-90 dark:before:bg-gray-new-20',
            !isOpen && 'sr-only h-0'
          )}
        >
          {items.map((item, index) => (
            <Item {...item} currentSlug={currentSlug} key={index} />
          ))}
        </ul>
      )}
    </li>
  );
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
  isStandalone: PropTypes.bool,
  slug: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.exact({
          title: PropTypes.string,
          slug: PropTypes.string,
          items: PropTypes.arrayOf(
            PropTypes.exact({
              title: PropTypes.string,
              slug: PropTypes.string,
            })
          ),
        })
      ),
    })
  ),
  currentSlug: PropTypes.string.isRequired,
};

export default Item;
