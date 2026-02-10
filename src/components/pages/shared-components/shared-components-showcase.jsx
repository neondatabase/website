'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Admonition from 'components/shared/admonition';
import AnchorHeading from 'components/shared/anchor-heading';
import AnimatedButton from 'components/shared/animated-button';
import Button from 'components/shared/button';
import CardItemsList from 'components/shared/card-items-list';
import Container from 'components/shared/container';
import CopyPrompt from 'components/shared/copy-prompt/copy-prompt';
import FeatureList from 'components/shared/feature-list';
import Field from 'components/shared/field';
import GradientBorder from 'components/shared/gradient-border';
import GradientCard from 'components/shared/gradient-card';
import GradientLabel from 'components/shared/gradient-label';
import Heading from 'components/shared/heading';
import HintText from 'components/shared/hint-text';
import InfoIcon from 'components/shared/info-icon';
import Link from 'components/shared/link';
import Logos from 'components/shared/logos';
import MegaLink from 'components/shared/mega-link';
import Mermaid from 'components/shared/mermaid';
import NavigationLinks from 'components/shared/navigation-links';
import QuickLinks from 'components/shared/quick-links';
import QuoteBlock from 'components/shared/quote-block';
import RssButton from 'components/shared/rss-button';
import SDKTableOfContents from 'components/shared/sdk-table-of-contents';
import SidebarCta from 'components/shared/sidebar-cta';
import Socials from 'components/shared/socials';
import TableOfContents from 'components/shared/table-of-contents';
import Testimonial from 'components/shared/testimonial';
import Tooltip from 'components/shared/tooltip';
import TwitterShareButton from 'components/shared/twitter-share-button';

const DemoAnchorHeading = AnchorHeading('h3');

const DEMO_COMPONENTS = [
  'admonition',
  'anchor-heading',
  'animated-button',
  'button',
  'card-items-list',
  'container',
  'copy-prompt',
  'feature-list',
  'field',
  'gradient-border',
  'gradient-card',
  'gradient-label',
  'heading',
  'hint-text',
  'info-icon',
  'link',
  'logos',
  'mega-link',
  'mermaid',
  'navigation-links',
  'quick-links',
  'quote-block',
  'rss-button',
  'sdk-table-of-contents',
  'sidebar-cta',
  'socials',
  'table-of-contents',
  'testimonial',
  'tooltip',
  'twitter-share-button',
];

const CARD_ITEMS_DEMO = [
  {
    icon: '/images/check-new.svg',
    title: 'Preview environments',
    description: 'Create isolated branches for each pull request.',
    url: '/branching',
  },
  {
    icon: '/images/check-new.svg',
    title: 'Restore quickly',
    description: 'Rollback data using point-in-time restore.',
    url: '/docs/guides/branching-neon',
  },
  {
    icon: '/images/check-new.svg',
    title: 'Scale on demand',
    description: 'Autoscaling compute for bursty traffic.',
    url: '/pricing',
  },
];

const TOC_ITEMS = [
  {
    index: 0,
    id: 'toc-demo-intro',
    level: 1,
    title: 'Introduction',
  },
  {
    index: 1,
    id: 'toc-demo-workflow',
    level: 1,
    title: 'Workflow',
    items: [
      {
        index: 2,
        id: 'toc-demo-workflow-step-1',
        level: 2,
        title: 'Create branch',
      },
      {
        index: 3,
        id: 'toc-demo-workflow-step-2',
        level: 2,
        title: 'Run migrations',
      },
    ],
  },
];

const SDK_TOC_SECTIONS = [
  {
    section: 'Database',
    items: [
      { id: 'sdk-demo-connect', title: 'Connect' },
      { id: 'sdk-demo-pooling', title: 'Connection pooling' },
    ],
  },
  {
    section: 'Platform',
    items: [{ id: 'sdk-demo-branches', title: 'Branches API' }],
  },
];

const QUOTE_BLOCK_PROPS = {
  author: 'dhruv-amin',
  quote: 'Neon made our preview and rollback workflow dramatically faster.',
  role: 'Engineering Lead',
};

const hasDemo = (name) => DEMO_COMPONENTS.includes(name);

const getDemoAnchor = (name) => `demo-${name}`;

const DemoCard = ({ component, title, description = '', className = '', children }) => (
  <article
    id={getDemoAnchor(component)}
    className={clsx(
      'rounded-2xl border border-[#232428] bg-[#0d0e10] p-6 lg:p-5',
      'shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
      className
    )}
  >
    <div className="flex flex-wrap items-center gap-2">
      <h3 className="text-lg font-medium tracking-tight text-gray-new-98">{title}</h3>
      <code className="rounded bg-[#18191c] px-2 py-1 text-xs text-gray-new-50">{component}</code>
    </div>
    {description && (
      <p className="mt-1 text-sm leading-snug tracking-tight text-gray-new-60">{description}</p>
    )}
    <div className="mt-5">{children}</div>
  </article>
);

DemoCard.propTypes = {
  component: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const SharedComponentsShowcase = ({ components }) => (
  <main className="safe-paddings min-h-screen bg-[#070809] py-16 text-white lg:py-12">
    <Container size="1408">
      <header className="rounded-2xl border border-[#24262a] bg-[linear-gradient(120deg,#0f1115_0%,#111420_55%,#10231f_100%)] px-8 py-7 lg:px-5 lg:py-5">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-green-45">
          Shared Components
        </p>
        <h1 className="mt-2 max-w-3xl font-title text-5xl font-medium leading-none tracking-tight xl:text-4xl md:text-3xl">
          Test page for shared components
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-snug tracking-tight text-gray-new-60">
          Total components: {components.length}. Live preview configured: {DEMO_COMPONENTS.length}.{' '}
          Use the catalog below to jump to available demos.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            className="rounded-full border border-green-45/50 px-3 py-1.5 text-sm text-green-45 transition-colors duration-200 hover:bg-green-45/10"
            href="#shared-live"
          >
            Live Preview
          </a>
          <a
            className="rounded-full border border-gray-new-20 px-3 py-1.5 text-sm text-gray-new-50 transition-colors duration-200 hover:bg-white/5 hover:text-gray-new-80"
            href="#shared-catalog"
          >
            Components Catalog
          </a>
        </div>
      </header>

      <section className="mt-12 lg:mt-9" id="shared-live">
        <h2 className="text-2xl font-medium tracking-tight text-gray-new-98 md:text-xl">
          Live Preview
        </h2>
        <p className="mt-2 text-sm leading-snug text-gray-new-60">
          Each card below shows minimal, working examples for a component from `shared`.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-5 xl:grid-cols-1">
          <DemoCard component="button" title="Button">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xxs" theme="primary">
                Primary
              </Button>
              <Button size="xxs" theme="secondary">
                Secondary
              </Button>
              <Button size="xxs" theme="outlined">
                Outlined
              </Button>
            </div>
          </DemoCard>

          <DemoCard component="animated-button" title="AnimatedButton">
            <div className="flex flex-wrap items-center gap-3">
              <AnimatedButton size="xxs" theme="primary" isAnimated>
                Animated
              </AnimatedButton>
              <AnimatedButton size="xxs" theme="secondary">
                Static
              </AnimatedButton>
            </div>
          </DemoCard>

          <DemoCard component="link" title="Link">
            <div className="flex flex-wrap items-center gap-5">
              <Link size="sm" theme="green-underlined" to="/docs">
                Open docs
              </Link>
              <Link size="sm" theme="gray-70" to="https://neon.tech" isExternal>
                neon.tech
              </Link>
            </div>
          </DemoCard>

          <DemoCard component="heading" title="Heading">
            <Heading tag="h3" size="sm" theme="white">
              Shared heading example
            </Heading>
          </DemoCard>

          <DemoCard component="gradient-label" title="GradientLabel">
            <div className="flex items-center gap-3">
              <GradientLabel>Default</GradientLabel>
              <GradientLabel theme="gray">Gray</GradientLabel>
            </div>
          </DemoCard>

          <DemoCard component="anchor-heading" title="AnchorHeading">
            <DemoAnchorHeading className="text-xl font-medium leading-tight">
              Feature title with custom id (#shared-custom-anchor)
            </DemoAnchorHeading>
          </DemoCard>

          <DemoCard component="hint-text" title="HintText">
            <HintText
              className="text-base text-gray-new-70"
              text="Hover *this phrase* to see extra details"
              tooltip="Tooltip content from <strong>HintText</strong>."
              tooltipId="shared-preview-hint"
            />
          </DemoCard>

          <DemoCard component="tooltip" title="Tooltip">
            <button
              className="rounded-md border border-gray-new-20 px-3 py-1.5 text-sm text-gray-new-70"
              type="button"
              data-tooltip-id="shared-preview-tooltip"
              data-tooltip-html="Standalone tooltip content."
            >
              Hover me
            </button>
            <Tooltip id="shared-preview-tooltip" place="top" />
          </DemoCard>

          <DemoCard component="info-icon" title="InfoIcon">
            <div className="flex items-center gap-2 text-sm text-gray-new-70">
              Estimated monthly cost
              <InfoIcon
                tooltip="Cost changes with compute and storage usage."
                tooltipId="shared-preview-info"
                tooltipPlace="top"
              />
            </div>
          </DemoCard>

          <DemoCard component="gradient-card" title="GradientCard">
            <GradientCard className="max-w-md">
              <div className="flex min-h-40 flex-col gap-3 p-4">
                <h4 className="text-lg font-medium">Card surface</h4>
                <p className="text-sm text-gray-new-70">
                  Use this as a base for dark cards with glow and noise.
                </p>
              </div>
            </GradientCard>
          </DemoCard>

          <DemoCard component="gradient-border" title="GradientBorder">
            <div className="relative rounded-xl bg-[#111317] p-5">
              <p className="relative z-20 text-sm text-gray-new-70">
                Decorative border around any block.
              </p>
              <GradientBorder withBlend />
            </div>
          </DemoCard>

          <DemoCard component="container" title="Container">
            <Container
              className="rounded-xl bg-[#101113] py-4 text-center text-sm text-gray-new-70"
              size="640"
            >
              Centered content inside a fixed max width container.
            </Container>
          </DemoCard>

          <DemoCard component="field" title="Field">
            <form className="max-w-md">
              <Field
                name="preview-email"
                label="Email"
                placeholder="name@company.com"
                inputClassName="bg-black/20"
              />
            </form>
          </DemoCard>

          <DemoCard component="admonition" title="Admonition">
            <Admonition type="tip">
              You can use this component to highlight important notes.
            </Admonition>
          </DemoCard>

          <DemoCard component="quote-block" title="QuoteBlock">
            <QuoteBlock {...QUOTE_BLOCK_PROPS} />
          </DemoCard>

          <DemoCard component="testimonial" title="Testimonial">
            <Testimonial
              className="!px-0 !py-0"
              quote="Branching lets us test schema and data changes in minutes."
              name="Alex Morgan"
              position="Staff Engineer"
            />
          </DemoCard>

          <DemoCard component="logos" title="Logos">
            <Logos
              logos={['openai', 'vercel', 'cloudflare', 'cursor', 'claude', 'meta']}
              size="sm"
              withGreenFade
              staticDesktop
            />
          </DemoCard>

          <DemoCard component="socials" title="Socials">
            <Socials />
          </DemoCard>

          <DemoCard component="rss-button" title="RssButton">
            <RssButton basePath="/blog/" title="Blog" />
          </DemoCard>

          <DemoCard component="mega-link" title="MegaLink">
            <MegaLink
              tag="Guide"
              title="Create a branch per preview deployment"
              date={new Date('2026-01-15')}
              url="/docs/guides/branching-neon"
            />
          </DemoCard>

          <DemoCard component="navigation-links" title="NavigationLinks">
            <NavigationLinks
              basePath="/docs/"
              previousLink={{ title: 'Connect from app', slug: 'connect' }}
              nextLink={{ title: 'Manage branches', slug: 'guides/branching-neon' }}
            />
          </DemoCard>

          <DemoCard component="sidebar-cta" title="SidebarCta">
            <SidebarCta />
          </DemoCard>

          <DemoCard component="quick-links" title="QuickLinks">
            <QuickLinks title="Start here" />
          </DemoCard>

          <DemoCard component="mermaid" title="Mermaid">
            <Mermaid
              chart={`flowchart LR
    A[Local branch] --> B{Run tests}
    B -->|Pass| C[Merge to main]
    B -->|Fail| D[Reset branch]
`}
            />
          </DemoCard>

          <DemoCard component="feature-list" title="FeatureList">
            <FeatureList icons={['database', 'branching', 'api']}>
              <h3 className="text-xl font-medium">Serverless Postgres</h3>
              <p className="text-sm text-gray-new-70">Scale compute automatically.</p>
              <h3 className="text-xl font-medium">Database Branching</h3>
              <p className="text-sm text-gray-new-70">Isolated dev and preview environments.</p>
              <h3 className="text-xl font-medium">API-first workflows</h3>
              <p className="text-sm text-gray-new-70">Automate branch lifecycle from CI.</p>
            </FeatureList>
          </DemoCard>

          <DemoCard component="card-items-list" title="CardItemsList">
            <CardItemsList items={CARD_ITEMS_DEMO} />
          </DemoCard>

          <DemoCard component="copy-prompt" title="CopyPrompt">
            <CopyPrompt
              src="/prompts/javascript-prompt.md"
              description="Copy a prompt template from /public/prompts."
            />
          </DemoCard>

          <DemoCard component="table-of-contents" title="TableOfContents">
            <div className="rounded-lg border border-gray-new-20 p-4">
              <TableOfContents items={TOC_ITEMS} isTemplate />
            </div>
            <div className="sr-only">
              <h3 id="toc-demo-intro">Introduction</h3>
              <h3 id="toc-demo-workflow">Workflow</h3>
              <h4 id="toc-demo-workflow-step-1">Create branch</h4>
              <h4 id="toc-demo-workflow-step-2">Run migrations</h4>
            </div>
          </DemoCard>

          <DemoCard component="sdk-table-of-contents" title="SDKTableOfContents">
            <div className="rounded-lg border border-gray-new-20 p-4">
              <SDKTableOfContents
                title="Neon SDK"
                url="/docs/reference/api-reference"
                sections={SDK_TOC_SECTIONS}
              />
            </div>
            <div className="sr-only">
              <h3 id="sdk-demo-connect">Connect</h3>
              <h3 id="sdk-demo-pooling">Connection pooling</h3>
              <h3 id="sdk-demo-branches">Branches API</h3>
            </div>
          </DemoCard>

          <DemoCard component="twitter-share-button" title="TwitterShareButton">
            <TwitterShareButton
              url="https://neon.tech"
              shareText="Testing shared components page"
              className="!rounded-lg !border !border-gray-new-20 !bg-[#111317]"
            >
              Share on X
            </TwitterShareButton>
          </DemoCard>
        </div>
      </section>

      <section className="mt-14 lg:mt-10" id="shared-catalog">
        <h2 className="text-2xl font-medium tracking-tight text-gray-new-98 md:text-xl">
          Components Catalog
        </h2>
        <p className="mt-2 text-sm leading-snug text-gray-new-60">
          Auto-generated from `src/components/shared`.
        </p>

        <ul className="mt-6 grid grid-cols-3 gap-4 xl:grid-cols-2 md:grid-cols-1">
          {components.map(({ name, importPath, sourcePath, hasIndex }) => (
            <li className="rounded-xl border border-[#202227] bg-[#0d0e10] p-4" key={name}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-medium text-gray-new-98">{name}</h3>
                {hasDemo(name) && (
                  <a
                    className="rounded bg-[#173126] px-2 py-0.5 text-xs font-medium text-green-45 transition-colors duration-200 hover:bg-[#1e3f31]"
                    href={`#${getDemoAnchor(name)}`}
                  >
                    demo
                  </a>
                )}
                <span
                  className={clsx(
                    'rounded px-2 py-0.5 text-xs font-medium',
                    hasIndex ? 'bg-[#1e2535] text-[#96b4ff]' : 'bg-[#2a2320] text-[#f2b88b]'
                  )}
                >
                  {hasIndex ? 'index export' : 'internal only'}
                </span>
              </div>

              <p className="mt-3 text-xs uppercase tracking-[0.07em] text-gray-new-50">Import</p>
              <code className="mt-1 block rounded bg-[#14161a] p-2 text-xs text-gray-new-70">
                {importPath}
              </code>

              <p className="mt-3 text-xs uppercase tracking-[0.07em] text-gray-new-50">Source</p>
              <code className="mt-1 block rounded bg-[#14161a] p-2 text-xs text-gray-new-70">
                {sourcePath}
              </code>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  </main>
);

SharedComponentsShowcase.propTypes = {
  components: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      importPath: PropTypes.string.isRequired,
      sourcePath: PropTypes.string.isRequired,
      hasIndex: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default SharedComponentsShowcase;
