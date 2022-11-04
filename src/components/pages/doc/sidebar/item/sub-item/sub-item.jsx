import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ChevronRight from 'icons/chevron-right-sm.inline.svg';

const SubItem = ({ title, slug, items, isParentOpen, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(
    !!items?.find(
      ({ slug, items }) => slug === currentSlug || items?.find(({ slug }) => slug === currentSlug)
    ) || slug === currentSlug
  );

  const handleClick = () => setIsOpen((isOpen) => !isOpen);
  const Tag = slug ? Link : 'button';
  return (
    <>
      <Tag
        className="group flex w-full justify-between pt-2.5 pb-2 text-left text-gray-3 transition-colors duration-200 hover:text-black"
        type="button"
        to={slug ? `${DOCS_BASE_PATH}${slug}` : undefined}
        tabIndex={!isParentOpen ? '-1' : undefined}
        onClick={handleClick}
      >
        <span className={clsx('text-sm leading-tight')}>{title}</span>
        <ChevronRight
          className={clsx(
            'mr-2 mt-1 shrink-0 text-gray-5 transition-[transform,color] duration-200 group-hover:text-black',
            isOpen ? 'rotate-90' : 'rotate-0'
          )}
        />
      </Tag>
      {isOpen && (
        <ul className="relative pl-3 before:absolute before:left-0 before:h-full before:w-px before:bg-gray-6">
          <li>
            {items.map(({ title, slug }, index) => (
              <Link
                className={clsx(
                  '!block py-2 leading-tight text-gray-3 transition-colors duration-200 hover:text-black',
                  {
                    'font-semibold !text-black': currentSlug === slug,
                  }
                )}
                size="2xs"
                to={`${DOCS_BASE_PATH}${slug}/`}
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
  slug: PropTypes.string,
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
  slug: undefined,
};

export default SubItem;
