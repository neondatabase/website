import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import StatusBadge from 'components/shared/footer/status-badge';
import ThemeSelect from 'components/shared/footer/theme-select';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import MENUS from 'constants/menus.js';

const styles = {
  wrapper: {
    'black-pure': 'bg-black-pure text-white',
    'black-new': 'border-gray-new-15 bg-black-new text-white',
    black: 'bg-black text-white',
    white: 'bg-white text-black',
  },
  menuLinkTheme: {
    'black-pure': 'gray-50',
    'black-new': 'white',
    'gray-8': 'white',
    black: 'white',
    white: 'black',
  },
  icon: {
    'black-pure': 'bg-gray-new-50',
    'black-new': 'bg-white',
    'gray-8': 'bg-white',
    black: 'bg-white',
    white: 'bg-black group-hover:bg-primary-2 dark:bg-white dark:group-hover:bg-primary-2',
  },
};

// TODO: add responsive styles for black-pure theme, fix logo size
const Footer = ({ isDocPage = false, withTopBorder = false, theme = 'white' }) => {
  const isNewTheme = theme === 'black-pure';
  const isDarkTheme =
    theme === 'black' || theme === 'black-new' || theme === 'gray-8' || isNewTheme;

  return (
    <footer
      className={clsx(
        'z-999 safe-paddings relative mt-auto overflow-hidden dark:bg-gray-new-8 dark:text-white',
        !isDarkTheme && withTopBorder && 'border-t border-gray-new-90 dark:border-gray-new-20',
        isDarkTheme && withTopBorder && 'border-t border-gray-2',
        styles.wrapper[theme] || null
      )}
    >
      <Container
        className={clsx(
          'flex justify-between',
          isNewTheme ? 'gap-x-10 pb-14 pt-10' : 'py-10 xl:py-8',
          isNewTheme &&
            'before:absolute before:-left-[20%] before:top-0 before:h-px before:w-[140%] before:bg-white before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%);]'
        )}
        size={isNewTheme ? '1344' : 'lg'}
      >
        <div className="flex flex-col items-start justify-between md:w-full md:space-y-8 sm:space-y-6">
          <div className="mb-7 flex flex-col xl:mb-5 md:mb-0 md:w-full md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col">
              <Link className="block" to="/">
                <span className="sr-only">Neon</span>
                <Logo
                  className={clsx('w-auto sm:h-6', isNewTheme === 'max-w-[116px]')}
                  isThemeBlack={isDarkTheme}
                />
              </Link>
              <StatusBadge isDocPage={isDocPage} isNewTheme={isNewTheme} />
              {isDocPage && <ThemeSelect className="mt-7 xl:mt-6 md:mt-0" />}
            </div>
          </div>
          <div
            className={clsx(
              { 'tracking-tight text-gray-new-80': theme === 'black-new' || theme === 'gray-8' },
              'flex flex-col text-sm leading-none lg:leading-tight',
              isNewTheme
                ? 'gap-y-3 tracking-extra-tight text-[#C9CBCF]'
                : 'gap-y-[18px] dark:text-gray-new-80'
            )}
          >
            <p>Made in SF and the World</p>
            <p>
              <span className="lg:hidden">Copyright </span>Ⓒ 2022 – 2024 Neon, Inc.
            </p>
          </div>
        </div>
        <div
          className={clsx(
            'flex',
            isNewTheme
              ? 'w-full max-w-[840px] justify-between xl:max-w-[623px] lg:hidden'
              : 'gap-x-[123px] xl:gap-x-8 md:hidden [@media(max-width:800px)]:gap-x-6'
          )}
        >
          {MENUS.footer.map(({ heading, links }, index) => (
            <div className={clsx('flex flex-col xl:w-full', isNewTheme && 'pt-3')} key={index}>
              <span
                className={clsx(
                  'relative uppercase leading-none',
                  {
                    'text-[13px] font-semibold text-gray-new-60':
                      theme === 'black-new' || theme === 'gray-8',
                  },
                  isNewTheme
                    ? 'text-[13px] font-semibold tracking-normal text-white'
                    : 'text-sm font-bold tracking-wider dark:text-gray-new-60'
                )}
              >
                {heading}
              </span>
              <ul
                className={clsx(
                  'flex grow flex-col',
                  isNewTheme ? 'mt-7 gap-y-5' : 'mt-6 gap-y-[18px]'
                )}
              >
                {links.map(({ to, text, icon }, index) => {
                  const isExternalUrl = to.startsWith('http');
                  return (
                    <li className="flex" key={index}>
                      <Link
                        className={clsx(
                          'group relative flex items-center gap-2 whitespace-nowrap leading-none',
                          isNewTheme && 'tracking-extra-tight'
                        )}
                        to={to}
                        theme={styles.menuLinkTheme[theme]}
                        target={isExternalUrl ? '_blank' : null}
                        rel={isExternalUrl ? 'noopener noreferrer' : null}
                      >
                        {icon && (
                          <span
                            className={clsx(
                              icon,
                              'inline-block h-4 w-4 transition-colors duration-200 group-hover:bg-primary-2',
                              styles.icon[theme]
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
  isDocPage: PropTypes.bool,
  withTopBorder: PropTypes.bool,
  theme: PropTypes.oneOf(['white', 'black', 'black-new', 'black-pure', 'gray-8']),
};

export default Footer;
