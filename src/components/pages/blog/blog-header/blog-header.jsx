import clsx from 'clsx';
import PropTypes from 'prop-types';

import RssButton from 'components/shared/rss-button';

const BlogHeader = ({ className, title, category, basePath }) => (
  <div
    className={clsx(
      'relative mb-12 flex items-end justify-between gap-8 lg:mb-10 md:mb-8 md:flex-col',
      className
    )}
  >
    <div className="flex items-end gap-5 md:w-full md:justify-between">
      <h1 className="font-title text-4xl font-medium leading-none tracking-extra-tight lg:text-[32px] md:text-[28px]">
        {title}
        {category && <span className="sr-only">{category}</span>}
      </h1>
      <RssButton className="mb-1 lg:mb-0.5" basePath={basePath} title={title} />
    </div>
  </div>
);

BlogHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  category: PropTypes.string,
  basePath: PropTypes.string.isRequired,
};

export default BlogHeader;
