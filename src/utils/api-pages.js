import { gql, graphQLClient } from 'lib/graphQLClient';

const PAGE_SEO_FRAGMENT = gql`
  fragment wpPageSeo on Page {
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

const getLandingPages = async () => {
  const allLandingPagesQuery = gql`
    {
      pages {
        nodes {
          slug
          template {
            templateName
          }
        }
      }
    }
  `;
  const data = await graphQLClient.request(allLandingPagesQuery);

  return data?.pages.nodes.filter((node) => node.template.templateName === 'Landing');
};

const getStaticPages = async () => {
  const allStaticPagesQuery = gql`
    {
      pages {
        nodes {
          slug
          template {
            templateName
          }
        }
      }
    }
  `;
  const data = await graphQLClient.request(allStaticPagesQuery);

  return data?.pages.nodes.filter((node) => node.template.templateName === 'Static');
};

const getWpPageBySlug = async (slug) => {
  const wpPageBySlugQuery = gql`
    query wpPage($slug: ID!) {
      page(id: $slug, idType: URI) {
        content(format: RENDERED)
        title(format: RENDERED)
        template {
          templateName
        }
        ...wpPageSeo
      }
    }
    ${PAGE_SEO_FRAGMENT}
  `;
  const data = await graphQLClient.request(wpPageBySlugQuery, { slug });

  return data?.page;
};

const getAboutPage = async () => {
  const aboutPageQuery = gql`
    query aboutPage {
      page(id: "about-us", idType: URI) {
        content
        ...wpPageSeo
      }
    }
    ${PAGE_SEO_FRAGMENT}
  `;
  const data = await graphQLClient.request(aboutPageQuery);

  return data?.page;
};

export { getLandingPages, getStaticPages, getWpPageBySlug, getAboutPage };
