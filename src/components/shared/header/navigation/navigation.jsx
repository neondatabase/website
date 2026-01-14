'use client';

import clsx from 'clsx';
import { useState, useRef, useEffect, useCallback } from 'react';

import Button from 'components/shared/button';
import MENUS from 'constants/menus.js';
import useClickOutside from 'hooks/use-click-outside';
import useIsTouchDevice from 'hooks/use-is-touch-device';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import Submenu from '../submenu';

const SUBMENU_LINK_CLASSNAME = 'main-navigation-submenu-link';

const Navigation = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);

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
          .querySelector(`.${SUBMENU_LINK_CLASSNAME}`)
          .focus();
      }
    }
  };

  const handleMenuClick = useCallback(
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

  const handleSubmenuNavigation = useCallback((containerIndex) => {
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
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [activeMenuIndex, handleEscapeKey]);

  useEffect(() => {
    if (submenuContainerRef.current) {
      const activePanel = submenuContainerRef.current.querySelector('[data-submenu-panel].active');
      const newHeight = activePanel ? activePanel.scrollHeight : 0;
      setContainerHeight(newHeight);
    }
  }, [activeMenuIndex]);

  return (
    <nav className="group/main-nav lg:hidden">
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
                className={clsx(
                  'group/main-nav-trigger relative flex items-center gap-x-1 whitespace-pre rounded-sm px-3.5 text-[15px] font-normal !leading-normal tracking-snug transition-colors duration-200 hover:!text-white group-hover/main-nav:text-gray-new-70 xl:px-2.5',
                  {
                    '-ml-3.5  xl:-ml-2.5 ': index === 0,
                    '-mr-3.5 xl:-mr-2.5': index === MENUS.header.length - 1,
                    '!text-white': isActive,
                    '!text-gray-new-70': activeMenuIndex !== null && !isActive,
                    'before:absolute before:top-0 before:h-10 before:w-full': hasSubmenu,
                  }
                )}
                ref={(el) => {
                  menuButtonRefs.current[index] = el;
                }}
                aria-haspopup={hasSubmenu ? 'menu' : undefined}
                aria-expanded={hasSubmenu ? isActive : undefined}
                aria-controls={hasSubmenu ? `submenu-${index}` : undefined}
                to={to}
                theme="black"
                tagName="Navigation"
                onKeyDown={(e) => handleMenuKeyDown(e, hasSubmenu, index)}
                onClick={handleMenuClick(hasSubmenu, index)}
              >
                {text}
                {hasSubmenu && (
                  <ChevronIcon
                    className={clsx(
                      'text-gray-new-70 opacity-60 transition-all duration-200 group-hover/main-nav-trigger:text-white',
                      { 'text-white': isActive }
                    )}
                    aria-hidden="true"
                  />
                )}
              </Button>
            </li>
          );
        })}
      </ul>

      <Submenu
        activeMenuIndex={activeMenuIndex}
        containerHeight={containerHeight}
        submenuContainerRef={submenuContainerRef}
        submenuLinkClassName={SUBMENU_LINK_CLASSNAME}
        handleSubmenuNavigation={handleSubmenuNavigation}
        handleSubmenuEnter={handleSubmenuEnter}
        handleSubmenuLeave={handleSubmenuLeave}
      />
    </nav>
  );
};

export default Navigation;
