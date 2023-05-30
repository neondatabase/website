'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { LinkedinShareButton, TwitterShareButton, FacebookShareButton } from 'react-share';

import FacebookIcon from 'icons/facebook-sm.inline.svg';
import LinkedinIcon from 'icons/linkedin-sm.inline.svg';
import TwitterIcon from 'icons/twitter-sm.inline.svg';

const links = [
  {
    icon: TwitterIcon,
    tag: TwitterShareButton,
  },
  {
    icon: FacebookIcon,
    tag: FacebookShareButton,
  },
  {
    icon: LinkedinIcon,
    tag: LinkedinShareButton,
  },
];

const SocialShare = ({ className = null, slug, title, withTopBorder = false }) => (
  <div
    className={clsx(
      'safe-paddings flex items-center justify-between lg:justify-start lg:space-x-5',
      className,
      {
        'border-t border-white border-opacity-[0.06] pt-6': withTopBorder,
      }
    )}
  >
    <span className="leading-none text-gray-new-80">Share:</span>
    <div className="flex shrink-0 space-x-5">
      {links.map(({ icon: Icon, tag: Tag }, index) => (
        <Tag className="group" url={slug} title={title} key={index}>
          <Icon className="h-4 w-4 text-white transition-colors duration-200 group-hover:text-[#47FFC2] lg:h-6 lg:w-6" />
        </Tag>
      ))}
    </div>
  </div>
);

SocialShare.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  withTopBorder: PropTypes.bool,
};

export default SocialShare;
