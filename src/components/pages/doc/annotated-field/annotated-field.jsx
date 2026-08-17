'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import { INLINE_CODE_STYLES, TYPE_STYLES, getTypeColor } from 'utils/api-style';
import { cn } from 'utils/cn';

// ── Type badge ──────────────────────────────────────────────────────────────
//
// Both the badge palette (TYPE_STYLES) and the inline text color helper
// (getTypeColor) live in src/utils/api-style.js so renaming a token here
// flips both renderings (badge + inline value) consistently.

const TypeBadge = ({ type }) => {
  if (!type) return null;
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 font-mono text-sm leading-normal font-medium',
        TYPE_STYLES[type] ?? TYPE_STYLES.string
      )}
    >
      {type}
    </span>
  );
};

TypeBadge.propTypes = { type: PropTypes.string };

// ── Detail card (click-to-pin) ──────────────────────────────────────────────

const DetailCard = ({ node, onClose }) => {
  const d = node.details;
  if (!d) return null;
  return (
    <div className="relative my-1 mr-5 ml-8 border border-gray-new-80 bg-white p-5 dark:border-gray-new-20 dark:bg-gray-new-8">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 px-1.5 py-0.5 text-xl leading-none text-gray-new-50 transition-colors hover:text-gray-new-20 dark:text-gray-new-60 dark:hover:text-gray-new-80"
        aria-label="Close field details"
      >
        ×
      </button>
      <div className="flex flex-wrap items-baseline gap-2 pr-8">
        <code className="font-mono text-sm leading-relaxed font-semibold text-[var(--shiki-token-string-expression)]">
          {node.key}
        </code>
        <TypeBadge type={node.type} />
        {node.required && (
          <span className="text-red-600 text-sm font-semibold dark:text-[#FF5645]">required</span>
        )}
        {node.constraints && (
          <span className="text-sm text-gray-new-50 dark:text-gray-new-60">{node.constraints}</span>
        )}
      </div>
      {(d.descriptionHtml || d.description) &&
        (() => {
          const descClass =
            'mt-3 text-sm leading-normal text-gray-new-20 dark:text-gray-new-80 [&_a]:underline';
          return d.descriptionHtml ? (
            <p
              className={cn(descClass, INLINE_CODE_STYLES)}
              dangerouslySetInnerHTML={{ __html: d.descriptionHtml }}
            />
          ) : (
            <p className={descClass}>{d.description}</p>
          );
        })()}
      {d.example && (
        <div className="mt-3">
          <span className="mb-1 block text-sm font-semibold tracking-wide text-gray-new-50 uppercase dark:text-gray-new-60">
            Example
          </span>
          <code className="block border border-gray-new-70 bg-transparent px-2.5 py-1.5 font-mono text-sm text-[var(--shiki-token-string)] dark:border-gray-new-30">
            {d.example}
          </code>
        </div>
      )}
      {d.values && d.values.length > 0 && (
        <div className="mt-3">
          <span className="mb-1 block text-sm font-semibold tracking-wide text-gray-new-50 uppercase dark:text-gray-new-60">
            Valid values
          </span>
          <ul className="space-y-0.5 text-sm text-gray-new-30 dark:text-gray-new-70">
            {d.values.map((v) => (
              <li key={v}>
                <code className="font-mono">{v}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
      {d.link && (
        <a href={d.link.href} className="mt-1 text-sm text-green-45 hover:underline">
          {d.link.text} →
        </a>
      )}
    </div>
  );
};

DetailCard.propTypes = {
  node: PropTypes.shape({
    key: PropTypes.string,
    type: PropTypes.string,
    required: PropTypes.bool,
    constraints: PropTypes.string,
    details: PropTypes.shape({
      description: PropTypes.string,
      descriptionHtml: PropTypes.string,
      example: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string),
      link: PropTypes.shape({ text: PropTypes.string, href: PropTypes.string }),
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

// ── Shared row wrapper ──────────────────────────────────────────────────────

const FieldRow = ({ indent, isHovered, onMouseEnter, onMouseLeave, children }) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={cn(
      'flex items-baseline justify-between gap-4 border-l-2 px-5 py-1.5 transition-all duration-100',
      isHovered
        ? 'border-l-green-45/70 bg-[rgba(0,229,153,0.04)] dark:bg-[rgba(0,229,153,0.03)]'
        : 'border-l-transparent'
    )}
    style={{ paddingLeft: `${20 + indent * 18}px` }}
  >
    {children}
  </div>
);

FieldRow.propTypes = {
  indent: PropTypes.number.isRequired,
  isHovered: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  children: PropTypes.node.isRequired,
};

// ── AnnotatedField — read-only, for response ───────────────────────────────

export const AnnotatedField = ({ node, indent = 0, parentPath = '', isOpen, onToggle }) => {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const path = parentPath ? `${parentPath}.${node.key}` : node.key;
  const hasKids = node.children?.length > 0;
  const open = isOpen(path);
  const bracket = hasKids ? (node.type === 'array' ? '[' : '{') : null;
  const closeBracket = node.type === 'array' ? ']' : '}';
  const hasDetails = Boolean(node.details);
  const leftContentClassName = cn(
    'flex min-w-0 flex-wrap items-baseline gap-0 text-left',
    hasKids && 'cursor-pointer',
    node.deprecated && 'opacity-50'
  );
  const fieldContent = (
    <>
      {hasKids && (
        <span
          className="mr-1 p-0 text-sm text-gray-new-50 transition-transform duration-150 dark:text-gray-new-60"
          style={{ transform: open ? 'rotate(90deg)' : 'none' }}
          aria-hidden="true"
        >
          ▶
        </span>
      )}
      <span
        className={cn(
          'font-mono text-sm',
          node.deprecated
            ? 'text-gray-new-50 line-through dark:text-gray-new-60'
            : 'text-[var(--shiki-token-string-expression)]'
        )}
      >
        &quot;{node.key}&quot;
      </span>
      <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">: </span>
      {bracket && !open ? (
        <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
          {bracket}…{closeBracket}
          <span className="ml-1.5 text-sm">
            {node.children.length} {node.type === 'array' ? 'items' : 'fields'}
          </span>
        </span>
      ) : bracket ? (
        <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">{bracket}</span>
      ) : (
        <>
          <span className={cn('font-mono text-sm', getTypeColor(node.type))}>
            {node.value ?? `(${node.type})`}
          </span>
          <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">,</span>
        </>
      )}
      {node.required && (
        <span className="text-red-600 ml-1.5 font-mono text-sm font-semibold tracking-wider dark:text-[#FF5645]">
          req
        </span>
      )}
      {node.deprecated && (
        <span className="ml-1.5 rounded border border-[#F0B375]/40 bg-transparent px-1 py-0.5 text-sm font-semibold text-[#F0B375]">
          deprecated{node.sunset ? ` · sunset ${node.sunset}` : ''}
        </span>
      )}
      {node.enum && (
        <span className="ml-1.5 font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
          {node.enum.join(' | ')}
        </span>
      )}
      {node.format && (
        <span className="ml-1.5 font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
          {node.format}
        </span>
      )}
      {node.constraints && (
        <span className="ml-1.5 text-sm text-gray-new-50 dark:text-gray-new-60">
          {node.constraints}
        </span>
      )}
    </>
  );

  return (
    <>
      <FieldRow
        indent={indent}
        isHovered={hovered || pinned}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hasKids ? (
          <button
            type="button"
            onClick={() => onToggle(path)}
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${node.key}`}
            className={leftContentClassName}
          >
            {fieldContent}
          </button>
        ) : (
          <div className={leftContentClassName}>{fieldContent}</div>
        )}

        {hasDetails && (
          <button
            type="button"
            onClick={() => setPinned((p) => !p)}
            aria-label={`${pinned ? 'Hide' : 'Show'} ${node.key} details`}
            className={cn(
              'ml-auto shrink-0 cursor-pointer text-sm leading-none transition-colors',
              pinned ? 'text-green-44' : 'text-gray-new-50 dark:text-gray-new-60',
              hovered && !pinned && 'text-gray-new-30 dark:text-gray-new-80'
            )}
          >
            ⓘ
          </button>
        )}
      </FieldRow>

      {pinned && node.details && <DetailCard node={node} onClose={() => setPinned(false)} />}

      {hasKids && open && (
        <>
          {node.children.map((child) => (
            <AnnotatedField
              key={`${path}.${child.key}`}
              node={child}
              indent={indent + 1}
              parentPath={path}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          ))}
          <div
            className="px-5 py-0.5 font-mono text-sm text-gray-new-50 dark:text-gray-new-60"
            style={{ paddingLeft: `${20 + indent * 18}px` }}
          >
            {closeBracket},
          </div>
        </>
      )}
    </>
  );
};

AnnotatedField.propTypes = {
  node: PropTypes.shape({
    key: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.any,
    annotation: PropTypes.string,
    required: PropTypes.bool,
    deprecated: PropTypes.bool,
    sunset: PropTypes.string,
    constraints: PropTypes.string,
    enum: PropTypes.array,
    format: PropTypes.string,
    details: PropTypes.object,
    children: PropTypes.array,
  }).isRequired,
  indent: PropTypes.number,
  parentPath: PropTypes.string,
  isOpen: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export { TypeBadge };
export default AnnotatedField;
