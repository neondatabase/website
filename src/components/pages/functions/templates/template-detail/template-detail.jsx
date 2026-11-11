import PropTypes from 'prop-types';

import FunctionRegistrySourceLabel from 'components/pages/functions/templates/registry/source-label';
import FunctionRegistryTemplateLogo from 'components/pages/functions/templates/registry/template-logo';
import FunctionRegistryWebsiteLink from 'components/pages/functions/templates/registry/website-link';
import {
  EnvironmentTable,
  OperationList,
} from 'components/pages/functions/templates/template-blocks';
import TemplateDownloads from 'components/pages/functions/templates/template-downloads';
import { renderReadme } from 'components/pages/functions/templates/template-readme';
import Container from 'components/shared/container';
import CopyCommand from 'components/shared/copy-command';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import ArrowBackIcon from 'icons/arrow-back.inline.svg';
import { cn } from 'utils/cn';
import {
  hasRegistryEnvironmentRequirements,
  isInlineCodeSafe,
  registryCategoryLabel,
  registryProviderLabel,
  registryTemplateCategories,
  registryTemplatePageHref,
  registryTemplateSourceUrl,
} from 'utils/function-registry';
const Section = ({ title, description, children = null }) => (
  <section className="mt-14 md:mt-10">
    <h2 className="text-[28px] leading-tight tracking-tighter md:text-2xl">{title}</h2>
    <p className="mt-4 text-base leading-normal tracking-extra-tight text-gray-new-80">
      {description}
    </p>
    {children}
  </section>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  children: PropTypes.node,
};

const Code = ({ children }) => <code className="font-mono text-[0.9375rem]">{children}</code>;

Code.propTypes = {
  children: PropTypes.node.isRequired,
};

// Links inside running text need more than color to stand out (WCAG 1.4.1).
const TEXT_LINK_CLASS_NAME = 'underline underline-offset-2';

const RUN_LOCALLY = (
  <>
    run it locally with{' '}
    <Link className={TEXT_LINK_CLASS_NAME} to="/docs/cli/dev" theme="green">
      neon dev
    </Link>{' '}
    first, and deploy it to a branch with{' '}
    <Link className={TEXT_LINK_CLASS_NAME} to="/docs/compute/functions/deploy" theme="green">
      neon deploy
    </Link>{' '}
    once it works.
  </>
);

const PagerLink = ({ label, title, href, direction }) => {
  const isNext = direction === 'next';

  return (
    <Link
      className={cn(
        'group flex min-w-0 items-center gap-6 border border-gray-new-20 py-4 transition-colors duration-200 hover:border-gray-new-40',
        isNext
          ? 'col-start-1 justify-between pr-4 pl-5'
          : 'col-start-2 flex-row-reverse justify-between pr-5 pl-4 sm:col-start-1'
      )}
      to={href}
    >
      <span className={cn('flex min-w-0 flex-col', !isNext && 'items-end text-right')}>
        <span className="text-xs leading-normal text-gray-new-50">{label}</span>
        <span className="w-full truncate text-base leading-normal text-white">{title}</span>
      </span>
      <ArrowBackIcon
        className={cn('shrink-0 text-gray-new-60', isNext && 'rotate-180')}
        aria-hidden
      />
    </Link>
  );
};

PagerLink.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['previous', 'next']).isRequired,
};

const TemplatePager = ({ previous, next }) => (
  <nav
    className="mt-14 grid grid-cols-2 gap-6 border-t border-gray-new-20 pt-8 md:mt-10 sm:grid-cols-1 sm:gap-4"
    aria-label="Other templates"
  >
    {next && (
      <PagerLink
        label="Next"
        title={next.title}
        href={registryTemplatePageHref(next.id)}
        direction="next"
      />
    )}
    <PagerLink
      label="Previous"
      title={previous ? previous.title : 'All templates'}
      href={previous ? registryTemplatePageHref(previous.id) : LINKS.functionsTemplates}
      direction="previous"
    />
  </nav>
);

TemplatePager.propTypes = {
  previous: PropTypes.shape({ id: PropTypes.string, title: PropTypes.string }),
  next: PropTypes.shape({ id: PropTypes.string, title: PropTypes.string }),
};

const DETAIL_LABEL_CLASS_NAME =
  'font-mono text-xs leading-none font-medium tracking-tight text-gray-new-50 uppercase';

const DetailRow = ({ label, children }) => (
  <div className="flex flex-col gap-2.5 border-t border-gray-new-20 py-4 last:pb-0">
    <dt className={DETAIL_LABEL_CLASS_NAME}>{label}</dt>
    <dd className="text-[15px] leading-snug tracking-extra-tight text-white">{children}</dd>
  </div>
);

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const TemplateSidebar = ({ template, installCommand }) => {
  const provider = registryProviderLabel(template) || 'Neon';
  const categories = registryTemplateCategories(template);
  const sourceUrl = registryTemplateSourceUrl(template);

  return (
    <div className="sticky top-24 flex flex-col gap-6 lg:static">
      <div className="border border-gray-new-20 bg-[#080808] p-5">
        <p className={DETAIL_LABEL_CLASS_NAME}>Use this template</p>
        <CopyCommand
          className="mt-4 [&>span:nth-of-type(2)]:[overflow-wrap:anywhere] [&>span:nth-of-type(2)]:whitespace-normal"
          command={installCommand}
          trackingLabel={`Copy ${installCommand}`}
        />
      </div>

      <dl>
        <TemplateDownloads id={template.id} />
        <DetailRow label="Built by">
          <span className="flex items-center gap-3">
            <FunctionRegistryTemplateLogo template={template} eager variant="title" />
            <span className="min-w-0 truncate">
              <FunctionRegistryWebsiteLink template={template}>
                {provider}
              </FunctionRegistryWebsiteLink>
            </span>
          </span>
        </DetailRow>
        {categories.length > 0 && (
          <DetailRow label="Categories">
            <ul className="flex flex-wrap gap-2">
              {categories.map((id) => (
                <li key={id}>
                  <Link
                    className="block border border-gray-new-20 px-2 py-1 font-mono text-xs leading-none tracking-tight text-gray-new-80 uppercase transition-colors hover:border-gray-new-40 hover:text-white"
                    to={`${LINKS.functionsTemplates}?category=${id}`}
                  >
                    {registryCategoryLabel(id)}
                  </Link>
                </li>
              ))}
            </ul>
          </DetailRow>
        )}
        <DetailRow label="Resources">
          <ul className="flex flex-col gap-2">
            {sourceUrl && (
              <li>
                <Link to={sourceUrl} theme="green" isExternal>
                  Template source
                  <span className="sr-only"> (opens in a new tab)</span>
                </Link>
              </li>
            )}
            <li>
              <Link to={LINKS.functionsTemplatesDocs} theme="green">
                How to use templates
              </Link>
            </li>
            <li>
              <Link to={LINKS.functionsRegistry} theme="green">
                Contribute a template
              </Link>
            </li>
          </ul>
        </DetailRow>
      </dl>
    </div>
  );
};

TemplateSidebar.propTypes = {
  installCommand: PropTypes.string.isRequired,
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    provider: PropTypes.string,
    website: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

const TemplateDetail = async ({ template, previous = null, next = null, readme = null }) => {
  const operations = template.operations ?? [];
  const environment = (template.environment ?? []).filter((item) => isInlineCodeSafe(item.name));
  const installCommand = `neon functions new ${template.id}`;

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
    <Container
      className="grid w-full grid-cols-12 gap-x-8 pt-[88px] pb-[120px] xl:pt-16 xl:pb-24 lg:flex lg:flex-col lg:gap-y-10 lg:pt-11 lg:pb-20 md:pt-8 md:pb-[72px]"
      size="1280"
    >
      <header className="col-span-8 row-start-1 max-w-[704px]">
        <Link
          className="mb-8 flex w-fit items-center gap-1 text-sm leading-none tracking-extra-tight text-gray-new-50 transition-colors duration-200 hover:text-white"
          to={LINKS.functionsTemplates}
        >
          <ArrowBackIcon />
          Function templates
        </Link>
        <FunctionRegistrySourceLabel className="mb-4 block text-xs" template={template} />
        <h1 className="text-5xl leading-dense font-normal tracking-tighter text-balance lg:text-[36px] md:text-[32px]">
          {template.title}
        </h1>
        <p className="mt-5 text-lg leading-normal tracking-extra-tight text-gray-new-60 md:text-base">
          {template.description}
        </p>
      </header>

      <aside className="col-span-4 col-start-9 row-span-2 row-start-1 lg:w-full lg:max-w-[704px]">
        <TemplateSidebar template={template} installCommand={installCommand} />
      </aside>

      <article className="col-span-8 row-start-2 max-w-[704px] lg:-mt-14 md:-mt-10">
        {renderedReadme && (
          <section className="mt-14 md:mt-10">
            <h2 className="text-[28px] leading-tight tracking-tighter md:text-2xl">
              About this template
            </h2>
            <div className="mt-6">{renderedReadme.content}</div>
          </section>
        )}

        {operations.length > 0 && !readmeHas('operations') && (
          <Section
            title="What this function exposes"
            description="After you deploy, call these paths on the function URL."
          >
            <OperationList
              className="mt-6"
              operations={operations}
              installCommand={installCommand}
            />
          </Section>
        )}

        {!renderedReadme &&
          (operations.length === 0 ? (
            <Section
              title="What it does"
              description={
                <>
                  This template has a single handler and no named operations, so it&apos;s a
                  starting point for your own code. To try it, {RUN_LOCALLY}
                </>
              }
            />
          ) : (
            <Section
              title="Run it"
              description={<>Installing a template doesn&apos;t deploy it, so {RUN_LOCALLY}</>}
            />
          ))}

        {environment.length > 0 && !readmeHas('environment') && (
          <Section
            title="Environment variables"
            description={
              <>
                The CLI declares these variables in <Code>neon.ts</Code> and adds them to{' '}
                <Code>.env.example</Code> without values, so you need to fill{' '}
                {hasRegistryEnvironmentRequirements(environment)
                  ? 'in the required ones'
                  : 'them in'}{' '}
                before you run the function.
              </>
            }
          >
            <EnvironmentTable className="mt-6" variables={environment} />
          </Section>
        )}

        <TemplatePager previous={previous} next={next} />
      </article>
    </Container>
  );
};

const templateShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  provider: PropTypes.string,
  logo: PropTypes.string,
  website: PropTypes.string,
  operations: PropTypes.arrayOf(PropTypes.object),
  environment: PropTypes.arrayOf(PropTypes.object),
});

TemplateDetail.propTypes = {
  template: templateShape.isRequired,
  previous: templateShape,
  next: templateShape,
  readme: PropTypes.shape({
    markdown: PropTypes.string.isRequired,
    imageBase: PropTypes.string.isRequired,
    linkBase: PropTypes.string.isRequired,
  }),
};

export default TemplateDetail;
