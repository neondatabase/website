'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import { cn } from 'utils/cn';

// Full terminal-styled command index (design handoff "E+ In docs"
// direction), theme-aware: terminal-dark panel in dark mode, a light
// equivalent in light mode (green accents use the ink-safe secondary-8 on
// light backgrounds). Grouped caret rows start collapsed; expanding shows
// option chips, curated $ examples, and a Full reference link.
const Row = ({ command, isOpen, onToggle }) => (
  <div className="border-b border-gray-new-90 py-1 last:border-b-0 dark:border-white/5">
    <div className="flex items-center gap-2">
      <button
        className="flex min-w-0 flex-1 items-center gap-2.5 py-1.5 text-left"
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span
          className={cn(
            'shrink-0 font-mono text-xs text-gray-new-60 transition-transform duration-150 dark:text-gray-new-50',
            isOpen && 'rotate-90'
          )}
          aria-hidden
        >
          &#8250;
        </span>
        <code className="shrink-0 font-mono text-sm font-semibold text-black-new dark:text-white">
          {command.name}
        </code>
        <span className="truncate text-sm text-gray-new-40 dark:text-gray-new-60">
          {command.desc}
        </span>
      </button>
      <Link
        className="flex shrink-0 items-center gap-1 font-mono text-xs text-gray-new-60 hover:text-secondary-8 dark:text-gray-new-50 dark:hover:text-green-45"
        to={command.href}
        aria-label={`Full reference for ${command.name}`}
      >
        Full reference &#8599;
      </Link>
    </div>
    {isOpen && (
      <div className="mb-2 ml-2 space-y-2 border-l border-gray-new-90 pb-1 pl-4 dark:border-white/10">
        {(command.opts.length > 0 || command.subs.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-gray-new-60 uppercase dark:text-gray-new-50">
              {command.subs.length > 0 ? 'subcommands' : 'options'}
            </span>
            {(command.subs.length > 0 ? command.subs : command.opts).map((chip) => (
              <code
                className="rounded border border-gray-new-90 bg-white px-2 py-0.5 font-mono text-[11px] text-gray-new-30 dark:border-white/10 dark:bg-white/5 dark:text-gray-new-80"
                key={chip}
              >
                {chip}
              </code>
            ))}
          </div>
        )}
        {(command.examples.length > 0 ? command.examples : [command.sig]).map((example) => (
          <div
            className="rounded-md border border-gray-new-90 bg-white px-3.5 py-2.5 font-mono text-[13px] leading-relaxed dark:border-white/10 dark:bg-[#080909]"
            key={example}
          >
            <span className="text-secondary-8 select-none dark:text-green-45">$ </span>
            <span className="whitespace-pre-wrap text-gray-new-20 dark:text-gray-new-90">
              {example}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

Row.propTypes = {
  command: PropTypes.shape({
    name: PropTypes.string.isRequired,
    desc: PropTypes.string,
    sig: PropTypes.string,
    opts: PropTypes.arrayOf(PropTypes.string),
    examples: PropTypes.arrayOf(PropTypes.string),
    subs: PropTypes.arrayOf(PropTypes.string),
    href: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const CommandIndexClient = ({ groups }) => {
  const allNames = groups.flatMap((group) => group.commands.map((command) => command.name));
  const [open, setOpen] = useState({});
  const allOpen = allNames.every((name) => open[name]);

  const toggleAll = () => {
    const next = {};
    for (const name of allNames) next[name] = !allOpen;
    setOpen(next);
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-gray-new-90 bg-gray-new-98 dark:border-gray-new-15 dark:bg-black-new">
      <div className="flex items-center justify-between border-b border-gray-new-90 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="font-mono text-xs text-gray-new-40 dark:text-gray-new-60">
          neonctl — commands
        </span>
        <button
          className="rounded border border-secondary-8/40 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-secondary-8 hover:border-secondary-8 dark:border-green-45/60 dark:text-green-45 dark:hover:border-green-45"
          type="button"
          onClick={toggleAll}
        >
          {allOpen ? 'collapse all' : 'expand all'}
        </button>
      </div>
      <div className="px-4 py-3">
        {groups.map((group) => (
          <div className="py-2 first:pt-0 last:pb-0" key={group.id}>
            <div className="mb-1.5 font-mono text-xs font-semibold text-secondary-8 dark:text-green-45">
              # {group.title.toLowerCase()}
            </div>
            {group.commands.map((command) => (
              <Row
                command={command}
                isOpen={Boolean(open[command.name])}
                key={command.name}
                onToggle={() =>
                  setOpen((prev) => ({ ...prev, [command.name]: !prev[command.name] }))
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

CommandIndexClient.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      commands: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
};

export default CommandIndexClient;
