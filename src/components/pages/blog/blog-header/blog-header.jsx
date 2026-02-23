import clsx from 'clsx';
import PropTypes from 'prop-types';

import RssButton from 'components/shared/rss-button';
import SectionLabel from 'components/shared/section-label';
import Socials from 'components/shared/socials';

const BlogHeader = ({ className, title, category, basePath, withLabel = false }) => (
  <div
    className={clsx(
      'relative mb-12 flex w-full items-end justify-between gap-5 lg:mb-10 md:mb-8',
      className
    )}
  >
    <div>
      {withLabel && (
        <SectionLabel className="mb-5 text-gray-new-80 lg:mb-[18px] md:mb-4">Blog</SectionLabel>
      )}
      <h1 className="max-w-[540px] text-[56px] leading-dense tracking-tighter lg:text-[32px] md:text-[28px]">
        {title}
        {category && <span className="sr-only">{category}</span>}
      </h1>
    </div>
    <div className="mb-2.5 flex items-center gap-x-4">
      <Socials withTitle={false} />
      <RssButton className="" basePath={basePath} title={title} />
    </div>
  </div>
);

BlogHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  category: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  withLabel: PropTypes.bool,
};

export default BlogHeader;
