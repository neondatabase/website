import 'styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import Script from 'next/script';

import RiveWasm from 'components/shared/rive-wasm';
import LINKS from 'constants/links';
import { CodeTabsProvider } from 'contexts/code-tabs-context';
import { TabsProvider } from 'contexts/tabs-context';
import { TopbarProvider } from 'contexts/topbar-context';

import { inter, esbuild } from './fonts';
import { HomepageVisitProvider } from './homepage-visit-context';
import ThemeProvider from './theme-provider';

export const preferredRegion = 'edge';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Theme class set client-side by next-themes; suppressHydrationWarning avoids server/client mismatch.
// eslint-disable-next-line react/prop-types
const RootLayout = ({ children }) => (
  <html
    lang="en"
    className={`${inter.variable} ${esbuild.variable} ${GeistMono.variable} dark`}
    suppressHydrationWarning
  >
    <head>
      {process.env.NODE_ENV === 'production' && (
        <Script strategy="afterInteractive" src="https://neonapi.io/cb.js" />
      )}
      {/* Dev-only live reload for content edits */}
      {process.env.NODE_ENV === 'development' && (
        <Script id="content-live-reload" strategy="afterInteractive">
          {`(function c(){try{var s=new WebSocket('ws://localhost:3549');s.onmessage=function(e){if(e.data==='reload')location.reload()};s.onclose=function(){setTimeout(c,1000)};s.onerror=function(){s.close()}}catch(e){setTimeout(c,1000)}})()`}
        </Script>
      )}
      <link rel="preconnect" href={LINKS.console} />
      <RiveWasm />
    </head>
    <body>
      <ThemeProvider>
        <HomepageVisitProvider>
          <TopbarProvider>
            <TabsProvider>
              <CodeTabsProvider>{children}</CodeTabsProvider>
            </TabsProvider>
          </TopbarProvider>
        </HomepageVisitProvider>
      </ThemeProvider>
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
