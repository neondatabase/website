import React from 'react';

import Branching from 'components/pages/developer-days-2/branching';
import Hero from 'components/pages/developer-days-2/hero';
import Layout from 'components/shared/layout';
import background from 'images/developer-days/background.svg';

const DeveloperDays2 = () => (
  <Layout headerTheme="black" footerTheme="black">
    <div className="relative overflow-hidden bg-black text-white">
      <img
        className="absolute h-auto w-[1440px]"
        src={background}
        width={1440}
        height={4815}
        alt=""
        aria-hidden
      />
      <Hero />
      <Branching />
    </div>
  </Layout>
);

export default DeveloperDays2;
