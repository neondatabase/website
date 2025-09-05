'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider as PreferredProvider, useTheme } from 'next-themes';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const whiteThemePages = [
  '/careers',
  '/thank-you',
  '/privacy-policy',
  '/terms-of-service',
  '/dpa',
  '/subprocessors',
  '/privacy-guide',
  '/cookie-policy',
  '/business-info',
];

const themesSupportPages = ['/docs', '/guides', '/templates', '/postgresql', '/ai-chat'];

const ThemeColorUpdater = () => {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const currentTheme = resolvedTheme || theme;
    const themeColor = currentTheme === 'light' ? '#FFFFFF' : '#000000';

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = themeColor;
  }, [theme, resolvedTheme]);

  return null;
};

const ThemeProvider = ({ children }) => {
  const pathname = usePathname();
  const isWhiteThemePage = whiteThemePages.some((page) => pathname.startsWith(page));
  const hasThemesSupport = themesSupportPages.some((page) => pathname.startsWith(page));
  const forcedTheme = isWhiteThemePage ? 'light' : 'dark';

  return (
    <PreferredProvider
      attribute="class"
      forcedTheme={hasThemesSupport ? null : forcedTheme}
      storageKey="neon-theme"
      disableTransitionOnChange
    >
      <ThemeColorUpdater />
      {children}
    </PreferredProvider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
