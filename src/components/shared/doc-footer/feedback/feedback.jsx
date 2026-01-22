'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useSessionStorage from 'react-use/lib/useSessionStorage';

import sendGtagEvent from 'utils/send-gtag-event';

import ThumbsDownIcon from './images/thumbs-down.inline.svg';
import ThumbsUpIcon from './images/thumbs-up.inline.svg';

const Feedback = ({ slug }) => {
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [feedbackSentData, setFeedbackSentData] = useSessionStorage('isPageFeedbackSubmitted', []);

  const handleFeedbackClick = (isPositive) => {
    setIsFeedbackSent(true);
    if (!feedbackSentData?.includes(slug)) {
      setFeedbackSentData([...feedbackSentData, slug]);
      sendGtagEvent('page_feedback', {
        rate: isPositive ? 'like' : 'dislike',
      });
    }
  };

  return (
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
            className="group flex items-center space-x-1 rounded border border-gray-new-90 px-2.5 py-1.5 text-xs leading-none dark:border-gray-new-20 dark:text-gray-7"
            type="button"
            onClick={() => handleFeedbackClick(true, slug)}
          >
            <ThumbsUpIcon className="h-2.5 w-2.5 shrink transition-colors duration-200 group-hover:text-primary-1 group-active:text-primary-1 dark:text-gray-4" />
            <span>Yes</span>
          </button>
          <button
            className="group flex items-center space-x-1 rounded border border-gray-new-90 px-2.5 py-1.5 text-xs leading-none dark:border-gray-new-20 dark:text-gray-7"
            type="button"
            onClick={() => handleFeedbackClick(false, slug)}
          >
            <ThumbsDownIcon className="h-2.5 w-2.5 shrink transition-colors duration-200 group-hover:text-secondary-1 group-active:text-secondary-1 dark:text-gray-4" />
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
  );
};

Feedback.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default Feedback;
