import Script from 'next/script';

import LINKS from 'constants/links';

const LoginPage = async () => (
  <Script id="zwait-redirector">{`zwait = setInterval(function(){if(window.zaraz) {clearInterval(zwait); window.location = "${LINKS.login}";}}, 50)`}</Script>
);

export default LoginPage;
