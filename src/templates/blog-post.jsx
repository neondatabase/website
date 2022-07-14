/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Content from 'components/pages/blog-post/content';
import Hero from 'components/pages/blog-post/hero';
import CodeBlock from 'components/shared/code-block';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const BlogPostTemplate = ({
  data: {
    wpPost: { content, title, pageBlogPost, date, seo },
  },
  location: { pathname },
}) => {
  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
    },
    true
  );
  return (
    <Layout seo={{ ...seo, pathname, ogImage: pageBlogPost.cover }} headerTheme="white">
      <article>
        <Hero title={title} {...pageBlogPost} date={date} />
        <Container size="sm">
          <Content className="mt-8" html={contentWithLazyBlocks} />
        </Container>
      </article>
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
      date(formatString: "MMMM D, YYYY")
      pageBlogPost {
        description
        author {
          ... on WpPostAuthor {
            title
            postAuthor {
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
        cover {
          localFile {
            childImageSharp {
              gatsbyImageData(layout: FIXED, quality: 90, width: 1200, height: 630, formats: JPG)
            }
          }
        }
      }
      ...wpPostSeo
    }
  }
`;

export default BlogPostTemplate;
