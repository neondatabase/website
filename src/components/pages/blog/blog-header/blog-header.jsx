import clsx from 'clsx';
import PropTypes from 'prop-types';

import SearchInput from 'components/shared/algolia-search/search-input';
import RssButton from 'components/shared/rss-button';

const BlogHeader = ({ className, title, basePath }) => (
  <div
    className={clsx(
      'relative mb-12 flex items-end justify-between gap-5 lg:mb-10 md:mb-8 sm:flex-col',
      className
    )}
  >
    <div className="flex items-end gap-5 sm:w-full sm:justify-between">
      <h1 className="font-title text-4xl font-medium leading-none tracking-extra-tight lg:text-[32px] md:text-[28px]">
        {title}
      </h1>
      <RssButton className="mb-1 lg:mb-0.5" basePath={basePath} title={title} />
    </div>
    <SearchInput className="dark w-[232px] md:w-full" />
  </div>
);

BlogHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
};

export default BlogHeader;
