import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import Icon from '../../menu/icon';

const isActiveItem = (slug, items, subnav, currentSlug) => {
  if (slug === currentSlug) return true;

  const findActiveInItems = (items) =>
    items?.reduce((found, item) => {
      if (found) return true;
      if (item.slug === currentSlug) return true;
      if (item.items) return findActiveInItems(item.items);
      return false;
    }, false) || false;

  if ((items && findActiveInItems(items)) || (subnav && findActiveInItems(subnav))) {
    return true;
  }

  return false;
};

const Item = ({ nav: title, slug, subnav, items, basePath, activeItems, setActiveItems }) => {
  const LinkTag = slug ? Link : 'button';
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const isActiveState = isActiveItem(slug, items, subnav, currentSlug);
    setIsActive(isActiveState);

    if (isActiveState) {
      setActiveItems((prev) => [...prev, slug]);
    }
  }, [slug, items, currentSlug, subnav, setActiveItems]);

  const href = `${basePath}${slug}`;

  // Highlight only the last found active item
  const isLastActive = isActive && activeItems.at(-1) === slug;

  return (
    <li className={clsx('relative hover:z-10', subnav && 'group')}>
      <LinkTag
        className={clsx(
          'relative flex h-full items-center gap-1',
          'whitespace-nowrap text-sm font-medium tracking-tight',
          'transition-colors duration-200',
          'text-gray-new-30 hover:text-black-new group-hover:text-black-new',
          'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:w-full after:bg-gray-new-40 after:opacity-0 after:transition-opacity after:duration-300',
          'dark:text-gray-new-70 dark:after:bg-white dark:hover:text-white dark:group-hover:text-white',
          isLastActive && 'text-black-new after:opacity-100 dark:text-white'
        )}
        to={href || undefined}
      >
        {title}
        {subnav && (
          <ChevronIcon className="text-gray-new-50 transition-transform duration-200 group-hover:-rotate-180 group-hover:text-black-new dark:group-hover:text-white" />
        )}
      </LinkTag>
      {subnav && (
        <div
          className={clsx(
            'absolute -left-5 top-[90%] z-10',
            'pointer-events-none opacity-0',
            'origin-top-left transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)]',
            'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]'
          )}
        >
          <ul
            className={clsx(
              'relative flex w-max min-w-40 flex-col gap-4 rounded-lg border p-4',
              'shadow-[0px_14px_20px_0px_rgba(0,0,0,.1) border-gray-new-94 bg-white',
              'dark:border-gray-new-15 dark:bg-gray-new-8 dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
            )}
          >
            {subnav.map(({ slug: subSlug, icon, title: subTitle }, index) => {
              const externalSlug = subSlug?.startsWith('http') ? subSlug : null;
              const websiteSlug =
                subSlug?.startsWith('/') && `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${subSlug}`;
              const docSlug = `${basePath}${subSlug}`;

              return (
                <li key={index}>
                  <Link
                    className={clsx(
                      'flex items-center gap-2 leading-none transition-colors duration-200',
                      'text-gray-new-30 hover:text-black-new dark:text-gray-new-70 dark:hover:text-white'
                    )}
                    to={externalSlug || websiteSlug || docSlug}
                    size="2xs"
                    isExternal={externalSlug}
                  >
                    {icon && <Icon title={icon} className="size-4.5 shrink-0" />}
                    {subTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
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
  subnav: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ),
  basePath: PropTypes.string.isRequired,
  activeItems: PropTypes.arrayOf(PropTypes.string),
  setActiveItems: PropTypes.func.isRequired,
};

export default Item;
