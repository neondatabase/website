'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';

const isActiveItem = (slug, items, currentSlug) => {
  if (slug === currentSlug) return true;

  const findActiveItem = (itemsList) =>
    itemsList?.reduce((found, item) => {
      if (found) return true;
      if (item.slug === currentSlug) return true;
      if (item.items) return findActiveItem(item.items);
      return false;
    }, false) || false;

  return findActiveItem(items);
};

const Item = ({ nav, slug, items, basePath }) => {
  const LinkTag = slug ? Link : 'button';
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  const isActive = isActiveItem(slug, items, currentSlug);
  const href = `${basePath}${slug}`;

  return (
    <LinkTag
      className={clsx(
        'relative flex h-full items-center',
        'whitespace-nowrap text-sm font-medium tracking-tight',
        'transition-colors duration-200',
        'text-gray-new-30 hover:text-black-new',
        'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gray-new-40 after:opacity-0 after:transition-opacity after:duration-300',
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
  basePath: PropTypes.string.isRequired,
};

export default Item;
