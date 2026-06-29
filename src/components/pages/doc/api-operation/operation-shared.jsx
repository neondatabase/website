'use client';

import PropTypes from 'prop-types';

import { INLINE_CODE_STYLES, JSON_SYNTAX_COLORS } from 'utils/api-style';
import { cn } from 'utils/cn';

import cliGlobalFlagsList from '../../../../../scripts/data/cli-global-flags.json';

import ApiCodeBlock from './api-code-block';

// Rendering primitives + constants shared across the operation-* section
// components. Anything imported by 2+ sibling modules lives here.

// ── Constants ───────────────────────────────────────────────────────────────

// Imported from scripts/data/cli-global-flags.json so the generator (which
// consumes the same file) and this client constant can't drift.
export const GLOBAL_FLAG_NAMES = new Set(cliGlobalFlagsList);

export const CLI_FLAG_PRIORITY = ['project-id', 'org-id'];

// ── Section header ──────────────────────────────────────────────────────────

export const SectionHeader = ({ title, badge, right, id }) => (
  <div className="mb-4 flex min-h-6 items-center gap-2.5">
    <h2 id={id} className="scroll-mt-20 text-base leading-tight font-semibold tracking-tight">
      {title}
    </h2>
    {badge && (
      <span className="text-red-600 border-red-600/40 border bg-transparent px-1.5 py-0.5 font-mono text-sm font-semibold dark:border-[#FF5645]/40 dark:text-[#FF5645]">
        {badge}
      </span>
    )}
    {right && <div className="ml-auto">{right}</div>}
  </div>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  badge: PropTypes.string,
  right: PropTypes.node,
  id: PropTypes.string,
};

// ── Live code block ─────────────────────────────────────────────────────────

export const LiveCodeBlock = ({ label, code, editCount }) => (
  <ApiCodeBlock
    label={editCount > 0 ? `${label} - live from your edits` : label}
    code={code}
    className={cn(
      'transition-colors duration-200',
      editCount > 0 && 'border-[#00B87B]/30 dark:border-green-45/30'
    )}
  />
);

LiveCodeBlock.propTypes = {
  label: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  editCount: PropTypes.number,
};

// ── CLI positional row ──────────────────────────────────────────────────────

export const CliPositionalRow = ({
  pos,
  currentVal,
  isEditing,
  onEdit,
  onSetEditing,
  isLast,
  description,
  descriptionHtml,
  labelPrefix = 'CLI argument',
}) => {
  const editKey = pos.apiEquiv ?? pos.display;
  // Same widget renders both real CLI positionals and (via ParamsSection)
  // API path/query params. Scoped aria-label keeps screen-reader users
  // oriented when the same identifier shows up on multiple sections.
  const ariaLabel = `Edit ${labelPrefix} ${pos.display}`;
  return (
    <div
      className={cn(
        'grid items-baseline gap-2 py-2.5',
        !isLast && 'border-b border-gray-new-90 dark:border-gray-new-20'
      )}
      style={{ gridTemplateColumns: '14px 1fr 1fr' }}
    >
      <div className="flex items-center justify-center pt-0.5">
        <span className="font-mono text-sm leading-none font-bold text-[#E2301D] dark:text-[#FF5645]">
          *
        </span>
      </div>

      <div className="flex flex-wrap items-baseline gap-1.5">
        <code className="font-mono text-sm font-semibold text-black-pure dark:text-white">
          {pos.display}
        </code>
        {isEditing ? (
          <input
            autoFocus
            value={currentVal}
            onChange={(e) => onEdit(e.target.value)}
            onBlur={() => onSetEditing(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') onSetEditing(null);
            }}
            aria-label={ariaLabel}
            className="rounded border border-green-45/40 bg-green-45/5 px-1 font-mono text-sm text-[var(--shiki-token-string)] outline-none"
            style={{ width: `${Math.max(80, currentVal.length * 7.5)}px`, maxWidth: '200px' }}
          />
        ) : (
          <span
            role="button"
            tabIndex={0}
            onClick={() => onSetEditing(editKey)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSetEditing(editKey);
              }
            }}
            aria-label={ariaLabel}
            className={cn(
              'cursor-text rounded px-0.5 font-mono text-sm transition-all',
              currentVal
                ? 'border-b border-dashed border-[#00B87B]/20 bg-green-45/5 text-[var(--shiki-token-string)]'
                : 'text-gray-new-50 hover:border-b hover:border-dashed hover:border-gray-new-50 dark:text-gray-new-60'
            )}
          >
            {currentVal || '(string)'}
          </span>
        )}
        <span className="border border-[#E2301D]/40 bg-transparent px-1.5 py-0.5 font-mono text-sm leading-normal font-medium text-[#E2301D] dark:border-[#FF5645]/40 dark:text-[#FF5645]">
          required
        </span>
      </div>

      <div>
        {(() => {
          const descClass =
            'text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70 [&_a]:underline';
          // Plain-text fallback: don't pipe unsanitized `description` through
          // dangerouslySetInnerHTML if the generator failed to produce HTML.
          return descriptionHtml ? (
            <span
              className={cn(descClass, INLINE_CODE_STYLES)}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <span className={descClass}>{description ?? ''}</span>
          );
        })()}
      </div>
    </div>
  );
};

CliPositionalRow.propTypes = {
  pos: PropTypes.shape({
    display: PropTypes.string.isRequired,
    apiEquiv: PropTypes.string,
  }).isRequired,
  currentVal: PropTypes.string,
  isEditing: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onSetEditing: PropTypes.func.isRequired,
  isLast: PropTypes.bool,
  description: PropTypes.string,
  descriptionHtml: PropTypes.string,
  labelPrefix: PropTypes.string,
};

// ── CLI flag row ────────────────────────────────────────────────────────────

export const CliFlagRow = ({
  flag,
  isLast,
  isIncluded,
  isEditing,
  currentVal,
  isHovered,
  onSetHovered,
  onToggleInclude,
  onEdit,
  onSetEditing,
  showCheckboxes,
  labelPrefix = 'CLI flag',
}) => (
  <div
    onMouseEnter={() => onSetHovered(flag.name)}
    onMouseLeave={() => onSetHovered(null)}
    className={cn(
      'grid items-baseline gap-2 py-2.5',
      !isLast && 'border-b border-gray-new-90 dark:border-gray-new-20',
      isHovered && 'bg-[rgba(0,229,153,0.03)]'
    )}
    style={{ gridTemplateColumns: '14px 1fr 1fr' }}
  >
    <div className="flex items-center justify-center pt-0.5">
      {flag.required ? (
        <span className="font-mono text-sm leading-none font-bold text-[#E2301D] dark:text-[#FF5645]">
          *
        </span>
      ) : (
        <button
          type="button"
          onClick={onToggleInclude}
          style={{ visibility: showCheckboxes || isHovered || isIncluded ? 'visible' : 'hidden' }}
          className={cn(
            'flex h-2.5 w-2.5 items-center justify-center rounded-sm border transition-all duration-100',
            isIncluded
              ? 'border-[#00B87B] bg-[#00B87B] dark:border-green-45 dark:bg-green-45'
              : 'border-gray-new-50 bg-transparent dark:border-gray-new-60'
          )}
        >
          {isIncluded && (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path
                d="M1 3L2.5 4.5L5 1.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}
    </div>

    <div className="flex flex-wrap items-baseline gap-1.5">
      <code className="font-mono text-sm font-semibold text-black-pure dark:text-white">
        {flag.name}
      </code>
      {flag.alias && (
        <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
          {flag.alias}
        </span>
      )}
      <span
        className={cn(
          'px-1.5 py-0.5 font-mono text-sm leading-normal font-medium',
          flag.type === 'string'
            ? 'border border-[#426CE0]/40 bg-transparent text-[#426CE0] dark:border-blue-70/40 dark:text-blue-70'
            : flag.type === 'boolean'
              ? 'border border-[#BE8A3C]/40 bg-transparent text-[#BE8A3C] dark:border-brown-70/40 dark:text-brown-70'
              : 'border border-[#8458D0]/40 bg-transparent text-[#8458D0] dark:border-purple-70/40 dark:text-purple-70'
        )}
      >
        {flag.type}
      </span>

      {flag.enum ? (
        <span className="flex gap-0.5">
          {flag.enum.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onEdit(opt)}
              className={cn(
                'px-1.5 py-0 font-mono text-sm transition-all',
                currentVal === String(opt)
                  ? 'border border-[#00B87B]/40 bg-transparent font-semibold text-[#00B87B] dark:border-green-45/40 dark:text-green-45'
                  : 'border border-gray-new-70 bg-transparent text-gray-new-50 dark:border-gray-new-30 dark:text-gray-new-60'
              )}
            >
              {opt}
            </button>
          ))}
        </span>
      ) : flag.type === 'boolean' ? (
        <button
          type="button"
          onClick={() => (isIncluded ? onToggleInclude() : onEdit('true'))}
          className="font-mono text-sm text-[var(--shiki-token-keyword)]"
        >
          {isIncluded ? 'true' : 'false'}
        </button>
      ) : isEditing ? (
        <input
          autoFocus
          value={currentVal}
          onChange={(e) => onEdit(e.target.value)}
          onBlur={() => onSetEditing(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') onSetEditing(null);
          }}
          aria-label={`Edit ${labelPrefix} ${flag.name}`}
          className="rounded border border-green-45/40 bg-green-45/5 px-1 font-mono text-sm text-[var(--shiki-token-string)] outline-none"
          style={{ width: `${Math.max(80, currentVal.length * 7.5)}px`, maxWidth: '200px' }}
        />
      ) : (
        <span
          role="button"
          tabIndex={0}
          onClick={() => onSetEditing(flag.name)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSetEditing(flag.name);
            }
          }}
          aria-label={`Edit ${labelPrefix} ${flag.name}`}
          className={cn(
            'cursor-text rounded px-0.5 font-mono text-sm transition-all',
            isIncluded && currentVal
              ? 'border-b border-dashed border-green-45/60 bg-green-45/5 text-[var(--shiki-token-string)]'
              : 'text-gray-new-50 hover:border-b hover:border-dashed hover:border-gray-new-50 dark:text-gray-new-60'
          )}
        >
          {isIncluded && currentVal
            ? currentVal
            : flag.placeholder
              ? `(${flag.placeholder})`
              : flag.default !== undefined
                ? String(flag.default)
                : `(${flag.type})`}
        </span>
      )}

      {flag.required && (
        <span className="border border-[#E2301D]/40 bg-transparent px-1.5 py-0.5 font-mono text-sm leading-normal font-medium text-[#E2301D] dark:border-[#FF5645]/40 dark:text-[#FF5645]">
          required
        </span>
      )}
      {flag.default !== undefined && !flag.enum && (
        <span className="font-mono text-sm text-gray-new-60 dark:text-gray-new-50">
          default: {String(flag.default)}
        </span>
      )}
    </div>

    <div>
      {(() => {
        const descClass =
          'text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70 [&_a]:underline';
        return flag.descriptionHtml ? (
          <span
            className={cn(descClass, INLINE_CODE_STYLES)}
            dangerouslySetInnerHTML={{ __html: flag.descriptionHtml }}
          />
        ) : (
          <span className={descClass}>{flag.description ?? ''}</span>
        );
      })()}
      {flag.apiEquiv && isHovered && (
        <div className="mt-0.5 font-mono text-sm text-gray-new-60 dark:text-gray-new-50">
          API: {flag.apiEquiv}
        </div>
      )}
      {flag.cliOnly && isHovered && (
        <div className="mt-0.5 text-sm text-[#E9943E] dark:text-yellow-70">CLI only</div>
      )}
    </div>
  </div>
);

CliFlagRow.propTypes = {
  flag: PropTypes.shape({
    name: PropTypes.string.isRequired,
    alias: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    descriptionHtml: PropTypes.string,
    default: PropTypes.any,
    placeholder: PropTypes.string,
    enum: PropTypes.array,
    required: PropTypes.bool,
    apiEquiv: PropTypes.string,
    cliOnly: PropTypes.bool,
  }).isRequired,
  isLast: PropTypes.bool,
  isIncluded: PropTypes.bool,
  isEditing: PropTypes.bool,
  currentVal: PropTypes.string,
  isHovered: PropTypes.bool,
  onSetHovered: PropTypes.func.isRequired,
  onToggleInclude: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSetEditing: PropTypes.func.isRequired,
  showCheckboxes: PropTypes.bool,
  labelPrefix: PropTypes.string,
};

// ── JSON syntax highlighter (client-side, no Shiki) ─────────────────────────
//
// Hand-rolled rather than reusing the codebase's Shiki integration because
// this component re-renders on every body-field keystroke (the live
// response example reflects edits). Shiki's async grammar load + tokenizer
// pass would dominate per-render cost for tiny JSON snippets; the simple
// type-switch below produces equivalent output with no startup cost.

export function JsonHighlightValue({ value, indent }) {
  if (value === null) return <span style={{ color: JSON_SYNTAX_COLORS.keyword }}>null</span>;
  if (typeof value === 'boolean')
    return <span style={{ color: JSON_SYNTAX_COLORS.keyword }}>{String(value)}</span>;
  if (typeof value === 'number')
    return <span style={{ color: JSON_SYNTAX_COLORS.number }}>{value}</span>;
  if (typeof value === 'string')
    return (
      <span style={{ color: JSON_SYNTAX_COLORS.string }}>
        {'"'}
        {value}
        {'"'}
      </span>
    );

  const pad = '  '.repeat(indent);
  const innerPad = '  '.repeat(indent + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return <span>{'[]'}</span>;
    return (
      <>
        {'[\n'}
        {value.map((item, i) => (
          <span key={i}>
            {innerPad}
            <JsonHighlightValue value={item} indent={indent + 1} />
            {i < value.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {pad}
        {']'}
      </>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return <span>{'{}'}</span>;
    return (
      <>
        {'{\n'}
        {entries.map(([k, v], i) => (
          <span key={k}>
            {innerPad}
            <span style={{ color: JSON_SYNTAX_COLORS.key }}>
              {'"'}
              {k}
              {'"'}
            </span>
            {': '}
            <JsonHighlightValue value={v} indent={indent + 1} />
            {i < entries.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {pad}
        {'}'}
      </>
    );
  }

  return <span>{String(value)}</span>;
}

JsonHighlightValue.propTypes = {
  value: PropTypes.any,
  indent: PropTypes.number,
};

// ── CLI flag sort + uncovered fields list + global flags collapsible ────────
//
// Shared between the single-command and multi-command CLI renderers.
// All three operate on cli-flag-shaped data + the cli section's state
// object, so they live in the shared module rather than being duplicated.

// Sort by: required first, then known-priority names (project-id, org-id),
// then natural order.
export function sortCliFlags(flags) {
  return flags.sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    const ai = CLI_FLAG_PRIORITY.indexOf(a.name);
    const bi = CLI_FLAG_PRIORITY.indexOf(b.name);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
    return 0;
  });
}

// "No CLI equivalent" section — lists request-body fields that the CLI
// doesn't expose. Renders type + first-line description from the body
// schema when available so the user can decide whether to fall back to
// the REST API or SDK for that field.
export const UncoveredList = ({ uncovered, operation, findBodyProp }) => (
  <div className="mt-6 border-t border-gray-new-90 pt-5 dark:border-gray-new-20">
    <p className="mb-3 text-sm font-semibold tracking-wider text-gray-new-50 uppercase dark:text-gray-new-60">
      No CLI equivalent
    </p>
    <div>
      {uncovered.map((f, i) => {
        const prop = findBodyProp(operation.requestBody?.properties, f);
        return (
          <div
            key={f}
            className={`flex flex-col gap-0.5 border-b px-4 py-3 ${
              i === uncovered.length - 1
                ? 'border-transparent'
                : 'border-gray-new-90 dark:border-gray-new-20'
            }`}
          >
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm text-gray-new-20 dark:text-gray-new-80">{f}</code>
              {prop?.type && (
                <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
                  {prop.type}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-gray-new-50 dark:text-gray-new-60">
              {prop?.description?.split('\n')[0] ??
                'Not configurable via CLI. Use the REST API or SDK.'}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

UncoveredList.propTypes = {
  uncovered: PropTypes.arrayOf(PropTypes.string).isRequired,
  operation: PropTypes.object.isRequired,
  // Injected by the caller (operation-cli.jsx / operation-cli-multi.jsx)
  // to avoid an import cycle — findBodyProp lives in operation-cli.jsx.
  findBodyProp: PropTypes.func.isRequired,
};

// Collapsible row that hides the always-present neonctl global options
// (--help, --api-key, --color, ...). Closed by default; expanding reveals
// each global flag as a regular CliFlagRow.
export const GlobalFlagsCollapsible = ({ flags, state, headerKeyPrefix }) => (
  <div className="mt-1 border-t border-gray-new-90 dark:border-gray-new-20">
    <button
      type="button"
      onClick={() => state.setGlobalFlagsOpen((o) => !o)}
      className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-gray-new-98 dark:hover:bg-gray-new-10"
    >
      <span
        className="text-sm text-gray-new-50 transition-transform duration-150 dark:text-gray-new-60"
        style={{ transform: state.globalFlagsOpen ? 'rotate(90deg)' : 'none' }}
      >
        ▶
      </span>
      <span className="text-sm text-gray-new-50 dark:text-gray-new-60">
        {state.globalFlagsOpen ? 'global options' : `+ ${flags.length} global options`}
      </span>
      {!state.globalFlagsOpen && (
        <span className="truncate font-mono text-sm text-gray-new-70 dark:text-gray-new-50">
          {flags.map((f) => `--${f.name}`).join('  ')}
        </span>
      )}
    </button>
    {state.globalFlagsOpen && (
      <div className={cn(headerKeyPrefix && 'opacity-70')}>
        {flags.map((flag, i) => (
          <CliFlagRow
            key={flag.name}
            flag={flag}
            isLast={i === flags.length - 1}
            isIncluded={state.isFlagIncluded(flag.name)}
            isEditing={state.editingFlag === `${headerKeyPrefix}${flag.name}`}
            currentVal={state.getFlagVal(flag)}
            isHovered={state.hoveredFlag === flag.name}
            onSetHovered={state.setHoveredFlag}
            onToggleInclude={() => state.onToggle(flag.name)}
            onEdit={(val) => state.onEdit(flag.name, val)}
            onSetEditing={(name) => state.setEditingFlag(name ? `${headerKeyPrefix}${name}` : null)}
            showCheckboxes={state.editCount > 0}
          />
        ))}
      </div>
    )}
  </div>
);

GlobalFlagsCollapsible.propTypes = {
  flags: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  headerKeyPrefix: PropTypes.string.isRequired,
};
