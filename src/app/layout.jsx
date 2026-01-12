import 'styles/globals.css';
import Script from 'next/script';

import LINKS from 'constants/links';
import { CodeTabsProvider } from 'contexts/code-tabs-context';
import { TabsProvider } from 'contexts/tabs-context';

import { inter, esbuild } from './fonts';
import { HomepageVisitProvider } from './homepage-visit-context';
import ThemeProvider from './theme-provider';

export const preferredRegion = 'edge';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// eslint-disable-next-line react/prop-types
const RootLayout = ({ children }) => (
  <html lang="en" className={`${inter.variable} ${esbuild.variable} dark`}>
    <head>
      {process.env.NODE_ENV === 'production' && (
        <Script strategy="afterInteractive" src="https://neonapi.io/cb.js" />
      )}
      <link rel="preconnect" href={LINKS.console} />
    </head>
    <body>
      <ThemeProvider>
        <HomepageVisitProvider>
          <TabsProvider>
            <CodeTabsProvider>{children}</CodeTabsProvider>
          </TabsProvider>
        </HomepageVisitProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
