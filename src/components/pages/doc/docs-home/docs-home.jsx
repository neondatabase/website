'use client';

import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import { CompactCards } from 'components/pages/doc/compact-cards';
import DetailIconCards from 'components/pages/doc/detail-icon-cards';
import DatabaseIcon from 'components/pages/doc/detail-icon-cards/images/database.inline.svg';
import Link from 'components/shared/link';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopiedIcon from 'icons/home/copied.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';
import { cn } from 'utils/cn';

// Capability definitions, mirrored from the Claude "Docs Home A2" mockup. One
// picker drives both the Agent prompt and CLI tabs. `phrase` is the bare word
// appended to the prompt's "Then add ..." clause; `cmds` are the exact verified
// CLI commands (CLI 8.8.0), with shell-safe example values (my-bucket,
// myfunction) where a name is needed; `comment` is the `#` line shown above them. `icon`
// is the real DetailIconCards monochrome icon name, matching the icon the live
// docs home (content/docs/introduction.md) already uses for each service.
// `product` is the real Neon product name, shown in the lockup line at the top
// of each card (icon + name) so the task-first title still teaches the product
// vocabulary. `chip` is the shorter label the composer picker shows (a
// different string, and a separate control).
const CAPS = [
  {
    k: 'auth',
    title: 'Add login and users',
    line: 'Sign-in, sign-up, sessions, OAuth.',
    product: 'Managed Better Auth',
    chip: 'Auth',
    phrase: 'auth',
    cmds: ['neon neon-auth enable'],
    comment: 'Add login and users',
    to: '/docs/auth/overview',
    icon: 'lock-landscape',
  },
  {
    k: 'object-storage',
    title: 'Store files and uploads',
    line: 'Images, documents, user uploads.',
    product: 'Neon Object Storage',
    chip: 'File uploads',
    phrase: 'file uploads',
    cmds: ['neon buckets create my-bucket'],
    comment: 'Create a bucket for files and uploads',
    to: '/docs/storage/overview',
    icon: 'data',
  },
  {
    k: 'functions',
    title: 'Run backend code',
    line: 'Host APIs, agents, webhooks, cron.',
    product: 'Neon Functions',
    chip: 'Backend code',
    phrase: 'serverless functions',
    cmds: ['neon functions deploy myfunction --src ./index.ts'],
    comment: 'Deploy backend code as a function (point --src at your function file)',
    to: '/docs/compute/functions/overview',
    icon: 'code',
  },
  {
    k: 'ai-gateway',
    title: 'Call any LLM',
    line: 'One API and one key for every model, plus embeddings.',
    product: 'Neon AI Gateway',
    chip: 'AI',
    phrase: 'AI',
    // The AI Gateway is on by default, so the CLI declares it in neon.ts and
    // `neon deploy` applies it. `declared` puts it after the direct-command
    // capabilities and adds the trailing deploy line. Paid plans only: deploy
    // fails with an upgrade error on Free, so the comment says so inline.
    cmds: ['neon config add ai-gateway'],
    comment: 'Declare the AI Gateway in your config (paid plan)',
    declared: true,
    to: '/docs/ai-gateway/overview',
    icon: 'sparkle',
  },
  {
    k: 'realtime',
    title: 'Make it reactive',
    line: 'Realtime, reactive data and UIs.',
    product: 'Neon Realtime',
    chip: 'Realtime',
    phrase: 'realtime',
    cmds: ['neon realtime enable'],
    comment: 'Enable Realtime',
    to: '/docs/realtime/overview',
    icon: 'zap',
  },
];

const SEARCH_CARD = {
  title: 'Add search',
  line: 'Vector, full-text, and hybrid search.',
  product: 'Lakebase Search',
  to: '/docs/ai/lakebase-search',
  icon: 'search',
};

// Framework quickstarts. `icon` is the real technology-logo key read by
// CompactCards (public/images/technology-logos/<icon>.svg), so these render the
// actual framework logos instead of the two-letter placeholders. React Router
// uses the `react` logo, matching the live docs home's framework list.
const FRAMEWORKS = [
  { name: 'Next.js', icon: 'next-js', to: '/docs/guides/nextjs' },
  { name: 'React Router', icon: 'react', to: '/docs/guides/react-router' },
  { name: 'Django', icon: 'django', to: '/docs/guides/django' },
  { name: 'Express', icon: 'express', to: '/docs/guides/express' },
  { name: 'Drizzle', icon: 'drizzle', to: '/docs/guides/drizzle' },
  { name: 'Prisma', icon: 'prisma', to: '/docs/guides/prisma' },
  { name: 'Laravel', icon: 'laravel', to: '/docs/guides/laravel' },
  { name: 'Rails', icon: 'rails', to: '/docs/guides/ruby-on-rails' },
];

const AGENTS = [
  { name: 'Cursor', icon: 'cursor' },
  { name: 'Claude Code', icon: 'claude-code' },
  { name: 'Codex', icon: 'codex' },
  { name: 'GitHub Copilot', icon: 'copilot' },
];

// Longer walkthroughs. `icon` is a real DetailIconCards monochrome icon name.
const GUIDED_PATHS = [
  {
    title: 'Full backend quickstart',
    line: 'Next.js on Postgres, Auth, Storage, and AI, to deployed.',
    to: '/docs/get-started/full-backend-quickstart',
    icon: 'rocket',
  },
  {
    title: 'Tour the backend',
    line: 'How the pieces fit on one branch.',
    to: '/docs/get-started/backend-overview',
    icon: 'puzzle',
  },
  {
    title: 'Build a reactive app',
    line: 'Live queries with Realtime.',
    to: '/docs/realtime/overview',
    icon: 'zap',
  },
];

const MCP_HREF = '/docs/ai/connect-mcp-clients-to-neon';

const AGENT_BASE = 'Set me up for Neon. Fetch https://neon.com/agent-setup.md and follow it.';

// "a", "a and b", "a, b, and c"
function joinList(items) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

// Shared design tokens, kept as the site's gray/green scale. These are the
// borders, panel fills, and muted-text values the rest of docs uses; the custom
// composer and foundation card below are built from them so they sit on the
// same palette as the real components.
const softBorder = 'border-gray-new-90 dark:border-gray-new-20';
const strongBorder = 'border-gray-new-80 dark:border-gray-new-20';
const panelBg = 'bg-gray-new-98 dark:bg-gray-new-8';
const mutedText = 'text-gray-new-50 dark:text-gray-new-70';
// Calmer, less-saturated green used only inside the composer box so the
// composed phrase and selected chips don't read as hot neon against the quiet
// page. green-44 (#39A57D) / green-52 (#34D59A) is the same muted pair the
// site's Link `blue-green` inline-emphasis theme uses, rather than the full
// brightness brand neon green-45 (#00E599).
const composerGreen = 'text-green-44 dark:text-green-52';

// Thin local layout wrapper for the label-left sections (quiet heading in a
// fixed left column, content on the right, divider on top). Turn 7 layout: a
// fixed 300px label track + minmax(0,1fr) content, inside the one 1296px
// content container (<main>), so every section shares the hero's left edge and
// the container's right edge. There is no shared "label-left section" component
// on the site: the marketing home re-implements this two-column grid inline in
// every section (build-your-backend, scale-your-app, ...), with only
// `SectionLabel` shared. This keeps the docs home from re-typing the grid per
// section; see the rebuild notes for the flagged decision on whether to promote
// it to a shared component.
const LabelSection = ({ heading, description, action, children }) => (
  <section
    className={cn(
      'grid grid-cols-[300px_minmax(0,1fr)] items-start gap-x-14 border-t pt-14 pb-24 xl:gap-x-10 md:grid-cols-1 md:gap-6 md:pt-10 md:pb-16',
      softBorder
    )}
  >
    <div className="grid content-start gap-2">
      <h2 className="m-0 font-title text-[32px] leading-tight font-normal tracking-[-0.03em] text-balance md:text-[26px]">
        {heading}
      </h2>
      {description && <span className={cn('text-sm leading-[1.5]', mutedText)}>{description}</span>}
      {action}
    </div>
    <div className="min-w-0">{children}</div>
  </section>
);

LabelSection.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node,
};

// Copy chip for the agent-fetch URLs (llms.txt, agent-setup.md). These are raw
// files meant for agents, not pages for people, so the chip copies the absolute
// URL instead of navigating. Same copy pattern as the composer's Copy button:
// the shared `useCopyToClipboard` hook and the shared home copy/copied icons,
// with the label swapping to "Copied" briefly. The path and "Copied" share one
// grid cell so the chip keeps its width when the label swaps.
const CopyChip = ({ label, url }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(1400);
  return (
    <button
      type="button"
      onClick={() => handleCopy(url)}
      aria-label={isCopied ? `Copied ${url}` : `Copy ${url}`}
      className={cn(
        'flex items-center gap-1.5 rounded-[2px] border px-2.5 py-1.5 font-mono text-xs text-current transition-colors hover:border-gray-new-70 dark:hover:border-gray-new-40',
        softBorder
      )}
    >
      <span className="grid">
        <span className={cn('col-start-1 row-start-1', isCopied && 'invisible')}>{label}</span>
        <span className={cn('col-start-1 row-start-1', !isCopied && 'invisible')}>Copied</span>
      </span>
      {isCopied ? (
        <CopiedIcon className="size-3" aria-hidden />
      ) : (
        <CopyIcon className="size-3" aria-hidden />
      )}
    </button>
  );
};

CopyChip.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

// Custom composer: the agent-prompt / CLI picker whose chips drive both the
// prompt and the CLI command block. This is the one genuinely new piece with no
// existing component, so it stays custom; only the copy control is rebuilt on
// the shared `useCopyToClipboard` hook and the shared home copy icons.
const Composer = () => {
  const [tab, setTab] = useState('agent');
  const [picks, setPicks] = useState([]);
  const { isCopied, handleCopy } = useCopyToClipboard(1400);

  const agent = tab === 'agent';
  const sel = useMemo(() => CAPS.filter((c) => picks.includes(c.k)), [picks]);

  const extra = useMemo(
    () => (sel.length ? ` Then add ${joinList(sel.map((c) => c.phrase))}.` : ''),
    [sel]
  );
  const promptText = AGENT_BASE + extra;

  // CLI: install the CLI globally, init, then one `# comment` + command block
  // per picked capability. Direct-command capabilities (Auth, Storage,
  // Functions, Realtime) provision on their own; declared ones (AI) come after
  // them, followed by `neon deploy`, which only appears when one is picked. The
  // global install comes first so the bare `neon` in every later line resolves
  // on a clean machine (same order as public/agent-setup.md).
  const cliLines = useMemo(() => {
    const blocks = [
      ['Install the Neon CLI (needs Node.js 22.20+)', ['npm install -g neon@latest']],
      ['Create and link a project (walks you through sign-in)', ['neon init']],
    ];
    sel.filter((c) => !c.declared).forEach((c) => blocks.push([c.comment, c.cmds]));
    const declared = sel.filter((c) => c.declared);
    declared.forEach((c) => blocks.push([c.comment, c.cmds]));
    if (declared.length) blocks.push(['Provision what you declared', ['neon deploy']]);
    const lines = [];
    blocks.forEach(([comment, cmds], i) => {
      lines.push({ text: `# ${comment}`, comment: true, gap: i > 0 });
      cmds.forEach((cmd) => lines.push({ text: cmd, comment: false, gap: false }));
    });
    return lines;
  }, [sel]);
  const cliText = cliLines.map((l) => l.text).join('\n');

  const activeText = agent ? promptText : cliText;

  const togglePick = (k) =>
    setPicks((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const tabBtn = (id) =>
    cn(
      'flex items-center px-[18px] font-mono text-xs transition-colors',
      '-mb-px border-b',
      tab === id
        ? 'border-green-44 text-black-pure dark:border-green-52 dark:text-white'
        : 'border-transparent text-gray-new-50 dark:text-gray-new-60'
    );

  // Returns only the composer box. The hero's text half (eyebrow, headline,
  // intro, links) lives in the left column of the hero section in DocsHome.
  return (
    <div className={cn('rounded-[2px] border', strongBorder, panelBg)}>
      <div className={cn('flex h-11 items-stretch border-b', softBorder)}>
        <button type="button" className={tabBtn('agent')} onClick={() => setTab('agent')}>
          Agent prompt
        </button>
        <button type="button" className={tabBtn('cli')} onClick={() => setTab('cli')}>
          CLI
        </button>
        <div className="flex-1" />
        <div className="flex items-center pr-2">
          <button
            type="button"
            onClick={() => handleCopy(activeText)}
            className="flex h-[30px] items-center gap-1.5 rounded-[2px] bg-primary-1 px-3 text-[13px] font-medium text-black transition-colors hover:bg-primary-2"
          >
            {isCopied ? 'Copied' : 'Copy'}
            {isCopied ? <CopiedIcon className="size-3" /> : <CopyIcon className="size-3" />}
          </button>
        </div>
      </div>

      {agent ? (
        <div className="min-h-[84px] p-7 font-mono text-[15px] leading-[1.65] [text-wrap:pretty] text-gray-new-15 dark:text-gray-new-94 md:p-6">
          <span>Set me up for Neon. Fetch </span>
          <span className="border-b border-dashed border-gray-new-70 text-black-pure dark:border-gray-new-50 dark:text-white">
            https://neon.com/agent-setup.md
          </span>
          <span> and follow it.</span>
          {extra && <span className={composerGreen}>{extra}</span>}
        </div>
      ) : (
        <div className="grid min-h-[84px] gap-0.5 p-7 font-mono text-[14px] leading-[1.6] md:p-6">
          {cliLines.map((l, i) => (
            <div
              key={`${l.text}-${i}`}
              className={cn(
                'break-words',
                l.gap && 'mt-2.5',
                l.comment
                  ? 'text-gray-new-50 dark:text-gray-new-60'
                  : 'text-black-pure dark:text-gray-new-94'
              )}
            >
              {l.text}
            </div>
          ))}
        </div>
      )}

      {/* Chip row drives both tabs */}
      <div
        className={cn(
          'flex flex-wrap items-center gap-1.5 border-t px-7 pt-3.5 pb-4 md:px-6',
          softBorder
        )}
      >
        <span className="mr-2 font-mono text-[11px] text-gray-new-50 dark:text-gray-new-60">
          {agent ? 'Add to prompt' : 'Add to commands'}
        </span>
        {CAPS.map((c) => {
          const on = picks.includes(c.k);
          return (
            <button
              key={c.k}
              type="button"
              aria-pressed={on}
              onClick={() => togglePick(c.k)}
              className={cn(
                'flex h-7 items-center rounded-[2px] border px-2.5 font-mono text-xs tracking-[-0.02em] transition-colors duration-150',
                on
                  ? 'border-green-44 bg-green-44/10 text-green-44 dark:border-green-52 dark:bg-green-52/10 dark:text-green-52'
                  : cn(
                      'text-gray-new-40 hover:border-green-44 dark:text-gray-new-60 dark:hover:border-green-52',
                      softBorder
                    )
              )}
            >
              {c.chip}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Postgres foundation card: full-width, foundation card across the top of the
// capability grid, with the slash-separated sub-links. It uses the same plain
// green-flat fill as the DetailIconCards cards below it (bg-[#E4F1EB]/40 light,
// #101815 dark) so it sits calmly in the same card family while staying full-
// width. DetailIconCards cannot render a single full-width card out of the box
// (it lays children out in a 2/3/4-col grid of equal cards), so this stays
// custom. Its lockup line repeats the classes DetailIconCards uses for its
// `lockup` prop, with the same shared database icon the live Products grid
// uses for Lakebase Postgres. Inside, it splits into two columns like the
// hero: lockup and title on the left, description and sub-links on the right,
// stacking at md. See the rebuild notes for the flagged decision. The whole
// card links to /docs/get-started through a stretched overlay link, and the
// three sub-links sit above it (relative z-10) so each is its own link; a
// card-wide <a> can't contain them, since links can't nest.
const FoundationCard = () => (
  <div
    className={cn(
      'group relative grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-end gap-x-12 gap-y-4 border px-[26px] py-6 transition-colors hover:border-green-44 md:grid-cols-1',
      'border-green-44/70 bg-[#E4F1EB]/40 dark:border-green-44/30 dark:bg-[#101815]'
    )}
  >
    <NextLink
      href="/docs/get-started"
      aria-label="Create a database"
      className="absolute inset-0"
    />
    <div className="grid">
      {/* Same lockup classes as the DetailIconCards lockup variant. */}
      <span className="mb-7 flex items-center gap-2">
        <DatabaseIcon className="size-5 shrink-0 text-[#2DAA7D] dark:text-[#00E599] [&_*]:[stroke-width:1.46] [&_*]:[stroke-linecap:round] [&_*]:[stroke-linejoin:round] [&_*]:[vector-effect:non-scaling-stroke]" />
        <span className="text-[13px] leading-snug font-normal tracking-normal text-[#6B6F77] dark:text-gray-new-60">
          Lakebase Postgres
        </span>
      </span>
      <span className="font-sans text-[20px] leading-[1.2] font-normal tracking-[-0.02em] text-[#0C0D0D] dark:text-white">
        Create a database
      </span>
    </div>
    <div className="grid gap-2.5">
      <span className="max-w-[440px] text-base leading-[1.5] text-[#6B6F77] dark:text-gray-new-60">
        Serverless Postgres that branches with your app. Every other capability runs on it.
      </span>
      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-[#303236] dark:text-gray-new-80">
        <NextLink href="/docs/get-started/signing-up" className="relative z-10">
          Quickstart
        </NextLink>
        <span className="text-gray-new-70">/</span>
        <NextLink href="/docs/connect/connect-hub" className="relative z-10">
          Connect
        </NextLink>
        <span className="text-gray-new-70">/</span>
        <NextLink href="/docs/introduction/branching" className="relative z-10">
          Branching
        </NextLink>
      </span>
    </div>
  </div>
);

const DocsHome = () => (
  <div className="w-full font-sans tracking-[-0.02em] text-black-pure dark:bg-black-pure dark:text-white">
    <main className="mx-auto max-w-[1296px] px-16 lg:px-10 md:px-8 sm:px-5">
      {/*
        Hero: text half on the left, composer box on the right, side by side on
        desktop and stacked (text then box) at lg and below. This hero uses its
        own two-column split and intentionally does NOT use the label-left
        LabelSection layout the sections further down the page use.
      */}
      <section className="grid grid-cols-[minmax(0,47fr)_minmax(0,53fr)] items-start gap-x-16 gap-y-10 py-24 xl:gap-x-10 lg:grid-cols-1 lg:py-16 md:py-14">
        <div className="grid content-start gap-6">
          {/*
            Heading unit: the docs label as the H1, with the product descriptor
            as a calm subhead held close beneath it. The links sit a step below.
          */}
          <div className="grid gap-3">
            <h1 className="m-0 font-title text-[56px] leading-[1.08] font-normal tracking-[-0.04em] text-balance 2xl:text-[48px] lg:text-[40px] md:text-[36px]">
              Neon Docs
            </h1>
            <p className="m-0 text-lg leading-snug [text-wrap:pretty] text-gray-new-40 dark:text-gray-new-70 md:text-base">
              Postgres, Auth, Storage, Functions, AI, and Realtime on one branch.
            </p>
          </div>
          <div className="grid justify-items-start gap-2 text-[13px]">
            <Link
              to="/docs/get-started/full-backend-quickstart"
              theme="grey-70-underlined"
              className="text-[13px]"
            >
              Full backend quickstart
            </Link>
            <Link to="/docs/connect/connect-hub" theme="grey-70-underlined" className="text-[13px]">
              Connect an existing app
            </Link>
          </div>
        </div>
        <Composer />
      </section>

      {/* Build your backend */}
      <LabelSection
        heading="Build your backend"
        description="Every capability runs on the same Postgres branch."
      >
        <div className="grid gap-3">
          <FoundationCard />
          {/*
            Capability cards rendered with the real docs card component
            (DetailIconCards), fed MDX-style <a> children, in the site's regular
            `green-flat` theme (the same green-tinted treatment the live Products
            grid in content/docs/introduction.md uses). The product name sits in
            a lockup line at the top of the card (icon + name, via the
            component's `lockup` prop), so the card keeps its task-first title
            while still teaching the product name. The eslint-disable keeps the
            component-only props (`description`, `icon`, `lockup`) from being
            stripped by `eslint --fix` as unknown DOM attributes.
          */}
          {/* eslint-disable react/no-unknown-property */}
          <DetailIconCards className="my-0!" cols={3} theme="green-flat">
            {[...CAPS, SEARCH_CARD].map((c) => (
              <a key={c.to} href={c.to} description={c.line} icon={c.icon} lockup={c.product}>
                {c.title}
              </a>
            ))}
          </DetailIconCards>
          {/* eslint-enable react/no-unknown-property */}
        </div>
      </LabelSection>

      {/* Frameworks */}
      <LabelSection
        heading="Frameworks"
        description="Quickstarts for the stacks most people use."
        action={
          <Link
            to="/docs/get-started/frameworks"
            theme="green-underlined"
            className="mt-1 text-[13px]"
          >
            See all frameworks
          </Link>
        }
      >
        <CompactCards className="my-0!" cols={4}>
          {FRAMEWORKS.map((f) => (
            <a key={f.name} href={f.to} title={f.name} icon={f.icon}>
              {f.name}
            </a>
          ))}
        </CompactCards>
      </LabelSection>

      {/* Set up your agent */}
      <LabelSection
        heading="Set up your agent"
        description="Connect Neon over MCP so your coding agent can create branches, run SQL, and read docs."
      >
        <div className="grid gap-5">
          <CompactCards className="my-0!" cols={4}>
            {AGENTS.map((g) => (
              <a key={g.name} href={MCP_HREF} title={g.name} icon={g.icon}>
                {g.name}
              </a>
            ))}
          </CompactCards>
          <div
            className={cn(
              'flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[2px] border border-dashed p-3.5 px-4 text-[13px]',
              strongBorder,
              mutedText
            )}
          >
            <span className="min-w-[220px] flex-1">
              Every docs page is also served as Markdown. Point an agent at the index and it can
              find the rest.
            </span>
            <CopyChip label="/docs/llms.txt" url="https://neon.com/docs/llms.txt" />
            <CopyChip label="/agent-setup.md" url="https://neon.com/agent-setup.md" />
          </div>
        </div>
      </LabelSection>

      {/* Guided paths */}
      <LabelSection
        heading="Guided paths"
        description="Longer walkthroughs when you want the whole picture."
      >
        {/* eslint-disable react/no-unknown-property */}
        <DetailIconCards className="my-0!" cols={3} theme="green-flat">
          {GUIDED_PATHS.map((p) => (
            <a key={p.to} href={p.to} description={p.line} icon={p.icon}>
              {p.title}
            </a>
          ))}
        </DetailIconCards>
        {/* eslint-enable react/no-unknown-property */}
      </LabelSection>
    </main>
  </div>
);

export default DocsHome;
