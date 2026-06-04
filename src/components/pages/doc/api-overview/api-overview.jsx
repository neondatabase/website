import PropTypes from 'prop-types';

import Breadcrumbs from 'components/pages/doc/breadcrumbs';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import { DOCS_BASE_PATH } from 'constants/docs';

const CURL_EXAMPLE = `curl "https://console.neon.tech/api/v2/projects" \\
  -H "Authorization: Bearer $NEON_API_KEY"`;

const FOOTER_LINKS = [
  { label: 'OpenAPI spec', href: 'https://neon.com/api_spec/release/v2.json' },
  { label: 'Getting started guide', href: `${DOCS_BASE_PATH}reference/api/getting-started` },
  {
    label: 'Rate limits & pagination',
    href: `${DOCS_BASE_PATH}reference/api/getting-started#pagination`,
  },
];

const ApiOverviewPage = ({ counts, resources, breadcrumbs, navigationLinks, currentSlug }) => {
  const { previousLink, nextLink } = navigationLinks;

  const interfaces = [
    {
      id: 'api',
      name: 'REST API',
      count: counts.rest,
      unit: 'endpoints',
      description: 'Full access to every Neon operation',
    },
    {
      id: 'cli',
      name: 'Neon CLI',
      count: counts.cli,
      unit: 'commands',
      description: 'Terminal-first workflow for dev and CI/CD',
    },
    {
      id: 'sdk',
      name: 'Management SDK',
      package: '@neondatabase/api-client',
      count: counts.sdk,
      unit: 'methods',
      description: 'Typed client generated from OpenAPI spec',
    },
    {
      id: 'mcp',
      name: 'MCP Server',
      count: counts.mcp,
      unit: 'tools',
      description: 'AI-native access via Claude, Cursor, Windsurf',
    },
  ];

  return (
    <div className="min-w-0 pb-32 lg:pb-24 md:pb-20">
      {breadcrumbs?.length > 0 && (
        <Breadcrumbs className="mb-7!" breadcrumbs={breadcrumbs} baseUrl={DOCS_BASE_PATH} />
      )}

      {/* Hero */}
      <h1 className="text-[36px] leading-tight font-medium tracking-tighter text-balance md:text-[28px]">
        API, CLI &amp; SDKs
      </h1>
      <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
        Everything you can do in the Neon Console, you can do programmatically. Choose your
        interface.
      </p>

      {/* Interface cards */}
      <h2 className="mt-10 mb-1 text-[17px] font-semibold tracking-tight text-black-pure dark:text-white">
        Management interfaces
      </h2>
      <p className="mb-4 text-[14px] text-gray-new-40 dark:text-gray-new-60">
        Four ways to manage Neon infrastructure — projects, branches, computes, roles. Pick the one
        that fits your workflow.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
        {interfaces.map(({ id, name, package: pkg, count, unit, description }) => (
          <a
            key={id}
            href={`${DOCS_BASE_PATH}reference/api/getting-started?iface=${id}`}
            className="group flex flex-col gap-2 rounded-xl border border-gray-new-90 bg-gray-new-98 p-5 transition-colors duration-150 hover:border-green-45/40 hover:bg-green-45/[0.03] dark:border-gray-new-20 dark:bg-gray-new-10 dark:hover:border-green-45/30 dark:hover:bg-green-45/[0.04]"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold tracking-tight text-black-pure transition-colors group-hover:text-green-45 dark:text-white dark:group-hover:text-green-45">
                  {name}
                </span>
                {pkg && (
                  <span className="font-mono text-[11px] text-gray-new-50 dark:text-gray-new-60">
                    {pkg}
                  </span>
                )}
              </div>
              <span className="shrink-0 font-mono text-[13px] text-green-45">
                {count} {unit}
              </span>
            </div>
            <p className="text-[13px] leading-snug text-gray-new-40 dark:text-gray-new-60">
              {description}
            </p>
          </a>
        ))}
      </div>

      {/* Application SDKs callout */}
      <div className="mt-4 rounded-r-xl border-l-2 border-[#426CE0] bg-[#426CE0]/[0.04] px-5 py-4 dark:bg-[#426CE0]/[0.06]">
        <p className="text-[14px] font-semibold text-black-pure dark:text-white">
          Building an app? Different SDKs.
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-gray-new-40 dark:text-gray-new-60">
          For auth and data queries, use the application SDKs:{' '}
          <a
            href={`${DOCS_BASE_PATH}reference/javascript-sdk`}
            className="font-mono text-[12px] text-green-45 hover:underline"
          >
            @neondatabase/neon-js
          </a>{' '}
          (Auth + Data API),{' '}
          <a
            href={`${DOCS_BASE_PATH}serverless/serverless-driver`}
            className="font-mono text-[12px] text-green-45 hover:underline"
          >
            @neondatabase/serverless
          </a>{' '}
          (raw SQL).{' '}
          <a href={`${DOCS_BASE_PATH}data-api/overview`} className="text-green-45 hover:underline">
            Data API docs →
          </a>
          {'  '}
          <a href={`${DOCS_BASE_PATH}auth/overview`} className="text-green-45 hover:underline">
            Neon Auth docs →
          </a>
        </p>
      </div>

      {/* Quick start */}
      <h2 className="mt-12 mb-4 text-xl font-medium tracking-tight text-black-pure dark:text-white">
        Quick start
      </h2>
      <div className="overflow-hidden border border-gray-new-90 dark:border-gray-new-20">
        <div className="border-b border-gray-new-90 bg-gray-new-98 px-4 py-2.5 dark:border-gray-new-20 dark:bg-gray-new-10">
          <span className="text-[12px] text-gray-new-50 dark:text-gray-new-60">
            List your projects
          </span>
        </div>
        <pre className="overflow-x-auto bg-gray-new-98 p-5 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-gray-new-30 dark:bg-gray-new-10 dark:text-gray-new-70">
          {CURL_EXAMPLE}
        </pre>
      </div>

      {/* Resources */}
      <h2 className="mt-12 mb-4 text-xl font-medium tracking-tight text-black-pure dark:text-white">
        Resources
      </h2>
      <div className="grid grid-cols-3 gap-x-4 gap-y-4 md:grid-cols-2 sm:grid-cols-1">
        {resources.map(({ tag, display, count, description, href }) => (
          <a
            key={tag}
            href={href}
            className="group flex flex-col gap-1 rounded-xl border border-gray-new-90 p-4 transition-colors duration-150 hover:border-green-45/40 hover:bg-green-45/[0.03] dark:border-gray-new-20 dark:hover:border-green-45/30 dark:hover:bg-green-45/[0.04]"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold text-black-pure transition-colors group-hover:text-green-45 dark:text-white dark:group-hover:text-green-45">
                {display}
              </span>
              <span className="font-mono text-[12px] text-gray-new-50 dark:text-gray-new-60">
                {count}
              </span>
            </div>
            <p className="text-[13px] leading-snug text-gray-new-40 dark:text-gray-new-60">
              {description}
            </p>
          </a>
        ))}
      </div>

      {/* Footer quick links */}
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-gray-new-90 pt-6 dark:border-gray-new-20">
        {FOOTER_LINKS.map(({ label, href }) => (
          <a key={label} href={href} className="text-[13px] text-green-45 hover:underline">
            {label} →
          </a>
        ))}
      </div>

      <DocFooter slug={currentSlug} gitHubPath={`content/docs/reference/api.md`} />

      <NavigationLinks
        className="mt-6"
        previousLink={previousLink}
        nextLink={nextLink}
        basePath={DOCS_BASE_PATH}
      />
    </div>
  );
};

ApiOverviewPage.propTypes = {
  counts: PropTypes.shape({
    rest: PropTypes.number.isRequired,
    cli: PropTypes.number.isRequired,
    sdk: PropTypes.number.isRequired,
    mcp: PropTypes.number.isRequired,
  }).isRequired,
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string.isRequired,
      display: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})),
  navigationLinks: PropTypes.shape({
    previousLink: PropTypes.shape({}),
    nextLink: PropTypes.shape({}),
  }).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

export default ApiOverviewPage;
