import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import LINKS from 'constants/links';
import ArrowBackIcon from 'icons/docs/sidebar/arrow-back.inline.svg';
import ChevronBackIcon from 'icons/docs/sidebar/chevron-back.inline.svg';

import Icon from './icon';
import Item from './item';

const Section = ({
  depth,
  title,
  slug,
  section,
  items,
  basePath,
  parentMenu,
  setMenuHeight,
  menuWrapperRef,
  activeMenuList,
  setActiveMenuList,
  closeMobileMenu,
}) => (
  <li className="border-b border-gray-new-94 py-2.5 first:pt-0 last:border-0 dark:border-gray-new-10 md:py-[11px] md:dark:border-gray-new-15">
    {section !== 'noname' && (
      <span className="block py-1.5 text-[10px] font-medium uppercase leading-tight text-gray-new-50 md:py-[7px]">
        {section}
      </span>
    )}
    {items && (
      <ul>
        {items.map((item, index) => (
          <Item
            {...item}
            key={index}
            basePath={basePath}
            parentMenu={{ title, slug, parentMenu }}
            activeMenuList={activeMenuList}
            setActiveMenuList={setActiveMenuList}
            closeMobileMenu={closeMobileMenu}
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
    )}
  </li>
);

Section.propTypes = {
  depth: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  section: PropTypes.string,
  icon: PropTypes.string,
  tag: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape()),
  parentMenu: PropTypes.exact({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
  }).isRequired,
  setMenuHeight: PropTypes.func.isRequired,
  menuWrapperRef: PropTypes.any.isRequired,
  activeMenuList: PropTypes.instanceOf(Set).isRequired,
  setActiveMenuList: PropTypes.func.isRequired,
  closeMobileMenu: PropTypes.func,
};

const Menu = ({
  depth,
  title,
  slug,
  basePath,
  icon = null,
  parentMenu = null,
  items = null,
  closeMobileMenu = null,
  setMenuHeight,
  menuWrapperRef,
  activeMenuList,
  setActiveMenuList,
}) => {
  const isRootMenu = depth === 0;
  const menuRef = useRef(null);
  const currentDepth = Array.from(activeMenuList).length - 1;

  const isActive = activeMenuList.has(title);
  const isLastActive = Array.from(activeMenuList)[currentDepth] === title;

  const BackLinkTag = parentMenu?.slug ? Link : 'button';
  const LinkTag = slug ? Link : 'div';

  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (currentSlug.includes(slug) && !activeMenuList.has(title)) {
        setActiveMenuList((prevList) => new Set(prevList).add(title));
      }
    }
  }, [activeMenuList, currentSlug, setActiveMenuList, slug, title]);

  // update menu height and scroll menu to top
  useEffect(() => {
    let timeout;

    if (isLastActive && menuRef.current && menuRef.current.scrollHeight > 0 && setMenuHeight) {
      timeout = setTimeout(() => {
        setMenuHeight(menuRef.current.scrollHeight);
        menuWrapperRef.current?.scrollTo(0, 0);
      }, 200);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isLastActive, currentDepth, setMenuHeight, menuWrapperRef]);

  const handleClose = () => {
    setActiveMenuList((prevList) => {
      const newList = new Set(prevList);
      newList.delete(title);
      return newList;
    });
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
            <BackLinkTag
              className="flex items-center gap-2 text-sm font-medium leading-tight tracking-extra-tight text-secondary-8 dark:text-green-45"
              type={parentMenu.slug ? undefined : 'button'}
              to={parentMenu.slug ? `${basePath}${parentMenu.slug}` : undefined}
              onClick={handleClose}
            >
              <ChevronBackIcon className="size-4.5" />
              Back to {parentMenu.title}
            </BackLinkTag>
            <LinkTag
              className="mt-7 flex w-full items-start gap-2 text-left font-medium leading-tight tracking-extra-tight text-black-new dark:text-white md:hidden"
              to={slug ? `${basePath}${slug}` : undefined}
            >
              {icon && <Icon title={icon} className="size-5" />}
              {title}
            </LinkTag>
          </div>
        )}
        <ul className="w-full">
          {items.map((item, index) =>
            item.section ? (
              <Section
                key={index}
                {...item}
                title={title}
                slug={slug}
                basePath={basePath}
                parentMenu={{ title, slug, parentMenu }}
                closeMobileMenu={closeMobileMenu}
                setMenuHeight={setMenuHeight}
                menuWrapperRef={menuWrapperRef}
                activeMenuList={activeMenuList}
                setActiveMenuList={setActiveMenuList}
              />
            ) : (
              <Item
                key={index}
                {...item}
                basePath={basePath}
                parentMenu={{ title, slug, parentMenu }}
                activeMenuList={activeMenuList}
                setActiveMenuList={setActiveMenuList}
                closeMobileMenu={closeMobileMenu}
              >
                {item.items && (
                  <Menu
                    depth={depth + 1}
                    title={item.title}
                    slug={item.slug}
                    icon={item.icon}
                    items={item.items}
                    basePath={basePath}
                    parentMenu={{ title, slug }}
                    setMenuHeight={setMenuHeight}
                    menuWrapperRef={menuWrapperRef}
                    activeMenuList={activeMenuList}
                    setActiveMenuList={setActiveMenuList}
                    closeMobileMenu={closeMobileMenu}
                  />
                )}
              </Item>
            )
          )}
        </ul>
        {isRootMenu && (
          <div className="border-t border-gray-new-94 pt-4 dark:border-gray-new-10">
            <Link
              className={clsx(
                'flex w-full items-start gap-2 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
                'text-gray-new-60 hover:text-black-new dark:hover:text-white'
              )}
              to={basePath === DOCS_BASE_PATH ? '/' : LINKS.docs}
            >
              <ArrowBackIcon className="size-4.5" />
              Back to {basePath === DOCS_BASE_PATH ? 'site' : 'docs'}
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
    })
  ),
  setMenuHeight: PropTypes.func.isRequired,
  menuWrapperRef: PropTypes.any.isRequired,
  activeMenuList: PropTypes.instanceOf(Set).isRequired,
  setActiveMenuList: PropTypes.func.isRequired,
  closeMobileMenu: PropTypes.func,
};

export default Menu;
