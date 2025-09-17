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

const SubItem = ({ icon, title, slug, basePath }) => {
  const docSlug = `${basePath}${slug}`;
  const websiteSlug = slug?.startsWith('/') ? slug : null;
  const externalSlug = slug?.startsWith('http') ? slug : null;

  return (
    <Link
      className={clsx(
        'flex items-center gap-2 leading-none tracking-tight transition-colors duration-200',
        'text-gray-new-30 hover:text-black-new dark:text-gray-new-70 dark:hover:text-white'
      )}
      to={externalSlug || websiteSlug || docSlug}
      size="2xs"
      isExternal={externalSlug}
      icon={externalSlug && 'external'}
    >
      {icon && <Icon title={icon} className="size-4.5 shrink-0" />}
      {title}
    </Link>
  );
};

SubItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
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

  const href = slug?.startsWith('/') ? slug : `${basePath}${slug}`;

  // Highlight only the last found active item
  const isLastActive = isActive && activeItems.at(-1) === slug;

  return (
    <li className={clsx('relative hover:z-10', subnav && 'group')}>
      <LinkTag
        className={clsx(
          'relative flex h-full items-center gap-1',
          'whitespace-nowrap text-sm font-medium tracking-tight',
          'transition-colors duration-200',
          'hover:text-black-new group-hover:text-black-new',
          'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:w-full after:bg-gray-new-40 after:opacity-0 after:transition-opacity after:duration-300',
          'dark:after:bg-white dark:hover:text-white dark:group-hover:text-white',
          isLastActive
            ? 'text-black-new after:opacity-100 dark:text-white'
            : 'text-gray-new-30 dark:text-gray-new-70'
        )}
        to={href || undefined}
      >
        {title}
        {subnav && (
          <ChevronIcon
            className={clsx(
              'transition-transform duration-200 group-hover:-rotate-180 group-hover:text-black-new dark:group-hover:text-white',
              isLastActive ? 'text-black-new dark:text-white' : 'text-gray-new-50'
            )}
          />
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
              'border-gray-new-94 bg-white shadow-[0px_14px_20px_0px_rgba(0,0,0,.1)]',
              'dark:border-gray-new-15 dark:bg-black-new dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
            )}
          >
            {subnav.map((item, index) => (
              <li className={item.section && 'mt-2 first:mt-0'} key={index}>
                {item.section ? (
                  <>
                    <span className="mb-3.5 block text-xs uppercase leading-none tracking-tight text-gray-new-50">
                      {item.section}
                    </span>
                    <ul className="flex flex-col gap-4">
                      {item.items.map((item, index) => (
                        <li key={index}>
                          <SubItem {...item} basePath={basePath} />
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <SubItem {...item} basePath={basePath} />
                )}
              </li>
            ))}
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
