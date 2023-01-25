import Script from 'next/script';

import 'styles/globals.css';
import ThemeProvider from './provider';

export const preferredRegion = 'edge';

// eslint-disable-next-line react/prop-types
const RootLayout = ({ children }) => (
  <html lang="en">
    <head>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl+'';f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer', 'GTM-MJLTK6F');
      `}
      </Script>
    </head>
    <body>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJLTK6F" height="0" width="0" style="display: none; visibility: hidden" aria-hidden="true"></iframe>`,
        }}
      />
      <ThemeProvider>{children}</ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
