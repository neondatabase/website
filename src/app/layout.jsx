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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl+'';f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer', 'GTM-MJLTK6F');
      `}
        </Script>
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
    </head>
    <body>
      {process.env.NODE_ENV === 'production' && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJLTK6F" height="0" width="0" style="display: none; visibility: hidden" aria-hidden="true"></iframe>`,
          }}
        />
      )}
      <ThemeProvider>
        <TopBar />
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
