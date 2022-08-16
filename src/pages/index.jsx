/* eslint-disable react/prop-types */
import React from 'react';
import { useInView } from 'react-intersection-observer';

import Advantages from 'components/pages/home/advantages';
import Community from 'components/pages/home/community';
import CTA from 'components/pages/home/cta';
import DataBranching from 'components/pages/home/data-branching';
import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import Lines1 from 'components/pages/home/lines-1';
import Lines2 from 'components/pages/home/lines-2';
import SaaS from 'components/pages/home/saas';
import Scalability from 'components/pages/home/scalability';
import Storage from 'components/pages/home/storage';
import Layout from 'components/shared/layout';
import Subscribe from 'components/shared/subscribe';

const HomePage = ({ location: { pathname } }) => {
  const [firstSectionWithLinesRef, isFirstSectionWithLinesInView] = useInView({
    rootMargin: '100px 0px',
    triggerOnce: true,
  });

  const [secondSectionWithLinesRef, isSecondSectionWithLinesInView] = useInView({
    rootMargin: '100px 0px',
    triggerOnce: true,
  });

  return (
    <Layout seo={{ pathname }} headerTheme="black" isSignIn withOverflowHidden>
      <div className="relative overflow-hidden" ref={firstSectionWithLinesRef}>
        {isFirstSectionWithLinesInView && <Lines1 />}
        <Hero />
        <CTA />
        <Advantages />
      </div>
      <Community />
      <Scalability />
      <Storage />
      <DataBranching />
      <div className="relative overflow-hidden" ref={secondSectionWithLinesRef}>
        <Features />
        <SaaS />
        {isSecondSectionWithLinesInView && <Lines2 />}
      </div>
      <Subscribe />
    </Layout>
  );
};

export default HomePage;
