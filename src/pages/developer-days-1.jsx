/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/developer-days/hero';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const DeveloperDays1 = () => (
  <Layout headerTheme="black" footerTheme="black" footerWithTopBorder>
    <Hero />
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

export default DeveloperDays1;

export const Head = ({ location: { pathname }, data: { ogImage } }) => (
  <SEO pathname={pathname} {...SEO_DATA.developerDays1} ogImage={ogImage} />
);
