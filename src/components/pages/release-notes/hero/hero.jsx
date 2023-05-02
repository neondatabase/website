import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link/link';
import { RELEASE_NOTES_BASE_PATH } from 'constants/docs';

import RSSLogo from './images/rss.inline.svg';

const TITLE = 'Release notes';
const DESCRIPTION = 'The latest product updates from Neon';

const Hero = ({ className = null, withContainer = false }) => {
  const Tag = withContainer ? Container : 'div';
  return (
    <div className={className}>
      <Tag className={clsx('mb-6 sm:mb-7')} size="sm">
        <h1 className="text-[36px] font-semibold xl:text-3xl">{TITLE}</h1>
        <div className="mt-3 flex items-center justify-between sm:flex-col sm:items-start sm:gap-y-4">
          <p>{DESCRIPTION}</p>
          <Link
            className="flex items-center text-secondary-8 transition-colors duration-200 hover:text-secondary-7 dark:text-primary-1 dark:hover:text-primary-2"
            to={`${RELEASE_NOTES_BASE_PATH}rss.xml`}
          >
            <RSSLogo className="mr-1.5" />
            <span className="leading-none">RSS feed</span>
          </Link>
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
