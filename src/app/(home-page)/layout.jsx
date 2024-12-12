import Script from 'next/script';

import Layout from 'components/shared/layout';

// eslint-disable-next-line react/prop-types
const HomeLayout = ({ children }) => (
  <>
    <Script id="redirect_script" strategy="beforeInteractive">
      {`if (document.cookie.includes('neon_login_indicator')) window.location.href = 'https://console.neon.tech';`}
    </Script>
    <Layout isHeaderSticky isHeaderStickyOverlay withOverflowHidden headerWithBorder>
      {children}
    </Layout>
  </>
);

export default HomeLayout;
