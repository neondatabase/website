import PropTypes from 'prop-types';

import ApiMethodBadge from 'components/pages/doc/api-method-badge';
import Aside from 'components/pages/doc/aside';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import DropdownMenu from 'components/pages/doc/dropdown-menu';
import Tag from 'components/pages/doc/tag';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import { DOCS_BASE_PATH } from 'constants/docs';
import { INLINE_CODE_STYLES } from 'utils/api-style';
import { cn } from 'utils/cn';

import OperationDoc from './operation-doc';
import { buildOperationToc } from './operation-toc';

// ── Schema → annotated tree ──────────────────────────────────────────────────

function constraintsStr(schema) {
  const parts = [];
  if (schema.minimum !== undefined) parts.push(`min: ${schema.minimum}`);
  if (schema.maximum !== undefined) parts.push(`max: ${schema.maximum}`);
  if (schema.minLength !== undefined) parts.push(`≥${schema.minLength} chars`);
  if (schema.maxLength !== undefined) parts.push(`≤${schema.maxLength} chars`);
  return parts.join(', ') || undefined;
}

function annotationStr(schema) {
  const desc = schema.description;
  if (!desc) return undefined;
  const first = desc.split('\n').find((l) => l.trim()) ?? '';
  // Strip markdown links for display
  const clean = first.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`/g, '');
  return clean.length > 70 ? clean.slice(0, 67) + '…' : clean;
}

function sortedEntries(properties, displayOrder) {
  const entries = Object.entries(properties);
  if (!displayOrder?.length) return entries;
  const orderMap = new Map(displayOrder.map((k, i) => [k, i]));
  return entries.sort(([a], [b]) => {
    const ai = orderMap.has(a) ? orderMap.get(a) : Infinity;
    const bi = orderMap.has(b) ? orderMap.get(b) : Infinity;
    return ai - bi;
  });
}

function schemaToTree(key, schema, required = false) {
  const node = {
    key,
    type: schema.type,
    required,
    deprecated: !!schema.deprecated,
  };

  const ann = annotationStr(schema);
  if (ann) node.annotation = ann;

  const details = schema.details;
  const descText = details?.description ?? schema.description ?? null;
  const descHtml = details?.descriptionHtml ?? null;
  const exampleText =
    details?.example ??
    (schema.example !== undefined
      ? typeof schema.example === 'object' && schema.example !== null
        ? JSON.stringify(schema.example, null, 2)
        : String(schema.example)
      : null);
  const values = details?.values ?? (schema.enum ? schema.enum.map(String) : null);
  if (descText !== null || exampleText !== null || values !== null) {
    node.details = {
      description: descText,
      descriptionHtml: descHtml,
      example: exampleText,
      values,
    };
  }

  const c = constraintsStr(schema);
  if (c) node.constraints = c;
  if (schema.minimum !== undefined) node.min = schema.minimum;
  if (schema.maximum !== undefined) node.max = schema.maximum;
  if (schema.minLength !== undefined) node.minLength = schema.minLength;
  if (schema.maxLength !== undefined) node.maxLength = schema.maxLength;
  if (schema.format) node.format = schema.format;

  if (schema.enum) {
    node.enum = schema.enum;
  } else if (
    schema.type === 'integer' &&
    schema.minimum !== undefined &&
    schema.maximum !== undefined &&
    schema.maximum - schema.minimum <= 20
  ) {
    node.enum = Array.from(
      { length: schema.maximum - schema.minimum + 1 },
      (_, i) => schema.minimum + i
    );
  }
  if (schema.default !== undefined) node.value = String(schema.default);

  // additionalProperties-only objects (free-form maps): show example as value hint
  if (schema.type === 'object' && schema.additionalProperties && !schema.properties) {
    const ex = schema.example;
    node.placeholder = ex !== undefined ? JSON.stringify(ex) : `{"key": "value"}`;
  }

  if (schema.type === 'object' && schema.properties) {
    const reqSet = new Set(schema.required ?? []);
    const entries = sortedEntries(schema.properties, schema.displayOrder);
    node.children = entries.map(([k, v]) => schemaToTree(k, v, reqSet.has(k)));
  }

  if (schema.type === 'array' && schema.items?.type === 'object' && schema.items.properties) {
    const reqSet = new Set(schema.items.required ?? []);
    const entries = sortedEntries(schema.items.properties, schema.items.displayOrder);
    node.children = entries.map(([k, v]) => schemaToTree(k, v, reqSet.has(k)));
  }

  return node;
}

function buildTree(properties, requiredFields, displayOrder) {
  if (!properties) return [];
  const reqSet = new Set(requiredFields ?? []);
  return sortedEntries(properties, displayOrder).map(([k, v]) => schemaToTree(k, v, reqSet.has(k)));
}

// ── Component ────────────────────────────────────────────────────────────────

const ApiOperation = ({ operation, breadcrumbs, navigationLinks, currentSlug }) => {
  const { previousLink, nextLink } = navigationLinks;
  const gitHubPath = `content/docs/${currentSlug}.md`;

  const bodyTree = buildTree(
    operation.requestBody?.properties,
    operation.requestBody?.requiredFields,
    operation.requestBody?.displayOrder
  );
  const respTree = buildTree(
    operation.response?.properties,
    operation.response?.requiredFields,
    operation.response?.displayOrder
  );
  const tableOfContents = buildOperationToc(operation, { hasRequestBody: bodyTree.length > 0 });

  return (
    <>
      <div className="max-w-208 min-w-0 flex-1 pb-32 lg:max-w-none lg:pb-24 md:pb-20">
        {breadcrumbs?.length > 0 && (
          <Breadcrumbs className="mb-7!" breadcrumbs={breadcrumbs} baseUrl={DOCS_BASE_PATH} />
        )}

        <article>
          <div className="flex flex-wrap items-center gap-2">
            <ApiMethodBadge method={operation.method} />
            <code className="font-mono text-sm font-medium text-gray-new-20 dark:text-gray-new-80">
              {operation.path}
            </code>
            {operation.stability && <Tag label={operation.stability} size="sm" className="ml-1" />}
            {operation.deprecated && <Tag label="deprecated" size="sm" className="ml-1" />}
          </div>

          {operation.deprecated && (
            <p className="mt-2 text-sm text-gray-new-50 dark:text-gray-new-60">
              This endpoint is deprecated
              {operation.sunset ? `. Scheduled for removal on ${operation.sunset}.` : '.'}
            </p>
          )}

          <div className="mt-4 flex items-start justify-between gap-4">
            <h1 className="text-[36px] leading-tight font-medium tracking-tighter text-balance md:text-[28px]">
              {operation.summary}
            </h1>
            <DropdownMenu className="shrink-0" gitHubPath={gitHubPath} />
          </div>

          {operation.descriptionHtml && (
            <div
              className={cn(
                'mt-3 text-[15px] leading-relaxed text-gray-new-30 dark:text-gray-new-70 [&_p+p]:mt-3',
                INLINE_CODE_STYLES
              )}
              dangerouslySetInnerHTML={{ __html: operation.descriptionHtml }}
            />
          )}

          <p className="mt-3 text-sm text-gray-new-50 dark:text-gray-new-60">
            <strong>Auth:</strong> Bearer token required
          </p>

          <OperationDoc operation={operation} bodyTree={bodyTree} respTree={respTree} />
        </article>

        <DocFooter slug={currentSlug} gitHubPath={null} />

        <NavigationLinks
          className="mt-6"
          previousLink={previousLink}
          nextLink={nextLink}
          basePath={DOCS_BASE_PATH}
        />
      </div>
      <Aside
        className="ml-0! w-78 shrink-0 xl:hidden"
        enableTableOfContents
        tableOfContents={tableOfContents}
        gitHubPath={gitHubPath}
      />
    </>
  );
};

ApiOperation.propTypes = {
  operation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    operationId: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    description: PropTypes.string,
    descriptionHtml: PropTypes.string,
    stability: PropTypes.string,
    deprecated: PropTypes.bool,
    sunset: PropTypes.string,
    parameters: PropTypes.arrayOf(PropTypes.shape({})),
    requestBody: PropTypes.shape({
      required: PropTypes.bool,
      properties: PropTypes.objectOf(PropTypes.shape({})),
      requiredFields: PropTypes.arrayOf(PropTypes.string),
      displayOrder: PropTypes.arrayOf(PropTypes.string),
      sections: PropTypes.array,
      seed: PropTypes.object,
      labels: PropTypes.object,
    }),
    response: PropTypes.shape({
      status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
      descriptionHtml: PropTypes.string,
      example: PropTypes.any,
      properties: PropTypes.objectOf(PropTypes.shape({})),
      requiredFields: PropTypes.arrayOf(PropTypes.string),
      displayOrder: PropTypes.arrayOf(PropTypes.string),
    }),
    errors: PropTypes.arrayOf(PropTypes.shape({})),
    examples: PropTypes.shape({
      curl: PropTypes.string,
      typescript: PropTypes.string,
      bodyExample: PropTypes.any,
      representative: PropTypes.shape({
        curl: PropTypes.string,
        typescript: PropTypes.string,
        body: PropTypes.any,
      }),
    }),
    cli: PropTypes.oneOfType([
      PropTypes.shape({
        command: PropTypes.string,
        flags: PropTypes.array,
        positionals: PropTypes.array,
        tableOutput: PropTypes.string,
      }),
      PropTypes.shape({
        commands: PropTypes.arrayOf(
          PropTypes.shape({
            command: PropTypes.string,
            covers: PropTypes.arrayOf(PropTypes.string),
            flags: PropTypes.array,
            positionals: PropTypes.array,
          })
        ),
        uncovered: PropTypes.arrayOf(PropTypes.string),
        tableOutput: PropTypes.string,
      }),
    ]),
    mcp: PropTypes.shape({
      tool: PropTypes.string,
      description: PropTypes.string,
      arguments: PropTypes.array,
    }),
    console: PropTypes.shape({ breadcrumb: PropTypes.string }),
  }).isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})),
  navigationLinks: PropTypes.shape({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

export default ApiOperation;
