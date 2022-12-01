/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Branching from 'components/pages/developer-days/branching';
import CTA from 'components/pages/developer-days/cta';
import Hero from 'components/pages/developer-days/hero';
import Partners from 'components/pages/developer-days/partners';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';
import background from 'images/developer-days/background.svg';

const DeveloperDays = () => (
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
