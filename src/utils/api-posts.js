// import { BLOG_POSTS_PER_PAGE } from 'constants/blog';
// import { gql, graphQLClient, graphQLClientAdmin } from 'lib/graphQLClient';

// import getAuthToken from './api-auth';

const mockupData = {
  post: {
    categories: {
      nodes: [
        {
          name: 'Community',
          slug: 'Community',
        },
      ],
    },
    title: 'MITM attacks are easier to avoid with psql (Postgres) 16',
    slug: 'avoid-mitm-attacks-with-psql-postgres-16',
    excerpt:
      '<p>The psql client accepts a new connection string option in Postgres 16: ?sslrootcert=system. This new option makes it simpler than ever to connect a secure interactive session to your Neon database: You can use psql version 16 with this new option even if your Neon database is still on Postgres 14 or 15. Read on [&hellip;]</p>\n',
    dateGmt: '2021-09-30T12:00:00',
    modifiedGmt: '2021-09-30T12:00:00',
    content: 'test',
    date: '2021-09-30T12:00:00',
    readingTime: 'test',
    pageBlogPost: {
      largeCover: {
        altText: 'test',
        mediaItemUrl:
          'https://neon-hwp.dreamhosters.com/wp-content/uploads/2023/10/neon-MITM-attacks-2.jpg',
      },
      description:
        'Learn how the psql client in Postgres 16 makes it simpler than ever to connect a secure interactive session to your Neon database',
      authors: [
        {
          author: {
            title: 'George MacKerron',
            postAuthor: {
              role: 'Typescript Developer',
              url: 'test',
              image: {
                altText: 'test',
                mediaItemUrl:
                  'https://neon-hwp.dreamhosters.com/wp-content/uploads/2022/12/george-mackerron.png',
              },
            },
          },
        },
      ],
    },
    seo: {
      title: 'MITM attacks are easier to avoid with psql (Postgres) 16',
      metaDesc:
        'Learn how the psql client in Postgres 16 makes it simpler than ever to connect a secure interactive session to your Neon database',
      opengraphTitle: 'MITM attacks are easier to avoid with psql (Postgres) 16',
      opengraphDescription:
        'Learn how the psql client in Postgres 16 makes it simpler than ever to connect a secure interactive session to your Neon database',
      twitterImage: {
        mediaItemUrl:
          'https://neon-hwp.dreamhosters.com/wp-content/uploads/2023/10/neon-MITM-attacks-2.jpg',
      },
    },
  },
};

// const POST_SEO_FRAGMENT = gql`
//   fragment wpPostSeo on Post {
//     seo {
//       title
//       metaDesc
//       opengraphTitle
//       opengraphDescription
//       twitterImage {
//         mediaItemUrl
//       }
//     }
//   }
// `;

const getAllWpBlogCategories = async () => {
  //   const categoriesQuery = gql`
  //     query Categories {
  //       categories {
  //         nodes {
  //           name
  //           slug
  //         }
  //       }
  //     }
  //   `;
  //   const data = await graphQLClient.request(categoriesQuery);
  //   const filteredCategories = data?.categories?.nodes.filter(
  //     (category) => category.slug !== 'uncategorized'
  //   );

  //   return [...filteredCategories, { name: 'All posts', slug: 'all-posts' }];
  // TODO: remove mock data
  const data = [
    {
      name: 'test',
      slug: 'test',
    },
  ];

  return [...data, { name: 'All posts', slug: 'all-posts' }];
};

const getWpPostsByCategorySlug = async () =>
  // slug
  {
    // const postsQuery = gql`
    //   query Query($categoryName: String!, $first: Int!) {
    //     posts(
    //       first: $first
    //       where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }
    //     ) {
    //       nodes {
    //         title(format: RENDERED)
    //         slug
    //         date
    //         pageBlogPost {
    //           largeCover {
    //             altText
    //             mediaItemUrl
    //           }
    //           authors {
    //             author {
    //               ... on PostAuthor {
    //                 title
    //                 postAuthor {
    //                   role
    //                   url
    //                   image {
    //                     altText
    //                     mediaItemUrl
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // `;

    // const allPostsQuery = gql`
    //   query AllPosts($first: Int!) {
    //     posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
    //       nodes {
    //         categories {
    //           nodes {
    //             name
    //             slug
    //           }
    //         }
    //         excerpt
    //         slug
    //         title(format: RENDERED)
    //         date
    //         pageBlogPost {
    //           largeCover {
    //             altText
    //             mediaItemUrl
    //           }
    //           description
    //           authors {
    //             author {
    //               ... on PostAuthor {
    //                 title
    //                 postAuthor {
    //                   role
    //                   url
    //                   image {
    //                     altText
    //                     mediaItemUrl
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // `;

    // if (slug === 'all-posts') {
    //   const allPostsData = await graphQLClient.request(allPostsQuery, {
    //     first: BLOG_POSTS_PER_PAGE,
    //   });

    //   return allPostsData?.posts?.nodes;
    // }
    // const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    // const data = await graphQLClient.request(postsQuery, {
    //   first: BLOG_POSTS_PER_PAGE,
    //   categoryName,
    // });

    // return data?.posts?.nodes;

    // TODO: remove mock data
    const data = [mockupData.post];

    return data;
  };

const getWpBlogPage = async () => {
  // const blogPageQuery = gql`
  //   query BlogPage {
  //     page(idType: URI, id: "blog") {
  //       template {
  //         ... on Template_Blog {
  //           templateName
  //           pageBlog {
  //             featuredPosts {
  //               post {
  //                 ... on Post {
  //                   categories {
  //                     nodes {
  //                       name
  //                       slug
  //                     }
  //                   }
  //                   title(format: RENDERED)
  //                   slug
  //                   date
  //                   pageBlogPost {
  //                     largeCover {
  //                       altText
  //                       mediaItemUrl
  //                     }
  //                     authors {
  //                       author {
  //                         ... on PostAuthor {
  //                           title
  //                           postAuthor {
  //                             role
  //                             url
  //                             image {
  //                               altText
  //                               mediaItemUrl
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             companyFeaturedPosts {
  //               post {
  //                 ... on Post {
  //                   title(format: RENDERED)
  //                   slug
  //                   date
  //                   pageBlogPost {
  //                     largeCover {
  //                       altText
  //                       mediaItemUrl
  //                     }
  //                     authors {
  //                       author {
  //                         ... on PostAuthor {
  //                           title
  //                           postAuthor {
  //                             role
  //                             url
  //                             image {
  //                               altText
  //                               mediaItemUrl
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             communityFeaturedPosts {
  //               post {
  //                 ... on Post {
  //                   title(format: RENDERED)
  //                   slug
  //                   date
  //                   pageBlogPost {
  //                     largeCover {
  //                       altText
  //                       mediaItemUrl
  //                     }
  //                     authors {
  //                       author {
  //                         ... on PostAuthor {
  //                           title
  //                           postAuthor {
  //                             role
  //                             url
  //                             image {
  //                               altText
  //                               mediaItemUrl
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             videos {
  //               post {
  //                 ... on Video {
  //                   title(format: RENDERED)
  //                   date
  //                   pageBlogPost: videoPost {
  //                     url
  //                     largeCover: coverImage {
  //                       mediaItemUrl
  //                       altText
  //                     }
  //                     author {
  //                       ... on PostAuthor {
  //                         title(format: RENDERED)
  //                         postAuthor {
  //                           role
  //                           url
  //                           image {
  //                             altText
  //                             mediaItemUrl
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             appearances {
  //               post {
  //                 ... on Appearance {
  //                   title(format: RENDERED)
  //                   appearancePost {
  //                     url
  //                     coverImage {
  //                       mediaItemUrl
  //                       altText
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             engineeringFeaturedPosts {
  //               post {
  //                 ... on Post {
  //                   title(format: RENDERED)
  //                   slug
  //                   date
  //                   pageBlogPost {
  //                     largeCover {
  //                       altText
  //                       mediaItemUrl
  //                     }
  //                     authors {
  //                       author {
  //                         ... on PostAuthor {
  //                           title
  //                           postAuthor {
  //                             role
  //                             url
  //                             image {
  //                               altText
  //                               mediaItemUrl
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // `;
  // const data = await graphQLClient.request(blogPageQuery);

  // return data?.page?.template?.pageBlog;
  // TODO: remove mock data
  const data = {
    featuredPosts: [
      {
        post: mockupData.post,
      },
      {
        post: mockupData.post,
      },
    ],
    companyFeaturedPosts: [
      {
        post: mockupData.post,
      },
      {
        post: mockupData.post,
      },
    ],
    communityFeaturedPosts: [
      {
        post: mockupData.post,
      },
      {
        post: mockupData.post,
      },
    ],
    videos: [
      {
        post: mockupData.post,
      },
    ],
    appearances: [
      {
        post: {
          title: 'test',
          appearancePost: {
            url: 'test',
            coverImage: {
              mediaItemUrl:
                'https://neon-hwp.dreamhosters.com/wp-content/uploads/2023/10/neon-MITM-attacks-2.jpg',
              altText: 'test',
            },
          },
        },
      },
    ],
    engineeringFeaturedPosts: [
      {
        post: mockupData.post,
      },
    ],
  };

  return data;
};

const getAllWpPosts = async () => {
  // const allPostsQuery = gql`
  //   query AllPosts($first: Int!) {
  //     posts(first: $first) {
  //       nodes {
  //         categories {
  //           nodes {
  //             name
  //             slug
  //           }
  //         }
  //         excerpt
  //         slug
  //         title(format: RENDERED)
  //         date
  //         pageBlogPost {
  //           largeCover {
  //             altText
  //             mediaItemUrl
  //           }
  //           description
  //           authors {
  //             author {
  //               ... on PostAuthor {
  //                 title
  //                 postAuthor {
  //                   role
  //                   url
  //                   image {
  //                     altText
  //                     mediaItemUrl
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // `;
  // const data = await graphQLClient.request(allPostsQuery, {
  //   first: BLOG_POSTS_PER_PAGE,
  // });

  // return data?.posts?.nodes;

  // TODO: remove mock data
  const data = [mockupData.post];

  return data;
};

const getWpPostBySlug = async () =>
  // slug
  {
    // const postBySlugQuery = gql`
    //   query PostBySlug($id: ID!) {
    //     post(id: $id, idType: URI) {
    //       categories {
    //         nodes {
    //           name
    //           slug
    //         }
    //       }
    //       slug
    //       date
    //       dateGmt
    //       modifiedGmt
    //       title(format: RENDERED)
    //       content(format: RENDERED)
    //       readingTime
    //       pageBlogPost {
    //         largeCover {
    //           altText
    //           mediaItemUrl
    //         }
    //         description
    //         authors {
    //           author {
    //             ... on PostAuthor {
    //               title
    //               postAuthor {
    //                 role
    //                 url
    //                 image {
    //                   altText
    //                   mediaItemUrl
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //       ...wpPostSeo
    //     }

    //     posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
    //       nodes {
    //         categories {
    //           nodes {
    //             name
    //             slug
    //           }
    //         }
    //         slug
    //         title(format: RENDERED)
    //         date
    //         readingTime
    //         pageBlogPost {
    //           largeCover {
    //             altText
    //             mediaItemUrl
    //           }
    //           description
    //           authors {
    //             author {
    //               ... on PostAuthor {
    //                 title
    //                 postAuthor {
    //                   role
    //                   url
    //                   image {
    //                     altText
    //                     mediaItemUrl
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   ${POST_SEO_FRAGMENT}
    // `;

    // const data = await graphQLClient.request(postBySlugQuery, { id: slug });

    // const sortedPosts = data?.posts?.nodes.filter((post) => post.slug !== slug).slice(0, 3);

    // return {
    //   post: data?.post,
    //   relatedPosts: sortedPosts,
    // };

    // TODO: remove mock data
    const data = {
      post: mockupData.post,
      posts: [mockupData.post],
    };

    return {
      post: data?.post,
      relatedPosts: data?.posts,
    };
  };

// Query that executes when user requests a preview on a CMS,
// the difference from a standard post query is that it uses Admin token to access unpublished posts and revisions of published posts

const getWpPreviewPostData = async () =>
  // id, status
  {
    // const {
    //   refreshJwtAuthToken: { authToken },
    // } = await getAuthToken();
    // const isDraft = status === 'draft';
    // const isRevision = status === 'publish';
    // let query;
    // if (isDraft) {
    //   query = gql`
    //     query PostById($id: ID!) {
    //       post(id: $id, idType: DATABASE_ID) {
    //         categories {
    //           nodes {
    //             name
    //             slug
    //           }
    //         }
    //         slug
    //         date
    //         dateGmt
    //         modifiedGmt
    //         title(format: RENDERED)
    //         content(format: RENDERED)
    //         readingTime
    //         pageBlogPost {
    //           largeCover {
    //             altText
    //             mediaItemUrl
    //           }
    //           description
    //           authors {
    //             author {
    //               ... on PostAuthor {
    //                 title
    //                 postAuthor {
    //                   role
    //                   url
    //                   image {
    //                     altText
    //                     mediaItemUrl
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //         ...wpPostSeo
    //       }
    //       posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
    //         nodes {
    //           categories {
    //             nodes {
    //               name
    //               slug
    //             }
    //           }
    //           slug
    //           title(format: RENDERED)
    //           date
    //           readingTime
    //           pageBlogPost {
    //             largeCover {
    //               altText
    //               mediaItemUrl
    //             }
    //             description
    //             authors {
    //               author {
    //                 ... on PostAuthor {
    //                   title
    //                   postAuthor {
    //                     role
    //                     url
    //                     image {
    //                       altText
    //                       mediaItemUrl
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //     ${POST_SEO_FRAGMENT}
    //   `;
    //   const data = await graphQLClientAdmin(authToken).request(query, { id });
    //   const sortedPosts = data?.posts?.nodes
    //     .filter((post) => post.slug !== data?.post?.slug)
    //     .slice(0, 3);
    //   return {
    //     post: data?.post,
    //     relatedPosts: sortedPosts,
    //   };
    // }
    // if (isRevision) {
    //   query = gql`
    //     query PostById($id: ID!) {
    //       post(id: $id, idType: DATABASE_ID) {
    //         ...wpPostSeo
    //         revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
    //           edges {
    //             post: node {
    //               categories {
    //                 nodes {
    //                   name
    //                   slug
    //                 }
    //               }
    //               slug
    //               date
    //               title(format: RENDERED)
    //               content(format: RENDERED)
    //               readingTime
    //               pageBlogPost {
    //                 largeCover {
    //                   mediaItemUrl
    //                 }
    //                 description
    //                 authors {
    //                   author {
    //                     ... on PostAuthor {
    //                       title
    //                       postAuthor {
    //                         role
    //                         url
    //                         image {
    //                           altText
    //                           mediaItemUrl
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //       posts(first: 4, where: { orderby: { field: DATE, order: DESC } }) {
    //         nodes {
    //           categories {
    //             nodes {
    //               name
    //               slug
    //             }
    //           }
    //           slug
    //           title(format: RENDERED)
    //           date
    //           readingTime
    //           pageBlogPost {
    //             largeCover {
    //               altText
    //               mediaItemUrl
    //             }
    //             description
    //             authors {
    //               author {
    //                 ... on PostAuthor {
    //                   title
    //                   postAuthor {
    //                     role
    //                     url
    //                     image {
    //                       altText
    //                       mediaItemUrl
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //     ${POST_SEO_FRAGMENT}
    //   `;
    //   const revisionPostData = await graphQLClientAdmin(authToken).request(query, {
    //     id,
    //   });
    //   // TODO: Pass seo data to head component
    //   const sortedPosts = revisionPostData?.posts?.nodes
    //     .filter((post) => post.slug !== revisionPostData?.post?.revisions?.edges[0].post.slug)
    //     .slice(0, 3);
    //   return {
    //     post: revisionPostData?.post?.revisions?.edges[0].post,
    //     relatedPosts: sortedPosts,
    //   };
    // }

    // TODO: remove mock data
    const data = {
      post: mockupData.post,
      posts: [mockupData.post],
    };

    return {
      post: data?.post,
      relatedPosts: data?.posts,
    };
  };

const getWpPreviewPost = async () =>
  // id
  {
    // const {
    //   refreshJwtAuthToken: { authToken },
    // } = await getAuthToken();

    // const findPreviewPostQuery = gql`
    //   query PreviewPost($id: ID!) {
    //     post(id: $id, idType: DATABASE_ID) {
    //       databaseId
    //       slug
    //       status
    //     }
    //   }
    // `;

    // return graphQLClientAdmin(authToken).request(findPreviewPostQuery, { id });

    const data = {
      post: {
        databaseId: 1,
        slug: 'test',
        status: 'test',
      },
    };

    return data;
  };

export {
  getAllWpPosts,
  getWpPostBySlug,
  getWpPreviewPostData,
  getWpPreviewPost,
  getWpBlogPage,
  getAllWpBlogCategories,
  getWpPostsByCategorySlug,
};
