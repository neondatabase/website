import clsx from 'clsx';
import PropTypes from 'prop-types';

import ChangelogList from 'components/pages/changelog/changelog-list';
import Hero from 'components/pages/changelog/hero';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import EditOnGithub from 'components/pages/doc/edit-on-github';
import Modal from 'components/pages/doc/modal';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import TableOfContents from 'components/shared/table-of-contents';
import { DOCS_BASE_PATH } from 'constants/docs';
import LINKS from 'constants/links';

import Tag from '../tag';

const Changelog = ({ posts }) => (
  <>
    <Hero />
    <ChangelogList className="mt-4" posts={posts} />
  </>
);

Changelog.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const MODALS = [
  {
    type: 'migrate',
    breadcrumb: 'Migrate to Neon',
    title: 'Migrating to Neon?',
    description: 'Our team can help minimize downtime.',
    link: {
      title: 'Get migration assistance',
      url: LINKS.migrationAssistance,
    },
  },
  {
    type: 'support',
    breadcrumb: 'Support',
    title: 'Need help now?',
    description: 'Please reach out to our Support team!',
    link: {
      title: 'Get support',
      url: LINKS.consoleSupport,
    },
  },
  {
    type: 'slack',
    breadcrumb: 'Neon Docs',
    title: 'Manage Neon in Slack',
    description: 'Get alerts, track usage, and manage your team right from Slack',
    link: {
      title: 'Get the Neon Slack app',
      url: '/docs/manage/slack-app',
    },
  },
  {
    type: 'slack',
    breadcrumb: ['Organizations', 'Manage organizations', 'Transfer a project'],
    title: 'Collaborate in Slack',
    description: 'Invite teammates to your Neon organization right from Slack',
    link: {
      title: 'Get the Neon Slack app',
      url: '/docs/manage/slack-app',
    },
  },
  {
    type: 'slack',
    breadcrumb: [
      'Monitor billing and usage',
      'Usage metrics',
      'Neon plans',
      'Pricing estimation guide',
      'Extra usage',
      'Sample project billing',
      'Manage billing',
    ],
    title: 'Track usage in Slack',
    description: 'Check project usage and get consumption alerts',
    link: {
      title: 'Get the Neon Slack app',
      url: '/docs/manage/slack-app',
    },
  },
];

const Post = ({
  data: { title, subtitle, enableTableOfContents = false, tag = null, updatedOn = null },
  content,
  breadcrumbs,
  navigationLinks: { previousLink, nextLink },
  navigationLinksPrefix,
  isChangelog = false,
  isUseCase = false,
  isPostgres = false,
  changelogPosts = [],
  currentSlug,
  fileOriginPath,
  tableOfContents,
}) => {
  const modal = MODALS.find(
    (modal) =>
      breadcrumbs.some((breadcrumb) =>
        Array.isArray(modal.breadcrumb)
          ? modal.breadcrumb.includes(breadcrumb.title)
          : modal.breadcrumb === breadcrumb.title
      ) ||
      (currentSlug === 'introduction' &&
        (Array.isArray(modal.breadcrumb)
          ? modal.breadcrumb.includes('Neon Docs')
          : modal.breadcrumb === 'Neon Docs'))
  );

  return (
    <>
      <div
        className={clsx(
          'flex flex-col lg:ml-0 lg:pt-0 md:mx-auto md:pb-[70px] sm:pb-8',
          isUseCase
            ? 'col-span-6 col-start-4 -mx-10 2xl:col-span-7 2xl:col-start-3 2xl:mx-0 xl:col-span-10 xl:col-start-2'
            : 'col-span-7 col-start-2 -ml-6 max-w-[832px] 3xl:ml-0 2xl:col-span-8 2xl:col-start-1 lg:max-w-full'
        )}
      >
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
                'font-semibold leading-tight tracking-extra-tight',
                isUseCase
                  ? 'text-[56px] xl:text-5xl lg:text-4xl md:text-[28px] md:leading-tight'
                  : 'text-[36px] xl:text-3xl',
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
            <Content
              className="mt-5"
              content={content}
              isUseCase={isUseCase}
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
        <DocFooter updatedOn={updatedOn} slug={currentSlug} />
      </div>

      <div
        className={clsx(
          'relative col-span-2 -ml-12 max-w-64 xl:hidden',
          isUseCase
            ? 'col-start-11 2xl:col-span-3 2xl:col-start-10 2xl:ml-auto 2xl:max-w-[238px]'
            : 'col-start-10 3xl:-ml-20 2xl:col-span-4 2xl:col-start-9 2xl:ml-6'
        )}
      >
        <div
          className={clsx(
            'sticky flex flex-col pb-5',
            isUseCase
              ? 'top-[188px] max-h-[calc(100vh-188px)]'
              : 'top-[136px] max-h-[calc(100vh-136px)]'
          )}
        >
          {enableTableOfContents && (
            <TableOfContents items={tableOfContents} isUseCase={isUseCase} />
          )}
          <div
            className={clsx(
              enableTableOfContents &&
                'mt-2.5 w-56 shrink-0 border-t border-gray-new-90 pt-4 dark:border-gray-new-15/70'
            )}
          >
            {!isUseCase && <EditOnGithub fileOriginPath={fileOriginPath} />}
          </div>
        </div>
      </div>

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
  }).isRequired,
  content: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  navigationLinks: PropTypes.exact({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  navigationLinksPrefix: PropTypes.string,
  isChangelog: PropTypes.bool,
  isUseCase: PropTypes.bool,
  isPostgres: PropTypes.bool,
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
