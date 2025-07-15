import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import Chevron from 'icons/chevron-right-lg.inline.svg';

import Tag from '../../tag';
import Icon from '../icon';

const Item = ({
  basePath,
  title,
  slug = null,
  icon = null,
  tag = null,
  ariaLabel = null,
  items = null,
  activeMenuList,
  setActiveMenuList,
  closeMobileMenu = null,
  root,
  children,
  collapsible = false,
  onCollapse = null,
}) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');
  const [isCollapsed, setIsCollapsed] = useState(true);

  const externalSlug = slug?.startsWith('http') ? slug : null;
  const websiteSlug = slug?.startsWith('/') && `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${slug}`;
  const docSlug = root ? slug : `${basePath}${slug}/`;

  const LinkTag = slug && !collapsible ? Link : 'button';

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
    if (onCollapse) onCollapse();
  };

  const handleClick = () => {
    if (collapsible) {
      handleToggle();
      return;
    }

    if (items?.length && !activeMenuList.some((item) => item.title === title)) {
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
          currentSlug === slug
            ? 'font-medium text-black-new dark:text-white'
            : 'font-normal text-gray-new-40 hover:text-black-new dark:text-gray-new-80 dark:hover:text-white'
        )}
        type={slug ? undefined : 'button'}
        to={slug && !collapsible ? externalSlug || websiteSlug || docSlug : undefined}
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
          <Chevron className={clsx('ml-auto w-1.5', !isCollapsed && 'rotate-90')} />
        )}
      </LinkTag>
      {collapsible ? (
        <LazyMotion features={domAnimation}>
          <m.div
            className="overflow-hidden"
            initial="collapsed"
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={{
              collapsed: { opacity: 0, height: 0 },
              expanded: { opacity: 1, height: 'auto' },
            }}
            transition={{ duration: 0.2 }}
          >
            <ul>
              {items.map((item, index) => (
                <Item
                  {...item}
                  key={index}
                  basePath={basePath}
                  activeMenuList={activeMenuList}
                  setActiveMenuList={setActiveMenuList}
                  closeMobileMenu={closeMobileMenu}
                />
              ))}
            </ul>
            {children}
          </m.div>
        </LazyMotion>
      ) : (
        children
      )}
    </li>
  );
};

Item.propTypes = {
  basePath: PropTypes.string.isRequired,
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
  root: PropTypes.bool,
  children: PropTypes.node,
  collapsible: PropTypes.bool,
  onCollapse: PropTypes.func,
};

export default Item;
