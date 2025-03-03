import clsx from 'clsx';
import PropTypes from 'prop-types';

import RssButton from 'components/shared/rss-button';

const BlogHeader = ({ className, title, basePath }) => (
  <div
    className={clsx(
      'relative mb-12 flex items-end justify-between lg:mb-10 lg:items-center md:mb-8',
      className
    )}
  >
    <h1 className="font-title text-4xl font-medium leading-none tracking-extra-tight lg:text-[32px] md:text-[28px]">
      {title}
    </h1>
    <RssButton className="mb-1.5 lg:mb-0" basePath={basePath} title={title} />
  </div>
);

BlogHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
};

export default BlogHeader;
