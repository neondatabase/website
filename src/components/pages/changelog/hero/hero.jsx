import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import { CHANGELOG_BASE_PATH } from 'constants/docs';
import RSSLogo from 'icons/rss.inline.svg';

const TITLE = 'Changelog';
const DESCRIPTION = 'The latest product updates from Neon';

const Hero = ({ className = null, withContainer = false }) => {
  const Tag = withContainer ? Container : 'div';

  return (
    <div className={className}>
      <Tag
        className={clsx('mb-6 sm:mb-7', {
          'flex flex-col justify-center text-center': withContainer,
        })}
        size="sm"
      >
        <h1 className="text-[36px] font-semibold xl:text-3xl">{TITLE}</h1>
        <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-y-4">
          <p>{DESCRIPTION}</p>
          {!withContainer && (
            <a
              className="ml-3 flex items-center text-secondary-8 transition-colors duration-200 hover:text-secondary-7 dark:text-primary-1 dark:hover:text-primary-2 sm:ml-0"
              href={`${CHANGELOG_BASE_PATH}rss.xml`}
            >
              <RSSLogo className="mr-1.5" />
              <span className="leading-none">RSS feed</span>
            </a>
          )}
        </div>
      </Tag>
    </div>
  );
};

Hero.propTypes = {
  className: PropTypes.string,
  withContainer: PropTypes.bool,
  isReleaseNotePost: PropTypes.bool,
};

export default Hero;
