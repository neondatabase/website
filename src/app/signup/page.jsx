import Script from 'next/script';

const SignupPage = async () => (
    <Script id="zwait-redirector">{`zwait = setInterval(function(){if(window.zaraz) {clearInterval(zwait); window.location = "https://console.neon.tech/signup";}}, 50)`}</Script>
  );

export default SignupPage;
