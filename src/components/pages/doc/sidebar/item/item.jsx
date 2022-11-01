import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right-sm.inline.svg';

import SubItem from './sub-item';

const Item = ({ title, slug, isStandalone, items, isOpenByDefault, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const handleClick = () => setIsOpen((isOpen) => !isOpen);

  const docSlug = isStandalone ? `/${slug}` : `${DOCS_BASE_PATH}${slug}/`;

  return (
    <li className="flex flex-col">
      {slug ? (
        <Link
          className={clsx('w-full py-2 text-left text-sm hover:text-secondary-8', {
            'font-semibold': currentSlug === slug,
          })}
          size="2xs"
          to={docSlug}
        >
          {title}
        </Link>
      ) : (
        <button
          className="flex w-full items-center justify-between py-2 text-left text-sm transition-colors duration-200 hover:text-secondary-8"
          type="button"
          onClick={handleClick}
        >
          <span className="leading-snug">{title}</span>
          <ChevronRight
            className={clsx(
              'mr-2 shrink-0 text-gray-5 transition-transform duration-150',
              isOpen ? 'rotate-90' : 'rotate-0'
            )}
          />
        </button>
      )}
      {!!items?.length && (
        <ul
          className={clsx(
            'relative pl-5 before:absolute before:left-[3px] before:h-full before:w-px before:bg-gray-6',
            !isOpen && 'sr-only'
          )}
        >
          {items.map(({ title, slug, items }, index) => (
            <li key={index}>
              {items?.length > 0 ? (
                <SubItem
                  title={title}
                  items={items}
                  isParentOpen={isOpen}
                  currentSlug={currentSlug}
                />
              ) : (
                <Link
                  className={clsx(
                    '!flex items-center py-2 text-sm leading-tight hover:text-secondary-8',
                    {
                      'font-semibold': currentSlug === slug,
                    }
                  )}
                  to={`${DOCS_BASE_PATH}${slug}/`}
                  tabIndex={!isOpen ? '-1' : undefined}
                >
                  {title}
                </Link>
              )}
            </li>
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
          title: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  isOpenByDefault: PropTypes.bool,
  currentSlug: PropTypes.string.isRequired,
};

Item.defaultProps = {
  slug: null,
  isStandalone: null,
  items: null,
  isOpenByDefault: false,
};

export default Item;
