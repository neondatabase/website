import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import Chevron from 'icons/chevron-right-lg.inline.svg';

import Tag from '../../tag';
import Icon from '../icon';
// eslint-disable-next-line import/no-cycle
import Menu from '../menu';

const Item = ({
  basePath,
  root,
  depth = 0,
  title,
  slug = null,
  icon = null,
  tag = null,
  ariaLabel = null,
  items = null,
  activeMenuList,
  setActiveMenuList,
  closeMobileMenu = null,
  setMenuHeight,
  menuWrapperRef,
  collapsible = false,
  onCollapse = null,
}) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  const isActive = slug === currentSlug;
  const isActiveMenu = isActive || items?.some((item) => item.slug === currentSlug);
  const [isCollapsed, setIsCollapsed] = useState(!isActiveMenu);

  const externalSlug = slug?.startsWith('http') ? slug : null;
  const websiteSlug = slug?.startsWith('/') && `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${slug}`;
  const docSlug = root ? slug : `${basePath}${slug}/`;

  const LinkTag = slug ? Link : 'button';

  const handleToggle = () => {
    if (isActiveMenu) {
      setIsCollapsed((prev) => !prev);
    } else if (isCollapsed) {
      setIsCollapsed(false);
    }
    if (onCollapse) onCollapse();
  };

  const handleClick = () => {
    if (collapsible) {
      handleToggle();
      return;
    }

    if (items?.length && !collapsible && !activeMenuList.some((item) => item.title === title)) {
      setActiveMenuList((prevList) => [...prevList, { title, slug }]);
    }
    if (slug && closeMobileMenu) closeMobileMenu();
  };

  return (
    <li className="group/item flex flex-col">
      <LinkTag
        className={clsx(
          'group flex w-full gap-2 py-1.5 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200 md:py-[7px]',
          collapsible && 'pr-1',
          isActive && !collapsible
            ? 'font-medium text-black-new dark:text-white'
            : 'font-normal text-gray-new-40 hover:text-black-new dark:text-gray-new-80 dark:hover:text-white'
        )}
        type={slug ? undefined : 'button'}
        to={slug ? externalSlug || websiteSlug || docSlug : undefined}
        target={externalSlug || websiteSlug ? '_blank' : '_self'}
        icon={externalSlug && 'external'}
        onClick={handleClick}
      >
        {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
        {icon && <Icon title={icon} className="size-4.5 shrink-0" />}
        <span className="text-pretty" aria-hidden={!!ariaLabel}>
          {title}&nbsp;
          {tag && <Tag className="relative -top-px ml-1 inline-block" label={tag} size="sm" />}
        </span>
        {collapsible && items?.length && (
          <Chevron className={clsx('ml-auto w-1.5', !isCollapsed && '-rotate-90')} />
        )}
      </LinkTag>
      {items?.length &&
        (collapsible ? (
          <LazyMotion features={domAnimation}>
            <m.div
              className="overflow-hidden"
              initial={isActiveMenu ? 'expanded' : 'collapsed'}
              animate={isCollapsed ? 'collapsed' : 'expanded'}
              variants={{
                collapsed: { opacity: 0, height: 0, translateY: 10 },
                expanded: { opacity: 1, height: 'auto', translateY: 0 },
              }}
              transition={{ duration: 0.2 }}
            >
              <ul className="mb-2 ml-1 border-l border-gray-new-80 pl-3 dark:border-gray-new-20">
                {items.map((item, index) => (
                  <Item
                    {...item}
                    key={index}
                    basePath={basePath}
                    activeMenuList={activeMenuList}
                    setActiveMenuList={setActiveMenuList}
                    closeMobileMenu={closeMobileMenu}
                    setMenuHeight={setMenuHeight}
                    menuWrapperRef={menuWrapperRef}
                    onCollapse={onCollapse}
                  >
                    {item.items && !item.collapsible && (
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
                ))}
              </ul>
            </m.div>
          </LazyMotion>
        ) : (
          <Menu
            depth={depth + 1}
            title={title}
            slug={slug}
            icon={icon}
            items={items}
            basePath={basePath}
            parentMenu={{ title, slug }}
            setMenuHeight={setMenuHeight}
            menuWrapperRef={menuWrapperRef}
            activeMenuList={activeMenuList}
            setActiveMenuList={setActiveMenuList}
            closeMobileMenu={closeMobileMenu}
          />
        ))}
    </li>
  );
};

Item.propTypes = {
  basePath: PropTypes.string.isRequired,
  root: PropTypes.bool,
  depth: PropTypes.number,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string,
  icon: PropTypes.string,
  tag: PropTypes.string,
  ariaLabel: PropTypes.string,
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
  activeMenuList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
    })
  ).isRequired,
  setActiveMenuList: PropTypes.func.isRequired,
  closeMobileMenu: PropTypes.func,
  setMenuHeight: PropTypes.func.isRequired,
  menuWrapperRef: PropTypes.any.isRequired,
  collapsible: PropTypes.bool,
  onCollapse: PropTypes.func,
};

export default Item;
