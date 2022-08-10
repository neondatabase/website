/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/blog-post/hero';
import SocialShare from 'components/pages/blog-post/social-share';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import SEO_DATA from 'constants/seo-data';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, body, timeToRead, frontmatter },
  },
  location: { pathname },
  pageContext: { pagePath },
}) => (
  <Layout
    seo={{
      ...SEO_DATA.blogPost({
        title: frontmatter.title,
        description: frontmatter.description,
      }),
      ogImage: frontmatter.ogImage?.childImageSharp.gatsbyImageData.images.fallback.src,
      pathname,
    }}
    headerTheme="white"
  >
    <article>
      <Hero {...frontmatter} timeToRead={timeToRead} slug={slug} />
      <Container size="sm">
        <Content className="mt-8" content={body} />
      </Container>
    </article>
    <SocialShare slug={pagePath} title={frontmatter.title} />
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      slug
      body
      timeToRead
      frontmatter {
        title
        description
        author
        ogImage: cover {
          childImageSharp {
            gatsbyImageData(layout: FIXED, quality: 90, width: 1200, height: 630, formats: JPG)
          }
        }
      }
    }
  }
`;

export default BlogPostTemplate;
