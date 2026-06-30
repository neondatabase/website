'use client';

import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

import ApiCodeBlock from './api-code-block';

// MCP description rendering — parses the XML-like blocks Neon's MCP server
// emits (workflow, important_notes, returns, etc.) and renders each as a
// labeled section. Falls back to plain text when no recognized blocks are
// present.

// Display labels for the XML-like outer tags Neon's MCP server emits inside
// tool descriptions. Keep in sync with the unknown-tag check in
// scripts/generate-api-ref.mjs (deriveMcpDescriptionTags) — that check fails
// the build when a new tag appears upstream that isn't covered here.
//
// `example` is intentionally NOT in this map: it's handled as a code-block
// extraction in parseMcpDescription, not a labeled section.
const MCP_BLOCK_LABELS = {
  workflow: 'Workflow',
  key_features: 'Key features',
  interactive_behavior: 'Behavior',
  returns: 'Returns',
  important_notes: 'Notes',
  supported_operations: 'Operations',
  security: 'Security',
  instructions: 'Instructions',
  error_handling: 'Error handling',
  next_steps: 'Next steps',
  use_case: 'Use case',
  do_not_include: 'Do NOT include',
  hint: 'Hint',
  hints: 'Hints',
  response_instructions: 'Response instructions',
};

// Fallback label for a tag that isn't in MCP_BLOCK_LABELS — turn `foo_bar`
// into "Foo bar" so the block still renders with a header instead of
// quietly losing one. The build-time check should still catch unknown tags
// before they ship, but this protects user-facing rendering if it slips.
function fallbackLabel(tag) {
  const spaced = tag.replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// Sanity cap for "N. " numbered-item parsing. Upstream descriptions never
// exceed this length in practice; the cap blocks false-positive matches like
// "ERR 1234. message" (where "1234." looks like a list marker but isn't).
const MAX_MCP_NUMBERED_ITEMS = 20;

export function splitMcpContent(text) {
  const items = [];
  const t = text.trim();
  if (!t) return items;

  // Find "N. " markers preceded by start-of-string or whitespace
  const positions = [];
  const numRe = /(^|\s)(\d{1,2})\. /g;
  let nm;
  while ((nm = numRe.exec(t)) !== null) {
    const n = parseInt(nm[2], 10);
    if (n < 1 || n > MAX_MCP_NUMBERED_ITEMS) continue;
    positions.push({ start: nm.index + nm[1].length, n, contentStart: nm.index + nm[0].length });
  }

  const addDashItems = (raw) => {
    const s = raw.trim();
    if (!s) return;
    const leadDash = s.startsWith('- ');
    const parts = (leadDash ? s.slice(2) : s).split(/ - /);
    if (!leadDash && parts.length === 1) {
      items.push({ type: 'para', text: parts[0].trim() });
      return;
    }
    if (!leadDash && parts[0].trim()) items.push({ type: 'para', text: parts[0].trim() });
    for (let i = leadDash ? 0 : 1; i < parts.length; i++) {
      if (parts[i].trim()) items.push({ type: 'bullet', text: parts[i].trim() });
    }
  };

  if (positions.length === 0) {
    addDashItems(t);
    return items;
  }

  addDashItems(t.slice(0, positions[0].start));

  for (let i = 0; i < positions.length; i++) {
    const end = i + 1 < positions.length ? positions[i + 1].start : t.length;
    const content = t.slice(positions[i].contentStart, end).trim();
    const subParts = content.split(/ - /);
    items.push({ type: 'numbered', n: positions[i].n, text: subParts[0].trim() });
    for (let j = 1; j < subParts.length; j++) {
      if (subParts[j].trim()) items.push({ type: 'sub', text: subParts[j].trim() });
    }
  }

  return items;
}

export function parseMcpDescription(text) {
  if (!text) return null;
  const outerRe = /<([a-z_]+)>([\s\S]*?)<\/\1>/g;
  const segments = [];
  let lastIndex = 0;
  let om;

  while ((om = outerRe.exec(text)) !== null) {
    const before = text.slice(lastIndex, om.index).trim();
    if (before) segments.push({ type: 'text', content: before });

    const tag = om[1];
    let inner = om[2].trim();
    let codeBlock = null;

    inner = inner
      .replace(/<example>([\s\S]*?)<\/example>/g, (_, code) => {
        codeBlock = code.trim();
        return '';
      })
      .trim();

    segments.push({
      type: 'block',
      tag,
      label: MCP_BLOCK_LABELS[tag] ?? fallbackLabel(tag),
      items: splitMcpContent(inner),
      code: codeBlock,
    });

    lastIndex = om.index + om[0].length;
  }

  const after = text.slice(lastIndex).trim();
  if (after) segments.push({ type: 'text', content: after });

  if (segments.length === 1 && segments[0].type === 'text') return null;
  return segments;
}

export const McpDescription = ({ description }) => {
  const segments = parseMcpDescription(description);

  if (!segments) {
    return (
      <p className="mt-2 text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70">
        {description}
      </p>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return (
            <p key={i} className="text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70">
              {seg.content}
            </p>
          );
        }

        return (
          <div
            key={i}
            className={cn(seg.label && 'border-t border-gray-new-90 pt-3 dark:border-gray-new-20')}
          >
            {seg.label && (
              <p className="mb-1.5 text-sm font-semibold tracking-wider text-gray-new-50 uppercase dark:text-gray-new-60">
                {seg.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {seg.items.map((item, j) => {
                if (item.type === 'numbered') {
                  return (
                    <div key={j} className="flex gap-2 py-0.5 text-sm leading-relaxed">
                      <span className="mt-0.5 w-5 flex-none text-right font-mono text-sm font-semibold text-green-45">
                        {item.n}.
                      </span>
                      <span className="text-gray-new-30 dark:text-gray-new-70">{item.text}</span>
                    </div>
                  );
                }
                if (item.type === 'bullet' || item.type === 'sub') {
                  return (
                    <div
                      key={j}
                      className={cn(
                        'flex items-baseline gap-2 py-0.5 text-sm leading-relaxed',
                        item.type === 'sub' && 'ml-7'
                      )}
                    >
                      <span className="mt-[7px] h-[5px] w-[5px] flex-none rounded-full bg-gray-new-70 dark:bg-gray-new-50" />
                      <span className="text-gray-new-30 dark:text-gray-new-70">{item.text}</span>
                    </div>
                  );
                }
                return (
                  <p
                    key={j}
                    className="py-0.5 text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70"
                  >
                    {item.text}
                  </p>
                );
              })}
            </div>
            {seg.code && (
              <ApiCodeBlock
                label="Example"
                code={seg.code}
                className="mt-2"
                preClassName="text-sm"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

McpDescription.propTypes = {
  description: PropTypes.string.isRequired,
};
