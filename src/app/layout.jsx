import 'styles/globals.css';

import dynamic from 'next/dynamic';
import Script from 'next/script';

import { ActiveLabelProvider } from '../components/pages/doc/code-tabs/CodeTabsContext';

import { inter, esbuild } from './fonts';
import { HomepageVisitProvider } from './homepage-visit-context';
import PostHogProvider from './posthog-provider';
import ThemeProvider from './provider';
import SessionProvider from './session-provider';

const PostHogPageView = dynamic(() => import('./posthog-pageview'), {
  ssr: false,
});

export const preferredRegion = 'edge';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

// eslint-disable-next-line react/prop-types
const RootLayout = ({ children }) => (
  <html lang="en" className={`${inter.variable} ${esbuild.variable} dark`}>
    <head>
      {process.env.NODE_ENV === 'production' && (
        <Script strategy="afterInteractive" src="https://neonapi.io/cb.js" />
      )}
      <link rel="preconnect" href="https://console.neon.tech" />
    </head>
    <body>
      <SessionProvider>
        <PostHogProvider>
          <PostHogPageView />
          <ThemeProvider>
            <HomepageVisitProvider>
              <ActiveLabelProvider>{children}</ActiveLabelProvider>
            </HomepageVisitProvider>
          </ThemeProvider>
        </PostHogProvider>
      </SessionProvider>
    </body>
  </html>
);

export default RootLayout;
