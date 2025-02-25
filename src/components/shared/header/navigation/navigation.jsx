import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import MenuBanner from '../menu-banner';

const Navigation = ({ isDarkTheme }) => (
  <nav>
    <ul className="flex gap-x-10 xl:gap-x-8 lg:hidden [@media(max-width:1070px)]:gap-x-6">
      {MENUS.header.map(({ to, text, sections }, index) => {
        const Tag = to ? Link : 'button';
        const hasSubmenu = sections?.length > 0;
        const gridSubmenu = sections?.length > 1;

        return (
          <li className={clsx('relative [perspective:2000px]', hasSubmenu && 'group')} key={index}>
            <Tag
              className={clsx(
                'flex items-center gap-x-1 whitespace-pre text-sm',
                isDarkTheme ? 'text-white' : 'text-black dark:text-white'
              )}
              to={to}
              theme={isDarkTheme && to ? 'white' : 'black'}
            >
              {text}
              {hasSubmenu && (
                <ChevronIcon
                  className={clsx(
                    '-mb-px w-2.5 opacity-60 [&_path]:stroke-2',
                    isDarkTheme ? 'text-white' : 'text-black-new dark:text-white'
                  )}
                />
              )}
            </Tag>
            {/* submenu */}
            {hasSubmenu && (
              <div
                className={clsx(
                  'absolute -left-7 top-full pt-5',
                  'pointer-events-none opacity-0',
                  'origin-top-left transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)]',
                  'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]'
                )}
              >
                <ul
                  className={clsx(
                    'relative rounded-[14px] border',
                    gridSubmenu
                      ? 'grid w-max grid-cols-[repeat(2,minmax(0,auto));] gap-x-14 gap-y-9 px-7 py-6'
                      : 'p-4',
                    isDarkTheme
                      ? 'border-[#16181D] bg-[#0B0C0F] shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
                      : 'border-gray-new-94 bg-white shadow-[0px_14px_20px_0px_rgba(0,0,0,.1)] dark:border-[#16181D] dark:bg-[#0B0C0F] dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
                  )}
                >
                  {sections.map(({ title, items, banner, isExtended }, index) => {
                    if (banner) {
                      return <MenuBanner {...banner} key={index} />;
                    }

                    return (
                      <li
                        className={clsx(
                          'min-w-[94px]',
                          gridSubmenu && [isExtended ? 'w-[216px]' : 'w-[196px]']
                        )}
                        key={index}
                      >
                        {title && (
                          <span className="mb-5 block text-[11px] font-medium uppercase leading-none text-gray-new-40 dark:text-gray-new-50">
                            {title}
                          </span>
                        )}
                        <ul className={clsx('flex flex-col', isExtended ? 'gap-5' : 'gap-[18px]')}>
                          {items.map(
                            ({
                              icon: Icon,
                              iconGradient: IconGradient,
                              title,
                              description,
                              to,
                            }) => (
                              <li key={title}>
                                <Link
                                  className={clsx(
                                    'relative flex items-center',
                                    isExtended
                                      ? 'gap-3 before:rounded-[14px]'
                                      : 'gap-2.5 before:rounded-[10px]',
                                    'before:pointer-events-none before:absolute before:-inset-2.5 before:transform-gpu before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100',
                                    isDarkTheme
                                      ? 'before:bg-[#16181D]'
                                      : 'before:bg-[#f5f5f5] dark:before:bg-[#16181D]'
                                  )}
                                  to={to}
                                >
                                  {isExtended && IconGradient && (
                                    <div
                                      className={clsx(
                                        'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg border',
                                        isDarkTheme
                                          ? 'border-[#2E3038] bg-[#16181D]'
                                          : 'border-gray-new-90 bg-[#F5F5F5] dark:border-[#2E3038] dark:bg-[#16181D]'
                                      )}
                                    >
                                      <IconGradient
                                        className={clsx(
                                          'size-4',
                                          isDarkTheme
                                            ? 'text-white'
                                            : 'text-gray-new-20 dark:text-white dark:[&_stop:not([stop-opacity])]:gradient-stop-opacity-40 dark:[&_stop[stop-opacity="0.6"]]:gradient-stop-opacity-100'
                                        )}
                                      />
                                    </div>
                                  )}
                                  {!isExtended && Icon && (
                                    <div className="relative z-10 shrink-0">
                                      <Icon
                                        className={clsx(
                                          'size-4',
                                          isDarkTheme
                                            ? 'text-gray-new-80'
                                            : 'text-gray-new-30 dark:text-gray-new-80'
                                        )}
                                      />
                                    </div>
                                  )}
                                  <div className="relative z-10">
                                    <span
                                      className={clsx(
                                        'block text-sm leading-none tracking-snug transition-colors duration-200',
                                        isDarkTheme
                                          ? 'text-white'
                                          : 'text-black-new dark:text-white'
                                      )}
                                    >
                                      {title}
                                    </span>
                                    {description && (
                                      <span
                                        className={clsx(
                                          'mt-1.5 block text-xs font-light leading-none tracking-extra-tight',
                                          isDarkTheme
                                            ? 'text-gray-new-50'
                                            : 'text-gray-new-40 dark:text-gray-new-50'
                                        )}
                                      >
                                        {description}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

Navigation.propTypes = {
  isDarkTheme: PropTypes.bool,
};

export default Navigation;
