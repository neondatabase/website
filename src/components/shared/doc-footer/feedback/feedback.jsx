'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import useSessionStorage from 'react-use/lib/useSessionStorage';

import { cn } from 'utils/cn';
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
        className={cn(
          'flex items-center space-x-5 transition-opacity duration-200 xs:flex-col xs:space-y-4 xs:space-x-0',
          isFeedbackSent ? 'invisible opacity-0' : 'visible opacity-100'
        )}
      >
        <span className="text-sm leading-snug tracking-extra-tight text-gray-new-40 dark:text-gray-new-70">
          Was this page helpful?
        </span>
        <div className="flex space-x-2.5">
          <button
            className="group flex items-center space-x-1 border border-gray-new-80 px-3 py-2 text-sm leading-none tracking-tight text-gray-new-30 dark:border-gray-new-20 dark:text-gray-new-85"
            type="button"
            onClick={() => handleFeedbackClick(true, slug)}
          >
            <ThumbsUpIcon className="h-3.5 w-3.5 shrink transition-colors duration-200 group-hover:text-[#38A57D] group-active:text-[#38A57D] dark:text-gray-new-85 group-hover:dark:text-[#38A57D] group-active:dark:text-[#38A57D]" />
            <span>Yes</span>
          </button>
          <button
            className="group flex items-center space-x-1 border border-gray-new-80 px-3 py-2 text-sm leading-none tracking-tight text-gray-new-30 dark:border-gray-new-20 dark:text-gray-new-85"
            type="button"
            onClick={() => handleFeedbackClick(false, slug)}
          >
            <ThumbsDownIcon className="h-3.5 w-3.5 shrink transition-colors duration-200 group-hover:text-secondary-1 group-active:text-secondary-1 dark:text-gray-new-85 group-hover:dark:text-secondary-1 group-active:dark:text-secondary-1" />
            <span>No</span>
          </button>
        </div>
      </div>
      <span
        className={cn(
          'absolute top-1/2 right-0 -translate-y-1/2 text-sm leading-tight transition-opacity duration-300',
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
