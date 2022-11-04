/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { graphql } from 'gatsby';
import React, { useRef } from 'react';

import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import DocFooter from 'components/pages/doc/doc-footer';
import MobileNav from 'components/pages/doc/mobile-nav';
import PreviousAndNextLinks from 'components/pages/doc/previous-and-next-links';
import Sidebar from 'components/pages/doc/sidebar';
import TableOfContents from 'components/pages/doc/table-of-contents';
import Hero from 'components/pages/release-notes/hero';
import Pagination from 'components/pages/release-notes/pagination';
import ReleaseNoteList from 'components/pages/release-notes/release-note-list';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const ReleaseNotes = ({ title, nodes, pageCount, currentPageIndex }) => (
  <>
    <Hero title={title} />
    <ReleaseNoteList items={nodes} />
    {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />}
  </>
);
const DocTemplate = (props) => {
  const {
    data: {
      mdx: {
        frontmatter: { title, enableTableOfContents },
      },
      allMdx: { nodes },
    },
    children,
    pageContext: {
      sidebar,
      currentSlug,
      isReleaseNotes,
      previousLink,
      nextLink,
      pageCount,
      currentPageIndex,
      fileOriginPath,
      breadcrumbs,
    },
  } = props;
  const contentRef = useRef(null);

  return (
    <Layout headerTheme="white" headerWithBottomBorder footerWithTopBorder isDocPage>
      <div className="safe-paddings flex flex-1 flex-col lg:block">
        <MobileNav className="hidden lg:block" sidebar={sidebar} currentSlug={currentSlug} />

        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
          size="lg"
        >
          <Sidebar
            className="relative col-start-1 col-end-4 max-w-[254px] bg-gray-9 pb-20 pt-[118px] before:absolute before:top-0 before:-right-5 before:-z-10 before:h-full before:w-[300%] before:bg-gray-9 lg:hidden"
            sidebar={sidebar}
            currentSlug={currentSlug}
          />
          <div
            className={clsx(
              '-mx-10 flex flex-col pt-[110px] pb-20 2xl:mx-0 xl:col-span-9 xl:ml-11 lg:ml-0 lg:pt-0 md:pb-[70px] sm:pb-8',
              isReleaseNotes ? 'col-span-7' : 'col-span-6 2xl:col-span-7 2xl:mx-5 xl:mr-0'
            )}
          >
            {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
            {isReleaseNotes ? (
              <ReleaseNotes
                title={title}
                nodes={nodes}
                pageCount={pageCount}
                currentPageIndex={currentPageIndex}
              />
            ) : (
              <article>
                <h1 className="text-[36px] font-semibold leading-tight xl:text-3xl">{title}</h1>
                <Content className="mt-5" content={children} ref={contentRef} />
              </article>
            )}
            <div className="mt-auto">
              <PreviousAndNextLinks previousLink={previousLink} nextLink={nextLink} />
              <DocFooter fileOriginPath={fileOriginPath} />
            </div>
          </div>
          {enableTableOfContents && (
            <TableOfContents
              className="col-start-11 col-end-13 -ml-11 pb-20 pt-[118px] 2xl:ml-0"
              contentRef={contentRef}
            />
          )}
        </Container>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ($id: String!, $limit: Int, $skip: Int, $draftFilter: [Boolean]) {
    mdx(id: { eq: $id }) {
      excerpt(pruneLength: 160)
      frontmatter {
        title
        enableTableOfContents
      }
    }
    allMdx(
      filter: {
        internal: { contentFilePath: { regex: "/release-notes/((?!RELEASE_NOTES_TEMPLATE).)*$/" } }
        fields: { isDraft: { in: $draftFilter } }
      }
      sort: { fields: internal___contentFilePath, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        body
        fields {
          slug: releaseNoteSlug
        }
        frontmatter {
          label
        }
      }
    }
  }
`;

export default DocTemplate;

export const Head = ({
  location: { pathname },
  data: {
    mdx: {
      excerpt,
      frontmatter: { title },
    },
  },
}) => <SEO pathname={pathname} {...SEO_DATA.doc({ title, description: excerpt })} />;
