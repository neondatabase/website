import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right.inline.svg';

import SubItem from './sub-item';

const Item = ({ title, items, isOpenByDefault, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const handleClick = () => setIsOpen((isOpen) => !isOpen);

  return (
    <li>
      <button
        className="flex items-center py-2.5 transition-colors duration-200 hover:text-primary-2"
        type="button"
        onClick={handleClick}
      >
        <ChevronRight className={clsx('mr-2', { 'rotate-90 transform': isOpen })} />
        <span className="text-xl font-semibold leading-snug">{title}</span>
      </button>
      <ul className={clsx('pl-4', !isOpen && 'sr-only')}>
        {items.map(({ title, slug, items }, index) => (
          <li key={index}>
            {items && items.length > 0 ? (
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
    </li>
  );
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
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
  ).isRequired,
  isOpenByDefault: PropTypes.bool,
  currentSlug: PropTypes.string.isRequired,
};

Item.defaultProps = {
  isOpenByDefault: false,
};

export default Item;
