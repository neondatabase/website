import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

import SubItem from './sub-item';

const Item = ({ title, slug, items, isOpenByDefault, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const handleClick = () => setIsOpen((isOpen) => !isOpen);

  return (
    <li>
      {slug ? (
        <Link className="w-full py-2.5 pl-4 text-left" theme="black" size="md" to={`/${slug}`}>
          {title}
        </Link>
      ) : (
        <button
          className="flex w-full items-center py-2.5 text-left transition-colors duration-200 hover:text-primary-2"
          type="button"
          onClick={handleClick}
        >
          <ChevronRight className={clsx('mr-2 shrink-0', { 'rotate-90 transform': isOpen })} />
          <span className="text-xl font-semibold leading-snug">{title}</span>
        </button>
      )}
      {!!items?.length && (
        <ul className={clsx('pl-4', !isOpen && 'sr-only')}>
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
                  className={clsx('!flex items-center py-2.5 text-base !leading-snug', {
                    'font-semibold text-primary-2': currentSlug === slug,
                  })}
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
  items: null,
  isOpenByDefault: false,
};

export default Item;
