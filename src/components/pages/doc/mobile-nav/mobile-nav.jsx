'use client';

import clsx from 'clsx';
import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import Item from 'components/pages/doc/sidebar/item';
import Link from 'components/shared/link/link';
import MENUS from 'constants/menus';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';
import useClickOutside from 'hooks/use-click-outside';
import useWindowSize from 'hooks/use-window-size';
import ChevronRight from 'icons/chevron-right.inline.svg';

import { sidebarPropTypes } from '../sidebar/sidebar';
import { ChatWidgetTrigger } from '../chat-widget';

const ANIMATION_DURATION = 0.2;

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

const MobileNav = ({ className = null, sidebar, currentSlug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [containerHeight, setContainerHeight] = useState(null);
  const { height } = useWindowSize();
  const wrapperRef = useRef(null);
  const controls = useAnimation();
  const toggleMenu = () => setIsOpen((isOpen) => !isOpen);
  useBodyLockScroll(isOpen);

  const onOutsideClick = () => {
    setIsOpen(false);
  };

  useClickOutside([wrapperRef], onOutsideClick);

  // 145px is the height of top banner + header + button Documentation menu
  useEffect(() => {
    setContainerHeight(`${height - 145}px`);
  }, [height]);

  useEffect(() => {
    if (isOpen) {
      controls.start('to');
    } else {
      controls.start('from');
    }
  }, [controls, isOpen]);
  return (
    <nav
      className={clsx(
        'safe-paddings relative border-b border-gray-new-90 bg-gray-new-98 dark:border-gray-new-20 dark:bg-gray-new-8',
        className
      )}
      ref={wrapperRef}
    >
      <button
        className="relative z-10 flex w-full cursor-pointer appearance-none justify-start text-ellipsis bg-gray-new-98 py-2.5 outline-none transition-colors duration-200 hover:bg-gray-new-94 active:bg-gray-new-94 dark:bg-gray-new-15 lg:px-8 md:px-4"
        type="button"
        onClick={toggleMenu}
      >
        <span>Documentation menu</span>
        <ChevronRight
          className="absolute right-[37px] top-1/2 -translate-y-1/2 rotate-90 md:right-5"
          aria-hidden
        />
      </button>

      <motion.div
        className={clsx(
          'absolute inset-x-0 top-[calc(100%+1px)] z-20 overflow-y-scroll bg-white pb-4 pl-8 pr-[29px] pt-2 dark:bg-gray-new-10 md:pl-4 md:pr-[13px]'
        )}
        initial="from"
        animate={controls}
        variants={variants}
        style={{ height: containerHeight }}
      >
        <ChatWidgetTrigger className="mb-3.5 mt-[18px] flex" isSidebar />
        <ul>
          {MENUS.docSidebar.map(({ icon: Icon, title, slug }, index) => (
            <li className="py-[7px] first:pt-0 last:pb-0" key={index}>
              <Link className="group flex items-center space-x-3" to={slug}>
                <span className="relative flex h-6 w-6 items-center justify-center rounded bg-[linear-gradient(180deg,#EFEFF0_100%,#E4E5E7_100%)] before:absolute before:inset-px before:rounded-[3px] before:bg-[linear-gradient(180deg,#FFF_100%,#FAFAFA_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_31.25%,rgba(255,255,255,0.05)_100%)] dark:before:bg-[linear-gradient(180deg,#242628_31.25%,#1D1E20_100%)]">
                  <Icon className="relative z-10 h-3 w-3 text-gray-new-30 dark:text-gray-new-80" />
                </span>
                <span className="text-sm font-medium leading-tight transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-green-45">
                  {title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-7">
          {sidebar.map((item, index) => (
            <Item {...item} currentSlug={currentSlug} key={index} />
          ))}
        </ul>
      </motion.div>
    </nav>
  );
};

MobileNav.propTypes = {
  className: PropTypes.string,
  sidebar: sidebarPropTypes,
  currentSlug: PropTypes.string.isRequired,
};

export default MobileNav;
