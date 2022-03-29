/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import DocMobileNav from 'components/pages/doc-page/doc-mobile-nav';
import DocNavLinks from 'components/pages/doc-page/doc-nav-links';
import Sidebar from 'components/pages/doc-page/sidebar';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { getPrevAndNextLinks } from 'utils/docs';

const DocPage = ({
  data: {
    mdx: {
      excerpt,
      body,
      frontmatter: { title },
    },
  },
  pageContext,
}) => {
  const { previousLink, nextLink } = getPrevAndNextLinks(pageContext.id, pageContext.docSidebar);

  return (
    <Layout seo={SEO_DATA.docs({ title, description: excerpt })} headerTheme="white">
      <div className="safe-paddings pt-48 pb-48 3xl:pt-44 3xl:pb-44 2xl:pt-40 2xl:pb-40 xl:pt-32 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-6 md:pb-20">
        <Container className="grid grid-cols-12 lg:block" size="md">
          <Sidebar
            className="col-start-2 col-end-4 xl:col-start-1 lg:hidden"
            sidebar={pageContext.docSidebar}
            currentSlug={pageContext.id}
          />
          <DocMobileNav
            className="hidden w-full lg:mb-8 lg:block"
            sidebar={pageContext.docSidebar}
            currentSlug={pageContext.id}
          />
          <div className="col-span-6 xl:col-span-9">
            <article>
              <h1 className="t-5xl font-semibold">{title}</h1>
              <Content className="mt-5" content={body} />
            </article>
            <DocNavLinks previousLink={previousLink} nextLink={nextLink} />
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!) {
    mdx(frontmatter: { id: { eq: $id } }) {
      excerpt(pruneLength: 140)
      body
      frontmatter {
        title
      }
    }
  }
`;

export default DocPage;
