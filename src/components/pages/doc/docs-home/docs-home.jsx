import NextLink from 'next/link';
import PropTypes from 'prop-types';

import { CompactCards } from 'components/pages/doc/compact-cards';
import DetailIconCards from 'components/pages/doc/detail-icon-cards';
import DatabaseIcon from 'components/pages/doc/detail-icon-cards/images/database.inline.svg';
import PromptCopyButton from 'components/pages/doc/prompt-copy-button';
import Link from 'components/shared/link';
import { cn } from 'utils/cn';

import DocsHomeComposer from './docs-home-composer';
import DocsHomeCopyChip from './docs-home-copy-chip';
import {
  AGENTS,
  CAPABILITY_CARDS,
  FOUNDATION_CARD,
  FRAMEWORKS,
  GUIDED_PATHS,
  HERO_LINKS,
  promptProps,
} from './docs-home-links';
import { mutedText } from './docs-home-tokens';

// Dashed underline for the hero links: 2px dashes on a 4px rhythm, offset 1px
// to match the Figma line. It spans the link, so it follows the text when the
// font size or fallback font changes.
const heroLinkUnderline =
  'absolute inset-x-0 bottom-0 h-px text-gray-new-50 [background-image:repeating-linear-gradient(to_right,currentColor_0_2px,transparent_2px_4px)] [background-position:-1px_0]';

// Child props that give a docs card a copy-prompt button.
const copyPromptProps = (item) => {
  const { src, text } = promptProps(item);
  return src ? { copyPromptSrc: src } : { copyPromptText: text };
};

// Section introductions sit beside their content, stacking when the page narrows.
const Section = ({ heading, description, children }) => (
  <section className="grid grid-cols-[240px_minmax(0,1fr)] items-start gap-x-14 border-t border-gray-new-90 pt-14 pb-24 @max-[900px]:grid-cols-1 @max-[900px]:gap-y-6 dark:border-gray-new-20 xl:gap-x-10 md:pt-10 md:pb-16">
    <div className="grid content-start gap-2">
      <h2 className="m-0 font-sans text-[26px] leading-tight font-medium tracking-[-0.04em] text-balance dark:text-white md:text-2xl">
        {heading}
      </h2>
      {description && (
        <span className={cn('text-base leading-[1.5] opacity-90', mutedText)}>{description}</span>
      )}
    </div>
    <div className="@container min-w-0">{children}</div>
  </section>
);

Section.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};

// Full-width Postgres foundation card from the Figma content container.
const FoundationCard = () => (
  <div
    className={cn(
      'group relative flex min-h-[142px] items-end justify-between gap-6 border p-4 transition-colors hover:border-green-44 @max-[680px]:flex-col @max-[680px]:items-start @max-[680px]:gap-5',
      'border-green-44/70 bg-[#E4F1EB]/40 dark:border-green-44/30 dark:bg-[#101815]'
    )}
  >
    <NextLink
      href={FOUNDATION_CARD.to}
      aria-label={FOUNDATION_CARD.title}
      className="absolute inset-0"
    />
    <PromptCopyButton
      className="absolute top-[13px] right-[15px]"
      label={FOUNDATION_CARD.title}
      {...promptProps(FOUNDATION_CARD)}
    />
    <div className="flex min-w-0 flex-col gap-8">
      <span className="flex items-center gap-3 text-green-44 dark:text-green-52">
        <DatabaseIcon className="size-6 shrink-0 [&_*]:[stroke-width:1.5] [&_*]:[stroke-linecap:round] [&_*]:[stroke-linejoin:round] [&_*]:[vector-effect:non-scaling-stroke]" />
        <span className="font-mono text-xs leading-4 font-medium tracking-[0.02em] uppercase">
          {FOUNDATION_CARD.product}
        </span>
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="font-sans text-lg leading-snug font-medium tracking-[-0.02em] text-black-pure transition-colors duration-200 group-focus-within:text-green-44 group-hover:text-green-44 dark:text-white dark:group-focus-within:text-green-52 dark:group-hover:text-green-52">
          {FOUNDATION_CARD.title}
        </span>
        <span className="text-[15px] leading-snug text-gray-new-45 dark:text-gray-new-60">
          {FOUNDATION_CARD.line}
        </span>
      </div>
    </div>
    <div className="relative z-10 flex shrink-0 gap-2">
      {[
        ['Connect', '/docs/connect/connect-hub'],
        ['Branching', '/docs/introduction/branching'],
      ].map(([label, to]) => (
        <Link
          key={label}
          to={to}
          className="flex items-center gap-1.5 rounded-full border border-green-44/50 bg-white px-3 py-1.5 text-sm leading-5 tracking-[-0.01em] text-[#1A1A1A] transition-colors hover:border-green-44 hover:bg-green-44/5 dark:border-gray-new-40 dark:bg-white/[0.02] dark:text-white dark:hover:border-gray-new-60"
        >
          {label}
          <span
            className="font-mono text-[13px] leading-5 font-medium tracking-normal text-green-44 dark:text-green-52"
            aria-hidden
          >
            →
          </span>
        </Link>
      ))}
    </div>
  </div>
);

// Match the reference's 1200px page while keeping the mobile container gutters.
const DocsHome = () => (
  <div className="@container w-full min-w-0 font-sans tracking-[-0.02em] text-black-pure dark:bg-black-pure dark:text-white">
    <div className="@container w-full max-w-[1200px] px-[clamp(0px,2cqi,24px)] lg:px-0">
      {/* The intro and composer share the hero row on wide screens. */}
      <section className="grid grid-cols-[minmax(0,47fr)_minmax(0,53fr)] items-start gap-x-16 gap-y-10 pt-0 pb-24 @max-[900px]:grid-cols-1 xl:gap-x-10 xl:pt-3 lg:py-16 md:py-14">
        <div className="grid content-start gap-6">
          {/*
            Heading unit: the docs label as the H1, with the product descriptor
            as a calm subhead held close beneath it. The links sit a step below.
          */}
          <div className="grid gap-3">
            <h1 className="m-0 font-sans text-[40px] leading-[1.25] font-medium tracking-[-0.04em] text-balance md:text-[36px]">
              Neon Docs
            </h1>
            <p className="m-0 text-lg leading-normal tracking-[-0.025em] [text-wrap:pretty] text-gray-new-30 dark:text-gray-new-80 md:text-base">
              Learn to build and scale apps with Neon&apos;s complete backend platform.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-base">
            {/* Each link has a copy-prompt button that shows on hover or focus. */}
            {HERO_LINKS.map((item) => (
              <span key={item.to} className="group/hero-link flex items-center gap-1.5">
                <Link
                  to={item.to}
                  className="relative text-base leading-8 text-gray-new-45 transition-colors hover:text-gray-new-30 dark:text-gray-new-70 dark:hover:text-white"
                >
                  {item.title}
                  <span className={heroLinkUnderline} aria-hidden />
                </Link>
                <PromptCopyButton
                  className="opacity-0 group-focus-within/hero-link:opacity-100 group-hover/hero-link:opacity-100 [@media(hover:none)]:opacity-100"
                  label={item.title}
                  {...promptProps(item)}
                />
              </span>
            ))}
          </div>
        </div>
        <DocsHomeComposer />
      </section>

      {/* Start building */}
      <Section
        heading="Start building"
        description="Add these to your app. Every capability runs on the same Postgres branch."
      >
        <div className="grid gap-5">
          <FoundationCard />
          {/*
            Capability cards rendered with the real docs card component
            (DetailIconCards), fed MDX-style <a> children, in the site's regular
            `green-flat` theme (the same green-tinted treatment the former
            docs front page used for its Products grid). The product name sits in
            a lockup line at the top of the card (icon + name, via the
            component's `lockup` prop), so the card keeps its task-first title
            while still teaching the product name. The eslint-disable keeps the
            component-only props (`description`, `icon`, `lockup`) from being
            stripped by `eslint --fix` as unknown DOM attributes.
          */}
          {/* eslint-disable react/no-unknown-property */}
          <DetailIconCards
            className="my-0! @max-[720px]:grid-cols-2 @max-[480px]:grid-cols-1"
            cols={3}
            theme="green-flat"
            appearance="home"
          >
            {CAPABILITY_CARDS.map((c) => (
              <a
                key={c.to}
                href={c.to}
                description={c.line}
                icon={c.icon}
                lockup={c.product}
                {...copyPromptProps(c)}
              >
                {c.title}
              </a>
            ))}
          </DetailIconCards>
          {/* eslint-enable react/no-unknown-property */}
        </div>
      </Section>

      {/* Frameworks */}
      <Section
        heading="Frameworks"
        description="Quickstart guides to connect Neon to your framework."
      >
        <CompactCards className="my-0!" cols={4} withToggler appearance="home">
          {/* All frameworks render here; CompactCards shows the first 12 and
              collapses the rest behind a Show more / Hide toggle, expanding in
              place instead of linking away. */}
          {FRAMEWORKS.map((f) => (
            <a key={f.name} href={f.to} title={f.name} icon={f.icon} {...copyPromptProps(f)}>
              {f.name}
            </a>
          ))}
        </CompactCards>
      </Section>

      {/* Coding agents */}
      <Section
        heading="Coding agents"
        description="Connect over MCP to create branches, run SQL, and read docs."
      >
        <div className="grid gap-8">
          <CompactCards className="my-0!" cols={2} appearance="home">
            {AGENTS.map((g) => (
              <a key={g.name} href={g.to} title={g.name} icon={g.icon} {...copyPromptProps(g)}>
                {g.name}
              </a>
            ))}
          </CompactCards>
          <div className="grid gap-2.5">
            <span className={cn('text-base leading-normal', mutedText)}>
              Point your agent at this Markdown index to find any doc.
            </span>
            <DocsHomeCopyChip label="/docs/llms.txt" url="https://neon.com/docs/llms.txt" />
          </div>
        </div>
      </Section>

      {/* Guided paths */}
      <Section
        heading="Guided paths"
        description="Step-by-step tutorials that build a complete backend."
      >
        {/* eslint-disable react/no-unknown-property */}
        <DetailIconCards
          className="my-0! @max-[720px]:grid-cols-2 @max-[480px]:grid-cols-1"
          cols={3}
          theme="green-flat"
          appearance="home"
        >
          {GUIDED_PATHS.map((p) => (
            <a key={p.to} href={p.to} description={p.line} icon={p.icon} {...copyPromptProps(p)}>
              {p.title}
            </a>
          ))}
        </DetailIconCards>
        {/* eslint-enable react/no-unknown-property */}
      </Section>
    </div>
  </div>
);

export default DocsHome;
