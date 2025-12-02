'use client';

import clsx from 'clsx';
import { useState, useRef, useEffect, useCallback } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import MENUS from 'constants/menus.js';
import useClickOutside from 'hooks/use-click-outside';
import useIsTouchDevice from 'hooks/use-is-touch-device';
import ArrowTopRightIcon from 'icons/arrow-top-right.inline.svg';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import MenuBanner from '../menu-banner';

const SUBMENU_SELECTOR_NAME = 'main-navigation-submenu-link';

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

    if (!hasSubmenu) {
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
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % MENUS.header.length;
      menuButtonRefs.current[nextIndex].focus();
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + MENUS.header.length) % MENUS.header.length;
      menuButtonRefs.current[prevIndex].focus();
    }

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

    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      if (activeMenuIndex === index && submenuContainerRef.current) {
        e.preventDefault();
        submenuContainerRef.current
          .querySelector(`#submenu-${index}`)
          .querySelector(`.${SUBMENU_SELECTOR_NAME}`)
          .focus();
      }
    }
  };

  const makeHandleMenuClick = useCallback(
    (hasSubmenu, index) => (e) => {
      if (!hasSubmenu) return;

      if (isTouchDevice) {
        e.preventDefault();
        if (activeMenuIndex === index) {
          setActiveMenuIndex(null);
          setIsKeyboardOpen(false);
        } else {
          setActiveMenuIndex(index);
          setIsKeyboardOpen(true);
        }
      }

      if (!isTouchDevice) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [activeMenuIndex, isTouchDevice]
  );

  const handleEscapeKey = useCallback(
    (e) => {
      if (e.key === 'Escape' && activeMenuIndex !== null) {
        e.preventDefault();
        setActiveMenuIndex(null);
        setIsKeyboardOpen(false);

        const currentlyFocused = document.activeElement;
        const submenuPanel = document.getElementById(`submenu-${activeMenuIndex}`);

        if (!submenuPanel || !submenuPanel.contains(currentlyFocused)) return;
        if (menuButtonRefs.current[activeMenuIndex]) {
          menuButtonRefs.current[activeMenuIndex].focus();
        }
      }
    },
    [activeMenuIndex]
  );

  const makeHandleSubmenuNavigation = useCallback((containerIndex) => {
    let links;

    if (submenuContainerRef.current) {
      links = submenuContainerRef.current
        .querySelector(`#submenu-${containerIndex}`)
        .querySelectorAll('.main-navigation-submenu-link');
    }

    if (!links || links.length === 0) return () => {};
    if (!menuButtonRefs.current[containerIndex]) return () => {};

    let linkIndex = -1;
    return (e) => {
      const menuTrigger = menuButtonRefs.current[containerIndex];
      const nextMenuTrigger = menuButtonRefs.current[containerIndex + 1] || null;

      if (linkIndex === -1) {
        links.forEach((link, idx) => {
          if (link === e.target) {
            linkIndex = idx;
          }
        });
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = linkIndex + 1;
        if (nextIndex >= links.length) return;
        links[nextIndex].focus();
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = linkIndex - 1;

        if (linkIndex === 0) {
          menuTrigger.focus();
        } else {
          links[prevIndex].focus();
        }
      }

      if (e.key === 'Tab') {
        if (linkIndex === 0 && e.shiftKey) {
          e.preventDefault();
          menuTrigger.focus();
        }
        const nextIndex = linkIndex + 1;
        if (nextIndex >= links.length && nextMenuTrigger) {
          e.preventDefault();
          nextMenuTrigger.focus();
        }
      }
    };
  }, []);

  useClickOutside([submenuContainerRef, ...menuButtonRefs.current.filter(Boolean)], (e) => {
    if (e.target === menuButtonRefs.current[activeMenuIndex]) return;

    if (activeMenuIndex !== null) {
      setActiveMenuIndex(null);
      setIsKeyboardOpen(false);
    }
  });

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
                  menuButtonRefs.current[index] = el;
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
                onClick={makeHandleMenuClick(hasSubmenu, index)}
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
          'main-navigation-submenu absolute left-0 top-full z-40 -m-px w-full overflow-hidden bg-black-pure',
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
            const isProduct = menu.text === 'Product';

            return (
              <div
                key={index}
                id={`submenu-${index}`}
                role="navigation"
                aria-label={menu.text}
                className={clsx(
                  'absolute left-0 top-0 w-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                  isActive ? 'active opacity-100' : 'pointer-events-none opacity-0'
                )}
                aria-hidden={!isActive}
                data-submenu-panel
              >
                {sections.length > 0 && (
                  <Container
                    size="1600"
                    className="flex w-full gap-x-[160px] overflow-hidden pb-12 pt-7 xl:gap-x-8"
                  >
                    <ul
                      className="flex gap-x-[128px] pl-[calc(102px+92px+2px)] pt-1 xl:gap-x-5 xl:pl-[calc(102px+40px)]"
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
                            className="flex flex-col gap-y-6"
                            role="group"
                            aria-labelledby={
                              title ? `submenu-${index}-section-${sectionIndex}` : undefined
                            }
                          >
                            {items?.map(({ title, description, to, isExternal }) => (
                              <li key={title} role="none">
                                <Link
                                  className={`group ${SUBMENU_SELECTOR_NAME} -mx-1 -my-3 grid min-w-[224px] gap-y-2 px-1 py-3 text-[13px] leading-tight tracking-snug text-gray-new-60`}
                                  to={to}
                                  isExternal={isExternal}
                                  tagName="Navigation"
                                  tagText={title}
                                  role="menuitem"
                                  tabIndex={isActive ? 0 : -1}
                                  onKeyDown={makeHandleSubmenuNavigation(index)}
                                >
                                  <span className="flex items-baseline gap-x-1.5 text-lg font-medium leading-none text-white">
                                    {title}
                                    <ArrowTopRightIcon
                                      width={12}
                                      height={12}
                                      className="-translate-x-2 scale-75 text-black-pure opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 dark:text-white"
                                    />
                                  </span>
                                  {description}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                    {isProduct && (
                      <MenuBanner
                        linkProps={{
                          className: SUBMENU_SELECTOR_NAME,
                          role: 'menuitem',
                          tabIndex: isActive ? 0 : -1,
                          onKeyDown: makeHandleSubmenuNavigation(index),
                        }}
                      />
                    )}
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
