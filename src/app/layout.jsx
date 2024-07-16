import 'styles/globals.css';

import Script from 'next/script';

import { ActiveLabelProvider } from 'components/pages/doc/code-tabs/CodeTabsContext';
import RiveWasm from 'components/shared/rive-wasm';

import { inter, esbuild } from './fonts';
import ThemeProvider from './provider';

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
      {/* Preload rive wasm, moved to a separate component, because it should be client component to make wasm accessible from client side */}
      <RiveWasm />
    </head>
    <body>
      <ThemeProvider>
        <ActiveLabelProvider>{children}</ActiveLabelProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
