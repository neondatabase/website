import { BLOG_POSTS_PER_PAGE } from 'constants/blog';
import { gql, graphQLClient } from 'lib/graphQLClient';

const POST_SEO_FRAGMENT = gql`
  fragment wpPostSeo on Post {
    seo {
      title
      metaDesc
      metaKeywords
      metaRobotsNoindex
      opengraphTitle
      opengraphDescription
      opengraphUrl
      twitterImage {
        mediaItemUrl
      }
    }
  }
`;

const getAllWpPosts = async () => {
  const allPostsQuery = gql`
    query AllPosts($first: Int!) {
      posts(first: $first) {
        nodes {
          slug
          title(format: RENDERED)
          date
          pageBlogPost {
            description
            authors {
              author {
                ... on PostAuthor {
                  title
                  postAuthor {
                    role
                    url
                    image {
                      altText
                      mediaItemUrl
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await graphQLClient.request(allPostsQuery, {
    first: BLOG_POSTS_PER_PAGE,
  });

  return data?.posts?.nodes;
};

const getWpPostBySlug = async (slug) => {
  const postBySlugQuery = gql`
    query PostBySlug($id: ID!) {
      post(id: $id, idType: URI) {
        slug
        date
        title(format: RENDERED)
        content(format: RENDERED)
        readingTime
        pageBlogPost {
          description
          authors {
            author {
              ... on PostAuthor {
                title
                postAuthor {
                  role
                  url
                  image {
                    altText
                    mediaItemUrl
                  }
                }
              }
            }
          }
        }
        ...wpPostSeo
      }
    }
    ${POST_SEO_FRAGMENT}
  `;

  return graphQLClient.request(postBySlugQuery, { id: slug });
};

export { getAllWpPosts, getWpPostBySlug };
