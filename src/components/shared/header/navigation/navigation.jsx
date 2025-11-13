'use client';

import clsx from 'clsx';
import { useContext } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';
import { TopbarContext } from 'contexts/topbar-context';
import ChevronIcon from 'icons/chevron-down.inline.svg';

const Navigation = () => {
  const { hasTopbar } = useContext(TopbarContext);

  return (
    <nav className="lg:hidden">
      <ul className="flex items-center gap-x-7 xl:gap-x-5">
        {MENUS.header.map(({ to, text, sections }, index) => {
          const Tag = to ? Link : Button;
          const hasSubmenu = sections?.length > 0;

          return (
            <li
              className={clsx('group/main-nav relative', {
                'before:absolute before:h-full before:w-3.5 xl:before:w-2.5':
                  index === 0 || index === 1,
                'before:left-full': index === 0,
                'before:right-full': index === 1,
              })}
              key={index}
            >
              <Tag
                className="flex items-center gap-x-1 whitespace-pre text-[15px] font-normal tracking-snug !text-gray-new-50 group-hover/main-nav:!text-white"
                to={to}
                theme="black"
                tagName="Navigation"
                analyticsOnHover={!to || undefined}
              >
                {text}
                {hasSubmenu && (
                  <ChevronIcon className="text-gray-new-50 opacity-60 group-hover/main-nav:text-white" />
                )}
              </Tag>
              {/* submenu */}
              {hasSubmenu && (
                <>
                  {/* Semi-transparent black overlay */}
                  <div
                    className={clsx(
                      'fixed inset-0 top-16 -z-10',
                      'pointer-events-none opacity-0 transition-opacity delay-150 duration-200',
                      'group-hover/main-nav:pointer-events-none group-hover/main-nav:opacity-100 group-hover/main-nav:delay-0',
                      'bg-black/80',
                      { 'top-[100px]': hasTopbar }
                    )}
                  />

                  <div
                    className={clsx(
                      '!fixed left-0 top-16 z-50 w-screen border-b border-gray-new-20 bg-black-pure',
                      'pointer-events-none opacity-0 transition-[opacity] delay-150 duration-200',
                      'group-hover/main-nav:pointer-events-auto group-hover/main-nav:visible group-hover/main-nav:opacity-100 group-hover/main-nav:delay-0',
                      { 'top-[100px]': hasTopbar }
                    )}
                  >
                    <Container size="1344">
                      <ul
                        className={clsx(
                          'flex gap-x-[136px] pb-16 pl-[calc(102px+92px)] pt-8 xl:pl-[calc(102px+40px)]',
                          'translate-x-4 opacity-0',
                          'transition-[transform,opacity] duration-300 ease-out',
                          'group-hover/main-nav:translate-x-0 group-hover/main-nav:opacity-100',
                          'before:absolute before:-top-6 before:left-0 before:h-10 before:w-full'
                        )}
                      >
                        {sections.map(({ title, items }, index) => {
                          if (!items || items.length === 0) return null;
                          const isFirstColumn = index === 0;

                          return (
                            <li className="" key={title}>
                              {title && (
                                <span className="mb-6 block text-[10px] font-medium uppercase leading-none tracking-snug text-gray-new-50">
                                  {title}
                                </span>
                              )}
                              <ul
                                className={clsx('flex flex-col gap-y-4', {
                                  'gap-y-5': isFirstColumn,
                                })}
                              >
                                {items.map(({ title, to, isExternal }) => (
                                  <li key={title}>
                                    <Link
                                      className={clsx(
                                        'block text-sm leading-none tracking-snug text-gray-new-80 transition-colors duration-200 hover:text-white',
                                        { '!text-2xl': isFirstColumn }
                                      )}
                                      to={to}
                                      isExternal={isExternal}
                                      tagName="Navigation"
                                      tagText={title}
                                    >
                                      {title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </Container>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
