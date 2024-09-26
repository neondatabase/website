import clsx from 'clsx';
import PropTypes from 'prop-types';

import ReleaseNoteList from 'components/pages/changelog/changelog-list';
import Hero from 'components/pages/changelog/hero';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import EditOnGithub from 'components/pages/doc/edit-on-github';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import SidebarCta from 'components/shared/sidebar-cta';
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
  isUseCase = false,
  changelogPosts = [],
  currentSlug,
  fileOriginPath,
  tableOfContents,
}) => (
  <>
    <div
      className={clsx(
        'flex flex-col lg:ml-0 lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8',
        isUseCase
          ? 'col-span-6 col-start-4 -mx-10 2xl:col-span-7 2xl:col-start-3 2xl:mx-0 xl:col-span-10 xl:col-start-2'
          : 'col-span-7 col-start-3 -ml-6 max-w-[832px] 3xl:col-span-8 3xl:col-start-2 3xl:ml-0 2xl:col-span-8 2xl:col-start-1 lg:max-w-none'
      )}
    >
      {breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      {isChangelog ? (
        <Changelog currentSlug={currentSlug} items={changelogPosts} />
      ) : (
        <article>
          <h1
            className={clsx(
              isUseCase
                ? 'text-[56px] font-semibold leading-dense tracking-tighter xl:text-5xl lg:text-4xl md:text-[28px] md:leading-tight'
                : 'font-title text-[36px] font-medium leading-tight tracking-tighter xl:text-3xl',
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
          <Content className="mt-5" content={content} isUseCase={isUseCase} />
        </article>
      )}

      {!isChangelog && (
        <NavigationLinks
          previousLink={previousLink}
          nextLink={nextLink}
          basePath={DOCS_BASE_PATH}
        />
      )}
      <DocFooter updatedOn={updatedOn} slug={currentSlug} />
    </div>

    <div
      className={clsx(
        'col-span-2 col-start-11 -ml-12 h-full max-w-64 xl:hidden',
        isUseCase
          ? '2xl:col-span-3 2xl:col-start-10 2xl:ml-auto 2xl:max-w-[238px]'
          : '3xl:-ml-20 2xl:col-span-4 2xl:col-start-9 2xl:ml-6'
      )}
    >
      <nav className="no-scrollbars sticky bottom-10 top-[104px] max-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden">
        {enableTableOfContents && <TableOfContents items={tableOfContents} />}
        <div
          className={clsx(
            enableTableOfContents &&
              'mt-2.5 w-56 border-t border-gray-new-90 pt-4 dark:border-gray-new-15/70'
          )}
        >
          {isUseCase ? <SidebarCta /> : <EditOnGithub fileOriginPath={fileOriginPath} />}
        </div>
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
  isUseCase: PropTypes.bool,
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
