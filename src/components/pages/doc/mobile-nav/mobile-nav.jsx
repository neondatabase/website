'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ChevronIcon from 'icons/chevron-down.inline.svg';
import CornerIcon from 'icons/corner-left.inline.svg';

import Icon from '../menu/icon';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from './drawer';

const isExternalSlug = (slug) => typeof slug === 'string' && /^https?:\/\//.test(slug);
const isWebsiteSlug = (slug) => typeof slug === 'string' && slug.startsWith('/');

const resolveHref = (slug, basePath) => {
  if (!slug) return null;

  if (isExternalSlug(slug)) return slug;

  if (isWebsiteSlug(slug)) return slug;

  return `${basePath}${slug}`;
};

function transformNavigationNode(raw, basePath, depth = 0) {
  const { nav, icon, section } = raw;
  const title = raw.title || raw.nav;
  const slug = resolveHref(raw.slug, basePath);

  let children = [];

  if (Array.isArray(raw.subnav) && raw.subnav.length) {
    children = raw.subnav.map((sn) => transformNavigationNode(sn, basePath, depth + 1));
  } else if (Array.isArray(raw.items) && raw.items.length) {
    children = raw.items.map((it) => transformNavigationNode(it, basePath, depth + 1));
  }

  return { nav, title, section, slug, icon, items: children, depth };
}

function transformNavigation(navigation, basePath) {
  return navigation.map((item) => transformNavigationNode(item, basePath, 0));
}

function hasActiveDescendant(node, currentPath) {
  const selfActive =
    typeof node.slug === 'string' && !isExternalSlug(node.slug) && node.slug === currentPath;

  if (selfActive) return true;

  if (Array.isArray(node.items)) {
    return node.items.some((child) => hasActiveDescendant(child, currentPath));
  }

  return false;
}

const NodeLink = ({ className, node }) => {
  const href = node.slug || '#';
  const external = isExternalSlug(href);
  const Comp = external ? 'a' : Link;
  const extraProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Comp
      className={clsx(
        'flex h-10 w-full flex-1 items-center gap-x-2 pr-7 text-sm leading-snug tracking-tight hover:text-black-new dark:hover:text-white',
        node.section
          ? 'font-medium text-black-new dark:text-white'
          : 'text-gray-new-20 dark:text-gray-new-80',
        className
      )}
      href={href}
      {...extraProps}
    >
      {node.icon && <Icon title={node.icon} className="size-4.5 shrink-0" />}
      <span>{node.title || node.section}</span>
    </Comp>
  );
};

NodeLink.propTypes = {
  node: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
    icon: PropTypes.string,
    section: PropTypes.string,
    depth: PropTypes.number,
  }).isRequired,
  className: PropTypes.string,
};

const RecursiveItem = ({ node, currentPath }) => {
  const isActive = hasActiveDescendant(node, currentPath);
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  const hasChildren = Array.isArray(node.items) && node.items.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <NodeLink
          className={clsx(isActive && 'font-medium text-secondary-8 dark:text-primary-1')}
          node={node}
        />
      </li>
    );
  }

  if (node.section) {
    return (
      <li>
        <NodeLink
          className={clsx(isActive && 'font-medium text-secondary-8 dark:text-primary-1')}
          node={node}
        />
        <ul
          className={clsx(
            'flex flex-col',
            node.nav && 'mt-[5px]',
            node.depth > 1 && 'border-l border-gray-new-80 pl-3 dark:border-gray-new-20'
          )}
        >
          {node.items.map((child, idx) => (
            <RecursiveItem key={idx} node={child} depth={node.depth} currentPath={currentPath} />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className={clsx(
            'group flex h-10 w-full items-center justify-between px-0 text-left',
            'leading-snug tracking-tight transition-colors duration-200',
            'text-gray-new-30 hover:text-black-new dark:text-gray-new-70 dark:hover:text-white',
            node.nav ? 'text-base font-medium' : 'text-sm'
          )}
        >
          <span>{node.nav || node.title}</span>
          <ChevronIcon
            className="shrink-0 -rotate-90 text-gray-new-50 transition-all duration-200 group-hover:text-black-new group-data-[state=open]:rotate-0 dark:group-hover:text-white"
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {node.nav && (
            <div className="mt-[5px]">
              <NodeLink
                className={clsx(
                  '!text-[15px] font-medium',
                  isActive
                    ? '!text-secondary-8 dark:!text-primary-1'
                    : '!text-black-new dark:!text-white'
                )}
                node={node}
              />
            </div>
          )}
          <ul
            className={clsx(
              'flex flex-col',
              node.nav && 'mt-[5px]',
              node.depth > 0 && 'border-l border-gray-new-80 pl-3 dark:border-gray-new-20'
            )}
          >
            {node.items.map((child, idx) => (
              <RecursiveItem key={idx} node={child} depth={node.depth} currentPath={currentPath} />
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
};

RecursiveItem.propTypes = {
  node: PropTypes.shape({
    title: PropTypes.string.isRequired,
    section: PropTypes.string,
    nav: PropTypes.string,
    slug: PropTypes.string,
    icon: PropTypes.string,
    items: PropTypes.array,
    depth: PropTypes.number,
  }).isRequired,
  currentPath: PropTypes.string.isRequired,
};

const RecursiveList = ({ nodes, currentPath }) => (
  <ul className="flex flex-col gap-y-2.5">
    {nodes.map((node, idx) => (
      <RecursiveItem key={idx} node={node} currentPath={currentPath} />
    ))}
  </ul>
);

RecursiveList.propTypes = {
  nodes: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
};

const MobileMenu = ({ navigation, basePath, title = 'Neon Docs' }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onOpenChange = useCallback((next) => setOpen(next), []);

  const menu = useMemo(
    () => transformNavigation(navigation || [], basePath),
    [navigation, basePath]
  );

  if (!menu.length) return null;

  return (
    <Drawer open={open} shouldScaleBackground={false} onOpenChange={onOpenChange}>
      <DrawerTrigger className="group fixed bottom-0 left-0 right-0 z-[55] hidden h-12 w-full items-center gap-x-2 border-t border-gray-new-80 bg-white px-8 dark:border-gray-new-15 dark:bg-black-pure dark:text-white lg:flex">
        <CornerIcon
          className="shrink-0 text-gray-new-60 transition-all duration-200 group-hover:text-black-new dark:group-hover:text-white"
          aria-hidden
        />
        <span className="text-[15px]">{title}</span>
        <ChevronIcon
          className="ml-auto shrink-0 text-gray-new-60 transition-all duration-200 group-hover:text-black-new dark:group-hover:text-white"
          aria-hidden
        />
      </DrawerTrigger>

      <DrawerContent className="hidden !h-[70dvh] flex-col rounded-t-2xl border-gray-new-80 bg-white p-0 text-black-new dark:border-[#27272A] dark:bg-black-pure dark:text-white lg:flex">
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <div className="flex flex-1 flex-col overflow-y-auto p-6 pb-20 pt-[15px]">
          <RecursiveList nodes={menu} currentPath={pathname} />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.00)_0%,#FFF_73.36%)] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.00)_0%,#09090B_73.36%)]"
          aria-hidden
        />
      </DrawerContent>
    </Drawer>
  );
};

MobileMenu.propTypes = {
  navigation: PropTypes.array.isRequired,
  basePath: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default MobileMenu;
