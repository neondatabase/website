/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Pagination from 'components/pages/blog/pagination';
import PostsList from 'components/pages/blog/posts-list';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';

const BlogTemplate = ({
  data: {
    allWpPost: { nodes },
  },
  pageContext: { currentPageIndex, pageCount },
}) => (
  <Layout headerTheme="white">
    <PostsList items={nodes} />
    {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />}
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query ($id: String!, $limit: Int!, $skip: Int!) {
    wpPage(id: { eq: $id }) {
      ...wpPageSeo
    }
    allWpPost(sort: { date: DESC }, limit: $limit, skip: $skip) {
      nodes {
        slug
        title
        date(formatString: "MMMM D, YYYY")
        pageBlogPost {
          authors {
            author {
              ... on WpPostAuthor {
                title
                postAuthor {
                  role
                  url
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
          description
        }
      }
    }
  }
`;

export default BlogTemplate;

export const Head = ({
  location: { pathname },
  data: {
    wpPage: { seo },
  },
}) => <SEO pathname={pathname} {...seo} />;
