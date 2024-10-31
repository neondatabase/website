'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { getActiveItems } from 'components/pages/doc/sidebar/sidebar';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import { HOME_MENU_ITEM } from 'constants/docs';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';
import useClickOutside from 'hooks/use-click-outside';
import useWindowSize from 'hooks/use-window-size';
import ChevronRight from 'icons/chevron-right.inline.svg';

import Menu from '../menu';

const ANIMATION_DURATION = 0.2;
const MOBILE_NAV_HEIGHT = 44;

const variants = {
  from: {
    opacity: 0,
    translateY: 10,
    transition: {
      duration: ANIMATION_DURATION,
    },
    transitionEnd: {
      zIndex: -1,
    },
  },
  to: {
    zIndex: 20,
    opacity: 1,
    translateY: 0,
    transition: {
      duration: ANIMATION_DURATION,
    },
  },
};

const MobileNav = ({ className = null, sidebar, slug, basePath, customName, customType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [wrapperHeight, setWrapperHeight] = useState(null);
  const [menuHeight, setMenuHeight] = useState(1000);
  const [buttonTop, setButtonTop] = useState(null);

  const { height } = useWindowSize();
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const controls = useAnimation();

  const pathname = usePathname();
  const currentSlug = pathname.replace(basePath, '');
  const [activeMenuList, setActiveMenuList] = useState([
    HOME_MENU_ITEM,
    ...getActiveItems(sidebar, currentSlug),
  ]);

  const toggleMenu = () => setIsOpen((isOpen) => !isOpen);
  const closeMenu = () => setIsOpen(false);
  useBodyLockScroll(isOpen);

  const onOutsideClick = () => {
    setIsOpen(false);
  };

  useClickOutside([wrapperRef], onOutsideClick);

  const checkSlugInActiveMenu = (currentSlug, activeMenuList, items) => {
    const activeMenu = activeMenuList[activeMenuList.length - 1];
    const isSlugActiveMenu = activeMenu.slug === currentSlug;

    const isSlugInActiveMenu = (items) =>
      items.some(
        (item) =>
          (item.title === activeMenu.title &&
            item.items?.some((subItem) => subItem.slug === currentSlug)) ||
          (item.items && isSlugInActiveMenu(item.items))
      );

    return isSlugActiveMenu || isSlugInActiveMenu(items);
  };

  useEffect(() => {
    const onScroll = () => {
      if (isOpen) {
        setButtonTop(buttonRef.current.getBoundingClientRect().top);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setButtonTop(buttonRef.current.getBoundingClientRect().top);
      setWrapperHeight(height - buttonTop - MOBILE_NAV_HEIGHT);
    }
  }, [height, isOpen, buttonTop]);

  useEffect(() => {
    if (isOpen) {
      controls.start('to');
    } else {
      controls.start('from');
    }
  }, [controls, isOpen]);

  useEffect(() => {
    if (!checkSlugInActiveMenu(currentSlug, activeMenuList, sidebar)) {
      setActiveMenuList([HOME_MENU_ITEM, ...getActiveItems(sidebar, currentSlug)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug]);

  return (
    <nav
      className={clsx(
        'safe-paddings relative border-y border-gray-new-90 bg-gray-new-98 dark:border-gray-new-15/70 dark:bg-gray-new-8',
        className
      )}
      ref={wrapperRef}
    >
      <button
        className="relative z-10 flex w-full cursor-pointer appearance-none justify-start bg-gray-new-98 py-[9px] outline-none transition-colors dark:bg-gray-new-8 lg:px-8 md:px-4"
        type="button"
        ref={buttonRef}
        onClick={toggleMenu}
      >
        <span className="text-ellipsis">{customName || 'Documentation'} menu</span>
        <ChevronRight
          className={clsx(
            'absolute right-[37px] top-1/2 -translate-y-1/2 rotate-90 transition-transform duration-200 md:right-5',
            isOpen && 'rotate-[270deg]'
          )}
          aria-hidden
        />
      </button>
      <LazyMotion features={domAnimation}>
        <m.div
          className={clsx(
            'absolute inset-x-0 top-[calc(100%+1px)] z-20 overflow-x-hidden overflow-y-scroll bg-white dark:bg-gray-new-8'
          )}
          initial="from"
          animate={controls}
          variants={variants}
          style={{ height: wrapperHeight }}
        >
          <InkeepTrigger className="lg:hidden" topOffset={wrapperHeight || menuHeight} />
          <div className="relative w-full overflow-hidden" style={{ height: menuHeight }}>
            <Menu
              depth={0}
              title="Home"
              basePath={basePath}
              slug={slug}
              items={sidebar}
              closeMobileMenu={closeMenu}
              setMenuHeight={setMenuHeight}
              menuWrapperRef={wrapperRef}
              activeMenuList={activeMenuList}
              setActiveMenuList={setActiveMenuList}
              customType={
                customType
                  ? {
                      title: `Back to ${customType.title}`,
                      link: customType.link,
                    }
                  : null
              }
            />
          </div>
        </m.div>
      </LazyMotion>
    </nav>
  );
};

MobileNav.propTypes = {
  className: PropTypes.string,
  sidebar: PropTypes.arrayOf(PropTypes.shape()),
  slug: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  customName: PropTypes.string,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
};

export default MobileNav;
