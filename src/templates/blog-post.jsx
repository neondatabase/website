/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Hero from 'components/pages/blog-post/hero';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import SEO_DATA from 'constants/seo-data';

const BlogPostTemplate = ({
  data: {
    mdx: { slug, body, frontmatter },
  },
  location: { pathname },
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
      <Hero {...frontmatter} slug={slug} />
      <Container size="sm">
        <Content className="mt-8" content={body} />
      </Container>
    </article>
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
