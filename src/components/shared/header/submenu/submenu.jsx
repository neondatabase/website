import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';

import MenuBanner from '../menu-banner';

const Submenu = ({
  activeMenuIndex,
  containerHeight,
  submenuContainerRef,
  submenuLinkClassName,
  handleSubmenuNavigation,
  handleSubmenuEnter,
  handleSubmenuLeave,
}) => (
  <div
    className={clsx(
      'main-navigation-submenu absolute left-0 top-full z-40 -mt-px w-full overflow-hidden',
      'border-b border-gray-new-20 bg-black-pure',
      'transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
      {
        'pointer-events-none': activeMenuIndex === null,
        '!pointer-events-auto': activeMenuIndex !== null,
      }
    )}
    style={{ height: `${containerHeight}px` }}
    onMouseEnter={handleSubmenuEnter}
    onMouseLeave={handleSubmenuLeave}
  >
    <div className="relative w-full" ref={submenuContainerRef}>
      {MENUS.header.map((menu, index) => {
        const isActive = activeMenuIndex === index;
        const sections = menu.sections || [];
        const isProduct = menu.text === 'Product';

        return (
          <div
            className={clsx(
              'absolute left-0 top-0 w-full',
              'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
              isActive ? 'active opacity-100' : 'pointer-events-none opacity-0'
            )}
            key={index}
            id={`submenu-${index}`}
            role="navigation"
            aria-label={menu.text}
            aria-hidden={!isActive}
            data-submenu-panel
          >
            {sections.length > 0 && (
              <Container
                className="flex w-full gap-x-40 overflow-hidden pb-20 pt-7 xl:gap-x-8"
                size="1920"
              >
                <ul className="flex gap-x-[128px] pl-[195px] xl:gap-x-5 xl:pl-[143px]" role="menu">
                  {sections.map(({ title, items }, sectionIndex) => (
                    <li key={sectionIndex} role="none">
                      {title && (
                        <span
                          className="mb-6 block text-[10px] font-medium uppercase leading-none tracking-snug text-gray-new-50"
                          id={`submenu-${index}-section-${sectionIndex}`}
                        >
                          {title}
                        </span>
                      )}
                      <ul
                        className="flex flex-col gap-y-6"
                        role="group"
                        aria-labelledby={
                          title ? `submenu-${index}-section-${sectionIndex}` : undefined
                        }
                      >
                        {items?.map(({ title, description, to, isExternal }) => (
                          <li key={title} role="none">
                            <Link
                              className={`group ${submenuLinkClassName} -mx-1 -my-3 grid min-w-[224px] gap-y-2 rounded px-1 py-3 text-[13px] leading-tight tracking-snug text-gray-new-60  transition-colors duration-200 hover:text-gray-new-80`}
                              to={to}
                              isExternal={isExternal}
                              tagName="Navigation"
                              tagText={title}
                              role="menuitem"
                              tabIndex={isActive ? 0 : -1}
                              onKeyDown={handleSubmenuNavigation(index)}
                            >
                              <span
                                className='text-white text-lg font-medium leading-none group-hover:text-gray-new-80'
                              >
                                {title}
                              </span>
                              {description}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                {isProduct && (
                  <MenuBanner
                    linkProps={{
                      className: clsx('mt-1 xl:mt-0', submenuLinkClassName),
                      role: 'menuitem',
                      tabIndex: isActive ? 0 : -1,
                      onKeyDown: handleSubmenuNavigation(index),
                    }}
                  />
                )}
              </Container>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

Submenu.propTypes = {
  activeMenuIndex: PropTypes.number,
  containerHeight: PropTypes.number.isRequired,
  submenuContainerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]).isRequired,
  submenuLinkClassName: PropTypes.string.isRequired,
  handleSubmenuNavigation: PropTypes.func.isRequired,
  handleSubmenuEnter: PropTypes.func.isRequired,
  handleSubmenuLeave: PropTypes.func.isRequired,
};

export default Submenu;
