import clsx from 'clsx';
import PropTypes from 'prop-types';

import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import DocFooter from 'components/pages/doc/doc-footer';
import PreviousAndNextLinks from 'components/pages/doc/previous-and-next-links';
import TableOfContents from 'components/pages/doc/table-of-contents';
import Hero from 'components/pages/release-notes/hero';
// import Pagination from 'components/pages/release-notes/pagination';
import ReleaseNoteList from 'components/pages/release-notes/release-note-list';
// import ReleaseNotesFilter from 'components/pages/release-notes/release-notes-filter';
import Content from 'components/shared/content';

// TODO: Add pagination for release notes
const ReleaseNotes = ({
  // currentSlug,
  items,
}) => (
  <>
    <Hero />
    {/* <ReleaseNotesFilter currentSlug={currentSlug} /> */}
    <ReleaseNoteList className="mt-4" items={items} />
    {/* {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />} */}
  </>
);

ReleaseNotes.propTypes = {
  // currentSlug: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      content: PropTypes.shape({}).isRequired,
    })
  ).isRequired,
};

const Post = ({
  data: { title, subtitle, enableTableOfContents = false, updatedOn = null },
  content,
  breadcrumbs,
  navigationLinks: { previousLink, nextLink },
  isReleaseNotes = false,
  releaseNotes = [],
  currentSlug,
  fileOriginPath,
  tableOfContents,
}) => {
  const lastUpdatedOn = updatedOn
    ? new Date(updatedOn).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <div
        className={clsx(
          'col-span-6 -mx-10 flex flex-col 2xl:col-span-7 2xl:mx-5 xl:col-span-9 xl:ml-11 xl:mr-0 xl:max-w-[750px] lg:ml-0 lg:max-w-none lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8'
        )}
      >
        {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
        {isReleaseNotes ? (
          <ReleaseNotes currentSlug={currentSlug} items={releaseNotes} />
        ) : (
          <article>
            <h1 className="text-[36px] font-semibold leading-tight xl:text-3xl">{title}</h1>
            {subtitle && (
              <p className="my-2 text-xl leading-tight text-gray-new-40 dark:text-gray-new-80">
                {subtitle}
              </p>
            )}
            <Content className="mt-5" content={content} />
            {lastUpdatedOn && (
              <p className="text-gray-new-40 dark:text-gray-new-80 mt-10">
                Last updated on <time dateTime={updatedOn}>{lastUpdatedOn}</time>
              </p>
            )}
          </article>
        )}

        <PreviousAndNextLinks previousLink={previousLink} nextLink={nextLink} />
        <DocFooter fileOriginPath={fileOriginPath} slug={currentSlug} />
      </div>

      <div className={clsx('col-start-11 col-end-13 -ml-11 h-full 2xl:ml-0 xl:hidden')}>
        <nav className="no-scrollbars sticky bottom-10 top-10 max-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden">
          {enableTableOfContents && <TableOfContents items={tableOfContents} />}
        </nav>
      </div>
    </>
  );
};

Post.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    enableTableOfContents: PropTypes.bool,
    updatedOn: PropTypes.string,
  }).isRequired,
  content: PropTypes.shape({}).isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  navigationLinks: PropTypes.exact({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  isReleaseNotes: PropTypes.bool,
  releaseNotes: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      content: PropTypes.shape({}),
    })
  ),
  currentSlug: PropTypes.string.isRequired,
  fileOriginPath: PropTypes.string.isRequired,
  tableOfContents: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Post;
