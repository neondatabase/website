import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ArrowBackIcon from 'icons/docs/sidebar/arrow-back.inline.svg';

import Icon from './icon';
import Item from './item';

const Menu = ({
  title,
  slug,
  icon,
  basePath,
  items = null,
  closeMobileMenu = null,
  customType = null,
}) => (
  <div className="flex w-full flex-col gap-8 lg:px-8 lg:pt-4 md:px-5">
    <Link
      className="flex items-center gap-2.5 text-[15px] font-medium leading-snug tracking-extra-tight"
      to={`${basePath}${slug}`}
      theme="blue-green"
    >
      {icon && <Icon title={icon} className="size-4.5 shrink-0" />}
      {title}
    </Link>

    <ul className="flex flex-col">
      {items?.map((item, index) => {
        if (item.section) {
          return (
            <li className="mt-6 first:mt-0" key={index}>
              <div className="mb-[9px] flex items-center gap-2.5 text-[15px] font-medium leading-snug tracking-extra-tight">
                {item.icon && <Icon title={item.icon} className="size-4.5 shrink-0" />}
                {item.section}
              </div>
              <ul className="flex flex-col">
                {item.items?.map((item, index) => (
                  <Item
                    key={index}
                    {...item}
                    basePath={basePath}
                    closeMobileMenu={closeMobileMenu}
                  />
                ))}
              </ul>
            </li>
          );
        }

        return <Item key={index} {...item} basePath={basePath} closeMobileMenu={closeMobileMenu} />;
      })}
    </ul>

    {/* back to Docs link */}
    {customType && (
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

Menu.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  icon: PropTypes.string,
  items: PropTypes.array,
  closeMobileMenu: PropTypes.func,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
};

export default Menu;
