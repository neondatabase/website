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

const DocPage = ({ data: { mdx: docData }, pageContext }) => {
  const { body: content, frontmatter, excerpt } = docData;

  const { previousLink, nextLink } = getPrevAndNextLinks(pageContext.id, pageContext.docSidebar);

  return (
    <Layout
      headerTheme="white"
      pageMetadata={SEO_DATA.docs({ title: frontmatter.title, description: excerpt || null })}
    >
      <Container size="md" className="relative">
        <div className="safe-paddings mb-auto flex h-full flex-grow pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:flex-col lg:pt-6">
          <div className="absolute top-48 left-[calc((100%-860px)/2-313px)] w-[313px] flex-shrink-0 2xl:relative 2xl:left-0 2xl:top-0 2xl:w-[256px] lg:hidden">
            <Sidebar sidebar={pageContext.docSidebar} currentSlug={pageContext.id} />
          </div>
          <div className="hidden w-full lg:mb-8 lg:block">
            <DocMobileNav sidebar={pageContext.docSidebar} currentSlug={pageContext.id} />
          </div>
          <main className="mx-auto w-[860px] pb-48 3xl:pb-44 2xl:w-[calc(100%-256px)] 2xl:pb-40 xl:pb-32 lg:w-full lg:pb-24 md:pb-20">
            <article className="relative">
              <div className="relative flex flex-col">
                <h1 className="t-5xl font-semibold">{frontmatter.title}</h1>
                <Content content={content} className="!mt-6 !max-w-full md:!mt-5" />
              </div>
            </article>
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
