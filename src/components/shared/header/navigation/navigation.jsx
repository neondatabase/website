'use client';

import clsx from 'clsx';
import { useState, useRef, useEffect, useCallback } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';
import useClickOutside from 'hooks/use-click-outside';
import useIsTouchDevice from 'hooks/use-is-touch-device';
import ChevronIcon from 'icons/chevron-down.inline.svg';

const Navigation = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const submenuContainerRef = useRef(null);
  const timeoutRef = useRef(null);
  const menuButtonRefs = useRef([]);

  const isTouchDevice = useIsTouchDevice();

  const handleMenuEnter = (hasSubmenu, index) => {
    if (isKeyboardOpen || isTouchDevice) return;

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
    if (isKeyboardOpen) return;

    if (hasSubmenu || activeMenuIndex !== null) {
      timeoutRef.current = setTimeout(() => {
        setActiveMenuIndex(null);
      }, 100);
    }
  };

  const handleSubmenuEnter = () => {
    if (isKeyboardOpen) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleSubmenuLeave = () => {
    if (isKeyboardOpen) return;

    setActiveMenuIndex(null);
  };

  const handleMenuKeyDown = (e, hasSubmenu, index) => {
    if (!hasSubmenu) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();

      if (activeMenuIndex === index) {
        setActiveMenuIndex(null);
        setIsKeyboardOpen(false);
      } else {
        setActiveMenuIndex(index);
        setIsKeyboardOpen(true);
      }
    }
  };

  const handleMenuClick = useCallback(
    (e, hasSubmenu, index) => {
      if (hasSubmenu) {
        e.preventDefault();
        if (activeMenuIndex === index) {
          setActiveMenuIndex(null);
          setIsKeyboardOpen(false);
        } else {
          setActiveMenuIndex(index);
          setIsKeyboardOpen(true);
        }
      }
    },
    [activeMenuIndex]
  );

  const handleEscapeKey = useCallback(
    (e) => {
      if (e.key === 'Escape' && activeMenuIndex !== null) {
        e.preventDefault();
        setActiveMenuIndex(null);
        setIsKeyboardOpen(false);

        if (menuButtonRefs.current[activeMenuIndex]) {
          menuButtonRefs.current[activeMenuIndex].focus();
        }
      }
    },
    [activeMenuIndex]
  );

  useClickOutside([submenuContainerRef, ...menuButtonRefs.current.filter(Boolean)], () => {
    if (activeMenuIndex !== null) {
      setActiveMenuIndex(null);
      setIsKeyboardOpen(false);
    }
  });

  useEffect(() => {
    if (activeMenuIndex !== null && !isKeyboardOpen) {
      setIsKeyboardOpen(false);
    }
  }, [activeMenuIndex, isKeyboardOpen]);

  useEffect(() => {
    if (activeMenuIndex !== null) {
      document.addEventListener('keydown', handleEscapeKey);

      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [activeMenuIndex, handleEscapeKey]);

  useEffect(() => {
    if (submenuContainerRef.current) {
      const activePanel = submenuContainerRef.current.querySelector('[data-submenu-panel].active');
      const newHeight = activePanel ? activePanel.scrollHeight : 0;
      setContainerHeight(newHeight);
    }
  }, [activeMenuIndex]);

  return (
    <nav className="main-navigation lg:hidden">
      <ul className="flex items-center">
        {MENUS.header.map(({ to, text, sections }, index) => {
          const hasSubmenu = sections?.length > 0;
          const isActive = activeMenuIndex === index;

          return (
            <li
              key={text}
              onMouseEnter={() => handleMenuEnter(hasSubmenu, index)}
              onMouseLeave={() => handleMenuLeave(hasSubmenu)}
            >
              <Button
                ref={(el) => {
                  if (hasSubmenu) {
                    menuButtonRefs.current[index] = el;
                  }
                }}
                className={clsx(
                  'relative flex items-center gap-x-1 whitespace-pre rounded-sm px-3.5 text-[15px] font-normal !leading-normal tracking-snug transition-colors duration-200  hover:!text-white focus-visible:outline-[revert] xl:px-2.5',
                  {
                    '-ml-3.5  xl:-ml-2.5 ': index === 0,
                    '-mr-3.5 xl:-mr-2.5': index === MENUS.header.length - 1,
                    '!text-white': activeMenuIndex === null || isActive,
                    '!text-gray-new-70': activeMenuIndex !== null && !isActive,
                    'before:absolute before:top-0 before:h-10 before:w-full': hasSubmenu,
                  }
                )}
                aria-haspopup={hasSubmenu ? 'menu' : undefined}
                aria-expanded={hasSubmenu ? isActive : undefined}
                aria-controls={hasSubmenu ? `submenu-${index}` : undefined}
                to={to}
                theme="black"
                tagName="Navigation"
                onKeyDown={(e) => handleMenuKeyDown(e, hasSubmenu, index)}
                onClick={isTouchDevice ? (e) => handleMenuClick(e, hasSubmenu, index) : undefined}
              >
                {text}
                {hasSubmenu && (
                  <ChevronIcon
                    className={clsx('transition-all duration-200', {
                      'text-white opacity-100': isActive,
                      'text-gray-new-70 opacity-60 group-hover/main-nav:text-white': !isActive,
                    })}
                    aria-hidden="true"
                  />
                )}
              </Button>
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
            'pointer-events-none': activeMenuIndex === null,
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
                role="region"
                className={clsx(
                  'absolute left-0 top-0 w-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                  isActive ? 'active opacity-100' : 'pointer-events-none opacity-0'
                )}
                aria-hidden={!isActive}
                data-submenu-panel
              >
                {sections.length > 0 && (
                  <Container size="1344" className="w-full overflow-hidden">
                    <ul
                      className="flex gap-x-[136px] pb-16 pl-[calc(102px+92px)] pt-8 xl:pl-[calc(102px+40px)]"
                      role="menu"
                    >
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
                            className={clsx(
                              'group flex flex-col',
                              sectionIndex === 0 ? 'gap-y-5' : 'gap-y-4'
                            )}
                            role="group"
                            aria-labelledby={
                              title ? `submenu-${index}-section-${sectionIndex}` : undefined
                            }
                          >
                            {items?.map(({ title, to, isExternal }) => (
                              <li key={title} role="none">
                                <Link
                                  className={clsx(
                                    'main-navigation-submenu-link flex leading-none tracking-snug  transition-colors duration-200 hover:!text-white group-hover:text-gray-new-70',
                                    sectionIndex === 0
                                      ? '-my-2.5 py-2.5 text-2xl text-white'
                                      : '-my-2 py-2 text-sm text-gray-new-70'
                                  )}
                                  to={to}
                                  isExternal={isExternal}
                                  tagName="Navigation"
                                  tagText={title}
                                  role="menuitem"
                                  tabIndex={isActive ? 0 : -1}
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
