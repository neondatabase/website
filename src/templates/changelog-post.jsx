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
    mdx: {
      slug,
      body,
      frontmatter: { version },
    },
  },
  location: { pathname },
}) => (
  <Layout seo={{ ...SEO_DATA.changelog, pathname }} headerTheme="white">
    <Hero />
    <Container size="sm" className="relative mb-10 border-b border-b-gray-4 pb-12 pt-48">
      <div className="sticky mt-5 rounded-md border border-gray-4">
        <div className="text-xl">
          v<span className="uppercase">{version}</span>
        </div>
        <div className="text-sm">{getChangelogPostDateFromSlug(slug)}</div>
      </div>
      <Content content={body} />
    </Container>
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query ($id: String!) {
    AllMdx(id: { eq: $id }) {
      nodes {
        slug
        body
        frontmatter {
          version
        }
      }
    }
  }
`;

export default ChangelogPostTemplate;
