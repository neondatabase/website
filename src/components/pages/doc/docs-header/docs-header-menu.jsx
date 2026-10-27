'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useEffect, useId, useRef, useState } from 'react';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import useClickOutside from 'hooks/use-click-outside';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import DiscordIcon from 'icons/discord.inline.svg';
import { cn } from 'utils/cn';
import getDocsNavHref from 'utils/get-docs-nav-href';

import Icon from '../menu/icon';

import MenuIcon from './images/menu.inline.svg';

const THEMES = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const itemClassName = cn(
  'flex w-full items-center gap-x-2.5 rounded-sm px-2.5 py-2 text-left text-sm leading-tight',
  'text-gray-new-15 transition-colors duration-200 hover:bg-gray-new-98 dark:text-gray-new-90 dark:hover:bg-gray-new-10'
);

const Divider = () => <span className="mx-0.5 my-1.5 h-px bg-gray-new-90 dark:bg-gray-new-20" />;

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
                <span className="px-2.5 pt-2 pb-1 text-xs text-gray-new-50 uppercase">
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

const ThemeOptions = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div className="grid" role="radiogroup" aria-label="Theme">
      <span className="px-2.5 pt-1.5 pb-0.5 text-xs text-[#6B6F77] dark:text-gray-new-60">
        Theme
      </span>
      {THEMES.map(({ value, label }) => {
        const isSelected = mounted && theme === value;

        return (
          <button
            className={cn(
              'flex items-center gap-x-2.5 rounded-sm px-2.5 py-1.5 text-left text-sm leading-tight transition-colors duration-200 hover:bg-gray-new-98 dark:hover:bg-gray-new-10',
              isSelected
                ? 'text-gray-new-15 dark:text-gray-new-90'
                : 'text-gray-new-40 dark:text-gray-new-60'
            )}
            key={value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTheme(value)}
          >
            <span
              className={cn(
                'size-1.5 shrink-0 rounded-full',
                isSelected && 'bg-black-new dark:bg-white'
              )}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
};

const DocsHeaderMenu = ({ className = null, lanes = [], basePath, isNavCollapsed = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();
  const id = useId();

  useClickOutside([menuRef], () => setIsOpen(false));

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        className={cn(
          'flex size-9 items-center justify-center rounded-none text-gray-new-20 transition-colors duration-200 hover:bg-gray-new-98',
          'dark:text-gray-new-80 dark:hover:bg-gray-new-10'
        )}
        type="button"
        aria-label={isOpen ? 'Close menu' : 'More'}
        aria-expanded={isOpen}
        aria-controls={id}
        data-test="docs-header-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon className="dark:invert" aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          className={cn(
            'absolute top-[calc(100%+18px)] right-0 z-10 grid max-h-[calc(100vh-120px)] w-56 gap-y-0.5 overflow-y-auto rounded-md border p-2',
            'border-gray-new-85 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
            'dark:border-gray-new-20 dark:bg-black-new dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
          )}
          id={id}
        >
          {isNavCollapsed && lanes.length > 0 && (
            <>
              {lanes.map(({ nav, slug, subnav }) =>
                subnav ? (
                  <LaneGroup key={nav} nav={nav} subnav={subnav} basePath={basePath} />
                ) : (
                  <MenuLink key={nav} to={getDocsNavHref(slug, basePath)}>
                    {nav}
                  </MenuLink>
                )
              )}
              <Divider />
            </>
          )}
          <MenuLink to="/">
            <Icon title="home" className="size-4 shrink-0" />
            neon.com
          </MenuLink>
          <MenuLink to={LINKS.github}>
            <Icon title="github" className="size-4 shrink-0" />
            GitHub
          </MenuLink>
          <MenuLink to={LINKS.discord}>
            <DiscordIcon className="size-4 shrink-0" width={16} height={16} />
            Discord
          </MenuLink>
          <MenuLink to={LINKS.postgresqltutorial}>
            <Icon title="tutorial" className="size-4 shrink-0 text-primary-2" />
            Learn PostgreSQL
          </MenuLink>
          <Divider />
          <ThemeOptions />
        </div>
      )}
    </div>
  );
};

DocsHeaderMenu.propTypes = {
  className: PropTypes.string,
  lanes: PropTypes.array,
  basePath: PropTypes.string.isRequired,
  isNavCollapsed: PropTypes.bool,
};

export default DocsHeaderMenu;
