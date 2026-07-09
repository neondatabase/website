'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

import Link from 'components/shared/link';
import Chevron from 'icons/chevron-right-lg.inline.svg';
import { cn } from 'utils/cn';

import Tag from '../../tag';

const METHOD_DOT_COLOR = {
  GET: 'bg-[#00B87B] dark:bg-green-45',
  POST: 'bg-[#426CE0] dark:bg-blue-70',
  PUT: 'bg-[#BE8A3C] dark:bg-brown-70',
  PATCH: 'bg-[#E9943E] dark:bg-yellow-70',
  DELETE: 'bg-[#E2301D] dark:bg-[#FF5645]',
};

function hasActiveDescendant(items, slug) {
  return (
    items?.some((item) => item.slug === slug || hasActiveDescendant(item.items, slug)) ?? false
  );
}

const MethodDot = ({ method }) => (
  <span
    className={cn(
      'mt-[5px] inline-block size-[5px] shrink-0 rounded-full opacity-70',
      METHOD_DOT_COLOR[method?.toUpperCase()] ?? 'bg-gray-new-50'
    )}
  />
);

const Item = ({
  basePath,
  title = null,
  section = null,
  slug = null,
  tag = null,
  method = null,
  ariaLabel = null,
  items = null,
  isSubmenu = false,
  isHidden = false,
  closeMobileMenu = null,
}) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  const isActive = slug === currentSlug;
  const isActiveMenu = isActive || hasActiveDescendant(items, currentSlug);
  const [isCollapsed, setIsCollapsed] = useState(!isActiveMenu);

  const prevActiveRef = useRef(isActiveMenu);
  useEffect(() => {
    if (isActiveMenu && !prevActiveRef.current) {
      setIsCollapsed(false);
    }
    prevActiveRef.current = isActiveMenu;
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
    if (items?.length && !slug) {
      handleToggle();
      return;
    }

    if (slug && closeMobileMenu) closeMobileMenu();
  };

  // When a node has both a slug and children, split into a link + a separate chevron button
  const hasSplitHeader = slug && items?.length;

  return (
    <li className="group/item flex flex-col">
      {hasSplitHeader ? (
        <div
          className={cn(
            'group relative flex w-full items-center gap-2 rounded-sm text-sm leading-tight tracking-extra-tight transition-colors duration-200',
            isActive
              ? 'font-medium text-green-44 dark:text-green-52'
              : 'font-normal text-gray-new-40 hover:text-black-pure dark:text-gray-new-70 dark:hover:text-white',
            isSubmenu &&
              'before:absolute before:inset-y-0 before:-left-[13px] before:w-px before:bg-green-44 before:opacity-0 before:transition-opacity before:duration-200 dark:before:bg-green-52',
            isActive && isSubmenu && 'before:opacity-100'
          )}
        >
          <Link
            className="flex-1 py-2 text-left"
            to={externalSlug || websiteSlug || docSlug}
            target={externalSlug ? '_blank' : '_self'}
            tabIndex={isHidden ? -1 : undefined}
            onClick={() => {
              if (isActive) handleToggle();
              closeMobileMenu?.();
            }}
          >
            {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
            <span className="text-pretty" aria-hidden={!!ariaLabel}>
              {title}
              {tag && (
                <Tag
                  className="ml-2 inline-flex text-[0.6875rem] font-normal -tracking-tight tabular-nums"
                  label={tag}
                  size="sm"
                />
              )}
            </span>
          </Link>
          <button
            type="button"
            className="px-1 py-2"
            tabIndex={isHidden ? -1 : undefined}
            onClick={handleToggle}
            aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
          >
            <Chevron className={cn('w-1.5', !isCollapsed && 'rotate-90')} />
          </button>
        </div>
      ) : (
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
          {method && <MethodDot method={method} />}
          <span className="text-balance" aria-hidden={!!ariaLabel}>
            {title}
            {tag && (
              <Tag
                className="ml-2 inline-flex text-[0.6875rem] font-normal -tracking-tight tabular-nums"
                label={tag}
                size="sm"
              />
            )}
          </span>
          {items?.length && (
            <Chevron className={cn('ml-auto w-1.5', !isCollapsed && 'rotate-90')} />
          )}
        </LinkTag>
      )}
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
              {items.map((item) => (
                <Item
                  {...item}
                  key={item.slug ?? item.title}
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

MethodDot.propTypes = { method: PropTypes.string };

Item.propTypes = {
  basePath: PropTypes.string.isRequired,
  title: PropTypes.string,
  section: PropTypes.string,
  slug: PropTypes.string,
  tag: PropTypes.string,
  method: PropTypes.string,
  ariaLabel: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string,
      section: PropTypes.string,
      slug: PropTypes.string,
      tag: PropTypes.string,
      method: PropTypes.string,
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
