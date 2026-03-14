import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import RssButton from 'components/shared/rss-button';
import { CHANGELOG_BASE_PATH } from 'constants/docs';

const TITLE = 'Changelog';
const DESCRIPTION = 'The latest product updates from Neon';

const Hero = ({ className = null, withContainer = false }) => {
  const Tag = withContainer ? Container : 'div';

  return (
    <div className={clsx('changelog-hero mt-10 text-black-pure dark:text-white', className)}>
      <Tag
        className={clsx('mb-6 sm:mb-7', {
          'flex flex-col justify-center text-center': withContainer,
        })}
        size="sm"
      >
        <h1 className="flex items-center justify-between text-[48px] leading-dense tracking-tighter xl:text-4xl [&_svg]:size-5">
          {TITLE}
          {!withContainer && (
            <RssButton
              className="relative top-1 hidden gap-x-1.5 !text-gray-new-40 dark:!text-gray-new-70 sm:flex"
              size="sm"
              basePath={CHANGELOG_BASE_PATH}
            />
          )}
        </h1>
        <div className="mt-3.5 flex items-center justify-between text-gray-new-40 dark:text-gray-new-70 sm:flex-col sm:items-start sm:gap-y-4">
          <p className="text-xl leading-snug tracking-extra-tight">{DESCRIPTION}</p>
          {!withContainer && (
            <RssButton
              className="flex gap-x-1.5 !text-gray-new-40 dark:!text-gray-new-70 sm:hidden"
              size="sm"
              basePath={CHANGELOG_BASE_PATH}
            />
          )}
        </div>
      </Tag>
    </div>
  );
};

Hero.propTypes = {
  className: PropTypes.string,
  withContainer: PropTypes.bool,
};

export default Hero;
