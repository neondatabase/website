import 'styles/globals.css';

import Script from 'next/script';

import TopBar from 'components/shared/topbar';

import ThemeProvider from './provider';

const fontsBasePath = '/fonts';
const fontsPaths = [
  '/ibm-plex-sans/ibm-plex-sans-bold.woff2',
  '/ibm-plex-sans/ibm-plex-sans-regular.woff2',
];

export const preferredRegion = 'edge';

// eslint-disable-next-line react/prop-types
const RootLayout = ({ children }) => (
  <html lang="en">
    <head>
      {process.env.NODE_ENV === 'production' && (
        <Script strategy="afterInteractive" src="https://neonapi.io/cb.js" />
      )}
      {fontsPaths.map((fontPath, index) => (
        <link
          rel="preload"
          href={`${fontsBasePath}${fontPath}`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          key={index}
        />
      ))}
      <link rel="preconnect" href="https://console.neon.tech" />
    </head>
    <body>
      <ThemeProvider>
        <TopBar />
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
