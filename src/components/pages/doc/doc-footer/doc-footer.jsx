import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSessionStorage } from 'react-use';

import Link from 'components/shared/link';
import GitHubIcon from 'icons/github.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

import ThumbsDownIcon from './images/thumbs-down.inline.svg';
import ThumbsUpIcon from './images/thumbs-up.inline.svg';

const DocFooter = ({ fileOriginPath, slug }) => {
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [feedbackSentData, setFeedbackSentData] = useSessionStorage('isPageFeedbackSubmitted', []);

  const handleFeedbackClick = (isPositive) => {
    setFeedbackSentData({ ...feedbackSentData, [slug]: isPositive });
    setIsFeedbackSent(true);
    if (feedbackSentData[slug]) {
      return;
    }
    sendGtagEvent('page-feedback', {
      rate: isPositive ? 1 : 0,
    });
  };

  return (
    <div className="mt-10 flex items-center justify-between border-t border-gray-7 pt-5 sm:flex-col sm:space-y-4">
      <Link
        className="group inline-flex items-center space-x-2.5 text-sm leading-none transition-colors duration-200"
        to={fileOriginPath}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon className="h-6 w-6" />
        <span className="group-hover:text-secondary-8">Edit this page</span>
      </Link>

      <div className="relative">
        <div
          className={clsx(
            'flex items-center space-x-5 transition-opacity duration-200 xs:flex-col xs:space-x-0 xs:space-y-4',
            isFeedbackSent ? 'invisible opacity-0' : 'visible opacity-100'
          )}
        >
          <span className="text-sm leading-tight">Was this page helpful?</span>
          <div className="flex space-x-3">
            <button
              className="group flex items-center space-x-1 rounded border border-gray-7 px-2.5 py-1.5 text-xs leading-none"
              type="button"
              onClick={() => handleFeedbackClick(true, slug)}
            >
              <ThumbsUpIcon className="h-2.5 w-2.5 shrink transition-colors duration-200 group-hover:text-primary-1 group-active:text-primary-1" />
              <span>Yes</span>
            </button>
            <button
              className="group flex items-center space-x-1 rounded border border-gray-7 px-2.5 py-1.5 text-xs leading-none"
              type="button"
              onClick={() => handleFeedbackClick(false, slug)}
            >
              <ThumbsDownIcon className="h-2.5 w-2.5 shrink transition-colors duration-200 group-hover:text-secondary-1 group-active:text-secondary-1" />
              <span>No</span>
            </button>
          </div>
        </div>
        <span
          className={clsx(
            'absolute right-0 top-1/2 -translate-y-1/2 text-sm leading-tight transition-opacity duration-300',
            isFeedbackSent ? 'visible opacity-100' : 'invisible opacity-0'
          )}
        >
          Thank you for your feedback!
        </span>
      </div>
    </div>
  );
};

DocFooter.propTypes = {
  fileOriginPath: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default DocFooter;
