/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const StaticPage = ({
  data: {
    mdx: { body, frontmatter },
  },
}) => (
  <Layout seo={SEO_DATA.static({ title: frontmatter.title })} headerTheme="white">
    <article>
      <div className="safe-paddings py-48 3xl:py-44 2xl:py-40 xl:py-32 lg:py-12 md:py-6">
        <Content content={body} />
      </div>
    </article>
  </Layout>
);

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
      }
    }
  }
`;

export default StaticPage;
