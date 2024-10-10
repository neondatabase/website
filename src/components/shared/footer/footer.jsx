import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import StatusBadge from 'components/shared/footer/status-badge';
import ThemeSelect from 'components/shared/footer/theme-select';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import MENUS from 'constants/menus.js';

// TODO: add responsive styles for black-pure theme, fix logo size
const Footer = ({ hasThemesSupport = false, theme = null }) => {
  const isDarkTheme = theme === 'dark';

  return (
    <footer
      className={clsx(
        'z-999 safe-paddings relative mt-auto overflow-hidden dark:bg-black-pure dark:text-white',
        isDarkTheme ? 'bg-black-pure' : 'bg-white'
      )}
    >
      <Container
        className={clsx(
          'flex justify-between gap-x-10 pb-[51px] pt-10 xl:pt-9 lg:pb-9 sm:py-8',
          'before:absolute before:-left-[20%] before:top-0 before:h-px before:w-[140%] before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%);]',
          'dark:before:bg-white',
          isDarkTheme ? 'before:bg-white' : 'before:bg-gray-new-10'
        )}
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
        <div className="flex w-full max-w-[860px] justify-between xl:max-w-[623px] lg:hidden">
          {MENUS.footer.map(({ heading, links }, index) => (
            <div className="flex flex-col pt-3 xl:w-full" key={index}>
              <span
                className={clsx(
                  'relative text-xs font-semibold uppercase leading-none tracking-normal dark:text-white',
                  isDarkTheme ? 'text-white' : 'text-gray-new-10'
                )}
              >
                {heading}
              </span>
              <ul className="mt-7 flex grow flex-col gap-y-5">
                {links.map(({ to, text, icon }, index) => {
                  const isExternalUrl = to.startsWith('http');
                  return (
                    <li className="flex" key={index}>
                      <Link
                        className="group relative flex items-center gap-2 whitespace-nowrap text-[15px] leading-none tracking-extra-tight dark:text-gray-new-70 dark:hover:text-green-45"
                        to={to}
                        theme={isDarkTheme ? 'gray-70' : 'gray-30'}
                        rel={isExternalUrl ? 'noopener noreferrer' : null}
                        target={isExternalUrl ? '_blank' : null}
                      >
                        {icon && (
                          <span
                            className={clsx(
                              icon,
                              'inline-block h-4 w-4 transition-colors duration-200 group-hover:bg-primary-2 dark:bg-gray-new-70 dark:group-hover:bg-green-45',
                              isDarkTheme ? 'bg-gray-new-70' : 'bg-gray-new-30'
                            )}
                          />
                        )}
                        {text}
                      </Link>
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
