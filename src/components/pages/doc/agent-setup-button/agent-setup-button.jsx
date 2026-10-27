'use client';

import PropTypes from 'prop-types';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

// Base prompt copied on every docs page. Pages may append a page-specific
// sentence via the `agentPrompt` frontmatter field (threaded in from post.jsx).
export const BASE_AGENT_PROMPT =
  'Set up Neon. Fetch https://neon.com/get-started.md and follow it.';

// "Prompt copied" shows for 1.4s, then the button reverts to its default state.
const COPIED_RESET_MS = 1400;

const SparkleIcon = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  </svg>
);

const CheckIcon = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const AgentSetupButton = ({ agentPrompt = null, className = null }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(COPIED_RESET_MS);

  const prompt = agentPrompt ? `${BASE_AGENT_PROMPT} ${agentPrompt}` : BASE_AGENT_PROMPT;

  const handleClick = () => {
    handleCopy(prompt);
    sendGtagEvent('Action Clicked', { text: 'Agent setup', tag_name: 'DocsAgentSetup' });
  };

  return (
    <button
      className={cn(
        'flex h-[34px] shrink-0 items-center gap-2 rounded-[6px] border bg-white px-3 text-sm leading-none transition-colors duration-[120ms] ease-out dark:bg-black-new',
        isCopied
          ? 'border-green-44 text-[#157A55] dark:border-green-52 dark:text-green-52'
          : 'border-gray-new-85 text-gray-new-20 hover:border-green-44 dark:border-gray-new-20 dark:text-gray-new-94 dark:hover:border-green-52',
        className
      )}
      type="button"
      title="Copy a prompt that sets up Neon in your coding agent"
      aria-label={isCopied ? 'Prompt copied' : 'Agent setup'}
      onClick={isCopied ? undefined : handleClick}
    >
      <span className="flex text-green-44 dark:text-green-52">
        {isCopied ? <CheckIcon /> : <SparkleIcon />}
      </span>
      {isCopied ? 'Prompt copied' : 'Agent setup'}
    </button>
  );
};

AgentSetupButton.propTypes = {
  agentPrompt: PropTypes.string,
  className: PropTypes.string,
};

export default AgentSetupButton;
