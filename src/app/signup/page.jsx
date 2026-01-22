import Script from 'next/script';

import LINKS from 'constants/links';

const SignupPage = async () => (
  <Script id="zwait-redirector">{`zwait = setInterval(function(){if(window.zaraz) {clearInterval(zwait); window.location = "${LINKS.signup}";}}, 50)`}</Script>
);

export default SignupPage;
