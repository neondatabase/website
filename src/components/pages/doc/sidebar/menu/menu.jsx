import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import ArrowBackIcon from 'icons/docs/sidebar/arrow-back.inline.svg';

import Item from '../item';

const variantsMenu = {
  to: { x: 0 },
  closed: { x: '-100%' },
};

const variantsSubMenu = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

const Menu = ({
  basePath,
  items = null,
  isSubMenu = false,
  isOpen = false,
  onClose,
  onToggleSubmenu = null,
  onToggleParentMenu = null,
}) => (
  <LazyMotion features={domAnimation}>
    <m.div
      className={clsx(
        'absolute left-0 top-0 w-full',
        isSubMenu && 'translate-x-full',
        isSubMenu && !isOpen && 'pointer-events-none'
      )}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      transition={{ ease: 'easeIn' }}
      variants={isSubMenu ? variantsSubMenu : variantsMenu}
    >
      {isSubMenu && (
        <Link
          className="mb-7 flex items-center gap-2 text-green-45"
          to={`${basePath}introduction`}
          onClick={onClose}
        >
          <ArrowBackIcon className="size-4.5" />
          Back to Home
        </Link>
      )}
      <ul className="w-full">
        {items.map((item, index) => (
          <Item
            {...item}
            key={index}
            basePath={basePath}
            onToggleSubmenu={onToggleSubmenu}
            onToggleParentMenu={onToggleParentMenu}
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

Menu.propTypes = {
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
  isSubMenu: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onToggleSubmenu: PropTypes.func,
  onToggleParentMenu: PropTypes.func,
};

export default Menu;
