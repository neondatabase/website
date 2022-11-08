import clsx from 'clsx';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useOnClickOutside from 'hooks/use-click-outside';
import useDarkMode from 'hooks/use-dark-mode';
import useLocalStorage from 'hooks/use-local-storage';

import ChevronsIcon from '../images/chevrons.inline.svg';
import ThemeIcon from '../images/switcher.inline.svg';

const ANIMATION_DURATION = 0.2;
const themes = ['system', 'light', 'dark'];

const isSystemDarkMode =
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const dropdownVariants = {
  hidden: { opacity: 0, y: '0', height: 0, pointerEvents: 'none', visibility: 'hidden' },
  visible: {
    opacity: 1,
    y: '0',
    height: 'auto',
    pointerEvents: 'auto',
    visibility: 'visible',
    transition: {
      duration: ANIMATION_DURATION,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: ANIMATION_DURATION,
    },
  },
};

const ActiveThemeIcon = ({ theme }) => {
  if (theme === 'system') {
    return <ThemeIcon />;
  }
  return (
    <span
      className={clsx(
        'inline-flex h-4 w-4 rounded-full',
        theme === 'dark' && 'border border-black bg-black dark:border-[#D9D9D9] dark:bg-[#D9D9D9]',
        theme === 'light' && 'border border-gray-6 bg-white dark:border-transparent'
      )}
    />
  );
};

ActiveThemeIcon.propTypes = {
  theme: PropTypes.string,
};

ActiveThemeIcon.defaultProps = {
  theme: '',
};

const ThemeSelect = ({ className }) => {
  const [, setDarkMode] = useDarkMode();
  const [storageTheme, setStorageTheme] = useLocalStorage('theme');
  const [theme, setTheme] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = useCallback(() => {
    setShowDropdown(false);
  }, [setShowDropdown]);

  useOnClickOutside([dropdownRef], handleClickOutside);

  useEffect(() => {
    const initTheme = storageTheme || 'system';

    setTheme(initTheme);
  }, [storageTheme]);

  const handleSelect = (value) => {
    const newTheme = value;
    setTheme(newTheme);
    setStorageTheme(newTheme);
    setShowDropdown(false);

    if (newTheme === 'dark' || (newTheme === 'system' && isSystemDarkMode)) {
      setDarkMode(true);
      document.documentElement.classList.add('disable-transition');
      setTimeout(() => document.documentElement.classList.remove('disable-transition'), 0);
    } else {
      setDarkMode(false);
      document.documentElement.classList.add('disable-transition');
      setTimeout(() => document.documentElement.classList.remove('disable-transition'), 0);
    }
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (!theme) return null;

  return (
    <div className={clsx('relative h-8 w-36', className)}>
      <div
        className={clsx(
          'absolute bottom-0 z-10 w-36 items-center rounded border border-gray-7 bg-white text-sm leading-none transition-shadow duration-200 md:bottom-auto md:top-0 md:flex md:flex-col-reverse',
          showDropdown && 'shadow-select dark:shadow-none'
        )}
        ref={dropdownRef}
      >
        <motion.ul
          className="w-full"
          initial="hidden"
          animate={showDropdown ? 'visible' : 'hidden'}
          variants={dropdownVariants}
        >
          {themes
            .filter((item) => item !== theme)
            .map((item, index) => (
              <motion.li key={item} variants={itemVariants}>
                <button
                  className={clsx(
                    'flex w-full items-center py-[7px] pl-2.5 pr-3 transition-colors duration-200 hover:bg-gray-8',
                    index === 0 && 'rounded-t'
                  )}
                  type="button"
                  onClick={() => handleSelect(item)}
                >
                  <ActiveThemeIcon theme={item} />
                  <span className="ml-2.5 capitalize">{item}</span>
                </button>
              </motion.li>
            ))}
        </motion.ul>
        <button
          className="flex h-[30px] w-full items-center py-[7px] pl-2.5 pr-3"
          type="button"
          aria-label="Select theme"
          onClick={handleDropdown}
        >
          <ActiveThemeIcon theme={theme} />
          <span className="ml-2.5 capitalize">{theme}</span>
          <ChevronsIcon className="ml-auto  text-gray-4" />
        </button>
      </div>
    </div>
  );
};

ThemeSelect.propTypes = {
  className: PropTypes.string,
};

ThemeSelect.defaultProps = {
  className: null,
};

export default ThemeSelect;
