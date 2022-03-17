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
        <div className="mb-auto flex h-full flex-grow lg:flex-col">
          <div className="absolute top-48 left-[calc((100%-860px)/2-313px)] w-[313px] flex-shrink-0 2xl:relative 2xl:left-0 2xl:top-0 2xl:mt-48 2xl:w-[256px] lg:hidden">
            <Sidebar sidebar={pageContext.docSidebar} currentSlug={pageContext.id} />
          </div>
          <div className="hidden w-full lg:mt-8 lg:block">
            <DocMobileNav sidebar={pageContext.docSidebar} currentSlug={pageContext.id} />
          </div>
          <main className="mx-auto mt-48 w-[860px] pb-48 2xl:w-[calc(100%-256px)] lg:mt-14 lg:w-full md:mt-10">
            <article className="relative">
              <div className="relative flex flex-col">
                <h1 className="text-[52px] font-semibold leading-tight md:text-5xl">
                  {frontmatter.title}
                </h1>
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
