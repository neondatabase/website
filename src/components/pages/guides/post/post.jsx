import clsx from 'clsx';
import PropTypes from 'prop-types';

import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import LastUpdatedDate from 'components/shared/last-updated-date';
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
  fileOriginPath,
  tableOfContents,
}) => (
  <>
    <Sidebar />

    <div className="col-span-6 col-start-4 -mx-[26px] flex flex-col xl:col-span-8 xl:col-start-1 xl:mx-0">
      <article>
        <h1 className="font-title text-[36px] font-medium leading-tight tracking-tighter xl:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="my-2 text-xl leading-tight text-gray-new-40 dark:text-gray-new-80">
            {subtitle}
          </p>
        )}
        {author && <Author data={author} className="mt-5 hidden lg:block" />}
        <Content className="mt-5" content={content} />
        {updatedOn && <LastUpdatedDate updatedOn={updatedOn} />}
      </article>

      <NavigationLinks
        previousLink={previousLink}
        nextLink={nextLink}
        basePath={GUIDES_BASE_PATH}
      />
      <DocFooter fileOriginPath={fileOriginPath} slug={slug} />
    </div>

    <div className="col-start-11 col-end-13 -ml-11 h-full max-w-[256px] xl:col-start-10 lg:hidden">
      <nav className="no-scrollbars sticky bottom-10 top-[104px] max-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden">
        {enableTableOfContents && <TableOfContents items={tableOfContents} />}
        {author && (
          <Author data={author} className={clsx('lg:hidden', enableTableOfContents && 'mt-14')} />
        )}
      </nav>
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
  fileOriginPath: PropTypes.string.isRequired,
  tableOfContents: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Post;
