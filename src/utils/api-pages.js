/* eslint-disable arrow-body-style */
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
  // TODO: remove this when enable WP
  return null;
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
    // TODO: remove this when enable WP
    return null;
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

  // TODO: remove this when enable WP
  return null;
};

export { getStaticPages, getStaticPageBySlug, getAboutPage };
