'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import Chevron from 'icons/chevron-right-lg.inline.svg';

import Tag from '../../tag';

const Item = ({
  basePath,
  title,
  slug = null,
  tag = null,
  ariaLabel = null,
  items = null,
  isSubmenu = false,
  closeMobileMenu = null,
}) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  const isActive = slug === currentSlug;
  const isActiveMenu = isActive || items?.some((item) => item.slug === currentSlug);
  const [isCollapsed, setIsCollapsed] = useState(!isActiveMenu);

  const externalSlug = slug?.startsWith('http') ? slug : null;
  const websiteSlug = slug?.startsWith('/') ? slug : null;
  const docSlug = `${basePath}${slug}`;

  const LinkTag = slug ? Link : 'button';

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleClick = () => {
    if (items?.length) {
      handleToggle();
      return;
    }

    if (slug && closeMobileMenu) closeMobileMenu();
  };

  return (
    <li className="group/item flex flex-col">
      <LinkTag
        className={clsx(
          'group relative flex w-full gap-2 py-2 pr-1 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
          isActive && !items?.length
            ? 'font-medium text-secondary-8 dark:text-primary-1'
            : 'font-normal text-gray-new-40 hover:text-black-new dark:text-gray-new-80 dark:hover:text-white',
          isSubmenu &&
            'before:absolute before:inset-y-0 before:-left-[13px] before:w-px before:bg-secondary-8 before:opacity-0 before:transition-opacity before:duration-200 dark:before:bg-primary-1',
          isActive && isSubmenu && !items?.length && 'before:opacity-100'
        )}
        type={slug ? undefined : 'button'}
        to={slug ? externalSlug || websiteSlug || docSlug : undefined}
        target={externalSlug || websiteSlug ? '_blank' : '_self'}
        icon={externalSlug && 'external'}
        onClick={handleClick}
      >
        {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
        <span className="text-pretty" aria-hidden={!!ariaLabel}>
          {title}&nbsp;
          {tag && <Tag className="relative -top-px ml-1 inline-block" label={tag} size="sm" />}
        </span>
        {items?.length && (
          <Chevron className={clsx('ml-auto w-1.5', !isCollapsed && 'rotate-90')} />
        )}
      </LinkTag>
      {items?.length && (
        <LazyMotion features={domAnimation}>
          <m.div
            className="overflow-hidden"
            initial={isActiveMenu ? 'expanded' : 'collapsed'}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={{
              collapsed: { opacity: 0, height: 0, translateY: 10 },
              expanded: { opacity: 1, height: 'auto', translateY: 0 },
            }}
            transition={{ duration: 0.2 }}
          >
            <ul className="border-l border-gray-new-80 pl-3 dark:border-gray-new-20">
              {items.map((item, index) => (
                <Item
                  {...item}
                  key={index}
                  basePath={basePath}
                  closeMobileMenu={closeMobileMenu}
                  isSubmenu
                />
              ))}
            </ul>
          </m.div>
        </LazyMotion>
      )}
    </li>
  );
};

Item.propTypes = {
  basePath: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string,
  tag: PropTypes.string,
  ariaLabel: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      tag: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.any),
      ariaLabel: PropTypes.string,
      collapsible: PropTypes.bool,
    })
  ),
  isSubmenu: PropTypes.bool,
  closeMobileMenu: PropTypes.func,
};

export default Item;
