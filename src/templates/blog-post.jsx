/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import SocialShare from 'components/pages/blog-post/social-share';
import CodeBlock from 'components/shared/code-block';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const BlogPostTemplate = ({
  data: {
    wpPost: { content, title, pageBlogPost, date, readingTime, seo },
  },
  location: { pathname },
  pageContext: { pagePath },
}) => {
  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
    },
    true
  );
  return (
    <Layout
      seo={{
        ...seo,
        description: pageBlogPost.description,
        pathname,
      }}
      headerTheme="white"
    >
      <article>
        <Hero title={title} {...pageBlogPost} date={date} readingTime={readingTime} />
        <Container size="sm">
          <Content className="mt-8" html={contentWithLazyBlocks} />
        </Container>
      </article>
      <SocialShare slug={pagePath} title={title} />
      <SubscribeMinimalistic />
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!) {
    wpPost(id: { eq: $id }) {
      slug
      title
      content
      readingTime
      date(formatString: "MMMM D, YYYY")
      pageBlogPost {
        description
        author {
          ... on WpPostAuthor {
            title
            postAuthor {
              role
              image {
                localFile {
                  childImageSharp {
                    gatsbyImageData(width: 40)
                  }
                }
              }
            }
          }
        }
      }
      ...wpPostSeo
    }
  }
`;

export default BlogPostTemplate;
