'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

const SERVICES = [
  {
    id: 'data-api',
    title: 'Data API',
    description: 'Query the database over HTTPS. Stays enabled after claim.',
  },
  {
    id: 'auth',
    title: 'Managed Better Auth',
    description: 'Add authentication. Stays enabled after claim.',
  },
];

const CODE_EXAMPLES = {
  agent: `GET https://neon.com/auth.md

POST https://claimable.neon.tech/v1/agent/identity
Content-Type: application/json

{
  "type": "anonymous",
  "capabilities": ["postgres", "data_api"]
}`,
  cli: `npx neon@latest claim create \\
  --service data-api \\
  --env-pull

neon branches list
neon claim accept`,
  config: `import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  dataApi: true,
});`,
};

const CopyButton = ({ value, label = 'Copy' }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(1600);

  return (
    <button
      className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-new-70 transition-colors hover:border-white/30 hover:text-white"
      type="button"
      onClick={() => handleCopy(value)}
    >
      {isCopied ? 'Copied' : label}
    </button>
  );
};

CopyButton.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
};

const Credential = ({ label, value }) => (
  <div>
    <div className="mb-2 flex items-center justify-between gap-4">
      <span className="text-xs font-medium tracking-wide text-gray-new-50 uppercase">{label}</span>
      <CopyButton value={value} />
    </div>
    <code className="block overflow-x-auto rounded-lg border border-white/10 bg-black-pure/70 px-3.5 py-3 text-[13px] leading-relaxed text-green-45">
      {value}
    </code>
  </div>
);

Credential.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const CAPABILITY_LABELS = {
  postgres: 'Lakebase Postgres',
  data_api: 'Data API',
  auth: 'Managed Better Auth',
};

const capabilityLabel = (name) => CAPABILITY_LABELS[name] ?? name.replaceAll('_', ' ');

const Capability = ({ name, granted }) => (
  <span
    className={`rounded-full border px-2.5 py-1 text-xs ${
      granted
        ? 'border-green-45/30 bg-green-45/10 text-green-45'
        : 'border-white/10 text-gray-new-50'
    }`}
  >
    {capabilityLabel(name)}
  </span>
);

Capability.propTypes = {
  name: PropTypes.string.isRequired,
  granted: PropTypes.bool.isRequired,
};

const Provisioner = () => {
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [state, setState] = useState({ status: 'idle' });

  const toggleService = (service) => {
    setSelectedServices((current) => {
      const next = new Set(current);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  };

  const createProject = async () => {
    setState({ status: 'loading' });
    try {
      const response = await fetch('/api/claimable-neon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: [...selectedServices] }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(
          body?.error?.message ||
            body?.error ||
            `Project creation failed with HTTP ${response.status}.`
        );
      }
      setState({ status: 'success', result: body });
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'The project could not be created.',
      });
    }
  };

  if (state.status === 'success') {
    const { capabilities, claim, credentials, project } = state.result;
    const formatTime = (value) =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value));
    const expiresAt = formatTime(project.expires_at);
    const granted = new Set(
      capabilities.filter(({ granted }) => granted).map(({ capability }) => capability)
    );
    const denied = capabilities.filter(({ granted }) => !granted);
    const stayEnabled = [
      granted.has('auth') ? 'Managed Better Auth' : null,
      granted.has('data_api') ? 'the Data API' : null,
    ].filter(Boolean);
    const stayEnabledSentence =
      stayEnabled.length === 0
        ? ''
        : stayEnabled.length === 1
          ? ` ${stayEnabled[0][0].toUpperCase()}${stayEnabled[0].slice(1)} stays enabled.`
          : ` ${stayEnabled.join(' and ')} stay enabled.`;

    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-green-45/30 bg-[#0b1311] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.45)] md:p-5"
        role="status"
        aria-live="polite"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-45 to-transparent" />
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-green-45">Project ready</p>
            <h2 className="mt-1 font-title text-2xl tracking-tight">Connect your agent</h2>
          </div>
          <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-xs text-gray-new-60">
            {project.id}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {capabilities.map(({ capability, granted }) => (
            <Capability key={capability} name={capability} granted={granted} />
          ))}
        </div>
        {denied.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm leading-relaxed text-gray-new-60">
            {denied.map(({ capability, reason, message }) => (
              <li key={capability}>
                {capabilityLabel(capability)} was not granted
                {message || reason ? `: ${message || reason}` : '.'}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 space-y-5">
          <Credential label="DATABASE_URL" value={credentials.database_url} />
          {credentials.services.data_api?.url && (
            <Credential label="NEON_DATA_API_URL" value={credentials.services.data_api.url} />
          )}
          {credentials.services.auth?.base_url && (
            <Credential label="NEON_AUTH_BASE_URL" value={credentials.services.auth.base_url} />
          )}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm leading-relaxed text-gray-new-70">
            Copy these values now. This page will not show them again. The claim link expires in{' '}
            {Math.round(claim.expires_in / 60)} minutes. Open it before then. Claiming rotates{' '}
            <code>DATABASE_URL</code>; pull a new one from the console after you claim.
            {stayEnabledSentence} The project itself expires on {expiresAt}.
          </p>
          <Button
            className="mt-4 w-full"
            size="new"
            theme="primary"
            to={claim.verification_uri_complete}
            target="_blank"
            rel="noreferrer"
          >
            Claim this project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.45)] backdrop-blur md:p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div>
        <p className="text-sm font-medium text-green-45">Provision from this page</p>
        <h2 className="mt-1 font-title text-2xl tracking-tight">Choose your backend</h2>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-green-45/25 bg-green-45/[0.06] p-4">
          <div>
            <p className="font-medium">Lakebase Postgres</p>
            <p className="mt-1 text-sm text-gray-new-60">
              A temporary database is always included.
            </p>
          </div>
          <span className="rounded-full bg-green-45 px-2.5 py-1 text-xs font-semibold text-black">
            Included
          </span>
        </div>

        {SERVICES.map((service) => {
          const isSelected = selectedServices.has(service.id);
          return (
            <button
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? 'border-green-45/40 bg-green-45/[0.06]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/25'
              }`}
              type="button"
              key={service.id}
              aria-pressed={isSelected}
              onClick={() => toggleService(service.id)}
            >
              <span>
                <span className="block font-medium">{service.title}</span>
                <span className="mt-1 block text-sm text-gray-new-60">{service.description}</span>
              </span>
              <span
                className={`relative ml-4 h-6 w-11 shrink-0 rounded-full transition-colors ${
                  isSelected ? 'bg-green-45' : 'bg-white/15'
                }`}
                aria-hidden
              >
                <span
                  className={`absolute top-1 size-4 rounded-full bg-black transition-transform ${
                    isSelected ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>

      {state.status === 'error' && (
        <div
          className="mt-4 rounded-lg border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 px-3.5 py-3 text-sm leading-relaxed text-[#ff9a9a]"
          role="alert"
        >
          {state.message}
        </div>
      )}

      <Button
        className="mt-6 w-full disabled:cursor-wait disabled:opacity-60"
        size="new"
        theme="primary"
        type="button"
        disabled={state.status === 'loading'}
        handleClick={createProject}
      >
        {state.status === 'loading' ? 'Creating project…' : 'Create a project'}
      </Button>

      <p className="mt-3 text-center text-xs leading-relaxed text-gray-new-50">
        No account or payment details required. Unclaimed projects expire in 72 hours and are capped
        at 100 MB storage and 1 GB transfer.
      </p>
    </div>
  );
};

const InterfaceCard = ({ eyebrow, title, description, code }) => (
  <article className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-5">
    <div className="flex items-start justify-between gap-3">
      <p className="font-mono text-xs tracking-wide text-green-45 uppercase">{eyebrow}</p>
      <CopyButton value={code} />
    </div>
    <h3 className="mt-3 font-title text-2xl tracking-tight">{title}</h3>
    <p className="mt-2 min-h-12 text-sm leading-relaxed text-gray-new-60">{description}</p>
    <div className="mt-5 min-w-0 grow rounded-xl border border-white/10 bg-black-pure/70 p-4">
      <pre className="overflow-x-auto font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-gray-new-70">
        <code>{code}</code>
      </pre>
    </div>
  </article>
);

InterfaceCard.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
};

const ClaimableNeon = () => (
  <>
    <section className="relative overflow-hidden pt-[150px] safe-paddings pb-24 xl:pt-32 lg:pt-20 md:pt-14 md:pb-16">
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-green-45/[0.08] blur-[130px]"
        aria-hidden
      />
      <Container size="1280">
        <div className="relative grid grid-cols-[minmax(0,1fr)_minmax(420px,0.82fr)] items-center gap-20 xl:gap-12 lg:grid-cols-1 lg:gap-14">
          <div className="max-w-[700px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-gray-new-70">
              <span className="size-1.5 rounded-full bg-green-45 shadow-[0_0_12px_#00e599]" />
              Claimable Neon
            </div>
            <h1 className="mt-7 font-title text-[72px] leading-[0.94] font-medium tracking-[-0.055em] xl:text-[64px] lg:text-[56px] md:text-[44px] sm:text-[38px]">
              A project when your agent needs one.
            </h1>
            <p className="mt-6 max-w-[620px] text-xl leading-relaxed tracking-tight text-gray-new-60 xl:text-lg md:text-base">
              Agents can provision a Neon project before a human creates an account. Start building,
              then claim the project into a Neon organization before it expires.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button size="new" theme="white-filled" to="#provision" tagName="Claimable Neon Hero">
                Create a project
              </Button>
              <Link
                className="text-sm font-medium"
                to="/docs/reference/claimable-neon"
                theme="green"
                withArrow
              >
                Read the docs
              </Link>
            </div>
            <div className="mt-10 grid max-w-[640px] grid-cols-3 gap-3 sm:grid-cols-1">
              {[
                ['01', 'Provision', 'Get scoped credentials'],
                ['02', 'Build', 'Use standard Postgres tools'],
                ['03', 'Claim', 'Transfer to your organization'],
              ].map(([number, title, description]) => (
                <div className="border-t border-white/10 pt-3" key={number}>
                  <span className="font-mono text-xs text-green-45">{number}</span>
                  <p className="mt-2 text-sm font-medium">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-new-50">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <div id="provision" className="scroll-mt-24">
            <Provisioner />
          </div>
        </div>
      </Container>
    </section>

    <section className="border-y border-white/10 bg-white/[0.015] py-24 safe-paddings md:py-16">
      <Container size="1280">
        <div className="max-w-[760px]">
          <p className="font-mono text-xs tracking-wide text-green-45 uppercase">
            One service, three interfaces
          </p>
          <h2 className="mt-4 font-title text-5xl tracking-[-0.04em] xl:text-4xl md:text-[34px]">
            auth.md, the Neon CLI and neon.ts
          </h2>
          <p className="mt-5 max-w-[680px] text-lg leading-relaxed text-gray-new-60 md:text-base">
            The same scoped agent credential works through the Claimable Neon API, Neon CLI, and{' '}
            <code>neon.ts</code>.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-5 xl:grid-cols-1">
          <InterfaceCard
            eyebrow="auth.md"
            title="Discover and register"
            description="Start from one text document, request capabilities, and exchange the identity assertion for short-lived access tokens."
            code={CODE_EXAMPLES.agent}
          />
          <InterfaceCard
            eyebrow="Neon CLI"
            title="Use existing commands"
            description="Create a claimable project once. Branch, query, and configure it with the same CLI commands used by account-backed projects."
            code={CODE_EXAMPLES.cli}
          />
          <InterfaceCard
            eyebrow="neon.ts"
            title="Declare services"
            description="If neon.ts is present, neon claim create requests its declared services. Unsupported pre-claim services return capability_requires_claim."
            code={CODE_EXAMPLES.config}
          />
        </div>
      </Container>
    </section>

    <section className="py-24 safe-paddings md:py-16">
      <Container size="960">
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-20 lg:grid-cols-1 lg:gap-10">
          <div>
            <p className="font-mono text-xs tracking-wide text-green-45 uppercase">Claim</p>
            <h2 className="mt-4 font-title text-4xl tracking-[-0.04em] md:text-[32px]">
              One project, a claim link, an expiry
            </h2>
          </div>
          <div className="space-y-8">
            {[
              [
                'Scoped from the first request',
                'The service creates one project and issues credentials for that project.',
              ],
              [
                'Human ownership starts at claim',
                'A short-lived claim link starts a project transfer into the Neon organization selected by the human.',
              ],
              [
                'Unclaimed projects expire',
                'Unclaimed projects expire in 72 hours and are capped at 100 MB storage and 1 GB transfer. Claim the project before then to keep it. Claiming rotates the database password; Auth and the Data API stay enabled.',
              ],
            ].map(([title, description], index) => (
              <div className="grid grid-cols-[36px_1fr] gap-4" key={title}>
                <span className="font-mono text-sm text-green-45">0{index + 1}</span>
                <div>
                  <h3 className="text-lg font-medium">{title}</h3>
                  <p className="mt-2 leading-relaxed text-gray-new-60">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  </>
);

export default ClaimableNeon;
