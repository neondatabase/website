'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { TYPE_STYLES, getTypeColor } from 'utils/api-style';
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
        'rounded px-1.5 py-0.5 font-mono text-[10px] leading-normal font-medium',
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
    <div className="relative my-1 mr-3 ml-8 rounded-lg border border-gray-new-90 bg-gray-new-98 p-3.5 shadow-lg dark:border-gray-new-20 dark:bg-gray-new-10">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 right-2 rounded px-1.5 py-0.5 text-sm text-gray-new-50 hover:text-gray-new-20 dark:text-gray-new-60 dark:hover:text-gray-new-80"
      >
        ×
      </button>
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        <code className="font-mono text-[13px] font-semibold text-[#9CDCFE]">{node.key}</code>
        <TypeBadge type={node.type} />
        {node.required && (
          <span className="text-red-600 text-[9px] font-semibold dark:text-[#FF5645]">
            required
          </span>
        )}
        {node.constraints && (
          <span className="text-[10px] text-gray-new-50 dark:text-gray-new-60">
            {node.constraints}
          </span>
        )}
      </div>
      {(d.descriptionHtml || d.description) &&
        (() => {
          const descClass =
            'mb-2 text-[13px] leading-relaxed text-gray-new-20 dark:text-gray-new-80 [&_a]:underline [&_code]:rounded [&_code]:bg-gray-new-94 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11px] dark:[&_code]:bg-gray-new-15';
          return d.descriptionHtml ? (
            <p className={descClass} dangerouslySetInnerHTML={{ __html: d.descriptionHtml }} />
          ) : (
            <p className={descClass}>{d.description}</p>
          );
        })()}
      {d.example && (
        <div className="mb-2">
          <span className="mb-1 block text-[10px] font-semibold tracking-wider text-gray-new-50 uppercase dark:text-gray-new-60">
            Example
          </span>
          <code className="block rounded border border-gray-new-90 bg-gray-new-95 px-2.5 py-1.5 font-mono text-[12px] text-[#CE9178] dark:border-gray-new-20 dark:bg-gray-new-15">
            {d.example}
          </code>
        </div>
      )}
      {d.values && d.values.length > 0 && (
        <div className="mb-2">
          <span className="mb-1 block text-[10px] font-semibold tracking-wider text-gray-new-50 uppercase dark:text-gray-new-60">
            Valid values
          </span>
          <ul className="space-y-0.5 text-[12px] text-gray-new-30 dark:text-gray-new-70">
            {d.values.map((v) => (
              <li key={v}>
                <code className="font-mono">{v}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
      {d.link && (
        <a href={d.link.href} className="mt-1 text-[12px] text-green-45 hover:underline">
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

const FieldRow = ({ indent, isHovered, children }) => (
  <div
    className={cn(
      'flex items-baseline justify-between gap-4 border-l-2 px-5 py-1 transition-all duration-100',
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
          'inline-flex items-center gap-1 rounded px-0.5 font-mono text-[12px] transition-colors',
          isEdited ? 'text-[#CE9178]' : getTypeColor(typeGuess),
          'hover:opacity-80'
        )}
      >
        {selected !== null && selected !== undefined && selected !== ''
          ? String(selected)
          : '(select)'}
        <span className="text-[9px] text-gray-new-50 dark:text-gray-new-60">▼</span>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left }}
          className="z-50 min-w-[140px] overflow-hidden rounded-lg border border-gray-new-80 bg-[#1e1e1e] py-1 shadow-2xl dark:border-gray-new-20 dark:bg-gray-new-10"
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
                  'flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left font-mono text-[13px] transition-colors',
                  isSelected
                    ? 'bg-green-45/15 text-green-45'
                    : 'text-gray-new-50 hover:bg-gray-new-20/60 hover:text-gray-new-20 dark:text-gray-new-60 dark:hover:text-gray-new-80'
                )}
              >
                {String(opt)}
                {isSelected && <span className="text-[11px] text-green-45">✓</span>}
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

  return (
    <>
      <FieldRow indent={indent} isHovered={hovered}>
        <div
          className={cn(
            'flex min-w-0 flex-wrap items-baseline gap-0',
            node.deprecated && 'opacity-50'
          )}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hasKids && (
            <button
              type="button"
              onClick={() => onToggle(path)}
              className="mr-1 p-0 text-[9px] text-gray-new-50 transition-transform duration-150 dark:text-gray-new-60"
              style={{ transform: open ? 'rotate(90deg)' : 'none' }}
            >
              ▶
            </button>
          )}
          <span
            className={cn(
              'font-mono text-[13px]',
              node.deprecated
                ? 'text-gray-new-50 line-through dark:text-gray-new-60'
                : 'text-[#9CDCFE]'
            )}
          >
            &quot;{node.key}&quot;
          </span>
          <span className="font-mono text-[13px] text-gray-new-50 dark:text-gray-new-60">: </span>
          {bracket && !open ? (
            <span className="font-mono text-[12px] text-gray-new-50 dark:text-gray-new-60">
              {bracket}…{closeBracket}
              <span className="ml-1.5 text-[10px]">
                {node.children.length} {node.type === 'array' ? 'items' : 'fields'}
              </span>
            </span>
          ) : bracket ? (
            <span className="font-mono text-[13px] text-gray-new-50 dark:text-gray-new-60">
              {bracket}
            </span>
          ) : (
            <>
              <span className={cn('font-mono text-[13px]', getTypeColor(node.type))}>
                {node.value ?? `(${node.type})`}
              </span>
              <span className="font-mono text-[13px] text-gray-new-50 dark:text-gray-new-60">
                ,
              </span>
            </>
          )}
          {node.required && (
            <span className="text-red-600 ml-1.5 font-mono text-[9px] font-semibold tracking-wider dark:text-[#FF5645]">
              req
            </span>
          )}
          {node.deprecated && (
            <span className="ml-1.5 rounded bg-[#F0B375]/10 px-1 py-0.5 text-[9px] font-semibold text-[#F0B375]">
              deprecated{node.sunset ? ` · sunset ${node.sunset}` : ''}
            </span>
          )}
          {node.enum && (
            <span className="ml-1.5 font-mono text-[10px] text-gray-new-50 dark:text-gray-new-60">
              {node.enum.join(' | ')}
            </span>
          )}
          {node.format && (
            <span className="ml-1.5 font-mono text-[10px] text-gray-new-50 dark:text-gray-new-60">
              {node.format}
            </span>
          )}
          {node.constraints && (
            <span className="ml-1.5 text-[10px] text-gray-new-50 dark:text-gray-new-60">
              {node.constraints}
            </span>
          )}
        </div>

        {/* Annotation — click to pin if details exist */}
        {node.annotation && (
          <button
            type="button"
            onClick={() => node.details && setPinned((p) => !p)}
            className={cn(
              'max-w-[280px] shrink-0 overflow-hidden text-right text-[12px] text-ellipsis whitespace-nowrap transition-colors duration-100',
              node.details
                ? 'cursor-pointer underline-offset-2 hover:text-gray-new-20 dark:hover:text-gray-new-80'
                : 'cursor-default',
              hovered || pinned
                ? 'text-gray-new-30 dark:text-gray-new-70'
                : 'text-gray-new-60 dark:text-gray-new-50',
              node.details && (hovered || pinned) && 'underline decoration-dashed'
            )}
          >
            {node.annotation}
            {node.details && (
              <span
                className={cn('ml-1 text-[10px]', pinned ? 'text-green-45' : 'text-gray-new-50')}
              >
                ⓘ
              </span>
            )}
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
            className="px-5 py-0.5 font-mono text-[13px] text-gray-new-50 dark:text-gray-new-60"
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
        <span className={cn('font-mono text-[13px]', getTypeColor(node.type))}>
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
            'font-mono text-[12px] transition-colors',
            edited ? 'text-green-45' : 'text-[#569CD6]'
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
          className="rounded border border-green-45/40 bg-green-45/5 px-1 font-mono text-[12px] text-[#CE9178] outline-none"
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
          'cursor-text rounded px-0.5 font-mono text-[12px] transition-all',
          edited
            ? 'border-b border-dashed border-green-45/60 bg-green-45/5 text-[#CE9178]'
            : 'text-gray-new-50 hover:border-b hover:border-dashed hover:border-gray-new-50 dark:text-gray-new-60',
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
          'flex items-baseline justify-between gap-4 border-l-2 px-5 py-[9px] transition-all duration-100',
          hovered || isIncluded || edited
            ? 'border-l-green-45/50 bg-[rgba(0,229,153,0.04)] dark:bg-[rgba(0,229,153,0.03)]'
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
                    ? 'border-green-45 bg-green-45'
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
              className="mr-1 p-0 text-[9px] text-gray-new-50 transition-transform duration-150 dark:text-gray-new-60"
              style={{ transform: open ? 'rotate(90deg)' : 'none' }}
            >
              ▶
            </button>
          )}

          <span
            className={cn(
              'font-mono text-[13px]',
              node.deprecated
                ? 'text-gray-new-50 line-through dark:text-gray-new-60'
                : 'text-[#9CDCFE]'
            )}
          >
            &quot;{node.key}&quot;
          </span>
          <span className="font-mono text-[13px] text-gray-new-50 dark:text-gray-new-60">: </span>

          {bracket && !open ? (
            <span className="font-mono text-[12px] text-gray-new-50 dark:text-gray-new-60">
              {bracket}…{closeBracket}
              <span className="ml-1.5 text-[10px]">
                {node.children.length} {node.type === 'array' ? 'items' : 'fields'}
              </span>
            </span>
          ) : bracket ? (
            <span className="font-mono text-[13px] text-gray-new-50 dark:text-gray-new-60">
              {bracket}
            </span>
          ) : (
            <>
              {renderValue()}
              <span className="font-mono text-[13px] text-gray-new-50 dark:text-gray-new-60">
                ,
              </span>
            </>
          )}

          {node.deprecated && (
            <span className="ml-1.5 rounded bg-[#F0B375]/10 px-1 py-0.5 text-[9px] font-semibold text-[#F0B375]">
              deprecated{node.sunset ? ` · sunset ${node.sunset}` : ''}
            </span>
          )}
          {node.constraints && !node.enum && (
            <span className="ml-1.5 text-[10px] text-gray-new-50 dark:text-gray-new-60">
              {node.constraints}
            </span>
          )}
        </div>

        {/* Annotation — show validation error or click-to-pin annotation */}
        {error ? (
          <span className="text-amber-400 shrink-0 text-right text-[11px] font-medium">
            ⚠ {error}
          </span>
        ) : (
          node.annotation && (
            <button
              type="button"
              onClick={() => node.details && onPin(isPinned ? null : path)}
              className={cn(
                'max-w-[260px] shrink-0 overflow-hidden text-right text-[12px] text-ellipsis whitespace-nowrap transition-colors duration-100',
                node.details ? 'cursor-pointer' : 'cursor-default',
                hovered || isPinned
                  ? 'text-gray-new-30 dark:text-gray-new-70'
                  : 'text-gray-new-60 dark:text-gray-new-50',
                node.details &&
                  (hovered || isPinned) &&
                  'underline decoration-dashed underline-offset-2'
              )}
            >
              {node.annotation}
              {node.details && (
                <span
                  className={cn(
                    'ml-1 text-[10px]',
                    isPinned ? 'text-green-45' : 'text-gray-new-50'
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
            className="px-5 py-0.5 font-mono text-[13px] text-gray-new-50 dark:text-gray-new-60"
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
