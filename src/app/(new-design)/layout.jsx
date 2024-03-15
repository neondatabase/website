import 'styles/globals.css';

import Script from 'next/script';

import TopBar from 'components/shared/topbar';

import { inter } from '../fonts';
import ThemeProvider from '../provider';

export const preferredRegion = 'edge';

// eslint-disable-next-line react/prop-types
const RootLayout = ({ children }) => (
  <html lang="en" className={`new-design ${inter.variable}`}>
    <head>
      {process.env.NODE_ENV === 'production' && (
        <Script strategy="afterInteractive" src="https://neonapi.io/cb.js" />
      )}
      <link rel="preconnect" href="https://console.neon.tech" />
    </head>
    <body>
      <ThemeProvider>
        <TopBar isNewDesign />
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
