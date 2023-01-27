'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider as PreferredProvider } from 'next-themes';

// eslint-disable-next-line react/prop-types
const ThemeProvider = ({ children }) => {
  const pathname = usePathname();
  const isDocPage = pathname.startsWith('/docs');

  return (
    <PreferredProvider
      attribute="class"
      forcedTheme={isDocPage ? null : 'light'}
      storageKey="neon-theme"
      disableTransitionOnChange
    >
      {children}
    </PreferredProvider>
  );
};
export default ThemeProvider;
