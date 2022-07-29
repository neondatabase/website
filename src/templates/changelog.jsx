/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import ChangelogPostList from 'components/pages/changelog-content/changelog-post-list';
import Hero from 'components/pages/changelog-content/hero/hero';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { CHANGELOG_BASE_PATH } from 'constants/changelog';
import SEO_DATA from 'constants/seo-data';

const ChangelogPage = ({
  data: {
    allMdx: { nodes },
  },
}) => (
  <Layout seo={{ ...SEO_DATA.changelog, pathname: CHANGELOG_BASE_PATH }} headerTheme="white">
    <Hero />
    <ChangelogPostList items={nodes} />
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query {
    allMdx(filter: { fileAbsolutePath: { regex: "/content/changelog/" } }) {
      nodes {
        body
        slug
        frontmatter {
          version
        }
      }
    }
  }
`;

export default ChangelogPage;
