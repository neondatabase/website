import PropTypes from 'prop-types';

import ChangelogList from 'components/pages/changelog/changelog-list';
import Hero from 'components/pages/changelog/hero';
import SubscribeForm from 'components/pages/changelog/subscribe-form';
import Aside from 'components/pages/doc/aside';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import Modal from 'components/pages/doc/modal';
import MODALS from 'components/pages/doc/modal/data';
import selectModal from 'components/pages/doc/modal/select-modal';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import Link from 'components/shared/link';
import NavigationLinks from 'components/shared/navigation-links';
import { DOCS_BASE_PATH } from 'constants/docs';
import { cn } from 'utils/cn';

import AgentSetupButton from '../agent-setup-button';
import DropdownMenu from '../dropdown-menu';
import Tag from '../tag';

// "View as Markdown" glyph for the page actions row (15px, stroke 1.6).
const MarkdownViewIcon = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="3" y="6" width="18" height="12" rx="1" />
    <path d="M6 15v-6l3 3 3-3v6" />
    <path d="M16 9v6M14 13l2 2 2-2" />
  </svg>
);

const Changelog = ({ posts }) => (
  <>
    <Hero />
    {/* <SubscribeForm className="mt-3.5" /> */}
    <SubscribeForm />
    <ChangelogList className="mt-14" posts={posts} />
  </>
);

Changelog.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Post = ({
  data: {
    title,
    subtitle,
    eyebrow = null,
    enableTableOfContents = false,
    tag = null,
    tagTheme = 'gray',
    layout = null,
    titleWidth = null,
    contentLayout = null,
    hideCopyPage = false,
    agentPrompt = null,
  },
  content,
  breadcrumbs,
  breadcrumbsBaseUrl = DOCS_BASE_PATH,
  navigationLinks: { previousLink, nextLink },
  navigationLinksBasePath = DOCS_BASE_PATH,
  isChangelog = false,
  isPostgres = false,
  changelogPosts = [],
  currentSlug,
  gitHubPath,
  markdownPath,
  tableOfContents,
  author,
  aboveContent = null,
  titleLeading = null,
  isFaq = false,
  className = 'max-w-208 lg:max-w-none',
}) => {
  const pagePath = `${navigationLinksBasePath}${currentSlug ?? ''}`;
  const modal = selectModal(MODALS, pagePath);

  // Check if wide layout is enabled (hides right sidebar/TOC)
  const isWideLayout = layout === 'wide';

  // Check if split content layout is enabled (2-column grid for SDK reference style)
  const isSplitLayout = contentLayout === 'split';

  const heading = (
    <h1
      className={cn(
        eyebrow
          ? 'text-[40px]! leading-[1.15]! font-semibold! tracking-tight text-balance md:text-[28px]!'
          : 'text-[36px] leading-tight font-medium tracking-tighter text-balance md:text-[28px]',
        tag && 'inline'
      )}
    >
      {title}
    </h1>
  );

  // The docs route doesn't pass markdownPath, so derive it from gitHubPath the
  // same way DropdownMenu does (e.g. content/docs/x.md -> /docs/x.md).
  const docMarkdownPath =
    markdownPath || (gitHubPath ? `/${gitHubPath.replace('content/', '')}` : null);

  // Page actions row: Copy page (menu) · View as Markdown · Set up agent.
  // Text-only, left-aligned, with 1px dividers between items.
  const actionsDivider = (
    <span aria-hidden="true" className="h-4 w-px shrink-0 bg-gray-new-85 dark:bg-gray-new-20" />
  );
  const pageActionsRow = (
    <div className="mt-3.5 flex flex-wrap items-center gap-3.5">
      {!hideCopyPage && (
        <>
          <DropdownMenu variant="inline" gitHubPath={gitHubPath} markdownPath={docMarkdownPath} />
          {actionsDivider}
        </>
      )}
      {docMarkdownPath && (
        <>
          <Link
            className="flex items-center gap-[7px] text-sm leading-none text-gray-new-20 transition-colors duration-[120ms] ease-out hover:text-black-new dark:text-gray-new-94 dark:hover:text-white"
            to={docMarkdownPath}
          >
            <MarkdownViewIcon />
            View as Markdown
          </Link>
          {actionsDivider}
        </>
      )}
      <AgentSetupButton agentPrompt={agentPrompt} />
    </div>
  );

  return (
    <>
      <div
        className={cn(
          'min-w-0 pb-32 lg:pb-24 md:pb-20',
          isChangelog && 'mx-auto',
          className,
          isWideLayout && 'max-w-none'
        )}
      >
        {breadcrumbs?.length > 0 && (
          <Breadcrumbs
            className={cn(isChangelog && 'pt-1', 'mb-7!')}
            breadcrumbs={breadcrumbs}
            baseUrl={breadcrumbsBaseUrl}
          />
        )}

        {isChangelog ? (
          <Changelog currentSlug={currentSlug} posts={changelogPosts} />
        ) : (
          <article>
            {isFaq ? (
              <>
                {!hideCopyPage && (
                  <div className="mb-5 flex justify-end sm:mb-3">
                    <DropdownMenu gitHubPath={gitHubPath} markdownPath={markdownPath} />
                  </div>
                )}
                <div>
                  <h1
                    className={cn(
                      'text-[36px] leading-tight font-medium tracking-tighter text-balance md:text-[28px]',
                      tag && 'inline'
                    )}
                  >
                    {title}
                  </h1>
                  {tag && (
                    <Tag className="relative -top-1.5 ml-3 inline" label={tag} theme={tagTheme} />
                  )}
                  {subtitle && (
                    <p className="mt-[1.125rem] text-xl leading-tight tracking-extra-tight text-gray-new-40 dark:text-gray-new-70 md:mt-1.5 md:text-lg">
                      {subtitle}
                    </p>
                  )}
                </div>
              </>
            ) : (
              // Title block: H1, subtitle, and the actions row as the last child,
              // over a bottom rule. Full content width (no narrow max-width), so
              // the H1 and subtitle no longer wrap early.
              <div
                className={cn(
                  'grid gap-2.5',
                  'mb-3 border-b border-gray-new-90 pb-[18px] dark:border-gray-new-15',
                  !isChangelog && isWideLayout && 'max-w-[860px]! 2xl:max-w-[860px]!',
                  eyebrow && 'max-w-[1100px]! 2xl:max-w-[1100px]!',
                  titleWidth === '530' && '2xl:max-w-[530px]! xl:max-w-[700px]!'
                )}
              >
                {eyebrow && (
                  <div className="text-xs leading-none font-semibold tracking-wider text-gray-new-50 uppercase dark:text-gray-new-70">
                    {eyebrow}
                  </div>
                )}
                <div>
                  {titleLeading ? (
                    <div className="flex items-center gap-3">
                      {titleLeading}
                      {heading}
                    </div>
                  ) : (
                    heading
                  )}
                  {tag && (
                    <Tag className="relative -top-1.5 ml-3 inline" label={tag} theme={tagTheme} />
                  )}
                </div>
                {subtitle && (
                  <p
                    className={cn(
                      eyebrow
                        ? 'text-[40px]! leading-[1.15]! font-semibold! tracking-tight text-gray-new-50 dark:text-gray-new-70 md:text-[28px]!'
                        : 'max-w-[64ch] text-xl leading-tight tracking-extra-tight text-gray-new-40 dark:text-gray-new-70 md:text-lg'
                    )}
                  >
                    {subtitle}
                  </p>
                )}
                {pageActionsRow}
              </div>
            )}
            {aboveContent}
            <Content
              className={cn('mt-10 lg:mt-7 md:mt-5', isSplitLayout && 'split-layout')}
              content={content}
              isPostgres={isPostgres}
            />
          </article>
        )}
        <DocFooter slug={currentSlug} gitHubPath={gitHubPath} />

        {!isChangelog && (
          <NavigationLinks
            className="mt-6"
            previousLink={previousLink}
            nextLink={nextLink}
            basePath={navigationLinksBasePath}
          />
        )}
      </div>

      {/* Regular pages: Show standard right sidebar (hide for wide layout and changelog) */}
      {!isWideLayout && !isChangelog && (
        <Aside
          className="ml-0! w-78 shrink-0 xl:hidden"
          isChangelog={isChangelog}
          enableTableOfContents={enableTableOfContents}
          tableOfContents={tableOfContents}
          gitHubPath={gitHubPath}
          author={author}
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
    eyebrow: PropTypes.string,
    enableTableOfContents: PropTypes.bool,
    tag: PropTypes.string,
    tagTheme: PropTypes.string,
    layout: PropTypes.oneOf(['wide', null]),
    titleWidth: PropTypes.oneOf(['530', null]),
    contentLayout: PropTypes.oneOf(['split', null]),
    hideCopyPage: PropTypes.bool,
    agentPrompt: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})),
  breadcrumbsBaseUrl: PropTypes.string,
  navigationLinks: PropTypes.exact({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  navigationLinksBasePath: PropTypes.string,
  isChangelog: PropTypes.bool,
  isPostgres: PropTypes.bool,
  changelogPosts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      content: PropTypes.string,
    })
  ),
  currentSlug: PropTypes.string.isRequired,
  gitHubPath: PropTypes.string.isRequired,
  markdownPath: PropTypes.string,
  tableOfContents: PropTypes.arrayOf(PropTypes.shape({})),
  author: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string.isRequired,
    position: PropTypes.string,
    bio: PropTypes.string,
    link: PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
    }),
    photo: PropTypes.string,
  }),
  aboveContent: PropTypes.node,
  titleLeading: PropTypes.node,
  isFaq: PropTypes.bool,
  className: PropTypes.string,
};

export default Post;
