import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import ThemeSelect from 'components/shared/footer/theme-select';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import StatusBadge from './status-badge';

const Footer = ({ hasThemesSupport = false }) => (
  <footer className="safe-paddings relative z-30 mt-auto border-t border-gray-new-90 bg-white dark:border-gray-new-20 dark:bg-black-pure">
    <Container className="flex justify-between gap-x-10 py-12 xl:py-8 sm:py-5" size="1600">
      <div className="flex flex-col items-start lg:w-full">
        <div className="mb-auto lg:mb-11">
          <Logo className="sm:h-6" width={102} height={28} />
          <span
            className={clsx(
              'mt-3.5 block whitespace-nowrap text-[13px] leading-none tracking-extra-tight',
              'text-gray-new-40 dark:text-gray-new-60',
              'xl:mt-3'
            )}
          >
            A Databricks Company
          </span>
        </div>

        {hasThemesSupport && <ThemeSelect className="mb-8 lg:mb-6" />}

        <div className="flex flex-col items-start justify-between gap-y-5 lg:w-full lg:flex-row sm:flex-col">
          <StatusBadge />
          <p
            className={clsx(
              'flex gap-x-1 gap-y-1.5 text-[13px] leading-none tracking-extra-tight text-gray-new-40',
              '2xl:flex-col lg:flex-row sm:flex-col'
            )}
          >
            <span>Made in SF and the World.</span>
            <span>Copyright Ⓒ 2022 – {new Date().getFullYear()} Neon, LLC</span>
          </p>
        </div>
      </div>

      <div className="flex w-fit gap-x-[88px] xl:gap-x-6 lg:hidden">
        {MENUS.footer.map(({ heading, items }, index) => (
          <div className="grid content-start gap-y-7" key={index}>
            <span className="text-[10px] uppercase leading-none text-gray-new-10 dark:text-white">
              {heading}
            </span>
            <ul className="flex flex-col gap-y-5">
              {items.map(({ to, text, description, icon, links }, index) => {
                const Tag = to ? Link : 'div';
                const isExternalUrl = to?.startsWith('http');
                const hasSubmenu = links?.length > 0;

                return (
                  <li
                    key={index}
                    className={clsx(
                      '-my-px flex min-w-[148px] py-px',
                      hasSubmenu && 'group relative [perspective:2000px]'
                    )}
                  >
                    <Tag
                      className={clsx(
                        'group/link relative -my-px flex cursor-pointer items-center whitespace-nowrap rounded-sm py-px',
                        'text-[15px] leading-none tracking-extra-tight text-gray-new-40',
                        'transition-colors duration-200 hover:text-black-pure',
                        'dark:text-gray-new-60 dark:hover:text-white'
                      )}
                      to={to}
                      rel={isExternalUrl ? 'noopener noreferrer' : null}
                      target={isExternalUrl ? '_blank' : null}
                    >
                      {icon && (
                        <span
                          className={clsx(
                            icon,
                            'mr-2.5 inline-block size-4 bg-gray-new-30 dark:bg-gray-new-70',
                            'group-hover/link:bg-black-pure group-hover/link:dark:bg-white'
                          )}
                        />
                      )}
                      {text}
                      {description && (
                        <span
                          className={clsx(
                            'ml-1.5 py-px text-gray-new-70 dark:text-gray-new-40',
                            to &&
                              'transition-colors duration-200 group-hover/link:text-gray-new-10 group-hover/link:dark:text-gray-new-90'
                          )}
                        >
                          {description}
                        </span>
                      )}
                      {hasSubmenu && <ChevronIcon className="ml-0.5 opacity-80" />}
                    </Tag>
                    {hasSubmenu && (
                      <div
                        className={clsx(
                          'absolute bottom-full right-0 z-50 min-w-[230px] pb-2.5',
                          'pointer-events-none opacity-0',
                          'origin-bottom-right transition-[opacity,transform] duration-200 [transform:rotateX(12deg)_scale(0.9)]',
                          'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]',
                          'group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-focus-within:[transform:none]'
                        )}
                      >
                        <ul
                          className={clsx(
                            'flex w-full flex-col gap-y-1 border border-gray-new-80 bg-gray-new-98 p-2',
                            'dark:border-gray-new-20 dark:bg-[#0A0A0B]',
                            'shadow-[0px_10px_20px_0px_rgba(0,0,0,.06)] dark:shadow-[0px_8px_20px_0px_rgba(0,0,0,.4)]'
                          )}
                        >
                          {links.map(({ text, to }) => (
                            <li key={text}>
                              <Link
                                className="block whitespace-nowrap p-3 text-[15px] leading-dense tracking-extra-tight text-gray-new-10 transition-colors duration-200 hover:bg-gray-new-90 dark:text-gray-new-90 dark:hover:bg-gray-new-8"
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

Footer.propTypes = {
  hasThemesSupport: PropTypes.bool,
};

export default Footer;
