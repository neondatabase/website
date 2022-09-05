import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

import SubItem from './sub-item';

const Item = ({ title, slug, isStandalone, items, isOpenByDefault, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const handleClick = () => setIsOpen((isOpen) => !isOpen);

  const docSlug = isStandalone ? `/${slug}` : `${DOCS_BASE_PATH}${slug}/`;

  return (
    <li>
      {slug ? (
        <Link
          className={clsx('w-full py-2.5 pl-4 text-left !text-lg font-semibold', {
            'font-bold text-primary-2': currentSlug === slug,
          })}
          theme="black"
          size="sm"
          to={docSlug}
        >
          {title}
        </Link>
      ) : (
        <button
          className="flex w-full items-center py-2.5 text-left transition-colors duration-200 hover:text-primary-2"
          type="button"
          onClick={handleClick}
        >
          <ChevronRight
            className={clsx(
              'mr-2 shrink-0 transition-transform duration-150',
              isOpen ? 'rotate-90' : 'rotate-0'
            )}
          />
          <span className="text-lg font-bold leading-snug">{title}</span>
        </button>
      )}
      {!!items?.length && (
        <ul
          className={clsx(
            'relative pl-9 before:absolute before:left-[3px] before:h-full before:w-0.5 before:bg-gray-4',
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
                    '!flex items-center py-2.5 text-base font-semibold !leading-snug',
                    {
                      'font-semibold text-primary-2': currentSlug === slug,
                    }
                  )}
                  to={`${DOCS_BASE_PATH}${slug}/`}
                  theme="black"
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
