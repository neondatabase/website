'use client';

import PropTypes from 'prop-types';
import { Fragment, useMemo, useState } from 'react';

import AnchorHeading from 'components/shared/anchor-heading';
import Link from 'components/shared/link';
import ExpandIcon from 'icons/expand-icon.inline.svg';
import ExternalIcon from 'icons/external.inline.svg';
import SearchIcon from 'icons/search.inline.svg';
import { cn } from 'utils/cn';

const SectionHeading = AnchorHeading('h3');

const normalize = (value = '') => value.toLowerCase();
const normalizeSearchText = (value = '') =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const getEditDistance = (left, right) => {
  const distances = Array.from({ length: left.length + 1 }, (_, index) => index);

  for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
    let previous = distances[0];
    distances[0] = rightIndex;

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const current = distances[leftIndex];
      distances[leftIndex] =
        left[leftIndex - 1] === right[rightIndex - 1]
          ? previous
          : Math.min(previous, distances[leftIndex - 1], distances[leftIndex]) + 1;
      previous = current;
    }
  }

  return distances[left.length];
};

const scoreValue = (value, token, weight) => {
  const normalizedValue = normalizeSearchText(value);
  if (!normalizedValue) return 0;

  const words = normalizedValue.split(' ');

  if (normalizedValue === token) return 120 * weight;
  if (normalizedValue.startsWith(token)) return 90 * weight;
  if (words.some((word) => word === token)) return 70 * weight;
  if (words.some((word) => word.startsWith(token))) return 55 * weight;
  if (token.length > 2 && normalizedValue.includes(token)) return 35 * weight;
  if (
    weight >= 6 &&
    token.length > 3 &&
    words.some(
      (word) => Math.abs(word.length - token.length) <= 1 && getEditDistance(word, token) <= 1
    )
  ) {
    return 10 * weight;
  }

  return 0;
};

const getSearchFields = (command, groupTitle) => [
  { value: command.name, weight: 10 },
  ...(command.aliases || []).map((value) => ({ value, weight: 9 })),
  { value: command.sig, weight: 6 },
  { value: command.desc, weight: 4 },
  { value: groupTitle, weight: 3 },
  ...(command.opts || []).map((value) => ({ value, weight: 5 })),
  ...(command.subs || []).map((value) => ({ value, weight: 5 })),
  ...(command.examples || []).map((value) => ({ value, weight: 2 })),
];

const scoreCommand = (command, groupTitle, query) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return Infinity;

  const tokens = normalizedQuery.split(' ');
  const fields = getSearchFields(command, groupTitle);
  let score = 0;

  for (const token of tokens) {
    const tokenScore = Math.max(
      ...fields.map(({ value, weight }) => scoreValue(value, token, weight))
    );
    if (tokenScore === 0) return 0;
    score += tokenScore;
  }

  const phraseScore = Math.max(
    ...fields.map(({ value, weight }) => scoreValue(value, normalizedQuery, weight))
  );

  return score + phraseScore;
};

const getDetailItems = (command) => {
  if (command.subs.length > 0) {
    return { label: 'SUBCOMMANDS', items: command.subs };
  }
  if (command.opts.length > 0) {
    return { label: 'OPTIONS', items: command.opts };
  }
  return { label: '', items: [] };
};

const CommandLink = ({ command }) => (
  <Link
    className="group inline-flex max-w-full items-center rounded border border-gray-new-80 bg-gray-new-98 p-1 font-mono text-sm leading-none text-black-new transition-colors hover:border-gray-new-50 dark:border-gray-new-30 dark:bg-black-new dark:text-gray-new-90 dark:hover:border-gray-new-50"
    to={command.href}
    aria-label={`Open full reference for ${command.name}`}
  >
    <span className="min-w-0 truncate border-b border-dashed border-current/40">
      {command.name}
    </span>
    <ExternalIcon className="ml-1.5 size-3.5 shrink-0 text-gray-new-50 transition-colors group-hover:text-gray-new-30 dark:text-gray-new-70 dark:group-hover:text-gray-new-90" />
  </Link>
);

CommandLink.propTypes = {
  command: PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }).isRequired,
};

const DetailToggle = ({ command, isOpen, onToggle }) => {
  const { label, items } = getDetailItems(command);

  if (items.length === 0) return null;

  return (
    <div>
      <button
        className="mt-2.5 mr-1 inline-flex flex-wrap items-center text-left text-gray-new-50 uppercase transition-colors hover:text-gray-new-30 dark:text-gray-new-60 dark:hover:text-gray-new-80"
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span
          className={cn(
            'ml-1.5 h-0 w-0 shrink-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-current transition-transform duration-150',
            isOpen && 'rotate-90'
          )}
          aria-hidden
        />
        <span className="ml-2 font-mono text-xs/snug font-medium -tracking-tight">{label}</span>
      </button>
      <span className="prose inline-flex flex-wrap gap-1">
        {isOpen &&
          items.map((item) => (
            <code className="leading-tight!" key={item}>
              {item}
            </code>
          ))}
      </span>
    </div>
  );
};

DetailToggle.propTypes = {
  command: PropTypes.shape({
    opts: PropTypes.arrayOf(PropTypes.string).isRequired,
    subs: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const ExampleList = ({ command }) => {
  const examples = (command.examples.length > 0 ? command.examples : [command.sig]).filter(Boolean);

  if (examples.length === 0) return null;

  return (
    <div className="prose flex flex-wrap gap-1">
      {examples.map((example) => (
        <code className="leading-tight!" key={example}>
          {example}
        </code>
      ))}
    </div>
  );
};

ExampleList.propTypes = {
  command: PropTypes.shape({
    examples: PropTypes.arrayOf(PropTypes.string).isRequired,
    sig: PropTypes.string,
  }).isRequired,
};

const Row = ({ command, isOpen, onToggle }) => (
  <tr className="border-t border-gray-new-80 first:border-t-0 last:border-b-0 dark:border-gray-new-20">
    <td className="prose w-[23%] min-w-[150px] py-4 pr-9 align-top">
      <CommandLink command={command} />
    </td>
    <td className="w-[45%] min-w-[300px] py-4 pr-9 align-top text-sm leading-snug text-gray-new-30 dark:text-gray-new-85">
      {command.desc}
      <DetailToggle command={command} isOpen={isOpen} onToggle={onToggle} />
    </td>
    <td className="w-[32%] min-w-[260px] py-4 align-top">
      <ExampleList command={command} />
    </td>
  </tr>
);

Row.propTypes = {
  command: PropTypes.shape({
    name: PropTypes.string.isRequired,
    aliases: PropTypes.arrayOf(PropTypes.string),
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
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState({});

  const filteredGroups = useMemo(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return groups;

    return groups
      .map((group) => ({
        ...group,
        commands: group.commands
          .map((command, index) => ({
            command,
            index,
            score: scoreCommand(command, group.title, trimmedQuery),
          }))
          .filter(({ score }) => score > 0)
          .sort((left, right) => right.score - left.score || left.index - right.index)
          .map(({ command }) => command),
      }))
      .filter((group) => group.commands.length > 0);
  }, [groups, query]);

  const expandableNames = filteredGroups.flatMap((group) =>
    group.commands
      .filter((command) => getDetailItems(command).items.length > 0)
      .map((command) => command.name)
  );
  const allOpen = expandableNames.length > 0 && expandableNames.every((name) => open[name]);

  const toggleAll = () => {
    const next = {};
    for (const name of expandableNames) next[name] = !allOpen;
    setOpen((prev) => ({ ...prev, ...next }));
  };

  return (
    <div className="not-prose mt-8">
      <div className="flex items-stretch gap-6 md:flex-col md:gap-3">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search CLI commands</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-gray-new-50 dark:text-gray-new-70" />
          <input
            className="h-10 w-full border border-gray-new-80 bg-white pr-4 pl-9 text-[.9375rem] leading-none text-gray-new-15 transition-colors outline-none placeholder:text-gray-new-50 focus:border-gray-new-40 dark:border-gray-new-20 dark:bg-black-pure dark:text-white dark:placeholder:text-gray-new-60 dark:focus:border-gray-new-50 lg:text-base"
            type="search"
            value={query}
            placeholder="Search..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2.5 border border-gray-new-80 px-5 text-[.9375rem] leading-none font-medium tracking-tight text-gray-new-30 transition-colors hover:border-gray-new-50 hover:text-black-new disabled:pointer-events-none disabled:opacity-50 dark:border-gray-new-20 dark:text-gray-new-80 dark:hover:border-gray-new-50 dark:hover:text-white"
          type="button"
          onClick={toggleAll}
          disabled={expandableNames.length === 0}
        >
          <ExpandIcon className={cn('size-3.5 shrink-0', allOpen && 'rotate-180')} />
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {filteredGroups.length > 0 ? (
        filteredGroups.map((group) => (
          <Fragment key={group.id}>
            <SectionHeading className="mt-8 text-2xl/tight tracking-tighter">
              {group.title}
            </SectionHeading>
            <div className="mt-2.5 overflow-auto 2xl:-mx-4 2xl:px-4">
              <table className="my-0! w-full min-w-196 table-fixed border-collapse">
                <colgroup>
                  <col className="w-[23%]" />
                  <col className="w-[45%]" />
                  <col className="w-[32%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-new-80 text-sm leading-none font-medium text-black-new dark:border-gray-new-20 dark:text-white">
                    <th className="pr-9 pb-4 text-left font-medium" scope="col">
                      Command
                    </th>
                    <th className="pr-9 pb-4 text-left font-medium" scope="col">
                      Description
                    </th>
                    <th className="pb-4 text-left font-medium" scope="col">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody>
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
                </tbody>
              </table>
            </div>
          </Fragment>
        ))
      ) : (
        <div className="mt-10 border-t border-gray-new-80 py-8 text-base text-gray-new-40 dark:border-gray-new-20 dark:text-gray-new-70">
          No commands found.
        </div>
      )}
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
