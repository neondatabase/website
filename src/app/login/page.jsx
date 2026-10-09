import Script from 'next/script';

import LINKS from 'constants/links';

export const metadata = {
  title: 'Log in - Neon',
  description: 'Log in to your Neon account.',
  robots: { index: false, follow: true },
};

const LoginPage = async () => (
  <Script id="zwait-redirector">{`zwait = setInterval(function(){if(window.zaraz) {clearInterval(zwait); window.location = "${LINKS.login}";}}, 50)`}</Script>
);

export default LoginPage;
