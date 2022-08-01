/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/changelog-content/hero/hero';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import SEO_DATA from 'constants/seo-data';
import getChangelogPostDateFromSlug from 'utils/get-changelog-post-date-from-slug';

const ChangelogPostTemplate = ({
  data: {
    mdx: { slug, body, frontmatter },
  },
  location: { pathname },
}) => (
  <Layout
    seo={{
      ...SEO_DATA.changelogPost({
        title: frontmatter.title,
        version: frontmatter.version,
      }),
      pathname,
    }}
    headerTheme="white"
  >
    <Hero />
    <Container size="sm" className="relative mb-10 flex">
      <article className="relative flex border-b border-b-gray-4 pb-12">
        <div className="absolute -left-36 max-h-fit min-w-fit max-w-fit rounded-md border border-gray-4">
          <div className="border-b border-b-gray-4 py-2 px-3 text-2xl font-bold">
            v<span>{frontmatter.version}</span>
          </div>
          <div className="max-h-fit py-1.5 px-2.5 text-sm">
            {getChangelogPostDateFromSlug(slug)}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-3xl font-bold leading-tight">{frontmatter.title}</h2>
          <Content content={body} />
        </div>
      </article>
    </Container>
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
        version
      }
    }
  }
`;

export default ChangelogPostTemplate;
