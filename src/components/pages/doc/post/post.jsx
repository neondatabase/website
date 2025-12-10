import clsx from 'clsx';
import PropTypes from 'prop-types';

import ChangelogList from 'components/pages/changelog/changelog-list';
import Hero from 'components/pages/changelog/hero';
import Aside from 'components/pages/doc/aside';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import Modal from 'components/pages/doc/modal';
import MODALS from 'components/pages/doc/modal/data';
import ChangelogForm from 'components/shared/changelog-form';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import { DOCS_BASE_PATH } from 'constants/docs';

import Tag from '../tag';

const Changelog = ({ posts }) => (
  <>
    <Hero />
    <ChangelogForm className="mb-5 hidden xl:flex" />
    <ChangelogList className="mt-4" posts={posts} />
  </>
);

Changelog.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Post = ({
  data: {
    title,
    subtitle,
    enableTableOfContents = false,
    tag = null,
    updatedOn = null,
    layout = null,
    contentLayout = null,
  },
  content,
  breadcrumbs,
  navigationLinks: { previousLink, nextLink },
  navigationLinksPrefix,
  isChangelog = false,
  isPostgres = false,
  isDocsIndex = false,
  changelogPosts = [],
  currentSlug,
  gitHubPath,
  tableOfContents,
}) => {
  const modal = MODALS.find(
    (modal) =>
      breadcrumbs.some((breadcrumb) => modal.pagesToShow.includes(breadcrumb.title)) ||
      (isDocsIndex && modal.pagesToShow.includes('Neon Docs'))
  );

  // Check if wide layout is enabled (hides right sidebar/TOC)
  const isWideLayout = layout === 'wide';

  // Check if split content layout is enabled (2-column grid for SDK reference style)
  const isSplitLayout = contentLayout === 'split';

  return (
    <>
      <div className={clsx('min-w-0 pb-32 lg:pb-24 md:pb-20', isWideLayout && 'max-w-none')}>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            currentSlug={currentSlug}
            isPostgresPost={isPostgres}
          />
        )}
        {isChangelog ? (
          <Changelog currentSlug={currentSlug} posts={changelogPosts} />
        ) : (
          <article>
            <h1
              className={clsx(
                'text-balance text-[36px] font-semibold leading-tight tracking-extra-tight md:text-[28px]',
                tag && 'inline'
              )}
            >
              {title}
            </h1>
            {tag && <Tag className="relative -top-1.5 ml-3 inline" label={tag} />}
            {subtitle && (
              <p className="mt-2.5 text-xl leading-tight text-gray-new-40 dark:text-gray-new-80 md:mt-1.5 md:text-lg">
                {subtitle}
              </p>
            )}
            <Content
              className={clsx('mt-7 md:mt-5', isSplitLayout && 'split-layout')}
              content={content}
              isPostgres={isPostgres}
            />
          </article>
        )}

        {!isChangelog && (
          <NavigationLinks
            previousLink={previousLink}
            nextLink={nextLink}
            basePath={navigationLinksPrefix || DOCS_BASE_PATH}
          />
        )}
        {!isDocsIndex && <DocFooter updatedOn={updatedOn} slug={currentSlug} />}
      </div>

      {/* Regular pages: Show standard right sidebar */}
      {!isWideLayout && (
        <Aside
          className="!ml-0 w-64 shrink-0 xl:hidden"
          isDocsIndex={isDocsIndex}
          isChangelog={isChangelog}
          enableTableOfContents={enableTableOfContents}
          tableOfContents={tableOfContents}
          gitHubPath={gitHubPath}
        />
      )}
      {modal && <Modal {...modal} />}
    </>
  );
};

Post.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    enableTableOfContents: PropTypes.bool,
    tag: PropTypes.string,
    updatedOn: PropTypes.string,
    layout: PropTypes.oneOf(['wide', null]),
    contentLayout: PropTypes.oneOf(['split', null]),
  }).isRequired,
  content: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  navigationLinks: PropTypes.exact({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  navigationLinksPrefix: PropTypes.string,
  isChangelog: PropTypes.bool,
  isPostgres: PropTypes.bool,
  isDocsIndex: PropTypes.bool,
  changelogPosts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      content: PropTypes.string,
    })
  ),
  currentSlug: PropTypes.string.isRequired,
  gitHubPath: PropTypes.string.isRequired,
  tableOfContents: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Post;
