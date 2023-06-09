'use client';

import clsx from 'clsx';
import { motion, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import Item from 'components/pages/doc/sidebar/item';
import useBodyLockScroll from 'hooks/use-body-lock-scroll';
import useClickOutside from 'hooks/use-click-outside';
import useWindowSize from 'hooks/use-window-size';
import ChevronRight from 'icons/chevron-right.inline.svg';

import { sidebarPropTypes } from '../sidebar/sidebar';

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

  // 146px is the height of top banner + header + button Documentation menu
  useEffect(() => {
    setContainerHeight(`${height - 146}px`);
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

      <motion.ul
        className={clsx(
          'absolute inset-x-0 top-[calc(100%+1px)] z-20 overflow-y-scroll bg-white pb-4 pl-8 pr-[29px] pt-2 dark:bg-gray-new-10 md:pl-4 md:pr-[13px]'
        )}
        initial="from"
        animate={controls}
        variants={variants}
        style={{ height: containerHeight }}
      >
        {sidebar.map((item, index) => (
          <Item {...item} currentSlug={currentSlug} key={index} />
        ))}
      </motion.ul>
    </nav>
  );
};

MobileNav.propTypes = {
  className: PropTypes.string,
  sidebar: sidebarPropTypes,
  currentSlug: PropTypes.string.isRequired,
};

export default MobileNav;
