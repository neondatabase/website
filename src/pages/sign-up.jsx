import React from 'react';

import Hero from 'components/pages/sign-up/hero';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const SignUpPage = () => (
  <>
    <SEO {...SEO_DATA.signUp} />
    <main>
      <Hero />
    </main>
  </>
);

export default SignUpPage;
