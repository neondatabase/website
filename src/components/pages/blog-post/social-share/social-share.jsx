import PropTypes from 'prop-types';
import React from 'react';
import { LinkedinShareButton, TwitterShareButton, FacebookShareButton } from 'react-share';

import Container from 'components/shared/container';
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

const SocialShare = ({ slug, title }) => {
  const shareUrl = `${process.env.GATSBY_DEFAULT_SITE_URL}${slug}`;

  return (
    <div className="safe-paddings mt-8">
      <Container
        className="flex items-center space-x-4 border-t border-gray-4 pt-8 xs:flex-col xs:space-x-0 xs:space-y-4"
        size="sm"
      >
        <span className="text-lg font-semibold">Share this article:</span>
        <div className="space-x-3.5">
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
      </Container>
    </div>
  );
};

SocialShare.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default SocialShare;
