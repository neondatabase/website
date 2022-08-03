/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Aside from 'components/pages/changelog-content/aside';
import Hero from 'components/pages/changelog-content/hero/hero';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import Link from 'components/shared/link';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { CHANGELOG_BASE_PATH } from 'constants/changelog';
import SEO_DATA from 'constants/seo-data';

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
      <article className="relative flex sm:flex-col">
        <Aside version={frontmatter.version} slug={slug} />
        <div>
          <h2 className="mb-5 text-3xl font-bold leading-tight">{frontmatter.title}</h2>
          <Content content={body} />
          <Link
            className="mt-10 font-semibold lg:mt-8"
            to={CHANGELOG_BASE_PATH}
            size="sm"
            theme="black-primary-1"
          >
            Back to Changelog
          </Link>
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
