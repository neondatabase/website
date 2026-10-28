'use client';

import { useId, useRef, useState } from 'react';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopiedIcon from 'icons/home/copied.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';
import { cn } from 'utils/cn';

import { strongBorder } from './docs-home-tokens';

// The agent prompt is built from these parts so the copied text and the
// displayed text (with the URL highlighted) can't drift apart.
const AGENT_SETUP_URL = 'https://neon.com/prompts/agent-setup.md';
const AGENT_PROMPT_LEAD = 'Set me up for Neon. Fetch ';
const AGENT_PROMPT_TAIL = ' and follow it.';
const AGENT_PROMPT = `${AGENT_PROMPT_LEAD}${AGENT_SETUP_URL}${AGENT_PROMPT_TAIL}`;

const CLI_LINES = [
  { text: '# Install the Neon CLI (needs Node.js 22.20+)', comment: true },
  { text: 'npm install -g neon@latest', comment: false },
  { text: '# Create and link a project (walks you through sign-in)', comment: true, gap: true },
  { text: 'neon init', comment: false },
];
const CLI_TEXT = CLI_LINES.map(({ text }) => text).join('\n');

const COMPOSER_TABS = [
  { id: 'agent', label: 'Agent prompt' },
  { id: 'cli', label: 'CLI' },
];

// Tabbed setup instructions with a copy control for the active tab.
const DocsHomeComposer = () => {
  const [tab, setTab] = useState('agent');
  const { isCopied, handleCopy } = useCopyToClipboard(1400);
  const idPrefix = useId();
  const tabRefs = useRef({});

  const agent = tab === 'agent';
  const activeText = agent ? AGENT_PROMPT : CLI_TEXT;
  const tabId = (id) => `${idPrefix}-tab-${id}`;
  const panelId = `${idPrefix}-panel`;

  // WAI-ARIA tabs keyboard pattern: arrows move between tabs (wrapping),
  // Home/End jump to the first/last, and focus follows the selection.
  const handleTabKeyDown = (event) => {
    const index = COMPOSER_TABS.findIndex((t) => t.id === tab);
    const last = COMPOSER_TABS.length - 1;
    const nextIndex = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    const next = COMPOSER_TABS[nextIndex].id;
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  const tabBtn = (id) =>
    cn(
      'flex h-full shrink-0 items-center justify-center border-b pt-2.5 pb-3.5 text-sm leading-none font-medium tracking-[-0.02em] whitespace-nowrap transition-colors',
      tab === id
        ? 'border-black-pure text-black-pure dark:border-gray-new-70 dark:text-white'
        : 'border-transparent text-gray-new-40 dark:text-gray-new-60',
      id === 'cli' && 'w-[63px] shrink'
    );

  // Full-width tabbed panel beneath the hero heading, intro and links.
  return (
    <div
      className={cn(
        '@container min-w-0 rounded-none border bg-white font-sans text-base dark:bg-gray-new-8',
        strongBorder
      )}
    >
      <div
        className={cn(
          'flex h-16 items-start justify-between border-b bg-gray-new-98 pr-3.5 pl-[18px] dark:bg-gray-new-8',
          strongBorder
        )}
      >
        <div
          className="-mt-px flex h-[65px] min-w-0 items-stretch"
          role="tablist"
          aria-label="Setup method"
        >
          {COMPOSER_TABS.map(({ id, label }) => (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[id] = node;
              }}
              id={tabId(id)}
              className={tabBtn(id)}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-controls={panelId}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
              onKeyDown={handleTabKeyDown}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => handleCopy(activeText)}
          className="mt-3.5 flex h-9 shrink-0 items-center gap-2 rounded-full bg-black-new px-4 text-[15px] leading-none font-medium tracking-normal text-white transition-colors duration-200 hover:bg-gray-new-20 dark:bg-white dark:text-black-pure dark:hover:bg-gray-new-90"
        >
          {isCopied ? 'Copied' : 'Copy'}
          {isCopied ? <CopiedIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        </button>
      </div>

      {/* One panel whose content swaps with the active tab. */}
      <div id={panelId} role="tabpanel" aria-labelledby={tabId(tab)}>
        {agent ? (
          <div className="px-6 pt-6 pb-[25px] text-base leading-[30.8px] [text-wrap:pretty] [overflow-wrap:anywhere] text-gray-new-30 dark:text-gray-new-80 sm:px-4">
            <span>{AGENT_PROMPT_LEAD}</span>
            <span className="text-green-44 dark:text-green-52">{AGENT_SETUP_URL}</span>
            <span>{AGENT_PROMPT_TAIL}</span>
          </div>
        ) : (
          <div className="grid gap-0.5 px-6 pt-6 pb-[25px] text-base leading-[30.8px] [overflow-wrap:anywhere] sm:px-4">
            {CLI_LINES.map((l, i) => (
              <div
                key={`${l.text}-${i}`}
                className={cn(
                  'break-words',
                  l.gap && 'mt-2.5',
                  l.comment
                    ? 'text-gray-new-30 dark:text-gray-new-60'
                    : 'text-green-44 dark:text-green-52'
                )}
              >
                {l.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsHomeComposer;
