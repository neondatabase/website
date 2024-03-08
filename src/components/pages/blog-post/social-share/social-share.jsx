'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';

import LINKS from 'constants/links';
import FacebookIcon from 'icons/facebook-sm.inline.svg';
import LinkedinIcon from 'icons/linkedin-sm.inline.svg';
import XIcon from 'icons/x.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

const links = [
  {
    icon: XIcon,
    tag: TwitterShareButton,
    via: LINKS.twitter.split('/')[3],
    eventName: 'share_twitter',
  },
  {
    icon: FacebookIcon,
    tag: FacebookShareButton,
    eventName: 'share_facebook',
  },
  {
    icon: LinkedinIcon,
    tag: LinkedinShareButton,
    eventName: 'share_linkedin',
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
      {links.map(({ icon: Icon, tag: Tag, via, eventName }, index) => (
        <Tag
          className="group"
          url={slug}
          title={title}
          via={via}
          key={index}
          onClick={() => {
            sendGtagEvent(eventName);
          }}
        >
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
