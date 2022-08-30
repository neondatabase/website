import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { LinkedinShareButton, TwitterShareButton, FacebookShareButton } from 'react-share';

import FacebookIcon from 'icons/facebook.inline.svg';
import LinkedinIcon from 'icons/linkedin.inline.svg';
import TwitterIcon from 'icons/twitter.inline.svg';

const links = [
  {
    icon: TwitterIcon,
    tag: TwitterShareButton,
  },
  {
    icon: LinkedinIcon,
    tag: LinkedinShareButton,
  },
  {
    icon: FacebookIcon,
    tag: FacebookShareButton,
  },
];

const SocialShare = forwardRef(({ className, slug, title, withTopBorder, isSticky }, ref) => {
  const shareUrl = `${process.env.GATSBY_DEFAULT_SITE_URL}${slug}`;

  return (
    <div className={clsx('safe-paddings mt-8', className)} ref={ref}>
      <div
        className={clsx(
          'flex items-center space-x-4 xs:flex-col xs:space-x-0 xs:space-y-4',
          withTopBorder && 'border-t border-gray-4',
          isSticky ? 'sticky top-28' : 'pt-8'
        )}
      >
        {!isSticky && <span className="text-lg font-semibold">Share this article:</span>}
        <div className={clsx('flex', isSticky ? 'flex-col space-y-3' : 'space-x-3.5')}>
          {links.map(({ icon: Icon, tag: Tag }, index) => (
            <Tag url={shareUrl} title={title} key={index}>
              <div className="relative">
                <span
                  className="absolute -bottom-1 -left-1 h-full w-full rounded-full bg-secondary-5"
                  aria-hidden
                />
                <div className="relative flex h-[33px] w-[33px] items-center justify-center rounded-full border-2 border-black bg-white transition-transform duration-200 hover:translate-y-1 hover:-translate-x-1">
                  <Icon className="h-4" />
                </div>
              </div>
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
});

SocialShare.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  withTopBorder: PropTypes.bool,
  isSticky: PropTypes.bool,
};

SocialShare.defaultProps = {
  className: null,
  withTopBorder: false,
  isSticky: false,
};

export default SocialShare;
