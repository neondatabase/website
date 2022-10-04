/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/jobs/hero';
import JobsList from 'components/pages/jobs/jobs-list';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import SEO_DATA from 'constants/seo-data';

const CareersPage = () => (
  <Layout headerTheme="black">
    <Hero />
    <JobsList />
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query {
    ogImage: file(relativePath: { eq: "social-previews/jobs.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200, height: 630, formats: JPG)
      }
    }
  }
`;

export default CareersPage;

export const Head = ({ location: { pathname }, data: { ogImage } }) => (
  <SEO pathname={pathname} ogImage={ogImage} {...SEO_DATA.jobs} />
);
