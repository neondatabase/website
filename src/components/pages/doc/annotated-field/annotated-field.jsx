'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { INLINE_CODE_STYLES, TYPE_STYLES, getTypeColor } from 'utils/api-style';
import { cn } from 'utils/cn';

// ── Field validation ─────────────────────────────────────────────────────────

export function validateValue(raw, node) {
  if (raw === '' || raw === undefined || raw === null) return null;
  if (node.type === 'integer' || node.type === 'number') {
    const n = Number(raw);
    if (!Number.isFinite(n))
      return `Must be a ${node.type === 'integer' ? 'whole number' : 'number'}`;
    if (node.type === 'integer' && !Number.isInteger(n)) return 'Must be a whole number';
    if (node.min !== undefined && n < node.min) return `Min ${node.min}`;
    if (node.max !== undefined && n > node.max) return `Max ${node.max}`;
  }
  if (node.type === 'string') {
    if (node.minLength !== undefined && raw.length < node.minLength)
      return `At least ${node.minLength} chars`;
    if (node.maxLength !== undefined && raw.length > node.maxLength)
      return `At most ${node.maxLength} chars`;
    if (node.format === 'email' && !/.+@.+\..+/.test(raw)) return 'Invalid email';
    if (
      node.format === 'uuid' &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw)
    )
      return 'Invalid UUID';
    if (node.format === 'uri' && !/^https?:\/\//.test(raw)) return 'Must start with http(s)://';
  }
  return null;
}

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
        'px-1.5 py-0.5 font-mono text-sm leading-normal font-medium',
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
    <div className="relative my-1 mr-5 ml-8 border border-gray-new-80 bg-white p-5 shadow-lg dark:border-gray-new-20 dark:bg-gray-new-8">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 px-1.5 py-0.5 text-xl leading-none text-gray-new-50 transition-colors hover:text-gray-new-20 dark:text-gray-new-60 dark:hover:text-gray-new-80"
        aria-label="Close field details"
      >
        ×
      </button>
      <div className="mb-3 flex flex-wrap items-baseline gap-2 pr-8">
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
            'mb-3 text-base leading-relaxed text-gray-new-20 dark:text-gray-new-80 [&_a]:underline';
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
        <div className="mb-3">
          <span className="mb-1 block text-sm font-semibold tracking-wide text-gray-new-50 uppercase dark:text-gray-new-60">
            Example
          </span>
          <code className="block border border-gray-new-70 bg-transparent px-2.5 py-1.5 font-mono text-sm text-[var(--shiki-token-string)] dark:border-gray-new-30">
            {d.example}
          </code>
        </div>
      )}
      {d.values && d.values.length > 0 && (
        <div className="mb-3">
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

const FieldRow = ({
  indent,
  isHovered,
  isInteractive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
}) => (
  <div
    role={isInteractive ? 'button' : undefined}
    tabIndex={isInteractive ? 0 : undefined}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onKeyDown={(e) => {
      if (!isInteractive) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e);
      }
    }}
    className={cn(
      'flex items-baseline justify-between gap-4 border-l-2 px-5 py-1.5 transition-all duration-100',
      isInteractive && 'cursor-pointer',
      isHovered
        ? 'border-l-green-45/50 bg-[rgba(0,229,153,0.04)] dark:bg-[rgba(0,229,153,0.03)]'
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
  isInteractive: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  children: PropTypes.node.isRequired,
};

// ── Enum dropdown ─────────────────────────────────────────────────────────────

const EnumDropdown = ({ options, selected, isEdited, onChange }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const handleMousedown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', handleMousedown);
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 2, left: rect.left });
    }
    setOpen((o) => !o);
  };

  const typeGuess = typeof options[0] === 'number' ? 'integer' : 'string';

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          'inline-flex items-center gap-1 rounded px-0.5 font-mono text-sm transition-colors',
          isEdited ? 'text-[var(--shiki-token-string)]' : getTypeColor(typeGuess),
          'hover:opacity-80'
        )}
      >
        {selected !== null && selected !== undefined && selected !== ''
          ? String(selected)
          : '(select)'}
        <span className="text-sm text-gray-new-50 dark:text-gray-new-60">▼</span>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left }}
          className="z-50 min-w-[140px] overflow-hidden rounded-lg border border-gray-new-80 bg-gray-new-94 py-1 shadow-2xl dark:border-gray-new-20 dark:bg-gray-new-10"
        >
          {options.map((opt) => {
            const isSelected = String(opt) === String(selected);
            return (
              <button
                key={String(opt)}
                type="button"
                onClick={() => {
                  onChange(String(opt));
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left font-mono text-sm transition-colors',
                  isSelected
                    ? 'bg-transparent text-[#00B87B] dark:text-green-45'
                    : 'text-gray-new-50 hover:bg-gray-new-20/40 hover:text-gray-new-20 dark:text-gray-new-60 dark:hover:text-gray-new-80'
                )}
              >
                {String(opt)}
                {isSelected && <span className="text-sm text-[#00B87B]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
};

EnumDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.any,
  isEdited: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
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

  return (
    <>
      <FieldRow
        indent={indent}
        isHovered={hovered || pinned}
        isInteractive={hasDetails}
        onClick={() => hasDetails && setPinned((p) => !p)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={cn(
            'flex min-w-0 flex-wrap items-baseline gap-0',
            node.deprecated && 'opacity-50'
          )}
        >
          {hasKids && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(path);
              }}
              className="mr-1 p-0 text-sm text-gray-new-50 transition-transform duration-150 dark:text-gray-new-60"
              style={{ transform: open ? 'rotate(90deg)' : 'none' }}
            >
              ▶
            </button>
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
            <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
              {bracket}
            </span>
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
            <span className="ml-1.5 border border-[#F0B375]/40 bg-transparent px-1 py-0.5 text-sm font-semibold text-[#F0B375]">
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
        </div>

        {hasDetails && (
          <span
            aria-hidden="true"
            className={cn(
              'ml-auto shrink-0 text-sm leading-none transition-colors',
              pinned ? 'text-green-45' : 'text-gray-new-50 dark:text-gray-new-60',
              hovered && !pinned && 'text-gray-new-30 dark:text-gray-new-80'
            )}
          >
            ⓘ
          </span>
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

// ── EditableField — interactive body editor ────────────────────────────────

export const EditableField = ({
  node,
  indent = 0,
  parentPath = '',
  editedValues,
  includedFields,
  onEdit,
  onToggleInclude,
  onError,
  isOpen,
  onToggle,
  pinnedField,
  onPin,
  showCheckboxes,
}) => {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  const path = parentPath ? `${parentPath}.${node.key}` : node.key;
  const hasKids = node.children?.length > 0;
  const open = isOpen(path);
  const bracket = hasKids ? (node.type === 'array' ? '[' : '{') : null;
  const closeBracket = node.type === 'array' ? ']' : '}';

  const isIncluded = includedFields.has(path);
  const edited = editedValues[path] !== undefined;
  const currentVal = edited ? editedValues[path] : (node.value ?? '');
  const isPinned = pinnedField === path;

  const handleEdit = (val) => {
    if (error) {
      setError(null);
      onError?.(path, null);
    }
    onEdit(path, val);
  };
  const handleToggle = () => onToggleInclude(path);

  const renderValue = () => {
    if (node.deprecated) {
      return (
        <span className={cn('font-mono text-sm', getTypeColor(node.type))}>
          {node.value ?? `(${node.type})`}
        </span>
      );
    }

    if (node.type === 'boolean') {
      const active = edited ? currentVal === 'true' : node.value === 'true' || node.value === true;
      return (
        <button
          type="button"
          onClick={() => handleEdit(active ? 'false' : 'true')}
          className={cn(
            'font-mono text-sm transition-colors',
            edited
              ? 'text-[var(--shiki-token-keyword)]'
              : 'text-[var(--shiki-token-string-expression)]'
          )}
        >
          {active ? 'true' : 'false'}
        </button>
      );
    }

    if (node.enum) {
      const selectedVal = edited
        ? currentVal
        : node.value !== undefined
          ? String(node.value)
          : node.enum.length > 0
            ? String(node.enum[0])
            : null;
      return (
        <EnumDropdown
          options={node.enum}
          selected={selectedVal}
          isEdited={edited}
          onChange={handleEdit}
        />
      );
    }

    if (editing) {
      return (
        <input
          autoFocus
          value={String(currentVal)}
          onChange={(e) => handleEdit(e.target.value)}
          onBlur={() => {
            const err = validateValue(String(currentVal), node);
            setError(err);
            onError?.(path, err);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              const err = validateValue(String(currentVal), node);
              setError(err);
              onError?.(path, err);
              setEditing(false);
            }
          }}
          aria-label={`Edit ${node.key} value`}
          className="rounded border border-green-45/40 bg-green-45/5 px-1 font-mono text-sm text-[var(--shiki-token-string)] outline-none"
          style={{ width: `${Math.max(80, String(currentVal).length * 7.5)}px`, maxWidth: '200px' }}
        />
      );
    }

    const startEditing = () => {
      if (!node.deprecated) setEditing(true);
    };

    return (
      <span
        role="button"
        tabIndex={node.deprecated ? -1 : 0}
        onClick={startEditing}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startEditing();
          }
        }}
        aria-label={`Edit ${node.key} value`}
        aria-disabled={node.deprecated || undefined}
        className={cn(
          'cursor-text rounded border-b border-dashed border-transparent px-0.5 font-mono text-sm transition-all outline-none',
          edited
            ? 'border-[#00B87B] bg-green-45/5 text-[var(--shiki-token-string)]'
            : 'text-gray-new-50 hover:border-gray-new-50 dark:text-gray-new-60',
          node.deprecated && 'cursor-default'
        )}
      >
        {edited
          ? String(currentVal)
          : node.placeholder
            ? `(${node.placeholder})`
            : node.value !== undefined
              ? String(node.value)
              : `(${node.type})`}
      </span>
    );
  };

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'flex items-center justify-between gap-4 border-l-2 px-5 py-[9px] transition-all duration-100',
          hovered || isIncluded || edited
            ? 'border-l-[#00B87B] bg-[#EFEFF1] dark:bg-[#242427]'
            : 'border-l-transparent'
        )}
        style={{ paddingLeft: `${20 + indent * 18}px` }}
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-0">
          {/* Checkbox — appears on hover or when any field is included */}
          <div className="mr-1.5 flex w-3 items-center justify-center">
            {!node.deprecated && (showCheckboxes || hovered || isIncluded) && !node.required && (
              <button
                type="button"
                onClick={handleToggle}
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

          {hasKids && (
            <button
              type="button"
              onClick={() => onToggle(path)}
              className="mr-1 p-0 text-sm text-gray-new-50 transition-transform duration-150 dark:text-gray-new-60"
              style={{ transform: open ? 'rotate(90deg)' : 'none' }}
            >
              ▶
            </button>
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
            <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
              {bracket}
            </span>
          ) : (
            <>
              {renderValue()}
              <span className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">,</span>
            </>
          )}

          {node.deprecated && (
            <span className="ml-1.5 border border-[#F0B375]/40 bg-transparent px-1 py-0.5 text-sm font-semibold text-[#F0B375]">
              deprecated{node.sunset ? ` · sunset ${node.sunset}` : ''}
            </span>
          )}

          {node.constraints && !node.enum && (
            <span className="ml-1.5 text-sm text-gray-new-50 dark:text-gray-new-60">
              {node.constraints}
            </span>
          )}
        </div>

        {/* Annotation — show validation error or click-to-pin annotation */}
        {error ? (
          <span className="text-amber-400 shrink-0 text-right text-sm font-medium">⚠ {error}</span>
        ) : (
          node.annotation && (
            <button
              type="button"
              onClick={() => node.details && onPin(isPinned ? null : path)}
              className={cn(
                'flex max-w-[260px] shrink-0 items-baseline text-right text-sm transition-colors duration-100',
                node.details ? 'cursor-pointer' : 'cursor-default',
                hovered || isPinned
                  ? 'text-gray-new-30 dark:text-gray-new-70'
                  : 'text-gray-new-60 dark:text-gray-new-50',
                node.details &&
                  (hovered || isPinned) &&
                  'underline decoration-dashed underline-offset-2'
              )}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {node.annotation}
              </span>
              {node.details && (
                <span
                  className={cn(
                    'ml-1 shrink-0 text-sm',
                    isPinned
                      ? 'text-gray-new-30 dark:text-gray-new-70'
                      : 'text-gray-new-60 dark:text-gray-new-50'
                  )}
                >
                  ⓘ
                </span>
              )}
            </button>
          )
        )}
      </div>

      {isPinned && node.details && <DetailCard node={node} onClose={() => onPin(null)} />}

      {hasKids && open && (
        <>
          {node.children.map((child) => (
            <EditableField
              key={`${path}.${child.key}`}
              node={child}
              indent={indent + 1}
              parentPath={path}
              editedValues={editedValues}
              includedFields={includedFields}
              onEdit={onEdit}
              onToggleInclude={onToggleInclude}
              onError={onError}
              isOpen={isOpen}
              onToggle={onToggle}
              pinnedField={pinnedField}
              onPin={onPin}
              showCheckboxes={showCheckboxes}
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

EditableField.propTypes = {
  node: PropTypes.shape({
    key: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    annotation: PropTypes.string,
    required: PropTypes.bool,
    deprecated: PropTypes.bool,
    sunset: PropTypes.string,
    constraints: PropTypes.string,
    enum: PropTypes.array,
    details: PropTypes.object,
    children: PropTypes.array,
    min: PropTypes.number,
    max: PropTypes.number,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    format: PropTypes.string,
  }).isRequired,
  indent: PropTypes.number,
  parentPath: PropTypes.string,
  editedValues: PropTypes.object.isRequired,
  includedFields: PropTypes.instanceOf(Set).isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggleInclude: PropTypes.func.isRequired,
  onError: PropTypes.func,
  isOpen: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  pinnedField: PropTypes.string,
  onPin: PropTypes.func.isRequired,
  showCheckboxes: PropTypes.bool,
};

export { TypeBadge };
export default AnnotatedField;
