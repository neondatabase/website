import { BLOG_POSTS_PER_PAGE } from 'constants/blog';
import { gql, graphQLClient, graphQLClientAdmin } from 'lib/graphQLClient';

import getAuthToken from './api-auth';

const POST_SEO_FRAGMENT = gql`
  fragment wpPostSeo on Post {
    seo {
      title
      metaDesc
      opengraphTitle
      opengraphDescription
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
          categories {
            nodes {
              name
              slug
            }
          }
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
        categories {
          nodes {
            name
            slug
          }
        }
        slug
        date
        title(format: RENDERED)
        content(format: RENDERED)
        readingTime
        pageBlogPost {
          largeCover {
            altText
            mediaItemUrl
          }
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

      posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          categories {
            nodes {
              name
              slug
            }
          }
          slug
          title(format: RENDERED)
          date
          readingTime
          pageBlogPost {
            largeCover {
              altText
              mediaItemUrl
            }
            smallCover {
              altText
              mediaItemUrl
            }
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
    ${POST_SEO_FRAGMENT}
  `;

  const data = await graphQLClient.request(postBySlugQuery, { id: slug });

  const sortedPosts = data?.posts?.nodes.filter((post) => post.slug !== slug).slice(0, 3);

  return {
    post: data?.post,
    relatedPosts: sortedPosts,
  };
};

// Query that executes when user requests a preview on a CMS,
// the difference from a standard post query is that it uses Admin token to access unpublished posts and revisions of published posts

const getWpPreviewPostData = async (id, status) => {
  const {
    refreshJwtAuthToken: { authToken },
  } = await getAuthToken();

  const isDraft = status === 'draft';
  const isRevision = status === 'publish';
  let query;

  if (isDraft) {
    query = gql`
      query PostById($id: ID!) {
        post(id: $id, idType: DATABASE_ID) {
          categories {
            nodes {
              name
              slug
            }
          }
          slug
          date
          title(format: RENDERED)
          content(format: RENDERED)
          readingTime
          pageBlogPost {
            largeCover {
              altText
              mediaItemUrl
            }
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

        posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            categories {
              nodes {
                name
                slug
              }
            }
            slug
            title(format: RENDERED)
            date
            readingTime
            pageBlogPost {
              largeCover {
                altText
                mediaItemUrl
              }
              smallCover {
                altText
                mediaItemUrl
              }
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
      ${POST_SEO_FRAGMENT}
    `;

    const data = await graphQLClientAdmin(authToken).request(query, { id });

    const sortedPosts = data?.posts?.nodes
      .filter((post) => post.slug !== data?.post?.slug)
      .slice(0, 3);

    return {
      post: data?.post,
      relatedPosts: sortedPosts,
    };
  }

  if (isRevision) {
    query = gql`
      query PostById($id: ID!) {
        post(id: $id, idType: DATABASE_ID) {
          ...wpPostSeo
          revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
            edges {
              post: node {
                categories {
                  nodes {
                    name
                    slug
                  }
                }
                slug
                date
                title(format: RENDERED)
                content(format: RENDERED)
                readingTime
                pageBlogPost {
                  largeCover {
                    mediaItemUrl
                  }
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
        }

        posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            categories {
              nodes {
                name
                slug
              }
            }
            slug
            title(format: RENDERED)
            date
            readingTime
            pageBlogPost {
              largeCover {
                altText
                mediaItemUrl
              }
              smallCover {
                mediaItemUrl
              }
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
      ${POST_SEO_FRAGMENT}
    `;
    const revisionPostData = await graphQLClientAdmin(authToken).request(query, {
      id,
    });
    // TODO: Pass seo data to head component

    const sortedPosts = revisionPostData?.posts?.nodes
      .filter((post) => post.slug !== revisionPostData?.post?.revisions?.edges[0].slug)
      .slice(0, 3);

    return {
      post: revisionPostData?.post?.revisions?.edges[0],
      relatedPosts: sortedPosts,
    };
  }
};

const getWpPreviewPost = async (id) => {
  const {
    refreshJwtAuthToken: { authToken },
  } = await getAuthToken();

  const findPreviewPostQuery = gql`
    query PreviewPost($id: ID!) {
      post(id: $id, idType: DATABASE_ID) {
        databaseId
        slug
        status
      }
    }
  `;

  return graphQLClientAdmin(authToken).request(findPreviewPostQuery, { id });
};

export { getAllWpPosts, getWpPostBySlug, getWpPreviewPostData, getWpPreviewPost };
