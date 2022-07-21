/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/jobs/hero';
import JobsList from 'components/pages/jobs/jobs-list';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import SEO_DATA from 'constants/seo-data';

const JobsPage = ({ location: { pathname }, data: { ogImage } }) => (
  <Layout
    seo={{
      ...SEO_DATA.jobs,
      pathname,
      ogImage: ogImage.childImageSharp.gatsbyImageData.images.fallback.src,
    }}
    headerTheme="black"
  >
    <Hero />
    <JobsList />
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query {
    ogImage: file(relativePath: { eq: "social-previews/jobs.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, quality: 90, width: 1200, height: 630, formats: JPG)
      }
    }
  }
`;

export default JobsPage;
