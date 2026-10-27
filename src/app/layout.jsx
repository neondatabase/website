import 'styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import SectionScroll from 'components/shared/inkeep-trigger/section-scroll';
import RiveWasm from 'components/shared/rive-wasm';
import WebMcpTools from 'components/shared/webmcp-tools';
import LINKS from 'constants/links';
import { CodeTabsProvider } from 'contexts/code-tabs-context';
import { TabsProvider } from 'contexts/tabs-context';
import { TopbarProvider } from 'contexts/topbar-context';

import { inter, esbuild } from './fonts';
import { HomepageVisitProvider } from './homepage-visit-context';
import ThemeProvider from './theme-provider';

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
      {/* Chrome origin-trial token that turns on WebMCP (document.modelContext) on
          neon.com and its subdomains; other origins ignore it. Expires 2027-03-30.
          Renew at https://developer.chrome.com/origintrials. */}
      <meta
        httpEquiv="origin-trial"
        content="AlPoMMWZF+IAU3oyUxT98E0KWL4GO2m88YxAsoEjMLmDy+t6l5+d2Fn1bn73a6G5uwWDTzdl5CZexnXeFdyICwwAAABbeyJvcmlnaW4iOiJodHRwczovL25lb24uY29tOjQ0MyIsImZlYXR1cmUiOiJXZWJNQ1AiLCJleHBpcnkiOjE4MDYzNjQ4MDAsImlzU3ViZG9tYWluIjp0cnVlfQ=="
      />
      <link rel="preconnect" href={LINKS.console} />
      <RiveWasm />
    </head>
    <body>
      <ThemeProvider>
        <HomepageVisitProvider>
          <TopbarProvider>
            <TabsProvider>
              <CodeTabsProvider>
                <NuqsAdapter>{children}</NuqsAdapter>
              </CodeTabsProvider>
            </TabsProvider>
          </TopbarProvider>
        </HomepageVisitProvider>
      </ThemeProvider>
      <SectionScroll />
      <WebMcpTools />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
