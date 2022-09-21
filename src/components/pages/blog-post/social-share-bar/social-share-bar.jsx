import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';
import { LinkedinShareButton, TwitterShareButton, FacebookShareButton } from 'react-share';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import FacebookIcon from 'icons/facebook.inline.svg';
import LinkedinIcon from 'icons/linkedin.inline.svg';
import TwitterIcon from 'icons/twitter.inline.svg';

import CheckIcon from './images/check.inline.svg';
import LinkIcon from './images/link.inline.svg';

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

const SocialShareBar = ({ className, slug, title }) => {
  const { isCopied, handleCopy } = useCopyToClipboard();
  return (
    <div className={clsx('fixed bottom-0 z-10 w-full bg-white', className)}>
      <ul className="flex px-4 py-2.5" style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.16)' }}>
        {links.map(({ icon: Icon, tag: Tag }, index) => (
          <li className="flex flex-1 items-center justify-center" key={index}>
            <Tag
              className="flex w-full items-center justify-center"
              url={slug}
              title={title}
              key={index}
            >
              <Icon className="h-5 text-gray-1 opacity-60" />
            </Tag>
          </li>
        ))}
        <li className="flex flex-1 items-center justify-center">
          <button
            className="flex w-full items-center justify-center"
            type="button"
            onClick={() => handleCopy(slug)}
          >
            <AnimatePresence initial={false}>
              {!isCopied ? (
                <LinkIcon className="h-5 text-gray-1 opacity-60" />
              ) : (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckIcon className="h-5 w-5 text-gray-1 opacity-60" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </li>
      </ul>
    </div>
  );
};

SocialShareBar.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

SocialShareBar.defaultProps = {
  className: null,
};

export default SocialShareBar;
