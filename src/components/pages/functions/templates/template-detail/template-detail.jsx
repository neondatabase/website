import PropTypes from 'prop-types';

import FunctionRegistryTemplateLogo from 'components/pages/functions/templates/registry/template-logo';
import {
  EnvironmentTable,
  OperationList,
} from 'components/pages/functions/templates/template-blocks';
import { renderReadme } from 'components/pages/functions/templates/template-readme';
import WeeklyInstalls from 'components/pages/functions/templates/weekly-installs';
import {
  totalWeeklyInstalls,
  weeklyInstallRowsPropType,
} from 'components/pages/functions/templates/weekly-installs/summary';
import Tooltip from 'components/shared/tooltip';
import LINKS from 'constants/links';
import ArrowLeftIcon from 'icons/arrow-left-thin.inline.svg';
import BookIcon from 'icons/docs/sidebar/book.inline.svg';
import GitHubIcon from 'icons/docs/sidebar/github.inline.svg';
import InfoIcon from 'icons/docs/sidebar/info.inline.svg';
import {
  hasRegistryEnvironmentRequirements,
  isInlineCodeSafe,
  registryCategoryLabel,
  registryProviderLabel,
  registryTemplateCategories,
  registryTemplateSource,
  registryTemplateSourceUrl,
} from 'utils/function-registry';
import getRelatedFunctionTemplates from 'utils/get-related-function-templates';

import OpenSource from '../open-source';
import FunctionRegistrySourceLabel from '../registry/source-label';
import { templateCardType } from '../registry/template-card';
import TemplateCopy from '../registry/template-copy';
import getTemplatePrompt from '../registry/template-prompt';
import FunctionRegistryWebsiteLink from '../registry/website-link';

import CodeSnippet from './code-snippet';
import RelatedTemplates from './related-templates';
import TemplateOperations from './template-operations';

const SELECTED_INDEX = `${LINKS.functionsTemplates}#library`;
const CONTRIBUTE_ID = 'contribute';
const frame =
  'mx-auto w-[calc(100%-6rem)] max-w-[72rem] max-[1201px]:w-[calc(100%-4rem)] max-[601px]:w-[calc(100%-2.5rem)]';
const resourceLink =
  'flex min-h-7 items-center gap-3 text-sm leading-normal text-gray-new-60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-1 max-[901px]:min-h-11 max-[601px]:text-[.8125rem] [&_svg]:size-[1.125rem] [&_svg]:shrink-0';

const TemplateDetail = async ({ template, templates, readme = null, installs = [] }) => {
  const installCommand = `neon functions new ${template.id}`;
  const cliTooltipId = `registry-cli-${template.id}`;
  const operations = template.operations ?? [];
  const environment = (template.environment ?? []).filter((item) => isInlineCodeSafe(item.name));
  const categories = registryTemplateCategories(template);
  const source = registryTemplateSource(template);
  const sourceUrl = registryTemplateSourceUrl(template);
  const related = getRelatedFunctionTemplates(template, templates);
  const renderedReadme =
    readme &&
    (await renderReadme({
      ...readme,
      blocks: {
        environment: environment.length > 0 && <EnvironmentTable variables={environment} />,
        operations: operations.length > 0 && (
          <OperationList operations={operations} installCommand={installCommand} />
        ),
      },
    }));
  const readmeHas = (block) => Boolean(renderedReadme?.used.has(block));

  return (
    <div className="bg-black-pure font-sans text-pretty text-white [--section-spacing:6rem] max-[901px]:[--section-spacing:5rem] max-[601px]:[--section-spacing:4rem]">
      <div
        className={`${frame} grid grid-cols-[minmax(0,46rem)_minmax(0,22rem)] items-start gap-x-16 pt-[9.125rem] pb-[var(--section-spacing)] max-[1201px]:grid-cols-[minmax(0,1fr)_18rem] max-[1201px]:gap-x-12 max-[901px]:grid-cols-1 max-[901px]:gap-y-8 max-[901px]:pt-[7.5rem] max-[601px]:gap-y-7 max-[601px]:pt-[6.25rem]`}
      >
        <header className="col-start-1 row-start-1 min-w-0">
          <a
            className="inline-flex items-center gap-2.5 text-[.8125rem] leading-normal text-gray-new-60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-1 max-[601px]:text-xs [&_svg]:h-3 [&_svg]:w-[1.125rem] [&_svg]:shrink-0"
            href={SELECTED_INDEX}
          >
            <ArrowLeftIcon aria-hidden="true" /> All functions
          </a>
          <h1 className="mt-8 min-w-0 text-[3.5rem] leading-[1.1] font-normal tracking-[-.04em] max-[1201px]:text-[3rem] max-[901px]:max-w-[40rem] max-[601px]:mt-7 max-[601px]:text-[2.25rem]">
            {template.title}
          </h1>
          <p className="mt-5 max-w-[42rem] text-lg leading-[1.55] tracking-[-.02em] text-gray-new-80 max-[601px]:mt-4 max-[601px]:text-base max-[601px]:leading-[1.6]">
            {template.description}
          </p>
          <div className="mt-[1.125rem] flex items-center gap-2 text-xs leading-normal text-gray-new-50 max-[601px]:mt-3.5">
            <span className="inline-flex shrink-0" aria-hidden="true">
              <FunctionRegistryTemplateLogo template={template} eager variant="tile-sm" />
            </span>
            By{' '}
            <FunctionRegistryWebsiteLink template={template} className="text-xs">
              {registryProviderLabel(template) || 'Neon'}
            </FunctionRegistryWebsiteLink>
          </div>
        </header>
        <aside
          className="sticky top-28 col-start-2 row-span-2 row-start-1 mt-[4.25rem] min-w-0 max-[1201px]:mt-16 max-[901px]:static max-[901px]:col-start-1 max-[901px]:row-span-1 max-[901px]:row-start-2 max-[901px]:mt-0 max-[901px]:max-w-[38rem]"
          aria-label="Template actions and resources"
        >
          <ol
            className="mb-5 flex list-decimal flex-col gap-2.5 pl-[1.125rem] text-sm leading-normal text-gray-new-80 marker:text-gray-new-50"
            aria-label="Add this template to your app"
          >
            <li>Copy the prompt below.</li>
            <li>Paste the prompt into your coding agent.</li>
            <li>Review the changes and test your function.</li>
          </ol>
          <TemplateCopy
            value={getTemplatePrompt(template)}
            className="w-full rounded-full bg-white px-6 py-3 text-[.9375rem] font-medium tracking-[-0.02em] text-black-pure hover:bg-gray-new-90 max-[768px]:text-sm"
            label={`Copy agent prompt for ${template.title}`}
          >
            Copy prompt
          </TemplateCopy>
          <CodeSnippet
            className="mt-4 max-w-full"
            command={installCommand}
            trackingLabel={`Copy registry command - ${template.title}`}
          />
          <p className="mt-3 flex flex-wrap items-center gap-x-0.5 text-[.8125rem] leading-normal text-gray-new-50">
            <span>
              Requires{' '}
              <a
                className="underline decoration-white/40 decoration-dashed underline-offset-[3px] transition-colors duration-200 hover:text-white hover:decoration-white"
                href={LINKS.cliInstall}
              >
                Neon CLI
              </a>{' '}
              8.11.0 or later.
            </span>
            <button
              type="button"
              className="inline-flex size-5 cursor-help items-center justify-center text-gray-new-50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
              aria-label="What this CLI command does"
              data-tooltip-id={cliTooltipId}
            >
              <InfoIcon className="size-3.5" aria-hidden="true" />
            </button>
            <Tooltip
              id={cliTooltipId}
              place="top"
              className="is-[.react-tooltip]:bg-gray-new-15! z-20 w-sm! px-4! pt-3! pb-3.5! [&_code]:font-mono [&_code]:text-[.8125rem] [&_code]:text-white"
              openEvents={{ mouseenter: true, focus: true, click: true }}
              globalCloseEvents={{ escape: true, clickOutsideAnchor: true }}
            >
              This command copies the template into <code>functions/&lt;slug&gt;/</code> and
              declares the function in <code>neon.ts</code>.
            </Tooltip>
          </p>
          {categories.length > 0 && (
            <nav aria-label="Template categories" className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`${LINKS.functionsTemplates}?category=${encodeURIComponent(category)}#library`}
                  className="group border border-gray-new-20 px-2 py-1 font-mono text-xs leading-none tracking-tight text-gray-new-60 uppercase hover:border-gray-new-40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-1"
                >
                  {category === source ? (
                    <FunctionRegistrySourceLabel
                      className="group-hover:text-white"
                      template={template}
                    />
                  ) : (
                    registryCategoryLabel(category)
                  )}
                </a>
              ))}
            </nav>
          )}
          <div className="mt-6 flex flex-col gap-1 border-t border-gray-new-20 pt-5 max-[901px]:flex-row max-[901px]:flex-wrap max-[901px]:gap-x-5 max-[901px]:gap-y-2 max-[601px]:mt-5 max-[601px]:gap-x-4 max-[601px]:gap-y-1 max-[601px]:pt-4">
            {sourceUrl && (
              <a className={resourceLink} href={sourceUrl}>
                <GitHubIcon aria-hidden="true" />
                Source code
              </a>
            )}
            <a className={resourceLink} href={LINKS.functionsTemplatesDocs}>
              <BookIcon aria-hidden="true" />
              How to use templates
            </a>
          </div>
          {totalWeeklyInstalls(installs) > 0 && (
            <dl className="mt-5">
              <WeeklyInstalls rows={installs} />
            </dl>
          )}
        </aside>
        <article
          className="col-start-1 row-start-2 mt-8 min-w-0 max-[901px]:row-start-3 max-[901px]:mt-0"
          aria-label={`${template.title} setup and usage`}
        >
          {renderedReadme && (
            <section>
              <h2 className="text-2xl leading-[1.3] font-normal tracking-tighter">
                About this template
              </h2>
              <div className="mt-6">{renderedReadme.content}</div>
            </section>
          )}
          {operations.length > 0 && !readmeHas('operations') && (
            <TemplateOperations operations={operations} installCommand={installCommand} />
          )}
          {!renderedReadme && (
            <section className="mt-8">
              <h2 className="text-2xl leading-[1.3] font-normal tracking-tighter">
                {operations.length > 0 ? 'Run it' : 'What it does'}
              </h2>
              <p className="mt-4 text-base leading-normal tracking-extra-tight text-gray-new-80">
                {operations.length > 0
                  ? "Installing a template doesn't deploy it, so "
                  : "This template has a single handler and no named operations, so it's a starting point for your own code. To try it, "}
                run it locally with{' '}
                <a className="underline underline-offset-2" href="/docs/cli/dev">
                  neon dev
                </a>{' '}
                first, and deploy it to a branch with{' '}
                <a className="underline underline-offset-2" href="/docs/compute/functions/deploy">
                  neon deploy
                </a>{' '}
                once it works.
              </p>
            </section>
          )}
          {environment.length > 0 && !readmeHas('environment') && (
            <section className="mt-8">
              <h2 className="text-2xl leading-[1.3] font-normal tracking-tighter">
                Environment variables
              </h2>
              <p className="mt-4 text-base leading-normal tracking-extra-tight text-gray-new-80">
                The CLI declares these variables in <code>neon.ts</code> and adds them to{' '}
                <code>.env.example</code> without values, so you need to fill{' '}
                {hasRegistryEnvironmentRequirements(environment)
                  ? 'in the required ones'
                  : 'them in'}{' '}
                before you run the function.
              </p>
              <EnvironmentTable className="mt-6" variables={environment} />
            </section>
          )}
        </article>
      </div>
      <OpenSource
        id={CONTRIBUTE_ID}
        withHowTo={false}
        withLabel={false}
        source="Detail"
        containerClassName={frame}
      />
      {related.length > 0 && (
        <RelatedTemplates
          templates={related}
          allTemplatesHref={SELECTED_INDEX}
          frameClassName={frame}
        />
      )}
    </div>
  );
};

TemplateDetail.propTypes = {
  template: templateCardType.isRequired,
  templates: PropTypes.arrayOf(templateCardType).isRequired,
  installs: weeklyInstallRowsPropType,
  readme: PropTypes.shape({
    markdown: PropTypes.string.isRequired,
    imageBase: PropTypes.string.isRequired,
    linkBase: PropTypes.string.isRequired,
  }),
};

export default TemplateDetail;
