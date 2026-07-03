'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Link from 'components/shared/link';
import Chevron from 'icons/chevron-right-lg.inline.svg';
import { cn } from 'utils/cn';

import Tag from '../../tag';

const containsActiveSlug = (item, currentSlug) =>
  item.slug === currentSlug ||
  item.items?.some((childItem) => containsActiveSlug(childItem, currentSlug));

const Item = ({
  basePath,
  title = null,
  section = null,
  slug = null,
  tag = null,
  ariaLabel = null,
  items = null,
  isSubmenu = false,
  isHidden = false,
  closeMobileMenu = null,
}) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  const isActive = slug === currentSlug;
  const isActiveMenu = isActive || items?.some((item) => containsActiveSlug(item, currentSlug));
  const [isCollapsed, setIsCollapsed] = useState(!isActiveMenu);

  useEffect(() => {
    if (isActiveMenu) {
      setIsCollapsed(false);
    }
  }, [isActiveMenu]);

  // Nested `section:` entries render as non-collapsible group labels with
  // their children inline — the same construct Menu supports at the top
  // level (the CLI commands list uses this for its editorial groups).
  if (section) {
    return (
      <li className="mt-3 flex flex-col first:mt-0">
        <span className="py-1.5 text-[11px] leading-tight font-semibold tracking-wider text-gray-new-50 uppercase dark:text-gray-new-60">
          {section}
        </span>
        <ul className="flex flex-col">
          {items?.map((item, index) => (
            <Item
              {...item}
              key={index}
              basePath={basePath}
              closeMobileMenu={closeMobileMenu}
              isHidden={isHidden}
              isSubmenu={isSubmenu}
            />
          ))}
        </ul>
      </li>
    );
  }

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
        className={cn(
          'group relative flex w-full gap-2 rounded-sm py-2 pr-1 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
          isActive && !items?.length
            ? 'font-medium text-green-44 dark:text-green-52'
            : 'font-normal text-gray-new-40 hover:text-black-pure dark:text-gray-new-70 dark:hover:text-white',
          isSubmenu &&
            'before:absolute before:inset-y-0 before:-left-[13px] before:w-px before:bg-green-44 before:opacity-0 before:transition-opacity before:duration-200 dark:before:bg-green-52',
          isActive && isSubmenu && !items?.length && 'before:opacity-100'
        )}
        type={slug ? undefined : 'button'}
        to={slug ? externalSlug || websiteSlug || docSlug : undefined}
        target={externalSlug ? '_blank' : '_self'}
        icon={externalSlug && 'external'}
        tabIndex={isHidden ? -1 : undefined}
        aria-expanded={items?.length ? !isCollapsed : undefined}
        onClick={handleClick}
      >
        {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
        <span className="text-balance" aria-hidden={!!ariaLabel}>
          {title}&nbsp;
          {tag && (
            <Tag
              className="inline-flex py-0.75 text-[0.6875rem] font-normal -tracking-tight tabular-nums"
              label={tag}
              size="sm"
            />
          )}
        </span>
        {items?.length && <Chevron className={cn('ml-auto w-1.5', !isCollapsed && 'rotate-90')} />}
      </LinkTag>
      {items?.length && (
        <LazyMotion features={domAnimation}>
          <m.div
            className="-m-1 overflow-hidden p-1"
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
                  isHidden={isCollapsed}
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
  title: PropTypes.string,
  section: PropTypes.string,
  slug: PropTypes.string,
  tag: PropTypes.string,
  ariaLabel: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string,
      section: PropTypes.string,
      slug: PropTypes.string,
      tag: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.any),
      ariaLabel: PropTypes.string,
      collapsible: PropTypes.bool,
    })
  ),
  isSubmenu: PropTypes.bool,
  isHidden: PropTypes.bool,
  closeMobileMenu: PropTypes.func,
};

export default Item;
