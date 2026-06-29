'use client';

import PropTypes from 'prop-types';
import { useId, useState } from 'react';

import Chevron from 'icons/chevron-right-lg.inline.svg';
import { INLINE_CODE_STYLES } from 'utils/api-style';
import { cn } from 'utils/cn';

import { fieldDefaultLabel, fieldTitle } from './field-label';

export function findNodeByPath(nodes, path) {
  const segs = path.split('.');
  let level = nodes;
  let node = null;
  for (const seg of segs) {
    node = level?.find((item) => item.key === seg) ?? null;
    if (!node) return null;
    level = node.children;
  }
  return { node, parentPath: segs.slice(0, -1).join('.') };
}

function descriptionHtml(node) {
  return node?.details?.descriptionHtml ?? null;
}

function descriptionText(node) {
  return node?.details?.description ?? node?.description ?? '';
}

function TypeBadge({ type }) {
  if (!type) return null;
  return (
    <span className="rounded border border-gray-new-70 bg-transparent px-1.5 py-0.5 font-mono text-sm leading-normal font-medium text-black-pure dark:border-gray-new-30 dark:text-white">
      {type}
    </span>
  );
}

TypeBadge.propTypes = {
  type: PropTypes.string,
};

function MetadataBadges({ node, row }) {
  return (
    <>
      {row?.common && (
        <span className="border border-[#00B87B]/40 bg-transparent px-1.5 py-0.5 text-sm font-semibold text-[#00B87B] dark:border-green-45/40 dark:text-green-45">
          common
        </span>
      )}
      {row?.outOfObject && (
        <span className="border border-gray-new-70 bg-transparent px-1.5 py-0.5 text-sm font-medium text-gray-new-50 dark:border-gray-new-30 dark:text-gray-new-60">
          top-level field
        </span>
      )}
      {node?.deprecated && (
        <span className="rounded border border-[#E2301D]/40 bg-transparent px-1.5 py-0.5 text-sm font-medium text-[#E2301D] dark:border-[#FF5645]/40 dark:text-[#FF5645]">
          deprecated
        </span>
      )}
    </>
  );
}

MetadataBadges.propTypes = {
  node: PropTypes.object,
  row: PropTypes.shape({
    common: PropTypes.bool,
    outOfObject: PropTypes.bool,
  }),
};

function EnumPills({ node }) {
  const values = node?.enum ?? node?.details?.values ?? null;
  if (!values?.length) return null;
  const active = node.value !== undefined ? String(node.value) : null;
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {values.map((value) => {
        const isActive = active === String(value);
        return (
          <span
            key={String(value)}
            className={cn(
              'rounded-sm px-1.5 py-0.5 font-mono text-sm',
              isActive
                ? 'border border-[#00B87B]/40 bg-transparent font-semibold text-[#00B87B] dark:border-green-45/40 dark:text-green-45'
                : 'border border-gray-new-70 bg-transparent text-gray-new-50 dark:border-gray-new-30 dark:text-gray-new-60'
            )}
          >
            {String(value)}
          </span>
        );
      })}
    </div>
  );
}

EnumPills.propTypes = {
  node: PropTypes.shape({
    enum: PropTypes.array,
    value: PropTypes.any,
    details: PropTypes.shape({
      values: PropTypes.array,
    }),
  }),
};

function ConstraintText({ node }) {
  if (!node?.constraints) return null;
  return (
    <p className="mt-2 font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
      {node.constraints}
    </p>
  );
}

ConstraintText.propTypes = {
  node: PropTypes.shape({ constraints: PropTypes.string }),
};

export function DocField({ node, path, labels, row, depth = 0, defaultOpen = depth === 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const childrenId = useId();
  const hasChildren = node.children?.length > 0;
  const title = fieldTitle(path, node, labels);
  const defaultLabel = fieldDefaultLabel(path, node, labels);

  return (
    <div className={cn('border-b border-gray-new-90 py-4 last:border-b-0 dark:border-gray-new-20')}>
      <div
        className="grid gap-4 md:grid-cols-1"
        style={{ gridTemplateColumns: 'minmax(180px, 0.85fr) minmax(0, 1.35fr)' }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            {hasChildren && (
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={`Toggle ${title} field`}
                aria-expanded={open}
                aria-controls={childrenId}
                className="mr-0.5 flex size-6 items-center justify-center text-gray-new-50 dark:text-gray-new-60"
              >
                <Chevron className={cn('w-1.5', open && 'rotate-90')} />
              </button>
            )}
            <span className="text-sm font-semibold text-black-pure dark:text-white">{title}</span>
            <MetadataBadges node={node} row={row} />
          </div>
          <code className="mt-1 block font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
            {node.key}
          </code>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <TypeBadge type={node.type} />
            {defaultLabel && <TypeBadge type={`default ${defaultLabel}`} />}
          </div>
        </div>
        <div>
          {descriptionHtml(node) ? (
            <div
              className={cn(
                'text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70 [&_a]:underline [&_p+p]:mt-2',
                INLINE_CODE_STYLES
              )}
              dangerouslySetInnerHTML={{ __html: descriptionHtml(node) }}
            />
          ) : (
            <p className="text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70">
              {descriptionText(node)}
            </p>
          )}
          <EnumPills node={node} />
          <ConstraintText node={node} />
        </div>
      </div>
      {hasChildren && open && (
        <div
          id={childrenId}
          className="mt-3 border-l border-gray-new-90 pl-4 dark:border-gray-new-20"
        >
          {node.children.map((child) => {
            const childPath = `${path}.${child.key}`;
            return (
              <DocField
                key={childPath}
                node={child}
                path={childPath}
                labels={labels}
                row={row}
                depth={depth + 1}
                defaultOpen={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

DocField.propTypes = {
  node: PropTypes.shape({
    key: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.any,
    children: PropTypes.array,
    deprecated: PropTypes.bool,
    details: PropTypes.shape({
      description: PropTypes.string,
      descriptionHtml: PropTypes.string,
      values: PropTypes.array,
    }),
    description: PropTypes.string,
    constraints: PropTypes.string,
    enum: PropTypes.array,
  }).isRequired,
  path: PropTypes.string.isRequired,
  labels: PropTypes.object,
  row: PropTypes.shape({
    common: PropTypes.bool,
    outOfObject: PropTypes.bool,
  }),
  depth: PropTypes.number,
  defaultOpen: PropTypes.bool,
};

function SectionCard({ section, bodyTree, labels, isFirst }) {
  const [open, setOpen] = useState(!(section.collapsed || !isFirst));
  const fieldsId = useId();
  const rows = section.rows
    .map((row) => {
      const found = findNodeByPath(bodyTree, row.path);
      return found ? { ...row, ...found } : null;
    })
    .filter(Boolean);

  return (
    <section className="overflow-hidden border border-gray-new-90 bg-white dark:border-gray-new-20 dark:bg-gray-new-10">
      <div className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-new-98 dark:hover:bg-gray-new-15">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={`Toggle ${section.label} section`}
          aria-expanded={open}
          aria-controls={fieldsId}
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center text-gray-new-50 dark:text-gray-new-60"
        >
          <Chevron className={cn('w-1.5', open && 'rotate-90')} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              id={`body-${section.id}`}
              className="scroll-mt-20 text-sm leading-tight font-semibold text-black-pure dark:text-white"
            >
              {section.label}
            </h3>
            {section.common && (
              <span className="border border-[#00B87B]/40 bg-transparent px-1.5 py-0.5 text-sm font-semibold text-[#00B87B] dark:border-green-45/40 dark:text-green-45">
                commonly set
              </span>
            )}
            {section.schemaPath && (
              <code className="font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
                {section.schemaPath}
              </code>
            )}
          </div>
          {section.blurb && (
            <p className="mt-1 text-sm leading-relaxed text-gray-new-50 dark:text-gray-new-60">
              {section.blurb}
            </p>
          )}
        </div>
        <span className="shrink-0 font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
          {rows.length} {rows.length === 1 ? 'field' : 'fields'}
        </span>
      </div>
      {open && (
        <div id={fieldsId} className="border-t border-gray-new-90 px-4 dark:border-gray-new-20">
          {rows.map(({ path, node, common, outOfObject }) => (
            <DocField
              key={path}
              node={node}
              path={path}
              labels={labels}
              row={{ common, outOfObject }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

SectionCard.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    common: PropTypes.bool,
    blurb: PropTypes.string,
    collapsed: PropTypes.bool,
    schemaPath: PropTypes.string,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
        common: PropTypes.bool,
        outOfObject: PropTypes.bool,
      })
    ).isRequired,
  }).isRequired,
  bodyTree: PropTypes.array.isRequired,
  labels: PropTypes.object,
  isFirst: PropTypes.bool.isRequired,
};

export function getRequiredLeafPaths(nodes, prefix = '', ancestorsRequired = true) {
  const paths = [];
  for (const node of nodes) {
    const path = prefix ? `${prefix}.${node.key}` : node.key;
    const pathRequired = ancestorsRequired && node.required;
    if (node.children?.length) {
      paths.push(...getRequiredLeafPaths(node.children, path, pathRequired));
    } else if (pathRequired) {
      paths.push(path);
    }
  }
  return paths;
}

function RequiredSummary({ requiredFields, bodyRequired }) {
  const count = requiredFields.length;
  return (
    <div className="mb-4 border-l-2 border-[#00B87B] bg-[#00B87B]/5 px-4 py-3 dark:bg-green-45/5">
      <p className="text-sm leading-relaxed text-gray-new-40 dark:text-gray-new-70">
        <strong className="font-semibold text-black-pure dark:text-white">{count} required</strong>{' '}
        {count === 0 ? (
          <>
            No field is required.
            {!bodyRequired ? ' Send an empty body to use sensible defaults.' : ''}
          </>
        ) : (
          <>
            Required:{' '}
            {requiredFields.map((field, index) => (
              <span key={field}>
                <code className="rounded border border-gray-new-70 bg-transparent px-1.5 py-0.5 font-mono text-sm leading-normal font-medium text-black-pure dark:border-gray-new-30 dark:text-white">
                  {field}
                </code>
                {index < requiredFields.length - 1 ? ', ' : ''}
              </span>
            ))}
            .
          </>
        )}
      </p>
    </div>
  );
}

RequiredSummary.propTypes = {
  requiredFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  bodyRequired: PropTypes.bool,
};

export function DocBodySection({ bodyTree, requestBody }) {
  if (!bodyTree.length) return null;

  const sections = requestBody?.sections ?? null;
  const labels = requestBody?.labels ?? null;
  const requiredLeafFields = getRequiredLeafPaths(bodyTree);

  return (
    <section className="mt-9">
      <h2
        id="request-body"
        className="mb-4 scroll-mt-20 text-base leading-tight font-semibold tracking-tight"
      >
        Request body
      </h2>
      <RequiredSummary
        requiredFields={requiredLeafFields}
        bodyRequired={requestBody?.required ?? false}
      />

      {sections?.length ? (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              bodyTree={bodyTree}
              labels={labels}
              isFirst={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="border border-gray-new-90 px-4 dark:border-gray-new-20">
          {bodyTree.map((node) => (
            <DocField
              key={node.key}
              node={node}
              path={node.key}
              labels={labels}
              defaultOpen={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}

DocBodySection.propTypes = {
  bodyTree: PropTypes.array.isRequired,
  requestBody: PropTypes.shape({
    required: PropTypes.bool,
    requiredFields: PropTypes.arrayOf(PropTypes.string),
    sections: PropTypes.array,
    labels: PropTypes.object,
  }),
};
