import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import StatusBadge from 'components/shared/footer/status-badge';
import ThemeSelect from 'components/shared/footer/theme-select';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';

const Footer = ({ hasThemesSupport = false, theme = null }) => {
  const isDarkTheme = theme === 'dark';

  return (
    <footer
      className={clsx(
        'safe-paddings relative z-50 mt-auto dark:bg-black-pure dark:text-white',
        'before:absolute before:left-1/2 before:top-0 before:h-px before:w-full before:max-w-[1920px] before:-translate-x-1/2 before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%);] dark:before:bg-white',
        isDarkTheme ? 'bg-black-pure before:bg-white' : 'bg-white before:bg-gray-new-10'
      )}
    >
      <Container
        className="flex justify-between gap-x-10 pb-[51px] pt-10 xl:pt-9 lg:pb-9 sm:py-8"
        size="1344"
      >
        <div className="flex flex-col items-start justify-between lg:w-full lg:flex-row sm:flex-col sm:gap-y-5">
          <div className="mb-[30px] flex grow flex-col lg:mb-0 sm:w-full sm:flex-row sm:justify-between">
            <div className="flex grow flex-col items-start">
              <Logo
                className="h-8 w-[116px] lg:h-7 lg:w-auto sm:h-[26px]"
                isDarkTheme={isDarkTheme}
                width={116}
                height={32}
              />

              <StatusBadge hasThemesSupport={hasThemesSupport} isDarkTheme={isDarkTheme} />
              {hasThemesSupport && <ThemeSelect className="mt-7 xl:mt-6 md:mt-3" />}
            </div>
          </div>
          <div className="flex flex-col gap-x-1 gap-y-3 text-[13px] leading-none tracking-extra-tight text-gray-new-40 lg:flex-row lg:self-end lg:leading-tight sm:flex-col sm:self-start">
            <p>Made in SF and the World</p>
            <p>
              <span className="lg:hidden">Copyright </span>Ⓒ 2022 – 2024 Neon, Inc.
            </p>
          </div>
        </div>
        <div className="flex w-full max-w-[860px] justify-between xl:max-w-[700px] lg:hidden">
          {MENUS.footer.map(({ heading, items }, index) => (
            <div className="flex flex-col pt-3" key={index}>
              <span
                className={clsx(
                  'relative text-xs font-semibold uppercase leading-none tracking-normal dark:text-white',
                  isDarkTheme ? 'text-white' : 'text-gray-new-10'
                )}
              >
                {heading}
              </span>
              <ul className="mt-7 flex grow flex-col gap-y-5">
                {items.map(({ to, text, description, icon, links }, index) => {
                  const Tag = to ? Link : 'div';
                  const isExternalUrl = to?.startsWith('http');
                  const hasSubmenu = links?.length > 0;

                  return (
                    <li
                      className={clsx(
                        'flex w-fit',
                        hasSubmenu && 'group relative [perspective:2000px]'
                      )}
                      key={index}
                    >
                      <Tag
                        className={clsx(
                          'group/link relative flex items-center whitespace-nowrap text-[15px] leading-none tracking-extra-tight dark:text-gray-new-70',
                          isDarkTheme ? 'text-gray-new-70' : 'text-gray-new-30',
                          to && 'hover:!text-green-45',
                          hasSubmenu && 'cursor-pointer'
                        )}
                        to={to}
                        theme={isDarkTheme ? 'gray-70' : 'gray-30'}
                        rel={isExternalUrl ? 'noopener noreferrer' : null}
                        target={isExternalUrl ? '_blank' : null}
                      >
                        {icon && (
                          <span
                            className={clsx(
                              icon,
                              'inline-block dark:bg-gray-new-70',
                              heading === 'Compliance' ? 'mr-1.5 size-3' : 'mr-2.5 size-4',
                              isDarkTheme ? 'bg-gray-new-70' : 'bg-gray-new-30',
                              to && 'transition-colors duration-200 group-hover/link:bg-green-45'
                            )}
                          />
                        )}
                        {text}
                        {description && (
                          <span
                            className={clsx(
                              'ml-1.5 dark:text-gray-new-40',
                              isDarkTheme ? 'text-gray-new-40' : 'text-gray-new-70'
                            )}
                          >
                            {description}
                          </span>
                        )}
                        {hasSubmenu && (
                          <ChevronIcon className="ml-1 size-3.5 scale-75 [&_path]:stroke-2" />
                        )}
                      </Tag>
                      {hasSubmenu && (
                        <div
                          className={clsx(
                            'absolute bottom-full right-0 w-[230px] pb-2.5',
                            'pointer-events-none opacity-0',
                            'origin-bottom-right transition-[opacity,transform] duration-200 [transform:rotateX(12deg)_scale(0.9)]',
                            'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]'
                          )}
                        >
                          <ul
                            className={clsx(
                              'relative flex w-full flex-col gap-y-1 rounded-[14px] border px-2 py-2.5 dark:border-[#16181D] dark:bg-[#0B0C0F] dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]',
                              isDarkTheme
                                ? 'border-[#16181D] bg-[#0B0C0F] shadow-[0px_14px_20px_0px_rgba(0,0,0,.5)]'
                                : 'border-gray-new-94 bg-white shadow-[0px_14px_20px_0px_rgba(0,0,0,.1)]'
                            )}
                          >
                            {links.map(({ text, to }, index) => (
                              <li key={index}>
                                <Link
                                  className={clsx(
                                    'relative flex items-center overflow-hidden whitespace-nowrap rounded-lg p-3 text-[15px] leading-dense transition-colors duration-300 dark:text-white dark:hover:bg-[#16181D]',
                                    isDarkTheme
                                      ? 'text-gray-new-90 hover:bg-[#16181D]'
                                      : 'text-gray-new-10 hover:bg-[#F5F5F5]'
                                  )}
                                  to={to}
                                >
                                  {text}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  hasThemesSupport: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default Footer;
