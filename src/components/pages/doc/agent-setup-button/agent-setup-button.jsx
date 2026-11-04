'use client';

import PropTypes from 'prop-types';

import ProviderMarks from 'components/shared/provider-marks';
import useCopyPrompt from 'hooks/use-copy-prompt';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

// Base prompt copied on every docs page. Pages may append a page-specific
// sentence via the `agentPrompt` frontmatter field (threaded in from post.jsx).
export const BASE_AGENT_PROMPT =
  'Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it.';

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
  const { isCopied, copy } = useCopyPrompt();

  const prompt = agentPrompt ? `${BASE_AGENT_PROMPT} ${agentPrompt}` : BASE_AGENT_PROMPT;

  const handleClick = () =>
    copy(prompt, () =>
      sendGtagEvent('Action Clicked', { text: 'Agent setup', tag_name: 'DocsAgentSetup' })
    );

  return (
    <button
      className={cn(
        'flex items-center gap-2 text-sm leading-none transition-colors duration-[120ms] ease-out',
        isCopied
          ? 'text-[#157A55] dark:text-green-52'
          : 'text-gray-new-20 hover:text-[#157A55] dark:text-gray-new-94 dark:hover:text-green-52',
        className
      )}
      type="button"
      title="Copy a prompt that sets up Neon in your coding agent"
      aria-label={isCopied ? 'Prompt copied' : 'Set up agent'}
      onClick={isCopied ? undefined : handleClick}
    >
      {/* The vendor-mark cluster replaces the robot icon and stays put in the
          copied state; only the label and the appended check turn green. */}
      <ProviderMarks />
      {isCopied ? 'Prompt copied!' : 'Set up agent'}
      {isCopied && (
        <span className="flex text-[#157A55] dark:text-green-52">
          <CheckIcon />
        </span>
      )}
    </button>
  );
};

AgentSetupButton.propTypes = {
  agentPrompt: PropTypes.string,
  className: PropTypes.string,
};

export default AgentSetupButton;
