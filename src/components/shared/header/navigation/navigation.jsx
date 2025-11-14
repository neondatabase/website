'use client';

import clsx from 'clsx';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';

const Navigation = () => (
  <nav className="main-navigation lg:hidden">
    <ul className="flex items-center gap-x-7 xl:gap-x-5">
      {MENUS.header.map(({ to, text, sections }, index) => {
        const Tag = to ? Link : Button;
        const hasSubmenu = sections?.length > 0;

        return (
          <li
            className={clsx({
              '-mr-3.5 pr-3.5 xl:-mr-2.5 xl:pr-2.5': index === 0,
              '-ml-3.5 pl-3.5 xl:-ml-2.5 xl:pl-2.5': index === 1,
              'group/main-nav': hasSubmenu,
            })}
            key={index}
          >
            <Tag
              className={clsx(
                'relative flex items-center gap-x-1 whitespace-pre text-[15px] font-normal tracking-snug !text-gray-new-50 group-hover/main-nav:!text-white',
                { 'before:absolute before:top-0 before:h-10 before:w-full': hasSubmenu }
              )}
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
              <div
                className={clsx(
                  '!absolute left-0 top-full z-50 -mt-px w-screen bg-black-pure',
                  'pointer-events-none opacity-0 transition-[opacity,grid-template-rows] delay-150 duration-200',
                  'group-hover/main-nav:pointer-events-auto group-hover/main-nav:visible group-hover/main-nav:opacity-100 group-hover/main-nav:delay-0',
                  'grid grid-rows-[0fr] group-hover/main-nav:grid-rows-[1fr]'
                )}
              >
                <Container size="1344" className="w-full overflow-hidden">
                  <ul
                    className={clsx(
                      'flex gap-x-[136px] pb-16 pl-[calc(102px+92px)] pt-8 xl:pl-[calc(102px+40px)]',
                      'opacity-0 transition-[opacity] duration-300 ease-out group-hover/main-nav:opacity-100'
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
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

export default Navigation;
