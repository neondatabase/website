/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import Pagination from 'components/pages/blog/pagination';
import PostsList from 'components/pages/blog/posts-list';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';

const BlogTemplate = ({
  data: {
    wpPage: { seo },
    allWpPost: { nodes },
  },
  location: { pathname },
  pageContext: { currentPageIndex, pageCount },
}) => (
  <Layout seo={{ ...seo, pathname }} headerTheme="white">
    <PostsList items={nodes} />
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
        date(formatString: "MMMM D, YYYY")
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
