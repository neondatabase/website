'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useId, useRef, useState } from 'react';

import Button from 'components/shared/button';
import Tooltip from 'components/shared/tooltip';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopiedIcon from 'icons/home/copied.inline.svg';
import authIcon from 'images/pages/claimable-neon/hero/auth.svg';
import copyIcon from 'images/pages/claimable-neon/hero/copy.svg';
import dataApiIcon from 'images/pages/claimable-neon/hero/data-api.svg';
import postgresIcon from 'images/pages/claimable-neon/hero/postgres.svg';
import formPattern from 'images/pages/contact-sales/form-pattern.png';
import { cn } from 'utils/cn';

const SERVICES = [
  {
    id: 'data-api',
    title: 'Data API',
    description: 'Query over HTTPS. Stays enabled after claim.',
    icon: dataApiIcon,
    iconClassName: 'size-5',
  },
  {
    id: 'auth',
    title: 'Managed Better Auth',
    description: 'Add authentication. Stays enabled after claim.',
    icon: authIcon,
    iconClassName: 'size-7',
  },
];

const CAPABILITY_LABELS = {
  postgres: 'Lakebase Postgres',
  data_api: 'Data API',
  auth: 'Managed Better Auth',
};

const INCLUDED_CAPABILITY_LABELS = {
  ...CAPABILITY_LABELS,
  auth: 'Auth',
};

const capabilityListFormatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const DENIED_REASON_COPY = {
  requires_claim: 'Claim the project to enable it.',
};

const capabilityLabel = (name) => CAPABILITY_LABELS[name] ?? name.replaceAll('_', ' ');

const includedCapabilityLabel = (name) => INCLUDED_CAPABILITY_LABELS[name] ?? capabilityLabel(name);

const provisionErrorMessage = (error) => {
  if (!(error instanceof Error)) return 'The project could not be created.';
  if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
    return 'The project could not be created. Check your connection and try again.';
  }
  return error.message;
};

const FormPanel = ({ children, className, ...props }) => (
  <div
    className={cn(
      'relative isolate flex min-h-149.5 min-w-0 flex-col overflow-hidden border border-gray-new-20 bg-black-pure/80 px-8 pt-7 pb-9 backdrop-blur-md xl:px-6 md:min-h-0 md:px-5 md:py-6',
      className
    )}
    {...props}
  >
    {children}
    <Image
      className="pointer-events-none absolute right-0 bottom-0 -z-10 h-57 w-144 max-w-none [mask-image:linear-gradient(to_right,transparent,black)] md:-right-5 md:-bottom-2.75 md:h-auto md:w-120"
      src={formPattern}
      alt=""
      width={576}
      height={228}
      priority
    />
  </div>
);

FormPanel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const CopyButton = ({ value, label = 'Copy', ariaLabel }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(1600);

  return (
    <button
      className="flex size-7 shrink-0 items-center justify-center border border-gray-new-20 bg-black-pure/70 text-gray-new-80 transition-colors hover:border-gray-new-60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      type="button"
      aria-label={isCopied ? 'Copied' : (ariaLabel ?? label)}
      onClick={() => handleCopy(value)}
    >
      {isCopied ? (
        <CopiedIcon className="size-3.5" aria-hidden="true" />
      ) : (
        <Image className="size-3.5" src={copyIcon} width={14} height={14} alt="" />
      )}
      <span className="sr-only" aria-live="polite">
        {isCopied ? 'Copied' : label}
      </span>
    </button>
  );
};

CopyButton.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
};

const Credential = ({ label, value }) => (
  <div className="min-w-0">
    <p className="font-mono text-[0.9375rem] leading-snug tracking-extra-tight text-gray-new-90">
      {label}
    </p>
    <div className="mt-2 flex min-w-0 items-center gap-3 border border-gray-new-20 bg-black-new py-2.5 pr-2.5 pl-4">
      <code className="min-w-0 flex-1 truncate py-0.5 font-mono text-base leading-snug tracking-extra-tight text-gray-new-80">
        {value}
      </code>
      <CopyButton value={value} ariaLabel={`Copy ${label}`} />
    </div>
  </div>
);

Credential.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const ProvisionResult = ({ result, onReset }) => {
  const headingRef = useRef(null);
  const infoTooltipId = useId();
  const { capabilities, claim, credentials, project } = result;
  const [claimDeadline] = useState(() => Date.now() + claim.expires_in * 1000);
  const formatTime = (value) =>
    new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  const expiresAt = formatTime(project.expires_at);
  const claimExpiresAt = formatTime(claimDeadline);
  const granted = new Set(
    capabilities.filter(({ granted: isGranted }) => isGranted).map(({ capability }) => capability)
  );
  const denied = capabilities.filter(({ granted: isGranted }) => !isGranted);
  const includedCapabilities = capabilityListFormatter.format(
    capabilities
      .filter(({ granted: isGranted }) => isGranted)
      .map(({ capability }) => includedCapabilityLabel(capability))
  );
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

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <FormPanel role="status" aria-live="polite">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-2xl leading-snug font-medium tracking-tighter">Project ready</p>
        <span className="max-w-full rounded-full bg-gray-new-15/90 px-2 py-1 font-mono text-xs leading-none break-all text-gray-new-80">
          {project.id}
        </span>
      </div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-1 text-base leading-normal tracking-extra-tight text-gray-new-70 outline-none"
      >
        This project includes {includedCapabilities}.
      </h2>

      {denied.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm leading-normal text-gray-new-60">
          {denied.map(({ capability, reason }) => (
            <li key={capability}>
              {capabilityLabel(capability)} was not granted
              {DENIED_REASON_COPY[reason] ? `. ${DENIED_REASON_COPY[reason]}` : '.'}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 mb-7 flex flex-col gap-6">
        <Credential label="DATABASE_URL" value={credentials.database_url} />
        {credentials.services.data_api?.url && (
          <Credential label="NEON_DATA_API_URL" value={credentials.services.data_api.url} />
        )}
        {credentials.services.auth?.base_url && (
          <Credential label="NEON_AUTH_BASE_URL" value={credentials.services.auth.base_url} />
        )}
      </div>

      <div className="mt-auto border-t border-gray-new-20 pt-8">
        <div className="flex flex-wrap gap-4">
          <Button
            className="h-10 flex-1 px-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-10"
            size="new"
            theme="white-filled"
            to={claim.verification_uri_complete}
            target="_blank"
            rel="noreferrer"
          >
            Open the claim link
          </Button>
          <Button
            className="h-10 flex-1 px-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-10"
            size="new"
            theme="outlined-new"
            type="button"
            handleClick={onReset}
          >
            Create another project
          </Button>
        </div>
        <p className="mt-4 text-sm leading-normal tracking-extra-tight text-gray-new-60">
          Save these values now. This page will not show them again.{' '}
          <button
            className="border-b border-dashed border-white/40 text-gray-new-90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            type="button"
            data-tooltip-id={infoTooltipId}
          >
            More info.
          </button>
          <br />
          Claim deadline: {claimExpiresAt}. Project expires: {expiresAt}.
        </p>
        <Tooltip
          id={infoTooltipId}
          className="max-w-80"
          place="bottom"
          openEvents={{ mouseover: true, focus: true, click: true }}
          closeEvents={{ mouseout: true, blur: true }}
          globalCloseEvents={{ escape: true, clickOutsideAnchor: true }}
        >
          If the claim link expires, create another project from this page. Opening the claim link
          does not freeze access. Continuing to Neon on the claim page rotates{' '}
          <code>DATABASE_URL</code>. After the transfer finishes, pull a new one from the Neon
          console.
          {stayEnabledSentence}
        </Tooltip>
      </div>
    </FormPanel>
  );
};

ProvisionResult.propTypes = {
  onReset: PropTypes.func.isRequired,
  result: PropTypes.shape({
    capabilities: PropTypes.arrayOf(
      PropTypes.shape({
        capability: PropTypes.string.isRequired,
        granted: PropTypes.bool.isRequired,
        reason: PropTypes.string,
      })
    ).isRequired,
    claim: PropTypes.shape({
      expires_in: PropTypes.number.isRequired,
      verification_uri_complete: PropTypes.string.isRequired,
    }).isRequired,
    credentials: PropTypes.shape({
      database_url: PropTypes.string.isRequired,
      services: PropTypes.shape({
        data_api: PropTypes.shape({ url: PropTypes.string }),
        auth: PropTypes.shape({ base_url: PropTypes.string }),
      }).isRequired,
    }).isRequired,
    project: PropTypes.shape({
      id: PropTypes.string.isRequired,
      expires_at: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
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
          typeof body?.error?.message === 'string'
            ? body.error.message
            : `Project creation failed with HTTP ${response.status}.`
        );
      }
      setState({ status: 'success', result: body });
    } catch (error) {
      setState({
        status: 'error',
        message: provisionErrorMessage(error),
      });
    }
  };

  if (state.status === 'success') {
    return <ProvisionResult result={state.result} onReset={() => setState({ status: 'idle' })} />;
  }

  return (
    <FormPanel>
      <h2 className="text-2xl leading-snug font-medium tracking-tighter text-pretty">
        Configure your backend
      </h2>
      <p className="mt-1 max-w-97 text-[1.0625rem] leading-normal font-medium tracking-extra-tight text-pretty text-gray-new-70">
        Select the services to include in your project. Postgres is always included.
      </p>

      <div className="mt-8 divide-y divide-gray-new-20 border-y border-gray-new-20">
        <div className="flex items-center gap-3.5 py-6.5">
          <span className="flex size-10 shrink-0 items-center justify-center border border-gray-new-30 bg-gray-new-8">
            <Image
              className="size-7"
              src={postgresIcon}
              width={28}
              height={28}
              alt=""
              loading="eager"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg leading-none tracking-extra-tight text-gray-new-90 md:text-base/tight">
              Lakebase Postgres
            </p>
            <p className="mt-2 text-base leading-none tracking-extra-tight text-gray-new-60 md:text-sm/tight">
              A temporary database is always included.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-green-44 px-2 py-1 font-mono text-[0.6875rem] leading-none font-medium text-white uppercase sm:text-[0.625rem]">
            Included
          </span>
        </div>

        {SERVICES.map((service) => {
          const isSelected = selectedServices.has(service.id);
          return (
            <button
              className="group flex w-full items-center gap-3.5 py-6.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              type="button"
              key={service.id}
              aria-pressed={isSelected}
              onClick={() => toggleService(service.id)}
            >
              <span className="flex size-10 shrink-0 items-center justify-center border border-gray-new-30 bg-gray-new-8">
                <Image
                  className={service.iconClassName}
                  src={service.icon}
                  width={28}
                  height={28}
                  alt=""
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg leading-none tracking-extra-tight text-gray-new-90 md:text-base/tight">
                  {service.title}
                </span>
                <span className="mt-2 block text-base leading-none tracking-extra-tight text-gray-new-60 transition-colors group-hover:text-gray-new-80 md:text-sm/tight">
                  {service.description}
                </span>
              </span>
              <span
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
                  isSelected ? 'border-green-44 bg-green-44' : 'border-gray-new-40'
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white transition-transform',
                    isSelected && 'translate-x-5'
                  )}
                />
              </span>
            </button>
          );
        })}
      </div>

      {state.status === 'error' && (
        <div
          className="mt-5 border border-secondary-1/30 bg-secondary-1/10 px-3.5 py-3 text-sm leading-normal text-secondary-4"
          role="alert"
        >
          {state.message}
        </div>
      )}

      <Button
        className="mt-8 h-10 w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-60 lg:h-10"
        size="new"
        theme="white-filled"
        type="button"
        disabled={state.status === 'loading'}
        handleClick={createProject}
      >
        <span aria-live="polite">
          {state.status === 'loading' ? 'Creating project…' : 'Create a project'}
        </span>
      </Button>

      <p className="mt-4 max-w-118 text-sm leading-normal tracking-extra-tight text-pretty text-gray-new-60">
        No account or payment details required. Unclaimed projects expire in 72 hours and are capped
        at 100 MB storage and 1 GB transfer.
      </p>
    </FormPanel>
  );
};

export default Provisioner;
