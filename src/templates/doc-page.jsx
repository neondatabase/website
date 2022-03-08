/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import DocContent from 'components/pages/doc-page/doc-content';
import DocNavLinks from 'components/pages/doc-page/doc-nav-links';
import DocLayout from 'layouts/doc-layout';
import { getPrevAndNextLinks } from 'utils/docs';

const DocPage = ({ data: { mdx: docData }, pageContext }) => {
  const { body: content, frontmatter, excerpt } = docData;

  const { previousLink, nextLink } = getPrevAndNextLinks(pageContext.id, pageContext.docSidebar);
  const seo = {
    title: `${frontmatter.title} – Browserless Docs`,
    metaDesc: excerpt || null,
  };

  return (
    <DocLayout
      seo={seo}
      pageContext={pageContext}
      sidebar={pageContext.docSidebar}
      currentSlug={pageContext.id}
    >
      <DocContent title={frontmatter.title} content={content} />
      <DocNavLinks previousLink={previousLink} nextLink={nextLink} />
    </DocLayout>
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
