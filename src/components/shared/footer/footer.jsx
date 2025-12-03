'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import ThemeSelect from 'components/shared/footer/theme-select';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import StatusBadge from './status-badge/status-badge';

const Footer = ({ hasThemesSupport = false, isDocsPage = false }) => (
  <footer className="safe-paddings relative z-50 mt-auto border-t border-gray-new-80 bg-white dark:border-gray-new-20 dark:bg-black-pure">
    <Container
      className={clsx('flex justify-between gap-x-10 py-12 xl:py-8 sm:py-5', {
        '!pb-20': isDocsPage,
      })}
      size="1600"
    >
      <div className="flex flex-col items-start lg:w-full">
        <div className="mb-auto lg:mb-11">
          <Logo className="sm:h-6" width={102} height={28} />
        </div>

        {hasThemesSupport && <ThemeSelect className="mb-8 lg:mb-6" />}

        <div className="flex flex-col items-start justify-between gap-y-5 lg:w-full lg:flex-row sm:flex-col">
          <StatusBadge />
          <small className="flex flex-wrap gap-x-1 gap-y-1.5 whitespace-nowrap text-[13px] leading-none tracking-extra-tight text-gray-new-40 xl:flex-col lg:flex-row sm:flex-col">
            <span>Made in SF and the World</span>
            <span>Copyright Ⓒ 2022 – {new Date().getFullYear()} Neon, Inc.</span>
          </small>
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
                      'flex min-w-[148px]',
                      hasSubmenu && 'group relative [perspective:2000px]'
                    )}
                  >
                    <Tag
                      className="group/link relative flex items-center whitespace-nowrap text-[15px] leading-none tracking-extra-tight text-gray-new-40 transition-colors duration-200 hover:text-black-pure dark:text-gray-new-60 hover:dark:text-white"
                      to={to}
                      rel={isExternalUrl ? 'noopener noreferrer' : null}
                      target={isExternalUrl ? '_blank' : null}
                    >
                      {icon && (
                        <span
                          className={clsx(
                            icon,
                            'mr-2.5 inline-block size-4 bg-gray-new-30 group-hover/link:bg-black-pure dark:bg-gray-new-70 group-hover/link:dark:bg-white'
                          )}
                        />
                      )}
                      {text}
                      {description && (
                        <span
                          className={clsx(
                            'ml-1.5 text-gray-new-70 dark:text-gray-new-40',
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
                          'absolute bottom-full right-0 min-w-[230px] pb-2.5',
                          'pointer-events-none opacity-0',
                          'origin-bottom-right transition-[opacity,transform] duration-200 [transform:rotateX(12deg)_scale(0.9)]',
                          'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]'
                        )}
                      >
                        <ul className="flex w-full flex-col gap-y-1 border border-gray-new-80 bg-gray-new-98 p-2 shadow-[0px_10px_20px_0px_rgba(0,0,0,.06)] dark:border-gray-new-20 dark:bg-[#0A0A0B] dark:shadow-[0px_8px_20px_0px_rgba(0,0,0,.4)]">
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
  isDocsPage: PropTypes.bool,
};

export default Footer;
