import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import ArrowExternalIcon from 'icons/docs/sidebar/arrow-external.inline.svg';

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
  children,
}) => {
  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');

  const externalSlug = slug && slug.startsWith('http') ? slug : null;
  const docSlug = `${basePath}${slug}/`;

  const LinkTag = slug ? Link : 'button';

  const handleClick = () => {
    if (items?.length && !activeMenuList.some((item) => item.title === title)) {
      setActiveMenuList((prevList) => [...prevList, { title, slug }]);
    }
    if (slug && closeMobileMenu) closeMobileMenu();
  };

  return (
    <li className="group/item flex flex-col">
      <LinkTag
        className={clsx(
          'group flex w-full items-center gap-2 py-1.5 text-left text-sm leading-tight tracking-extra-tight transition-colors duration-200 md:py-[7px]',
          currentSlug === slug
            ? 'font-medium text-black-new dark:text-white'
            : 'font-normal text-gray-new-40 hover:text-black-new dark:text-gray-new-80 dark:hover:text-white'
        )}
        type={slug ? undefined : 'button'}
        to={slug ? externalSlug || docSlug : undefined}
        target={externalSlug ? '_blank' : '_self'}
        onClick={handleClick}
      >
        {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
        {icon && <Icon title={icon} className="size-4.5" />}
        <span
          className="[&_code]:rounded-sm [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:font-normal [&_code]:leading-none dark:[&_code]:bg-gray-new-15"
          aria-hidden={!!ariaLabel}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {tag && <Tag className="ml-2 mt-0.5" label={tag} size="sm" />}
        {externalSlug && <ArrowExternalIcon className="text-gray-new-90 dark:text-gray-new-15" />}
      </LinkTag>
      {children}
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
  children: PropTypes.node,
};

export default Item;
