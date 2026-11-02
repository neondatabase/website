'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import RobotIcon from 'icons/docs/sidebar/ai-agent.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

// Base prompt copied on every docs page. Pages may append a page-specific
// sentence via the `agentPrompt` frontmatter field (threaded in from post.jsx).
export const BASE_AGENT_PROMPT =
  'Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it.';

// "Prompt copied" shows for 1.4s, then the button reverts to its default state.
const COPIED_RESET_MS = 1400;

// Copy as plain text only. navigator.clipboard.writeText writes a text/plain
// payload (no text/html), so the prompt pastes as normal body text rather than
// the styled/monospace markup a DOM-selection copy would carry. The hidden
// textarea execCommand path is a plain-text fallback for browsers without the
// async clipboard API.
async function copyPlainText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the textarea fallback.
    }
  }
  if (typeof document === 'undefined') return;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch {
    // Clipboard unavailable; nothing more we can do.
  }
  document.body.removeChild(textarea);
}

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
  const [isCopied, setIsCopied] = useState(false);
  const resetTimeoutRef = useRef(null);

  const prompt = agentPrompt ? `${BASE_AGENT_PROMPT} ${agentPrompt}` : BASE_AGENT_PROMPT;

  useEffect(() => () => clearTimeout(resetTimeoutRef.current), []);

  const handleClick = async () => {
    await copyPlainText(prompt);
    setIsCopied(true);
    clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
    sendGtagEvent('Action Clicked', { text: 'Agent setup', tag_name: 'DocsAgentSetup' });
  };

  return (
    <button
      className={cn(
        'flex items-center gap-[7px] text-sm leading-none transition-colors duration-[120ms] ease-out',
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
      <span
        className={cn('flex', isCopied ? 'text-[#157A55] dark:text-green-52' : 'text-green-44')}
      >
        {isCopied ? <CheckIcon /> : <RobotIcon width={15} height={15} aria-hidden="true" />}
      </span>
      {isCopied ? 'Prompt copied' : 'Set up agent'}
    </button>
  );
};

AgentSetupButton.propTypes = {
  agentPrompt: PropTypes.string,
  className: PropTypes.string,
};

export default AgentSetupButton;
