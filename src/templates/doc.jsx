/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import MobileNav from 'components/pages/doc/mobile-nav';
import PreviousAndNextLinks from 'components/pages/doc/previous-and-next-links';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getDocPreviousAndNextLinks from 'utils/get-doc-previous-and-next-links';

const DocTemplate = ({
  data: {
    mdx: {
      excerpt,
      body,
      frontmatter: { id, title },
    },
  },
  pageContext: { docsSidebar },
}) => {
  const { previousLink, nextLink } = getDocPreviousAndNextLinks(id, docsSidebar);

  return (
    <Layout seo={SEO_DATA.doc({ title, description: excerpt })} headerTheme="white">
      <div className="safe-paddings pt-48 pb-48 3xl:pt-44 3xl:pb-44 2xl:pt-40 2xl:pb-40 xl:pt-32 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-6 md:pb-20">
        <Container className="grid grid-cols-12 lg:block" size="md">
          <Sidebar
            className="col-start-2 col-end-4 xl:col-start-1 lg:hidden"
            sidebar={docsSidebar}
            currentSlug={id}
          />
          <MobileNav className="hidden lg:block" sidebar={docsSidebar} currentSlug={id} />
          <div className="col-span-6 xl:col-span-9">
            <article>
              <h1 className="t-5xl font-semibold">{title}</h1>
              <Content className="mt-5" content={body} />
            </article>
            <PreviousAndNextLinks previousLink={previousLink} nextLink={nextLink} />
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
        id
        title
      }
    }
  }
`;

export default DocTemplate;
