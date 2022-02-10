/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/blog-post/hero';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, frontmatter },
  },
}) => (
  <Layout headerTheme="white">
    <Hero {...frontmatter} slug={slug} />
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      slug
      body
      frontmatter {
        title
        description
        author
      }
    }
  }
`;

export default BlogPostTemplate;
