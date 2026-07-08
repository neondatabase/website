'use client';

import PropTypes from 'prop-types';
import { Fragment, useId, useState } from 'react';

import Chevron from 'icons/chevron.inline.svg';
import { INLINE_CODE_STYLES } from 'utils/api-style';
import { cn } from 'utils/cn';

import { fieldDefaultLabel, fieldTitle } from './field-label';
import { API_OPERATION_H2_WITH_MARGIN_CLASS_NAME } from './operation-shared';

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

function TypeBadge({ label, variant }) {
  if (!label) return null;
  return (
    <span
      className={cn(
        'rounded border border-gray-new-70 bg-gray-new-98 px-1 py-[3px] font-mono text-[14px] leading-[1.25] font-normal tracking-normal text-black-pure dark:border-gray-new-30 dark:bg-black-new dark:text-gray-new-90',
        variant === 'value' &&
          'border-gray-new-70 bg-gray-new-94 text-gray-new-50 dark:border-gray-new-30 dark:bg-gray-new-15 dark:text-gray-new-70'
      )}
    >
      {label}
    </span>
  );
}

TypeBadge.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.oneOf(['type', 'value']),
};

function MetadataBadges({ node, row, includeRowMetadata = true }) {
  return (
    <>
      {includeRowMetadata && row?.common && (
        <span className="rounded border border-green-52/40 bg-green-52/5 px-1 py-[3px] font-mono text-[14px] leading-[1.25] font-normal tracking-normal text-green-44 dark:bg-black-new dark:text-green-52">
          common
        </span>
      )}
      {includeRowMetadata && row?.outOfObject && (
        <span className="rounded border border-gray-new-70 bg-gray-new-98 px-1 py-[3px] text-[14px] leading-[1.25] font-normal tracking-normal text-gray-new-50 dark:border-gray-new-30 dark:bg-black-new dark:text-gray-new-60">
          top-level field
        </span>
      )}
      {node?.deprecated && (
        <span className="rounded border border-[#E2301D]/40 bg-transparent px-1 py-[3px] text-[14px] leading-[1.25] font-normal tracking-normal text-[#E2301D] dark:border-[#FF5645]/40 dark:text-[#FF5645]">
          deprecated
        </span>
      )}
      {includeRowMetadata && row?.schemaPath && (
        <span className="text-[16px] leading-[1.5] font-normal tracking-normal text-gray-new-50 dark:text-gray-new-80">
          {row.schemaPath}
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
    schemaPath: PropTypes.string,
  }),
  includeRowMetadata: PropTypes.bool,
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
              'rounded px-1 py-[3px] font-mono text-[14px] leading-[1.25] font-normal tracking-normal',
              isActive
                ? 'border border-green-52/40 bg-green-52/5 text-green-44 dark:bg-black-new dark:text-green-52'
                : 'border border-gray-new-70 bg-gray-new-98 text-gray-new-50 dark:border-gray-new-30 dark:bg-black-new dark:text-gray-new-60'
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
    <p className="mt-2.5 font-mono text-[15px] leading-[1.5] tracking-normal text-gray-new-50 dark:text-gray-new-70">
      {node.constraints}
    </p>
  );
}

ConstraintText.propTypes = {
  node: PropTypes.shape({ constraints: PropTypes.string }),
};

function Divider() {
  return <div className="h-px w-full shrink-0 bg-gray-new-90 dark:bg-gray-new-20" />;
}

function NestedDivider() {
  return (
    <div className="ml-14 h-px w-[calc(100%-3.5rem)] shrink-0 bg-gray-new-90 dark:bg-gray-new-20 md:ml-6 md:w-[calc(100%-1.5rem)]" />
  );
}

export function DocField({
  node,
  path,
  labels,
  row,
  depth = 0,
  defaultOpen = depth === 0,
  variant = 'bordered',
}) {
  const [open, setOpen] = useState(defaultOpen);
  const childrenId = useId();
  const hasChildren = node.children?.length > 0;
  const title = fieldTitle(path, node, labels);
  const defaultLabel = fieldDefaultLabel(path, node, labels);
  const isBare = variant === 'bare';
  const isNestedBare = isBare && depth > 0;
  const isExpandableBare = isBare && hasChildren;
  const columnWidth = isNestedBare ? 286 : isExpandableBare ? 304 : isBare ? 302 : 314;

  return (
    <div
      className={cn(
        'px-1',
        !isBare && 'border-b border-gray-new-90 py-4 last:border-b-0 dark:border-gray-new-20'
      )}
    >
      <div
        className={cn(
          'grid gap-y-3 md:block',
          isBare ? 'gap-x-5' : 'gap-x-2.5',
          isNestedBare
            ? 'pr-1 pl-14 md:pl-6'
            : isExpandableBare
              ? 'pr-1 pl-3.5 md:pl-0'
              : isBare && 'pr-1 pl-4 md:pl-0'
        )}
        style={{ gridTemplateColumns: `minmax(220px, ${columnWidth}px) minmax(0, 1fr)` }}
      >
        <div>
          {isExpandableBare ? (
            <>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  aria-label={`Toggle ${title} field`}
                  aria-expanded={open}
                  aria-controls={childrenId}
                  className="flex size-3.5 shrink-0 items-center justify-center text-gray-new-50 dark:text-white"
                >
                  <Chevron
                    className={cn(
                      'size-3.5 transition-transform [&_path]:fill-current',
                      open && 'rotate-90'
                    )}
                  />
                </button>
                <div className="flex min-w-0 flex-1 flex-wrap items-start gap-1.5">
                  <span className="text-[16px] leading-[1.5] font-medium tracking-normal text-black-pure dark:text-white">
                    {title}
                  </span>
                  <MetadataBadges node={node} row={row} includeRowMetadata={false} />
                </div>
              </div>
              <div className="mt-1.5 flex flex-col items-start gap-2.5 pl-6">
                <code className="block font-mono text-[15px] leading-[1.5] tracking-normal text-gray-new-50 dark:text-gray-new-70">
                  {node.key}
                </code>
                <div className="flex flex-wrap items-start gap-2">
                  <TypeBadge label={node.type} />
                  {defaultLabel && <TypeBadge label={`default: ${defaultLabel}`} variant="value" />}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-start gap-1.5">
                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-label={`Toggle ${title} field`}
                    aria-expanded={open}
                    aria-controls={childrenId}
                    className="mt-1 flex size-3.5 items-center justify-center text-gray-new-50 dark:text-white"
                  >
                    <Chevron
                      className={cn(
                        'size-3.5 transition-transform [&_path]:fill-current',
                        open && 'rotate-90'
                      )}
                    />
                  </button>
                )}
                <span className="text-[16px] leading-[1.5] font-medium tracking-normal text-black-pure dark:text-white">
                  {title}
                </span>
                <MetadataBadges node={node} row={row} includeRowMetadata={!isNestedBare} />
              </div>
              <code className="mt-1.5 block font-mono text-[15px] leading-[1.5] tracking-normal text-gray-new-50 dark:text-gray-new-70">
                {node.key}
              </code>
              <div className="mt-2.5 flex flex-wrap items-start gap-2">
                <TypeBadge label={node.type} />
                {defaultLabel && <TypeBadge label={`default: ${defaultLabel}`} variant="value" />}
              </div>
            </>
          )}
        </div>
        <div className={cn(isBare && 'md:mt-3')}>
          {descriptionHtml(node) ? (
            <div
              className={cn(
                'text-[16px] leading-[1.5] tracking-normal text-gray-new-30 dark:text-gray-new-85 [&_a]:underline [&_p+p]:mt-2',
                INLINE_CODE_STYLES
              )}
              dangerouslySetInnerHTML={{ __html: descriptionHtml(node) }}
            />
          ) : (
            <p className="text-[16px] leading-[1.5] tracking-normal text-gray-new-30 dark:text-gray-new-85">
              {descriptionText(node)}
            </p>
          )}
          <EnumPills node={node} />
          <ConstraintText node={node} />
        </div>
      </div>
      {hasChildren &&
        open &&
        (isBare ? (
          <div id={childrenId} className="relative mt-6 flex flex-col gap-4">
            <div className="pointer-events-none absolute top-0 bottom-0 left-[37px] w-px bg-gray-new-90 dark:bg-gray-new-20 md:left-3" />
            {node.children.map((child, index) => {
              const childPath = `${path}.${child.key}`;
              return (
                <Fragment key={childPath}>
                  <DocField
                    node={child}
                    path={childPath}
                    labels={labels}
                    row={row}
                    depth={depth + 1}
                    defaultOpen={false}
                    variant={variant}
                  />
                  {index < node.children.length - 1 && <NestedDivider />}
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div
            id={childrenId}
            className="mt-4 border-l border-gray-new-90 pl-4 dark:border-gray-new-20"
          >
            <div className="flex flex-col gap-4">
              {node.children.map((child, index) => {
                const childPath = `${path}.${child.key}`;
                return (
                  <Fragment key={childPath}>
                    <DocField
                      node={child}
                      path={childPath}
                      labels={labels}
                      row={row}
                      depth={depth + 1}
                      defaultOpen={false}
                      variant={variant}
                    />
                    {index < node.children.length - 1 && <Divider />}
                  </Fragment>
                );
              })}
            </div>
          </div>
        ))}
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
    schemaPath: PropTypes.string,
  }),
  depth: PropTypes.number,
  defaultOpen: PropTypes.bool,
  variant: PropTypes.oneOf(['bordered', 'bare']),
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
    <section className="mb-[-1px] flex flex-col overflow-hidden border border-gray-new-90 bg-white p-4 dark:border-gray-new-20 dark:bg-black-pure">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={`Toggle ${section.label} section`}
          aria-expanded={open}
          aria-controls={fieldsId}
          className="flex size-3.5 shrink-0 items-center justify-center text-gray-new-50 dark:text-white"
        >
          <Chevron
            className={cn(
              'size-3.5 transition-transform [&_path]:fill-current',
              open && 'rotate-90'
            )}
          />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex min-w-0 flex-wrap items-start gap-1.5">
              <h3
                id={`body-${section.id}`}
                className="scroll-mt-20 text-[16px] leading-[1.5] font-medium tracking-normal text-black-pure dark:text-white"
              >
                {section.label}
              </h3>
              {section.common && (
                <span className="rounded border border-green-52/40 bg-green-52/5 px-1 py-[3px] font-mono text-[14px] leading-[1.25] font-normal tracking-normal text-green-44 dark:bg-black-new dark:text-green-52">
                  commonly set
                </span>
              )}
              {section.schemaPath && (
                <span className="text-[16px] leading-[1.5] font-normal tracking-normal text-gray-new-50 dark:text-gray-new-80">
                  {section.schemaPath}
                </span>
              )}
            </div>
            <span className="shrink-0 text-[14px] leading-[1.5] font-normal tracking-normal text-gray-new-50 dark:text-gray-new-60">
              {rows.length} {rows.length === 1 ? 'field' : 'fields'}
            </span>
          </div>
          {section.blurb && (
            <p className="text-[15px] leading-[1.5] font-normal tracking-normal text-gray-new-50 dark:text-gray-new-70">
              {section.blurb}
            </p>
          )}
        </div>
      </div>
      {open && (
        <div id={fieldsId} className="mt-4 flex flex-col gap-4">
          <Divider />
          {rows.map(({ path, node, common, outOfObject }, index) => (
            <Fragment key={path}>
              <DocField
                node={node}
                path={path}
                labels={labels}
                row={{ common, outOfObject, schemaPath: section.schemaPath }}
                variant="bare"
              />
              {index < rows.length - 1 && <Divider />}
            </Fragment>
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
        {count === 0 ? (
          <>
            No field is required.
            {!bodyRequired ? ' Send an empty body to use sensible defaults.' : ''}
          </>
        ) : (
          <>
            <strong className="font-semibold text-black-pure dark:text-white">
              {count} required
            </strong>{' '}
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
  const hasSections = sections?.length > 0;

  return (
    <section className="mt-9">
      <h2 id="request-body" className={API_OPERATION_H2_WITH_MARGIN_CLASS_NAME}>
        Request body
      </h2>
      {!hasSections && (
        <RequiredSummary
          requiredFields={requiredLeafFields}
          bodyRequired={requestBody?.required ?? false}
        />
      )}

      {hasSections ? (
        <div className="py-2">
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
        <div className="flex flex-col gap-4 border border-gray-new-90 bg-white p-4 dark:border-gray-new-20 dark:bg-black-pure">
          {bodyTree.map((node, index) => (
            <Fragment key={node.key}>
              <DocField
                node={node}
                path={node.key}
                labels={labels}
                defaultOpen={false}
                variant="bare"
              />
              {index < bodyTree.length - 1 && <Divider />}
            </Fragment>
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
