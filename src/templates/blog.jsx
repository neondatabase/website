/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Pagination from 'components/pages/blog/pagination';
import PostsList from 'components/pages/blog/posts-list';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import SEO_DATA from 'constants/seo-data';

const BlogTemplate = ({
  data: {
    allMdx: { nodes },
  },
  pageContext: { currentPageIndex, pageCount, canonicalUrl },
}) => (
  <Layout seo={SEO_DATA.blog({ canonicalUrl })} headerTheme="white">
    <PostsList items={nodes} />
    {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />}
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query ($limit: Int!, $skip: Int!, $draftFilter: [Boolean]!) {
    allMdx(
      filter: { fileAbsolutePath: { regex: "/posts/" }, fields: { draft: { in: $draftFilter } } }
      sort: { order: DESC, fields: slug }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        slug
        frontmatter {
          title
          description
          author
        }
      }
    }
  }
`;

export default BlogTemplate;
