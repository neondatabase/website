import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH, HOME_MENU_ITEM } from 'constants/docs';
import LINKS from 'constants/links';
import ArrowBackIcon from 'icons/docs/sidebar/arrow-back.inline.svg';
import ChevronBackIcon from 'icons/docs/sidebar/chevron-back.inline.svg';
import HomeIcon from 'icons/docs/sidebar/home.inline.svg';

import Item from './item';

const Section = ({
  depth,
  title,
  slug,
  section,
  items,
  basePath,
  setMenuHeight,
  menuWrapperRef,
  activeMenuList,
  setActiveMenuList,
  closeMobileMenu,
}) => (
  <li className="border-b border-gray-new-94 py-2.5 first:pt-0 last:border-0 dark:border-gray-new-10 lg:dark:border-gray-new-15/70 md:py-[11px]">
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
}) => {
  const isRootMenu = depth === 0;
  const menuRef = useRef(null);
  const lastDepth = activeMenuList.length - 1;

  const isActive = isRootMenu || activeMenuList.some((item) => item.title === title);
  const isLastActive = activeMenuList[lastDepth]?.title === title;

  const BackLinkTag = parentMenu?.slug ? Link : 'button';
  const LinkTag = slug ? Link : 'div';

  const backLinkPath = basePath === DOCS_BASE_PATH ? '/' : LINKS.docs;
  const docsHomePath = LINKS.docsHome;
  const postgresHomePath = LINKS.postgres;
  const homePath = basePath === DOCS_BASE_PATH ? docsHomePath : postgresHomePath;

  // update menu height and scroll menu to top
  useEffect(() => {
    if (isLastActive && menuRef.current && menuRef.current.scrollHeight > 0 && setMenuHeight) {
      setMenuHeight(menuRef.current.scrollHeight);
      menuWrapperRef.current?.scrollTo(0, 0);
    }
  }, [isLastActive, setMenuHeight, menuWrapperRef]);

  const handleClose = () => {
    setActiveMenuList((prevList) => prevList.filter((item) => item.title !== title));
    if (parentMenu?.slug && closeMobileMenu) closeMobileMenu();
  };

  const handleClickHome = () => {
    setActiveMenuList([HOME_MENU_ITEM]);
  };

  if (!isRootMenu && !isActive) return null;

  return (
    <div
      className={clsx(
        'absolute left-0 top-0 w-full pb-16',
        !isActive && 'pointer-events-none',
        !isRootMenu && 'translate-x-full',
        'lg:px-8 lg:pb-8 lg:pt-4 md:px-5',
        (isActive || isRootMenu) && 'opacity-1'
      )}
      style={isRootMenu ? { transform: `translateX(${lastDepth * -100}%)` } : undefined}
      ref={menuRef}
    >
      {/* breadcrumbs, menu title and home link */}
      {!isRootMenu && (
        <>
          <div className="flex flex-col gap-7 border-b border-gray-new-94 pb-4 dark:border-gray-new-10 md:pb-3.5">
            {depth > 0 && (
              <BackLinkTag
                className="flex items-center gap-2 text-sm font-medium leading-tight tracking-extra-tight text-secondary-8 dark:text-green-45"
                type={parentMenu.slug ? undefined : 'button'}
                to={parentMenu.slug ? `${basePath}${parentMenu.slug}` : undefined}
                onClick={handleClose}
              >
                <ChevronBackIcon className="size-4.5" />
                Back to {parentMenu.title}
              </BackLinkTag>
            )}
            {depth !== 1 && (
              <Link
                className={clsx(
                  'flex w-full items-start gap-2 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
                  'text-gray-new-40 hover:text-black-new dark:text-gray-new-80 dark:hover:text-white'
                )}
                to={homePath}
                onClick={handleClickHome}
              >
                <HomeIcon className="size-4.5" />
                Home
              </Link>
            )}
          </div>

          <LinkTag
            className="mt-4 flex w-full items-start gap-1.5 pb-2.5 text-left font-medium leading-tight tracking-extra-tight text-black-new dark:text-white md:hidden"
            to={slug ? `${basePath}${slug}` : undefined}
          >
            {title}
          </LinkTag>
        </>
      )}

      {/* menu sections and items */}
      <ul className={clsx('w-full', !isRootMenu && 'py-2.5')}>
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
            />
          ) : (
            <Item
              key={index}
              {...item}
              basePath={basePath}
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

      {/* back to docs link */}
      {isRootMenu && basePath !== DOCS_BASE_PATH && (
        <div className="border-t border-gray-new-94 pt-4 dark:border-gray-new-10">
          <Link
            className={clsx(
              'flex w-full items-start gap-2 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200',
              'text-gray-new-60 hover:text-black-new dark:hover:text-white'
            )}
            to={isRootMenu ? backLinkPath : homePath}
          >
            <ArrowBackIcon className="size-4.5" />
            Back to docs
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
};

export default Menu;
