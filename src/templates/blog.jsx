/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Pagination from 'components/pages/blog/pagination';
import PostsList from 'components/pages/blog/posts-list';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { BLOG_BASE_PATH } from 'constants/blog';

const BlogTemplate = ({
  data: {
    wpPage: { seo },
    allWpPost: { nodes },
  },
  pageContext: { currentPageIndex, pageCount },
}) => (
  <Layout seo={{ ...seo, pathname: BLOG_BASE_PATH }} headerTheme="white">
    <PostsList items={nodes} />S
    {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />}
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query ($id: String!, $limit: Int!, $skip: Int!) {
    wpPage(id: { eq: $id }) {
      id
      ...wpPageSeo
    }
    allWpPost(sort: { order: DESC, fields: date }, limit: $limit, skip: $skip) {
      nodes {
        slug
        title
        date(formatString: "MMMM DD, YYYY")
        pageBlogPost {
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
          description
        }
      }
    }
  }
`;

export default BlogTemplate;
