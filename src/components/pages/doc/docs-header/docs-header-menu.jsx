'use client';

import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useId, useRef, useState } from 'react';

import Link from 'components/shared/link';
import useClickOutside from 'hooks/use-click-outside';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import { cn } from 'utils/cn';
import getDocsNavHref from 'utils/get-docs-nav-href';

import NavLaneChevronIcon from './images/chevron-down.inline.svg';

const itemClassName = cn(
  'flex w-full items-center gap-x-2.5 rounded-sm px-2.5 py-2 text-left text-sm leading-tight',
  'text-gray-new-15 transition-colors duration-200 hover:bg-gray-new-98 dark:text-gray-new-90 dark:hover:bg-gray-new-10'
);

const MenuLink = ({ to, children }) => {
  const isExternal = to.startsWith('http');

  return (
    <Link
      className={itemClassName}
      to={to}
      tagName="Docs Header Menu"
      {...(isExternal && { target: '_blank', isExternal: true })}
    >
      {children}
    </Link>
  );
};

MenuLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Lanes with a dropdown (Products, Platform, ...) expand in place: their
// sections flatten to a quiet label followed by the section's links.
const LaneGroup = ({ nav, subnav, basePath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  return (
    <div>
      <button
        className={cn(itemClassName, 'justify-between')}
        type="button"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => setIsOpen(!isOpen)}
      >
        {nav}
        <ChevronIcon
          className={cn(
            'text-gray-new-50 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="grid gap-y-0.5 pb-1 pl-2.5" id={id}>
          {subnav.map((item, index) =>
            item.section ? (
              <div className="grid gap-y-0.5" key={index}>
                <span className="px-2.5 pt-2 pb-1 text-xs text-gray-new-45 uppercase dark:text-gray-new-50">
                  {item.title || item.section}
                </span>
                {item.items?.map((sectionItem) => (
                  <MenuLink key={sectionItem.slug} to={getDocsNavHref(sectionItem.slug, basePath)}>
                    {sectionItem.title}
                  </MenuLink>
                ))}
              </div>
            ) : (
              <MenuLink key={index} to={getDocsNavHref(item.slug, basePath)}>
                {item.title}
              </MenuLink>
            )
          )}
        </div>
      )}
    </div>
  );
};

LaneGroup.propTypes = {
  nav: PropTypes.string.isRequired,
  subnav: PropTypes.array.isRequired,
  basePath: PropTypes.string.isRequired,
};

const DocsHeaderMenu = ({ className = null, overflowLanes = [], basePath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const pathname = usePathname();
  const id = useId();

  useClickOutside([menuRef], () => setIsOpen(false));

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    // Escape closes the panel and hands focus back to the toggle, so keyboard
    // users don't lose their place when the focused item unmounts.
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={cn('relative flex shrink-0 items-stretch', className)} ref={menuRef}>
      {/* The overflow control is an inline nav lane ("More"), styled and spaced
          exactly like the dropdown lanes (Products, Reference) beside it, not a
          right-side hamburger icon. It only renders while a lane has overflowed. */}
      <button
        ref={toggleRef}
        className={cn(
          'relative flex h-full items-center gap-1 rounded-sm text-[15px] leading-snug tracking-extra-tight whitespace-nowrap transition-colors duration-200',
          'hover:text-black-new dark:hover:text-white',
          isOpen ? 'text-black-new dark:text-white' : 'text-gray-new-30 dark:text-gray-new-70'
        )}
        type="button"
        aria-label={isOpen ? 'Close menu' : 'More'}
        aria-expanded={isOpen}
        aria-controls={id}
        data-test="docs-header-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        More
        <NavLaneChevronIcon
          className={cn(
            'text-gray-new-50 transition-transform duration-200 dark:text-gray-new-70',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          className={cn(
            'absolute top-[calc(100%+18px)] left-0 z-10 grid max-h-[calc(100vh-120px)] w-56 gap-y-0.5 overflow-y-auto rounded-md border p-2',
            'border-gray-new-85 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
            'dark:border-gray-new-20 dark:bg-black-new dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
          )}
          id={id}
        >
          {/* "More" holds only the overflowed nav lanes. Dropdown lanes expand in
              place as an accordion; plain lanes are a single link. The external
              links and theme switch live in the mobile drawer and page footer,
              not here. */}
          {overflowLanes.map(({ nav, slug, subnav }) =>
            subnav ? (
              <LaneGroup key={nav} nav={nav} subnav={subnav} basePath={basePath} />
            ) : (
              <MenuLink key={nav} to={getDocsNavHref(slug, basePath)}>
                {nav}
              </MenuLink>
            )
          )}
        </div>
      )}
    </div>
  );
};

DocsHeaderMenu.propTypes = {
  className: PropTypes.string,
  overflowLanes: PropTypes.array,
  basePath: PropTypes.string.isRequired,
};

export default DocsHeaderMenu;
