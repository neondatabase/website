import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import { RELEASE_NOTES_BASE_PATH } from 'constants/docs';

import RSSLogo from './images/rss.inline.svg';

const TITLE = 'Release notes';
const DESCRIPTION = 'The latest product updates from Neon';

const Hero = ({ className = null, withContainer = false, isReleaseNotePost }) => {
  const Tag = withContainer ? Container : 'div';
  const TitleTag = isReleaseNotePost ? 'span' : 'h1';
  return (
    <div className={className}>
      <Tag
        className={clsx('mb-6 sm:mb-7', {
          'flex flex-col justify-center text-center': withContainer,
        })}
        size="sm"
      >
        <TitleTag className="text-[36px] font-semibold xl:text-3xl">{TITLE}</TitleTag>
        <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-y-4">
          <p>{DESCRIPTION}</p>
          {!withContainer && (
            <a
              className="ml-3 flex items-center text-secondary-8 transition-colors duration-200 hover:text-secondary-7 dark:text-primary-1 dark:hover:text-primary-2 md:ml-0"
              href={`${RELEASE_NOTES_BASE_PATH}rss.xml`}
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
