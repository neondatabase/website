/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import ChangelogPostList from 'components/pages/changelog-content/changelog-post-list';
import Hero from 'components/pages/changelog-content/hero/hero';
import Pagination from 'components/pages/changelog-content/pagination/pagination';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { CHANGELOG_BASE_PATH } from 'constants/changelog';
import SEO_DATA from 'constants/seo-data';

const ChangelogPage = ({
  data: {
    allMdx: { nodes },
  },
  pageContext: { currentPageIndex, pageCount },
}) => (
  <Layout headerTheme="white">
    <Hero />
    <ChangelogPostList items={nodes} />
    {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />}
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query ($limit: Int!, $skip: Int!, $draftFilter: [Boolean]!) {
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/content/changelog/" }
        fields: { isDraft: { in: $draftFilter } }
      }
      sort: { order: DESC, fields: slug }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      nodes {
        slug
        body
        frontmatter {
          title
          label
        }
      }
    }
  }
`;

export default ChangelogPage;

export const Head = () => <SEO pathname={CHANGELOG_BASE_PATH} {...SEO_DATA.changelog} />;
