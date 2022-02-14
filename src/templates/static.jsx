/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const StaticTemplate = ({
  data: {
    mdx: {
      body,
      frontmatter: { title },
    },
  },
}) => (
  <Layout seo={SEO_DATA.static({ title })} headerTheme="white">
    <article className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 2xl:pb-28 xl:pt-32 xl:pb-20 lg:pt-12 lg:pb-16 md:pt-6">
      <Container size="sm">
        <h1 className="t-5xl font-semibold">{title}</h1>
      </Container>
      <Content className="mt-8" content={body} />
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

export default StaticTemplate;
