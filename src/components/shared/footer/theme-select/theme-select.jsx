'use client';

import clsx from 'clsx';
import { useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import DarkThemeIcon from '../images/dark-theme.inline.svg';
import LightThemeIcon from '../images/light-theme.inline.svg';
import SystemThemeIcon from '../images/system-theme.inline.svg';

const ThemeSelect = ({ className = null }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const themes = ['system', 'light', 'dark'];

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className={clsx(
        'relative flex gap-x-1 rounded-full border border-gray-new-80 dark:border-gray-new-20',
        'after:pointer-events-none after:absolute after:-left-px after:-top-px after:h-7 after:w-7 after:rounded-full after:border after:border-inherit',
        'after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.34,1,0.64,1)] after:will-change-transform',
        {
          'after:translate-x-0': theme === 'system',
          'after:translate-x-[30px]': theme === 'light',
          'after:translate-x-[60px]': theme === 'dark',
        },
        className
      )}
      role="radiogroup"
      aria-label="Select theme"
    >
      {themes.map((_theme) => {
        const isSelected = _theme === theme;
        const themeIconClassNames = clsx('text-gray-new-50 dark:text-gray-new-70', {
          '!text-black-pure dark:!text-white': isSelected,
        });

        return (
          <button
            key={_theme}
            type="button"
            role="radio"
            className="flex h-[26px] w-[26px] items-center justify-center rounded-full -outline-offset-1"
            aria-checked={isSelected}
            data-state={isSelected ? 'checked' : 'unchecked'}
            value={_theme}
            aria-label={_theme}
            onClick={() => setTheme(_theme)}
          >
            {_theme === 'system' && <SystemThemeIcon className={themeIconClassNames} />}
            {_theme === 'light' && <LightThemeIcon className={themeIconClassNames} />}
            {_theme === 'dark' && <DarkThemeIcon className={themeIconClassNames} />}
          </button>
        );
      })}
    </div>
  );
};

ThemeSelect.propTypes = {
  className: PropTypes.string,
};

export default ThemeSelect;
