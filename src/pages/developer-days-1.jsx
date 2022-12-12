/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Branching from 'components/pages/developer-days/branching';
import CTA from 'components/pages/developer-days/cta';
import Hero from 'components/pages/developer-days/hero';
import Partners from 'components/pages/developer-days/partners';
// import Register from 'components/pages/developer-days/register';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';
import backgroundLg from 'images/developer-days/background-lg.svg';
import backgroundMd from 'images/developer-days/background-md.svg';
import backgroundXl from 'images/developer-days/background-xl.svg';
import background from 'images/developer-days/background.svg';

const DeveloperDays = () => (
  <Layout headerTheme="black" footerTheme="black" footerWithTopBorder>
    <div className="relative overflow-hidden bg-black text-white">
      <img
        className="absolute top-0 left-1/2 h-auto w-[1440px] -translate-x-1/2 xl:hidden"
        src={background}
        width={1440}
        height={4815}
        alt=""
        aria-hidden
      />
      <img
        className="absolute top-0 left-1/2 hidden h-auto w-full -translate-x-1/2 px-[70px] xl:block lg:hidden"
        src={backgroundXl}
        width={884}
        height={3780}
        alt=""
        aria-hidden
      />
      <img
        className="absolute top-0 left-1/2 hidden h-auto w-full -translate-x-1/2 px-11 lg:block xs:hidden"
        src={backgroundLg}
        width={680}
        height={3196}
        alt=""
        aria-hidden
      />
      <img
        className="absolute top-0 left-1/2 hidden h-auto w-full -translate-x-1/2 px-9 xs:block"
        src={backgroundMd}
        width={340}
        height={3330}
        alt=""
        aria-hidden
      />
      <Hero />
      <Branching />
      <Partners />
      <CTA />
      {/* <Register type="day1" /> */}
    </div>
  </Layout>
);

export const query = graphql`
  query {
    ogImage: file(relativePath: { eq: "social-previews/developer-days-1.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200, height: 630, formats: JPG)
      }
    }
  }
`;

export default DeveloperDays;
// TODO: check if need to update SEO data
export const Head = ({ location: { pathname }, data: { ogImage } }) => (
  <SEO pathname={pathname} {...SEO_DATA.developerDays1} ogImage={ogImage} />
);
