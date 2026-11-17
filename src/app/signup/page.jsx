import Script from 'next/script';

import LINKS from 'constants/links';

export const metadata = {
  title: 'Sign up - Neon',
  description: 'Create a Neon account to build backends for apps and agents.',
  robots: { index: false, follow: true },
};

const SignupPage = async () => (
  <Script id="zwait-redirector">{`zwait = setInterval(function(){if(window.zaraz) {clearInterval(zwait); window.location = "${LINKS.signup}";}}, 50)`}</Script>
);

export default SignupPage;
