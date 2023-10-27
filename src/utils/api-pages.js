// import { gql, graphQLClient } from 'lib/graphQLClient';

// const PAGE_SEO_FRAGMENT = gql`
//   fragment wpPageSeo on Page {
//     seo {
//       title
//       metaDesc
//       metaKeywords
//       metaRobotsNoindex
//       opengraphTitle
//       opengraphDescription
//       opengraphUrl
//       twitterImage {
//         mediaItemUrl
//       }
//     }
//   }
// `;

const getStaticPages = async () => {
  // const allStaticPagesQuery = gql`
  //   {
  //     pages {
  //       nodes {
  //         slug
  //         template {
  //           templateName
  //         }
  //       }
  //     }
  //   }
  // `;
  // const data = await graphQLClient.request(allStaticPagesQuery);

  // return data?.pages.nodes.filter((node) => node.template.templateName === 'Static');

  const data = [
    {
      slug: 'test',
      template: {
        templateName: 'Static',
      },
    },
  ];

  return data;
};

const getStaticPageBySlug = async () =>
  // slug
  {
    // const staticPageBySlugQuery = gql`
    //   query staticPage($slug: ID!) {
    //     page(id: $slug, idType: URI) {
    //       content(format: RENDERED)
    //       title(format: RENDERED)
    //       ...wpPageSeo
    //     }
    //   }
    //   ${PAGE_SEO_FRAGMENT}
    // `;
    // const data = await graphQLClient.request(staticPageBySlugQuery, { slug });

    // return data?.page;

    // TODO: remove mock data
    const data = {
      page: {
        content: '<p>test</p>',
        title: 'test',
        seo: {
          title: 'test',
          metaDesc: 'test',
          metaKeywords: 'test',
          metaRobotsNoindex: 'test',
          opengraphTitle: 'test',
          opengraphDescription: 'test',
          opengraphUrl: 'test',
          twitterImage: {
            mediaItemUrl: 'test',
          },
        },
      },
    };

    return data?.page;
  };

const getAboutPage = async () => {
  // const aboutPageQuery = gql`
  //   query aboutPage {
  //     page(id: "about-us", idType: URI) {
  //       content
  //       ...wpPageSeo
  //     }
  //   }
  //   ${PAGE_SEO_FRAGMENT}
  // `;
  // const data = await graphQLClient.request(aboutPageQuery);

  // return data?.page;

  // TODO: remove mock data
  const data = {
    page: {
      content: '<p>test</p>',
      seo: {
        title: 'test',
        metaDesc: 'test',
        metaKeywords: 'test',
        metaRobotsNoindex: 'test',
        opengraphTitle: 'test',
        opengraphDescription: 'test',
        opengraphUrl: 'test',
        twitterImage: {
          mediaItemUrl: 'test',
        },
      },
    },
  };

  return data?.page;
};

export { getStaticPages, getStaticPageBySlug, getAboutPage };
