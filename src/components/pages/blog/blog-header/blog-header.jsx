import clsx from 'clsx';
import PropTypes from 'prop-types';

import RssButton from 'components/shared/rss-button';

const BlogHeader = ({ className, title, category, basePath, inlineRss = false }) => (
  <div
    className={clsx(
      'relative mb-12 flex items-end gap-5 lg:mb-10 md:mb-8',
      inlineRss ? 'justify-start' : 'w-full justify-between',
      className
    )}
  >
    <h1 className="text-4xl font-medium leading-none tracking-tighter lg:text-[32px] md:text-[28px]">
      {title}
      {category && <span className="sr-only">{category}</span>}
    </h1>
    <RssButton className="mb-1 lg:mb-0.5" basePath={basePath} title={title} />
  </div>
);

BlogHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  category: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  inlineRss: PropTypes.bool,
};

export default BlogHeader;
