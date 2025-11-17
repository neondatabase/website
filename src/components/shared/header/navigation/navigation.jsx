'use client';

import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';
import ChevronIcon from 'icons/chevron-down.inline.svg';

const Navigation = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const submenuContainerRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMenuEnter = (hasSubmenu, index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (hasSubmenu === null) {
      setActiveMenuIndex(null);
      return;
    }

    setActiveMenuIndex(index);
  };

  const handleMenuLeave = (hasSubmenu) => {
    if (hasSubmenu || activeMenuIndex) {
      timeoutRef.current = setTimeout(() => {
        setActiveMenuIndex(null);
      }, 100);
    }
  };

  const handleSubmenuEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleSubmenuLeave = () => {
    setActiveMenuIndex(null);
  };

  useEffect(() => {
    if (submenuContainerRef.current) {
      const activePanel = submenuContainerRef.current.querySelector('[data-submenu-panel].active');
      const newHeight = activePanel ? activePanel.scrollHeight : 0;
      setContainerHeight(newHeight);
    }
  }, [activeMenuIndex]);

  return (
    <nav className="main-navigation lg:hidden">
      <ul className="flex items-center gap-x-7 xl:gap-x-5">
        {MENUS.header.map(({ to, text, sections }, index) => {
          const Tag = to ? Link : Button;
          const hasSubmenu = sections?.length > 0;
          const isActive = activeMenuIndex === index;

          return (
            <li
              key={text}
              className={clsx({
                '-mr-3.5 pr-3.5 xl:-mr-2.5 xl:pr-2.5': index === 0,
                '-ml-3.5 pl-3.5 xl:-ml-2.5 xl:pl-2.5': index === 1,
                'group/main-nav': hasSubmenu,
              })}
              onMouseEnter={() => handleMenuEnter(hasSubmenu, index)}
              onMouseLeave={() => handleMenuLeave(hasSubmenu)}
            >
              <Tag
                className={clsx(
                  'relative flex items-center gap-x-1 whitespace-pre text-[15px] font-normal tracking-snug  transition-colors duration-200 hover:!text-white',
                  {
                    '!text-white': activeMenuIndex === null || isActive,
                    '!text-gray-new-50': activeMenuIndex !== null && !isActive,
                    'before:absolute before:top-0 before:h-10 before:w-full': hasSubmenu,
                  }
                )}
                aria-haspopup={hasSubmenu}
                aria-expanded={isActive}
                aria-controls={hasSubmenu ? `submenu-${index}` : undefined}
                to={to}
                theme="black"
                tagName="Navigation"
              >
                {text}
                {hasSubmenu && (
                  <ChevronIcon
                    className={clsx('transition-all duration-200', {
                      'text-white opacity-100': isActive,
                      'text-gray-new-50 opacity-60 group-hover:text-white': !isActive,
                    })}
                  />
                )}
              </Tag>
            </li>
          );
        })}
      </ul>

      {/* Shared submenu container */}
      <div
        className={clsx(
          'main-navigation-submenu absolute left-0 top-full z-40 -m-px w-screen overflow-hidden bg-black-pure',
          'transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          {
            'pointer-events-none': !activeMenuIndex,
            '!pointer-events-auto': activeMenuIndex !== null,
          }
        )}
        style={{ height: `${containerHeight}px` }}
        onMouseEnter={handleSubmenuEnter}
        onMouseLeave={handleSubmenuLeave}
      >
        <div ref={submenuContainerRef} className="relative w-full">
          {MENUS.header.map((menu, index) => {
            const isActive = activeMenuIndex === index;
            const sections = menu.sections || [];

            return (
              <div
                key={index}
                id={`submenu-${index}`}
                className={clsx(
                  'absolute left-0 top-0 w-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                  isActive ? 'active opacity-100' : 'pointer-events-none opacity-0'
                )}
                aria-hidden={!isActive}
                data-submenu-panel
              >
                {sections.length > 0 && (
                  <Container size="1344" className="w-full overflow-hidden">
                    <ul className="flex gap-x-[136px] pb-16 pl-[calc(102px+92px)] pt-8 xl:pl-[calc(102px+40px)]">
                      {sections.map(({ title, items }, sectionIndex) => (
                        <li key={sectionIndex}>
                          {title && (
                            <span className="mb-6 block text-[10px] font-medium uppercase leading-none tracking-snug text-gray-new-50">
                              {title}
                            </span>
                          )}
                          <ul
                            className={clsx(
                              'group flex flex-col',
                              sectionIndex === 0 ? 'gap-y-5' : 'gap-y-4'
                            )}
                          >
                            {items?.map(({ title, to, isExternal }) => (
                              <li key={title}>
                                <Link
                                  className={clsx(
                                    'main-navigation-submenu-link block leading-none tracking-snug text-white transition-colors duration-200 hover:!text-white group-hover:text-gray-new-80',
                                    sectionIndex === 0 ? 'text-2xl' : 'text-sm'
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
                      ))}
                    </ul>
                  </Container>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
