/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import DocContent from 'components/pages/doc-page/doc-content';
import DocMobileNav from 'components/pages/doc-page/doc-mobile-nav';
import DocNavLinks from 'components/pages/doc-page/doc-nav-links';
import Sidebar from 'components/pages/doc-page/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import { getPrevAndNextLinks } from 'utils/docs';

const DocPage = ({ data: { mdx: docData }, pageContext }) => {
  const { body: content, frontmatter, excerpt } = docData;

  const { previousLink, nextLink } = getPrevAndNextLinks(pageContext.id, pageContext.docSidebar);

  return (
    <Layout
      headerTheme="white"
      pageMetadata={SEO_DATA.docs({ title: frontmatter.title, description: excerpt || null })}
    >
      <Container size="md">
        <div className="mb-auto flex h-full flex-grow lg:flex-col">
          <div className="mt-48 w-[313px] flex-shrink-0 xl:w-[256px] lg:hidden">
            <Sidebar sidebar={pageContext.docSidebar} currentSlug={pageContext.id} />
          </div>
          <div className="hidden w-full lg:mt-8 lg:block">
            <DocMobileNav sidebar={pageContext.docSidebar} currentSlug={pageContext.id} />
          </div>
          <main className="mt-48 w-[calc(100%-313px)] pb-48 xl:w-[calc(100%-256px)] lg:mt-14 lg:w-full md:mt-10">
            <DocContent title={frontmatter.title} content={content} />
            <DocNavLinks previousLink={previousLink} nextLink={nextLink} />
          </main>
        </div>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!) {
    mdx(frontmatter: { id: { eq: $id } }) {
      frontmatter {
        id
        title
      }
      excerpt(pruneLength: 140)
      body
    }
  }
`;

export default DocPage;
