import PropTypes from 'prop-types';

import ApiAiContextLink from 'components/pages/doc/api-ai-context-link';
import ApiEndpointsTable from 'components/pages/doc/api-endpoints-table/api-endpoints-table';
import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import DropdownMenu from 'components/pages/doc/dropdown-menu';
import Tag from 'components/pages/doc/tag';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import Link from 'components/shared/link';
import NavigationLinks from 'components/shared/navigation-links';
import { DOCS_BASE_PATH } from 'constants/docs';
import { cn } from 'utils/cn';

import tagConfig from '../../../../../scripts/data/tag-config.json';

// Lookup: tag slug → { groups } (the shape buildGroupedOps expects).
// Pre-Phase-3a this came from a separate tag-groups.json file; consolidated.
const tagGroupsBySlug = Object.fromEntries(
  tagConfig.tags.filter((t) => t.groups).map((t) => [t.slug, { groups: t.groups }])
);

function buildGroupedOps(operations, tagConfig) {
  if (!tagConfig?.groups) return null;

  const opsBySlug = new Map(operations.map((op) => [op.id, op]));
  const assigned = new Set();

  const groups = tagConfig.groups
    .map((group) => {
      const ops = group.slugs.map((slug) => opsBySlug.get(slug)).filter(Boolean);
      ops.forEach((op) => assigned.add(op.id));
      return { label: group.label, ops };
    })
    .filter((g) => g.ops.length > 0);

  const other = operations.filter((op) => !assigned.has(op.id));
  if (other.length > 0) {
    groups.push({ label: 'Other', ops: other });
  }

  return groups;
}

const ApiTagPage = async ({
  tagDisplay,
  operations,
  intro,
  breadcrumbs,
  navigationLinks,
  currentSlug,
}) => {
  const { previousLink, nextLink } = navigationLinks;
  const gitHubPath = `content/docs/${currentSlug}.md`;
  const tag = operations[0]?.tag;
  const groups = buildGroupedOps(operations, tag ? tagGroupsBySlug[tag] : null);

  return (
    <div className="max-w-208 min-w-0 pb-32 lg:max-w-none lg:pb-24 md:pb-20">
      {breadcrumbs?.length > 0 && (
        <Breadcrumbs className="mb-7!" breadcrumbs={breadcrumbs} baseUrl={DOCS_BASE_PATH} />
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[36px] leading-tight font-medium tracking-tighter text-balance md:text-[28px]">
            {tagDisplay}
          </h1>
          <p className="mt-1 font-mono text-sm text-gray-new-50 dark:text-gray-new-60">
            {operations.length} endpoint{operations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <DropdownMenu className="shrink-0" gitHubPath={gitHubPath} />
      </div>

      <p className="mt-3 text-[13px] text-gray-new-50 dark:text-gray-new-60">
        <ApiAiContextLink
          to={`/docs/${currentSlug}.md`}
          tooltipId={`api-ai-context-${tag}`}
          tooltipLabel={tagDisplay}
          tooltipDescription={`all ${operations.length} endpoints with parameters and examples.`}
        />
      </p>

      {intro && (
        <div className="mt-6">
          <Content content={intro} withoutAnchorHeading />
        </div>
      )}

      {groups ? (
        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-1">
          {groups.map((group) => (
            <div
              key={group.label}
              className="border border-gray-new-90 bg-gray-new-98 p-4 dark:border-gray-new-20 dark:bg-gray-new-10"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black-pure dark:text-white">
                  {group.label}
                </h3>
                <span className="font-mono text-xs text-gray-new-50 dark:text-gray-new-60">
                  {group.ops.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {group.ops.map((op) => (
                  <Link
                    key={op.id}
                    href={`${DOCS_BASE_PATH}reference/api/${op.tag}/${op.id}`}
                    className={cn(
                      'inline-flex w-fit items-center gap-2 text-sm leading-tight text-balance transition-colors duration-200 hover:text-black-pure dark:hover:text-white',
                      op.deprecated
                        ? 'text-gray-new-60 dark:text-gray-new-50'
                        : 'text-gray-new-40 dark:text-gray-new-60'
                    )}
                  >
                    <span className="text-balance">
                      {op.summary}
                      {op.deprecated && (
                        <Tag
                          className="ml-2 inline-flex text-[0.6875rem] font-normal -tracking-tight tabular-nums"
                          label="deprecated"
                          size="sm"
                          theme="orange"
                        />
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-7 border border-gray-new-90 bg-gray-new-98 p-4 dark:border-gray-new-20 dark:bg-gray-new-10">
          <div className="flex flex-col gap-2">
            {operations.map((op) => (
              <Link
                key={op.id}
                href={`${DOCS_BASE_PATH}reference/api/${op.tag}/${op.id}`}
                className={cn(
                  'inline-flex w-fit items-center gap-2 text-sm leading-tight transition-colors duration-200 hover:text-black-pure dark:hover:text-white',
                  op.deprecated
                    ? 'text-gray-new-60 dark:text-gray-new-50'
                    : 'text-gray-new-40 dark:text-gray-new-60'
                )}
              >
                <span className="text-balance">
                  {op.summary}
                  {op.deprecated && (
                    <Tag
                      className="ml-2 inline-flex text-[0.6875rem] font-normal -tracking-tight tabular-nums"
                      label="deprecated"
                      size="sm"
                      theme="orange"
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ApiEndpointsTable operations={operations} tagDisplay={tagDisplay} />

      <DocFooter slug={currentSlug} gitHubPath={null} />

      <NavigationLinks
        className="mt-6"
        previousLink={previousLink}
        nextLink={nextLink}
        basePath={DOCS_BASE_PATH}
      />
    </div>
  );
};

ApiTagPage.propTypes = {
  tagDisplay: PropTypes.string.isRequired,
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      tag: PropTypes.string,
      summary: PropTypes.string,
      deprecated: PropTypes.bool,
    })
  ).isRequired,
  intro: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})),
  navigationLinks: PropTypes.shape({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

export default ApiTagPage;
