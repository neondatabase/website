'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import ArrowBackIcon from 'icons/docs/sidebar/arrow-back.inline.svg';
import ChevronBackIcon from 'icons/docs/sidebar/chevron-back.inline.svg';

import Item from '../item';

const Menu = ({
  title,
  slug,
  Icon = null,
  parentMenu = null,
  basePath,
  items = null,
  isSubMenu = false,
  isOpen = false,
  onClose = null,
  closeMobileMenu = null,
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const LinkTag = parentMenu?.slug ? Link : 'button';

  const handleToggleSubmenu = () => {
    setIsSubmenuOpen((isSubmenuOpen) => !isSubmenuOpen);
  };

  const handleClose = () => {
    onClose();
    if (parentMenu?.slug && closeMobileMenu) closeMobileMenu();
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={clsx(
          'absolute left-0 top-0 w-full transition-opacity duration-300',
          isSubMenu && !isOpen && 'pointer-events-none',
          'lg:px-8 lg:pb-8 lg:pt-10 md:px-4'
        )}
        initial={false}
        animate={isSubmenuOpen ? 'openSubmenu' : isOpen ? 'open' : 'close'}
        transition={{ ease: 'easeIn' }}
        variants={{
          open: { opacity: 1, x: isSubMenu ? '100%' : 0 },
          close: { opacity: 0, x: isSubMenu ? '100%' : 0 },
          openSubmenu: { opacity: 1, x: isSubMenu ? 0 : '-100%' },
        }}
      >
        {isSubMenu && parentMenu && (
          <div className="mb-2.5 border-b border-gray-new-94 pb-4 dark:border-gray-new-10">
            <LinkTag
              className="flex items-center gap-2 text-sm font-medium leading-tight tracking-extra-tight text-secondary-8 dark:text-green-45"
              type={parentMenu.slug ? undefined : 'button'}
              to={parentMenu.slug ? `${basePath}${parentMenu.slug}` : undefined}
              onClick={handleClose}
            >
              <ChevronBackIcon className="size-4.5" />
              Back to {parentMenu.title}
            </LinkTag>
            <p className="mt-7 flex w-full items-start gap-2 text-left font-medium leading-tight tracking-extra-tight text-black-new dark:text-white">
              {Icon && <Icon className="size-5" />}
              {title}
            </p>
          </div>
        )}
        <ul className="w-full">
          {items.map((item, index) => (
            <Item
              {...item}
              key={index}
              basePath={basePath}
              parentMenu={{ title, slug }}
              closeMobileMenu={closeMobileMenu}
              onToggleSubmenu={handleToggleSubmenu}
            />
          ))}
        </ul>
        {!isSubMenu && (
          <div className="border-t border-gray-new-94 pt-4 dark:border-gray-new-10">
            <Link
              className={clsx(
                'flex w-full items-start gap-2 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
                'text-gray-new-60 hover:text-black-new dark:hover:text-white'
              )}
              to="/"
            >
              <ArrowBackIcon className="size-4.5" />
              Back to site
            </Link>
          </div>
        )}
      </m.div>
    </LazyMotion>
  );
};

Menu.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  Icon: PropTypes.any,
  parentMenu: PropTypes.exact({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
  }),
  basePath: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      tag: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.any),
      ariaLabel: PropTypes.string,
    })
  ),
  isOpen: PropTypes.bool,
  isSubMenu: PropTypes.bool,
  onClose: PropTypes.func,
  closeMobileMenu: PropTypes.func,
};

export default Menu;
