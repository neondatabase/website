import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRightSm from 'icons/chevron-right-sm.inline.svg';
import ChevronRight from 'icons/chevron-right.inline.svg';

const SubItem = ({ title, items, isParentOpen, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(
    !!items?.find(
      ({ slug, items }) => slug === currentSlug || items?.find(({ slug }) => slug === currentSlug)
    )
  );

  const handleClick = () => setIsOpen((isOpen) => !isOpen);

  return (
    <>
      <button
        className="-ml-4 flex w-full items-center pt-2.5 pb-2 text-left transition-colors duration-200 hover:text-primary-2"
        type="button"
        tabIndex={!isParentOpen ? '-1' : undefined}
        onClick={handleClick}
      >
        <ChevronRight className={clsx('mr-2 hidden shrink-0 rotate-90', { '!block': isOpen })} />
        <ChevronRightSm className={clsx('mr-2.5 shrink-0', { '!hidden': isOpen })} />
        <span className={clsx('text-base leading-snug', isOpen && 'font-semibold')}>{title}</span>
      </button>
      {isOpen && (
        <ul className="pl-3">
          <li>
            {items.map(({ title, slug }, index) => (
              <Link
                className={clsx('!block py-2 text-base !leading-snug', {
                  'font-semibold text-primary-2': currentSlug === slug,
                })}
                to={`${DOCS_BASE_PATH}${slug}/`}
                theme="black"
                tabIndex={!isOpen ? '-1' : undefined}
                key={index}
              >
                {title}
              </Link>
            ))}
          </li>
        </ul>
      )}
    </>
  );
};

SubItem.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  isParentOpen: PropTypes.bool,
  currentSlug: PropTypes.string.isRequired,
};

SubItem.defaultProps = {
  isParentOpen: false,
};

export default SubItem;
