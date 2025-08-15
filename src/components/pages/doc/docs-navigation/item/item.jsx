'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';

const Item = ({ nav, slug, items }) => {
  const LinkTag = slug ? Link : 'button';
  const pathname = usePathname();
  const currentSlug = pathname.replace(DOCS_BASE_PATH, '');

  const isActive = slug === currentSlug || items?.some((item) => item.slug === currentSlug);
  const href = `${DOCS_BASE_PATH}${slug}`;

  return (
    <LinkTag
      className={clsx(
        'relative flex h-full items-center',
        'whitespace-nowrap text-sm font-medium tracking-tight',
        'transition-colors duration-200',
        'text-gray-new-30 hover:text-black-new',
        'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:w-full after:bg-black-new after:opacity-0 after:transition-opacity after:duration-300',
        'dark:text-gray-new-70 dark:after:bg-white dark:hover:text-white',
        isActive && 'text-black-new after:opacity-100 dark:text-white'
      )}
      to={href || undefined}
    >
      {nav}
    </LinkTag>
  );
};

Item.propTypes = {
  nav: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
};

export default Item;
