/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/release-notes/hero';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Heading from 'components/shared/heading';
import Layout from 'components/shared/layout';
import Link from 'components/shared/link';
import SEO from 'components/shared/seo';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { RELEASE_NOTES_BASE_PATH } from 'constants/docs';
import SEO_DATA from 'constants/seo-data';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const ReleaseNotePostTemplate = ({
  data: {
    mdx: { slug, body, frontmatter },
  },
}) => (
  <Layout headerTheme="white">
    <Hero className="pt-40 lg:pt-16 md:mb-10 md:py-10 sm:mb-7 sm:py-7" withContainer />
    <Container size="sm" className="relative mb-10 flex">
      <article className="relative flex flex-col items-start">
        <time
          className="mt-3 whitespace-nowrap text-gray-2"
          dateTime={getReleaseNotesDateFromSlug(slug)}
        >
          {getReleaseNotesDateFromSlug(slug)}
        </time>
        <Heading
          className="!text-[36px] !leading-normal md:!text-3xl"
          tag="h3"
          size="sm"
          theme="black"
        >
          {frontmatter.label} release
        </Heading>

        <Content className="mt-8 prose-h3:text-xl" content={body} />
        <Link
          className="mt-10 font-semibold lg:mt-8"
          to={RELEASE_NOTES_BASE_PATH}
          size="sm"
          theme="black-primary-1"
        >
          Back to all notes
        </Link>
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
        label
      }
    }
  }
`;

export default ReleaseNotePostTemplate;

export const Head = ({
  data: {
    mdx: { frontmatter },
  },
  location: { pathname },
}) => (
  <SEO
    pathname={pathname}
    {...SEO_DATA.releaseNotePost({
      title: `${frontmatter.label} release`,
    })}
  />
);
