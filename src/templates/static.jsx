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
  location: { pathname },
}) => (
  <Layout seo={{ ...SEO_DATA.static({ title }), pathname }} headerTheme="white">
    <article className="safe-paddings py-48 3xl:py-44 2xl:py-40 xl:py-32 lg:pt-12 lg:pb-24 md:pt-6 md:pb-20">
      <Container size="sm">
        <h1 className="t-5xl font-semibold">{title}</h1>
      </Container>
      <Container size="sm">
        <Content className="mt-8 2xl:mt-7 xl:mt-6" content={body} />
      </Container>
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
