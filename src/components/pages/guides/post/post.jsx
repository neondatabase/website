import PropTypes from 'prop-types';

import Actions from 'components/pages/doc/actions';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import TableOfContents from 'components/shared/table-of-contents';
import { GUIDES_BASE_PATH } from 'constants/guides';

import Author from './author';
import Sidebar from './sidebar';

const Post = ({
  data: { title, subtitle, enableTableOfContents = false, updatedOn = null },
  author,
  content,
  navigationLinks: { previousLink, nextLink },
  slug,
  gitHubPath,
  tableOfContents,
}) => (
  <>
    <Sidebar />

    <div className="col-span-6 col-start-4 -mx-[26px] flex flex-col xl:col-span-8 xl:col-start-1 xl:mx-0">
      <article>
        <h1 className="post-title font-title text-[36px] font-medium leading-tight tracking-tighter xl:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="my-2 text-xl leading-tight text-gray-new-40 dark:text-gray-new-80">
            {subtitle}
          </p>
        )}
        {author && <Author data={author} className="mt-5 hidden lg:block" />}
        <Content className="post-content mt-5" content={content} />
      </article>

      <NavigationLinks
        previousLink={previousLink}
        nextLink={nextLink}
        basePath={GUIDES_BASE_PATH}
      />
      <DocFooter updatedOn={updatedOn} slug={slug} />
    </div>

    <div className="col-start-11 col-end-13 -ml-11 h-full max-w-[256px] xl:col-start-10 lg:hidden">
      <div className="sticky top-[148px] flex max-h-[calc(100vh-150px)] flex-col pb-5">
        {enableTableOfContents && <TableOfContents items={tableOfContents} />}
        <Actions gitHubPath={gitHubPath} withBorder={enableTableOfContents} />
        {author && (
          <div className="mt-4 w-56 border-t border-gray-new-90 pt-4 dark:border-gray-new-15/70 lg:hidden">
            <Author data={author} />
          </div>
        )}
      </div>
    </div>
  </>
);

Post.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    enableTableOfContents: PropTypes.bool,
    updatedOn: PropTypes.string,
  }).isRequired,
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.string,
    bio: PropTypes.string,
    link: PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
    }),
    photo: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
  navigationLinks: PropTypes.exact({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  slug: PropTypes.string.isRequired,
  gitHubPath: PropTypes.string.isRequired,
  tableOfContents: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Post;
