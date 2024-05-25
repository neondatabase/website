import clsx from 'clsx';
import PropTypes from 'prop-types';

import ReleaseNoteList from 'components/pages/changelog/changelog-list';
import Hero from 'components/pages/changelog/hero';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import LastUpdatedDate from 'components/shared/last-updated-date';
import NavigationLinks from 'components/shared/navigation-links';
import TableOfContents from 'components/shared/table-of-contents';
// import Pagination from 'components/pages/changelog/pagination';
// import ChangelogFilter from 'components/pages/changelog/changelog-filter';
import { DOCS_BASE_PATH } from 'constants/docs';

import Tag from '../tag';

// TODO: Add pagination for changelog
const Changelog = ({
  // currentSlug,
  items,
}) => (
  <>
    <Hero />
    {/* <ChangelogFilter currentSlug={currentSlug} /> */}
    <ReleaseNoteList className="mt-4" items={items} />
    {/* {pageCount > 1 && <Pagination currentPageIndex={currentPageIndex} pageCount={pageCount} />} */}
  </>
);

Changelog.propTypes = {
  // currentSlug: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const Post = ({
  data: { title, subtitle, enableTableOfContents = false, tag = null, updatedOn = null },
  content,
  breadcrumbs,
  navigationLinks: { previousLink, nextLink },
  isChangelog = false,
  isFlowPage = false,
  changelogPosts = [],
  currentSlug,
  fileOriginPath,
  tableOfContents,
}) => (
  <>
    <div
      className={clsx(
        'flex flex-col lg:ml-0 lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8',
        isFlowPage
          ? 'col-span-6 col-start-4 -mx-10 2xl:col-span-9 2xl:col-start-2 2xl:mx-5 xl:col-span-8 xl:col-start-3'
          : 'col-span-6 -mr-12 ml-[-33px] 2xl:-ml-4 xl:col-span-9 xl:ml-10 xl:mr-0 xl:max-w-[750px] lg:max-w-none'
      )}
    >
      {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      {isChangelog ? (
        <Changelog currentSlug={currentSlug} items={changelogPosts} />
      ) : (
        <article>
          <h1
            className={clsx(
              'font-title text-[36px] font-medium leading-tight tracking-tighter xl:text-3xl',
              tag && 'inline'
            )}
          >
            {title}
          </h1>
          {tag && <Tag className="relative -top-1.5 ml-3 inline" label={tag} />}
          {subtitle && (
            <p className="my-2 text-xl leading-tight text-gray-new-40 dark:text-gray-new-80">
              {subtitle}
            </p>
          )}
          <Content className="mt-5" content={content} />
          {updatedOn && <LastUpdatedDate updatedOn={updatedOn} />}
        </article>
      )}

      {!isChangelog && (
        <NavigationLinks
          previousLink={previousLink}
          nextLink={nextLink}
          basePath={DOCS_BASE_PATH}
        />
      )}
      <DocFooter fileOriginPath={fileOriginPath} slug={currentSlug} />
    </div>

    <div className="col-start-10 col-end-13 ml-[50px] h-full xl:ml-0 xl:hidden">
      <nav className="no-scrollbars sticky bottom-10 top-[104px] max-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden">
        {enableTableOfContents && <TableOfContents items={tableOfContents} />}
      </nav>
    </div>
  </>
);

Post.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    enableTableOfContents: PropTypes.bool,
    tag: PropTypes.string,
    updatedOn: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  navigationLinks: PropTypes.exact({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  isChangelog: PropTypes.bool,
  isFlowPage: PropTypes.bool,
  changelogPosts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      content: PropTypes.string,
    })
  ),
  currentSlug: PropTypes.string.isRequired,
  fileOriginPath: PropTypes.string.isRequired,
  tableOfContents: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Post;
