import PropTypes from 'prop-types';

import FunctionRegistryTemplateLogo from 'components/pages/functions/templates/registry/template-logo';
import FunctionRegistryWebsiteLink from 'components/pages/functions/templates/registry/website-link';
import Container from 'components/shared/container';
import CopyCommand from 'components/shared/copy-command';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import ArrowBackIcon from 'icons/arrow-back.inline.svg';
import { cn } from 'utils/cn';
import {
  isInlineCodeSafe,
  isFirstPartyRegistryTemplate,
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

const Operation = ({ operation, installCommand }) => {
  const command = operation.id ? `${installCommand} --operation ${operation.id}` : null;

  return (
    <li className="border-t border-gray-new-20 pt-6">
      <h3 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xl leading-snug font-medium tracking-extra-tight">
        {operation.title}
        {operation.recommended && (
          <span className="border border-green-45/40 px-1.5 py-1 font-mono text-[11px] leading-none font-medium tracking-tight text-green-45 uppercase">
            Recommended
          </span>
        )}
      </h3>
      <p className="mt-2 text-base leading-normal tracking-extra-tight text-gray-new-60">
        {operation.description}
      </p>
      {isInlineCodeSafe(operation.route) && (
        <p className="mt-2 font-mono text-sm text-gray-new-80">{operation.route}</p>
      )}
      {command && (
        <CopyCommand className="mt-4" command={command} trackingLabel={`Copy ${command}`} />
      )}
    </li>
  );
};

Operation.propTypes = {
  installCommand: PropTypes.string.isRequired,
  operation: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    route: PropTypes.string,
    recommended: PropTypes.bool,
  }).isRequired,
};

const EnvironmentTable = ({ variables }) => (
  <div className="mt-6 overflow-x-auto border border-gray-new-20">
    <table className="w-full min-w-80 text-left text-sm">
      <thead className="bg-gray-new-8 font-mono text-xs tracking-tight text-gray-new-60 uppercase">
        <tr>
          <th className="px-4 py-3 font-medium">Variable</th>
          <th className="px-4 py-3 font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        {variables.map(({ name, description }) => (
          <tr className="border-t border-gray-new-20" key={name}>
            <td className="px-4 py-3 font-mono text-white">{name}</td>
            <td className="px-4 py-3 text-gray-new-60">{description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

EnvironmentTable.propTypes = {
  variables: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired, description: PropTypes.string })
  ).isRequired,
};

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

  return (
    <div className="sticky top-24 flex flex-col gap-6 lg:static">
      <div className="border border-gray-new-20 bg-[#080808] p-5">
        <p className={DETAIL_LABEL_CLASS_NAME}>Use this template</p>
        <CopyCommand
          className="mt-4 [&>span:nth-of-type(2)]:[overflow-wrap:anywhere] [&>span:nth-of-type(2)]:whitespace-normal"
          command={installCommand}
          trackingLabel={`Copy ${installCommand}`}
        />
        <p className="mt-3 text-[13px] leading-snug text-gray-new-50">
          With the{' '}
          <Link className={TEXT_LINK_CLASS_NAME} to={LINKS.cliInstall} theme="green">
            Neon CLI
          </Link>{' '}
          8.11.0 or later, this command copies the template into{' '}
          <Code>functions/&lt;slug&gt;/</Code> and declares the function in{' '}
          <Link className={TEXT_LINK_CLASS_NAME} to="/docs/reference/neon-ts" theme="green">
            neon.ts
          </Link>
          .
        </p>
      </div>

      <dl>
        <DetailRow label="Built by">
          <span className="flex items-center gap-3">
            <FunctionRegistryTemplateLogo template={template} eager variant="title" />
            <span className="flex min-w-0 flex-col gap-0.5">
              {provider}
              <FunctionRegistryWebsiteLink className="truncate text-sm" template={template} />
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
            <li>
              <Link to={registryTemplateSourceUrl(template)} theme="green" isExternal>
                Template source
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
            </li>
            <li>
              <Link to={LINKS.functionsTemplatesDocs} theme="green">
                How to use templates
              </Link>
            </li>
            <li>
              <Link to={LINKS.functionsRegistry} theme="green">
                Publish your own template
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

const TemplateDetail = ({ template, previous = null, next = null }) => {
  const operations = template.operations ?? [];
  const environment = (template.environment ?? []).filter((item) => isInlineCodeSafe(item.name));
  const installCommand = `neon functions new ${template.id}`;

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
        {isFirstPartyRegistryTemplate(template) && (
          <p className="mb-4 font-mono text-xs leading-none font-medium tracking-tight text-green-45 uppercase">
            First Party
          </p>
        )}
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
        {operations.length > 0 ? (
          <Section
            title="What this function exposes"
            description="After you deploy, call these paths on the function URL."
          >
            <ul className="mt-6 flex flex-col gap-6">
              {operations.map((operation) => (
                <Operation
                  key={operation.id || operation.title}
                  operation={operation}
                  installCommand={installCommand}
                />
              ))}
            </ul>
          </Section>
        ) : (
          <Section
            title="What it does"
            description={
              <>
                This template has a single handler and no named operations, so it&apos;s a starting
                point for your own code. To try it, {RUN_LOCALLY}
              </>
            }
          />
        )}

        {environment.length > 0 && (
          <Section
            title="Environment variables"
            description={
              <>
                The CLI declares these variables in <Code>neon.ts</Code> and adds them to{' '}
                <Code>.env.example</Code> without values, so you need to fill them in before you run
                the function.
              </>
            }
          >
            <EnvironmentTable variables={environment} />
          </Section>
        )}

        {operations.length > 0 && (
          <Section
            title="Run it"
            description={<>Installing a template doesn&apos;t deploy it, so {RUN_LOCALLY}</>}
          />
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
};

export default TemplateDetail;
