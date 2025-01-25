import { cache } from 'react';

import { BLOG_POSTS_PER_PAGE, EXTRA_CATEGORIES } from 'constants/blog';
import { gql, graphQLClientAdmin, fetchGraphQL, graphQLClient } from 'lib/graphQLClient';
import { getAllChangelogs } from 'utils/api-docs';
import { getAllGuides } from 'utils/api-guides';

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

const getAllWpBlogCategories = cache(async () => {
  const categoriesQuery = gql`
    query Categories {
      categories {
        nodes {
          name
          slug
          posts {
            nodes {
              id
            }
          }
        }
      }
    }
  `;
  const data = await fetchGraphQL(graphQLClient).request(categoriesQuery);
  const filteredCategories = data?.categories?.nodes.filter(
    (category) => category.slug !== 'uncategorized' && category.posts.nodes.length > 0
  );

  return filteredCategories;
});

const getAllCategories = async () => {
  const wpCategories = await getAllWpBlogCategories();
  return [...wpCategories, ...EXTRA_CATEGORIES];
};

const getCategoryBySlug = async (slug) => {
  const extraCategory = EXTRA_CATEGORIES.find((cat) => cat.slug === slug);
  if (extraCategory) return extraCategory;

  const wpCategories = await getAllWpBlogCategories();
  const wpCategory = wpCategories.find((cat) => cat.slug === slug);
  return wpCategory;
};

const fetchWpPostsByCategorySlug = async (slug, after) => {
  const postsQuery = gql`
    query Query($categoryName: String!, $first: Int!, $after: String) {
      posts(
        first: $first
        after: $after
        where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }
      ) {
        nodes {
          title(format: RENDERED)
          slug
          date
          pageBlogPost {
            largeCover {
              altText
              mediaItemUrl
            }
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
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  const data = await fetchGraphQL(graphQLClient).request(postsQuery, {
    first: BLOG_POSTS_PER_PAGE,
    after,
    categoryName,
  });

  return data?.posts;
};

const getWpPostsByCategorySlug = cache(async (slug) => {
  let allPosts = [];
  let afterCursor = null;

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { nodes: posts, pageInfo } = await fetchWpPostsByCategorySlug(slug, afterCursor);

    allPosts = allPosts.concat(posts);
    if (!pageInfo.hasNextPage) break;
    afterCursor = pageInfo.endCursor;
  }

  return allPosts;
});

const getPostsByCategorySlug = async (slug) => {
  if (slug === 'guides') {
    return getAllGuides();
  }

  if (slug === 'changelog') {
    return getAllChangelogs();
  }

  return getWpPostsByCategorySlug(slug);
};

const fetchAllWpPosts = async (after) => {
  const allPostsQuery = gql`
    query AllPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after) {
        nodes {
          categories {
            nodes {
              name
              slug
            }
          }
          modifiedGmt
          slug
          title(format: RENDERED)
          date
          content(format: RENDERED)
          pageBlogPost {
            isFeatured
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
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  const data = await fetchGraphQL(graphQLClient).request(allPostsQuery, {
    first: BLOG_POSTS_PER_PAGE,
    after,
  });

  return data?.posts;
};

const getAllWpPosts = cache(async () => {
  let allPosts = [];
  let afterCursor = null;

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { nodes: posts, pageInfo } = await fetchAllWpPosts(afterCursor);

    allPosts = allPosts.concat(posts);
    if (!pageInfo.hasNextPage) break;
    afterCursor = pageInfo.endCursor;
  }

  return allPosts;
});

const getAllPosts = async () => {
  const [wpPosts, guides, changelogs] = await Promise.all([
    getAllWpPosts(),
    getAllGuides(),
    getAllChangelogs(),
  ]);
  const allPosts = [...wpPosts, ...guides, ...changelogs];

  // Separate featured wp posts, guides and changelogs and all other
  const categories = {
    wpPosts: [],
    guides: [],
    changelogs: [],
    others: [],
  };

  // Find 2 most recent featured posts for each category
  allPosts.forEach((item) => {
    const { pageBlogPost, category, isFeatured } = item;
    const isWpPost = !!pageBlogPost;
    const isGuide = category === 'guides';
    const isChangelog = category === 'changelog';
    const featured = isWpPost ? pageBlogPost.isFeatured : isFeatured;

    if (featured) {
      if (isWpPost && categories.wpPosts.length < 2) {
        categories.wpPosts.push(item);
      } else if (isGuide && categories.guides.length < 2) {
        categories.guides.push(item);
      } else if (isChangelog && categories.changelogs.length < 2) {
        categories.changelogs.push(item);
      } else {
        categories.others.push(item);
      }
    } else {
      categories.others.push(item);
    }
  });

  // Sort the rest posts by date, newest first
  categories.others.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Combine the results
  return [
    ...categories.wpPosts,
    ...categories.guides,
    ...categories.changelogs,
    ...categories.others,
  ];
};

const getWpPostBySlug = cache(async (slug) => {
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
        dateGmt
        modifiedGmt
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

  const data = await fetchGraphQL(graphQLClient).request(postBySlugQuery, { id: slug });

  const sortedPosts = data?.posts?.nodes.filter((post) => post.slug !== slug).slice(0, 3);

  return {
    post: data?.post,
    relatedPosts: sortedPosts,
  };
});

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
          dateGmt
          modifiedGmt
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
      .filter((post) => post.slug !== revisionPostData?.post?.revisions?.edges[0].post.slug)
      .slice(0, 3);

    return {
      post: revisionPostData?.post?.revisions?.edges[0].post,
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

const getAllWpCaseStudiesPosts = cache(async () => {
  const caseStudiesQuery = gql`
    query CaseStudies {
      caseStudies(where: { orderby: { field: DATE, order: ASC } }, first: 100) {
        nodes {
          id
          title(format: RENDERED)
          caseStudyPost {
            isFeatured
            logo {
              mediaItemUrl
              mediaDetails {
                width
                height
              }
            }
            quote
            author {
              name
              post
            }
            isInternal
            externalUrl
            post {
              ... on Post {
                slug
              }
            }
          }
          caseStudiesCategories {
            nodes {
              slug
              name
            }
          }
        }
      }
    }
  `;
  const data = await fetchGraphQL(graphQLClient).request(caseStudiesQuery);

  return data?.caseStudies?.nodes;
});

const getAllWpCaseStudiesCategories = cache(async () => {
  const categoriesQuery = gql`
    query CaseStudiesCategories {
      caseStudiesCategories {
        nodes {
          slug
          name
          caseStudyCategory {
            featuredCaseStudy {
              ... on CaseStudy {
                id
              }
            }
          }
        }
      }
    }
  `;
  const data = await fetchGraphQL(graphQLClient).request(categoriesQuery);
  const categories = data?.caseStudiesCategories?.nodes;
  const updatedCategories = categories.map((category) => ({
    ...category,
    featuredCaseStudy: category.caseStudyCategory?.featuredCaseStudy?.id || null,
  }));

  return [{ name: 'All', slug: 'all' }, ...updatedCategories];
});

export {
  fetchAllWpPosts,
  getAllWpBlogCategories,
  getAllCategories,
  getAllWpCaseStudiesPosts,
  getAllWpCaseStudiesCategories,
  getAllWpPosts,
  getAllPosts,
  getCategoryBySlug,
  getWpPostBySlug,
  getPostsByCategorySlug,
  getWpPreviewPost,
  getWpPreviewPostData,
};
