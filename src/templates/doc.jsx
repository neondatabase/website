/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React, { useRef } from 'react';

import MobileNav from 'components/pages/doc/mobile-nav';
import PreviousAndNextLinks from 'components/pages/doc/previous-and-next-links';
import Sidebar from 'components/pages/doc/sidebar';
import TableOfContents from 'components/pages/doc/table-of-contents';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getDocPreviousAndNextLinks from 'utils/get-doc-previous-and-next-links';

const DocTemplate = ({
  data: {
    mdx: {
      slug,
      excerpt,
      body,
      frontmatter: { title, enableTableOfContents },
    },
  },
  pageContext: { sidebar, flatSidebar },
}) => {
  const { previousLink, nextLink } = getDocPreviousAndNextLinks(slug, flatSidebar);
  const contentRef = useRef(null);

  return (
    <Layout seo={SEO_DATA.doc({ title, description: excerpt })} headerTheme="white">
      <div className="safe-paddings pt-48 pb-48 3xl:pt-44 3xl:pb-44 2xl:pt-40 2xl:pb-40 xl:pt-32 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-6 md:pb-20">
        <Container className="grid-gap-x grid grid-cols-12 lg:block" size="md">
          <Sidebar
            className="col-start-2 col-end-4 xl:col-start-1 lg:hidden"
            sidebar={sidebar}
            currentSlug={slug}
          />
          <MobileNav className="hidden lg:block" sidebar={sidebar} currentSlug={slug} />
          <div className="col-span-6 xl:col-span-9 lg:mt-6">
            <article>
              <h1 className="t-5xl font-semibold">{title}</h1>
              <Content className="mt-5" content={body} ref={contentRef} />
            </article>
            <PreviousAndNextLinks previousLink={previousLink} nextLink={nextLink} />
          </div>
          {enableTableOfContents && <TableOfContents contentRef={contentRef} />}
        </Container>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      excerpt(pruneLength: 160)
      body
      slug
      frontmatter {
        title
        enableTableOfContents
      }
    }
  }
`;

export default DocTemplate;
