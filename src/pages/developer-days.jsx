import React from 'react';

import Branching from 'components/pages/developer-days/branching';
import CTA from 'components/pages/developer-days/cta';
import Hero from 'components/pages/developer-days/hero';
import Partners from 'components/pages/developer-days/partners';
import Layout from 'components/shared/layout';
import background from 'images/developer-days/background.svg';

const DeveloperDays2 = () => (
  <Layout headerTheme="black" footerTheme="black" footerWithTopBorder>
    <div className="relative overflow-hidden bg-black text-white">
      <img
        className="absolute top-0 left-1/2 h-auto w-[1440px] -translate-x-1/2"
        src={background}
        width={1440}
        height={4815}
        alt=""
        aria-hidden
      />
      <Hero />
      <Branching />
      <Partners />
      <CTA />
    </div>
  </Layout>
);

export default DeveloperDays2;
