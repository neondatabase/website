import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';

import Link from 'components/shared/link';
import ArrowBackIcon from 'icons/docs/sidebar/arrow-back.inline.svg';
import ChevronBackIcon from 'icons/docs/sidebar/chevron-back.inline.svg';

import Item from '../item';
import icons from '../item/item';

const Menu = ({
  depth,
  title,
  slug,
  Icon = null,
  parentMenu = null,
  basePath,
  items = null,
  closeMobileMenu = null,
  setMenuTitle = null,
  setMenuHeight,
  menuWrapperRef,
  activeMenuList,
  setActiveMenuList,
}) => {
  const isRootMenu = depth === 0;
  const LinkTag = parentMenu?.slug ? Link : 'button';
  const menuRef = useRef(null);
  const currentDepth = activeMenuList.length - 1;

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (activeMenuList.includes(title)) setIsActive(true);
  }, [title, activeMenuList]);

  useEffect(() => {
    console.log(title, isActive);
  }, [title, isActive]);

  // update title for toggler button
  useEffect(() => {
    if (isActive && title && setMenuTitle) {
      setMenuTitle(title);
    }
  }, [isActive, setMenuTitle, title]);

  // update menu height and scroll menu to top
  useEffect(() => {
    let timeout;

    if (isActive && menuRef.current && setMenuHeight) {
      timeout = setTimeout(() => {
        setMenuHeight(menuRef.current.scrollHeight);
        menuWrapperRef.current?.scrollTo(0, 0);
      }, 200);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isActive, setMenuHeight, menuWrapperRef]);

  const handleClose = () => {
    setActiveMenuList((prevList) => prevList.slice(0, -1));
    if (parentMenu?.slug && closeMobileMenu) closeMobileMenu();
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={clsx(
          'absolute left-0 top-0 w-full pb-16',
          !isActive && 'pointer-events-none',
          !isRootMenu && 'translate-x-full',
          'lg:px-8 lg:pb-8 lg:pt-4 md:px-5'
        )}
        initial={false}
        animate={isRootMenu ? 'moveMenu' : isActive ? 'open' : 'close'}
        transition={{ ease: 'easeIn' }}
        variants={{
          open: { opacity: 1 },
          close: { opacity: 0 },
          moveMenu: { x: `${currentDepth * -100}%` },
        }}
        ref={menuRef}
      >
        {!isRootMenu && parentMenu && (
          <div className="mb-2.5 border-b border-gray-new-94 pb-4 dark:border-gray-new-10 md:pb-3.5">
            <LinkTag
              className="flex items-center gap-2 text-sm font-medium leading-tight tracking-extra-tight text-secondary-8 dark:text-green-45"
              type={parentMenu.slug ? undefined : 'button'}
              to={parentMenu.slug ? `${basePath}${parentMenu.slug}` : undefined}
              onClick={handleClose}
            >
              <ChevronBackIcon className="size-4.5" />
              Back to {parentMenu.title}
            </LinkTag>
            <p className="mt-7 flex w-full items-start gap-2 text-left font-medium leading-tight tracking-extra-tight text-black-new dark:text-white md:hidden">
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
              setMenuTitle={setMenuTitle}
              setMenuHeight={setMenuHeight}
              menuWrapperRef={menuWrapperRef}
              setActiveMenuList={setActiveMenuList}
            >
              {item.items && (
                <Menu
                  depth={depth + 1}
                  title={item.title}
                  slug={item.slug}
                  Icon={icons[item.icon]}
                  items={item.items}
                  basePath={basePath}
                  parentMenu={{ title, slug }}
                  closeMobileMenu={closeMobileMenu}
                  setMenuTitle={setMenuTitle}
                  setMenuHeight={setMenuHeight}
                  menuWrapperRef={menuWrapperRef}
                  activeMenuList={activeMenuList}
                  setActiveMenuList={setActiveMenuList}
                />
              )}
            </Item>
          ))}
        </ul>
        {isRootMenu && (
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
  depth: PropTypes.number.isRequired,
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
  updateMenuHeight: PropTypes.func,
  closeMobileMenu: PropTypes.func,
  setMenuTitle: PropTypes.func,
  setMenuHeight: PropTypes.func.isRequired,
  menuWrapperRef: PropTypes.any.isRequired,
  activeMenuList: PropTypes.arrayOf(PropTypes.string).isRequired,
  setActiveMenuList: PropTypes.func.isRequired,
};

export default Menu;
