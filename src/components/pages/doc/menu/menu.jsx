import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import Chevron from 'icons/chevron-right-lg.inline.svg';
import ArrowBackIcon from 'icons/docs/sidebar/arrow-back.inline.svg';

import Item from './item';

const sectionTitleClassName =
  'py-1.5 text-xs font-medium uppercase leading-none tracking-tight text-gray-new-50';

const Section = ({
  depth,
  title,
  slug,
  section,
  collapsible,
  items,
  basePath,
  setMenuHeight,
  menuWrapperRef,
  activeMenuList,
  setActiveMenuList,
  closeMobileMenu,
  onCollapse,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
    onCollapse();
  };

  return (
    <li className="border-b border-gray-new-94 py-2.5 first:pt-0 last:border-0 dark:border-gray-new-10 lg:dark:border-gray-new-15/70">
      {section !== 'noname' &&
        (collapsible ? (
          <button
            className={clsx(
              'flex w-full items-center justify-between pr-1',
              sectionTitleClassName,
              'transition-colors duration-200 hover:text-black-new dark:hover:text-white'
            )}
            type="button"
            onClick={handleToggle}
          >
            {section}
            <Chevron className={clsx('w-1.5', !isCollapsed && '-rotate-90')} />
          </button>
        ) : (
          <span className={clsx('block', sectionTitleClassName)}>{section}</span>
        ))}
      {items && (
        <LazyMotion features={domAnimation}>
          <m.div
            className={collapsible && 'overflow-hidden'}
            initial={collapsible ? 'collapsed' : 'expanded'}
            animate={collapsible && isCollapsed ? 'collapsed' : 'expanded'}
            variants={{
              collapsed: { opacity: 0, height: 0, translateY: 10 },
              expanded: { opacity: 1, height: 'auto', translateY: 0 },
            }}
            transition={{ duration: 0.2 }}
          >
            <ul className={collapsible && 'mt-1'}>
              {items.map((item, index) => (
                <Item
                  {...item}
                  key={index}
                  basePath={basePath}
                  activeMenuList={activeMenuList}
                  setActiveMenuList={setActiveMenuList}
                  closeMobileMenu={closeMobileMenu}
                  onCollapse={onCollapse}
                >
                  {item.items && (
                    <Menu
                      depth={depth + 1}
                      title={item.title}
                      slug={item.slug}
                      basePath={basePath}
                      icon={item.icon}
                      items={item.items}
                      parentMenu={{ title, slug }}
                      setMenuHeight={setMenuHeight}
                      menuWrapperRef={menuWrapperRef}
                      activeMenuList={activeMenuList}
                      setActiveMenuList={setActiveMenuList}
                      closeMobileMenu={closeMobileMenu}
                    />
                  )}
                </Item>
              ))}
            </ul>
          </m.div>
        </LazyMotion>
      )}
    </li>
  );
};

Section.propTypes = {
  depth: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  section: PropTypes.string,
  collapsible: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape()),
  setMenuHeight: PropTypes.func.isRequired,
  menuWrapperRef: PropTypes.any.isRequired,
  activeMenuList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
    })
  ).isRequired,
  setActiveMenuList: PropTypes.func.isRequired,
  closeMobileMenu: PropTypes.func,
  onCollapse: PropTypes.func,
};

const Menu = ({
  depth = 0,
  title,
  slug,
  basePath,
  parentMenu = null,
  items = null,
  closeMobileMenu = null,
  setMenuHeight,
  menuWrapperRef,
  activeMenuList,
  setActiveMenuList,
  customType = null,
}) => {
  const isRootMenu = depth === 0;
  const menuRef = useRef(null);
  const lastDepth = activeMenuList.length - 1;

  const BackLinkTag = slug ? Link : 'button';

  const isActive = isRootMenu || activeMenuList.some((item) => item.title === title);
  const isLastActive =
    activeMenuList[lastDepth]?.title === title || (isRootMenu && lastDepth === 0);

  const updateMenuHeight = () => {
    setMenuHeight(2000);
    setTimeout(() => {
      setMenuHeight(menuRef.current.scrollHeight);
    }, 250);
  };

  // update menu height and scroll menu to top
  useEffect(() => {
    if (isLastActive && setMenuHeight && menuRef?.current && menuWrapperRef?.current) {
      setMenuHeight(menuRef.current.scrollHeight);
      menuWrapperRef.current?.scrollTo(0, 0);
    }
  }, [isLastActive, setMenuHeight, menuWrapperRef, depth, isActive, title]);

  if (!isRootMenu && !isActive) return null;

  const handleClose = () => {
    if (parentMenu?.slug && closeMobileMenu) closeMobileMenu();
  };

  return (
    <div
      className={clsx(
        'absolute left-0 top-0 w-full',
        !isActive && 'pointer-events-none',
        !isRootMenu && 'translate-x-full',
        'lg:px-8 lg:pt-4 md:px-5',
        (isActive || isRootMenu) && 'opacity-100'
      )}
      style={isRootMenu ? { transform: `translateX(${lastDepth * -100}%)` } : undefined}
      ref={menuRef}
    >
      {/* menu title and home link */}
      {!isRootMenu && (
        <BackLinkTag
          className="group relative z-50 flex w-full items-center pb-1.5 text-left font-medium leading-tight tracking-extra-tight text-black-new dark:text-white"
          to={`${basePath}${slug}`}
          onClick={handleClose}
        >
          {title}
        </BackLinkTag>
      )}

      {/* menu sections and items */}
      <ul
        className={clsx('w-full', !isRootMenu && 'py-2.5', !isActive ? 'opacity-0' : 'opacity-100')}
      >
        {items.map((item, index) =>
          item.section ? (
            <Section
              key={index}
              depth={depth}
              {...item}
              title={title}
              slug={slug}
              basePath={basePath}
              closeMobileMenu={closeMobileMenu}
              setMenuHeight={setMenuHeight}
              menuWrapperRef={menuWrapperRef}
              activeMenuList={activeMenuList}
              setActiveMenuList={setActiveMenuList}
              onCollapse={updateMenuHeight}
            />
          ) : (
            <Item
              key={index}
              {...item}
              depth={depth}
              basePath={basePath}
              activeMenuList={activeMenuList}
              setActiveMenuList={setActiveMenuList}
              closeMobileMenu={closeMobileMenu}
              setMenuHeight={setMenuHeight}
              menuWrapperRef={menuWrapperRef}
              onCollapse={updateMenuHeight}
            />
          )
        )}
      </ul>

      {/* back to Docs link */}
      {isRootMenu && customType && (
        <div className="border-t border-gray-new-94 pt-4 dark:border-gray-new-10">
          <Link
            className={clsx(
              'flex w-full items-start gap-2 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
              'text-gray-new-60 hover:text-black-new dark:hover:text-white'
            )}
            to={DOCS_BASE_PATH}
          >
            <ArrowBackIcon className="size-4.5" />
            Back to Docs
          </Link>
        </div>
      )}
    </div>
  );
};

Menu.propTypes = {
  depth: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  icon: PropTypes.string,
  parentMenu: PropTypes.exact({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
  }),
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
  setMenuHeight: PropTypes.func.isRequired,
  menuWrapperRef: PropTypes.any.isRequired,
  activeMenuList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
    })
  ).isRequired,
  setActiveMenuList: PropTypes.func.isRequired,
  closeMobileMenu: PropTypes.func,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
};

export default Menu;
