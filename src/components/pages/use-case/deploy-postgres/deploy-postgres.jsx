// @ts-check

'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { clsx } from 'clsx';
import React, { useState } from 'react';
import { useScramble } from 'use-scramble';

import Button from 'components/shared/button';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

const regions = {
  'aws-us-east-1': {
    name: 'US East (N. Virginia)',
  },
  'aws-us-east-2': {
    name: 'US East (Ohio)',
  },
  'aws-us-west-2': {
    name: 'US West (Oregon)',
  },
  'aws-eu-central-1': {
    name: 'Europe (Frankfurt)',
  },
  'aws-ap-southeast-1': {
    name: 'Asia Pacific (Singapore)',
  },
  'aws-ap-southeast-2': {
    name: 'Asia Pacific (Sydney)',
  },
  'azure-eastus2': {
    name: 'Azure US East 2',
  },
};

const maskPassword = (uri) => {
  const url = new URL(uri);
  const [username, password] = `${url.username}:${url.password}`.split(':');
  const maskedPassword = '*'.repeat(password.length);
  return uri.replace(`${username}:${password}`, `${username}:${maskedPassword}`);
};

const DeployPostgres = () => {
  const [formState, setFormState] = useState({
    isLoading: false,
    hasCreatedProject: false,
    error: null,
    data: {
      result: {
        timeToProvision: 0,
        project: { region_id: '' },
        connectionUri: '',
        hasCreatedProject: false,
      },
    },
  });
  const [token, setToken] = useState(null);

  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const { ref } = useScramble({
    text: formState.data.result.connectionUri && maskPassword(formState.data.result.connectionUri),
    range: [65, 99],
    speed: 1,
    tick: 1,
    step: 5,
    scramble: 5,
    seed: 2,
    chance: 1,
    overdrive: false,
    overflow: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return;

    setFormState((prev) => ({ ...prev, isLoading: true }));

    // @ts-ignore
    if (window.zaraz) {
      // @ts-ignore
      window.zaraz.track('Button Clicked', { text: 'Deploy Postgres database per tenant' });
    }

    try {
      const response = await fetch(`https://instant-postgres-api.pages.dev/postgres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cfTurnstileResponse: token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'An error occurred');
      }

      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        data,
        hasCreatedProject: true,
      }));
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-5 py-8">
      {/* Deploy Button */}
      <form className="flex flex-col gap-3 md:flex-row md:items-center" onSubmit={handleSubmit}>
        <Button
          type="submit"
          disabled={!token || formState.isLoading || formState.hasCreatedProject}
          className="pointer-events-auto relative !font-semibold tracking-tighter disabled:cursor-wait disabled:opacity-50"
          theme="secondary"
          size="xs"
        >
          {formState.isLoading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 animate-spin"
              role="img"
              aria-label="Loading"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : formState.hasCreatedProject ? (
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Copied to clipboard"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
              role="img"
              aria-label="Database"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5V19A9 3 0 0 0 21 19V5" />
              <path d="M3 12A9 3 0 0 0 21 12" />
            </svg>
          )}
          Deploy Postgres
        </Button>

        <Turnstile
          className="hidden"
          siteKey="0x4AAAAAAAa4q5vJcjGaJqL7"
          onSuccess={(token) => setToken(token)}
        />
      </form>

      <div className="w-full space-y-1.5">
        <div className="relative flex w-full max-w-4xl flex-col space-y-3 sm:overflow-hidden">
          <div className="relative z-10 rounded-[14px] bg-white bg-opacity-[0.03] p-1 backdrop-blur-[4px] xl:rounded-xl ">
            <div
              className="absolute inset-0 z-10 rounded-[inherit] border border-white/[0.04]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-[5px] z-10 rounded-[10px] border border-white/[0.04] mix-blend-overlay"
              aria-hidden="true"
            />
            <div className="z-20 flex h-9 gap-x-3.5 rounded-[10px] border-opacity-[0.05] bg-[#0c0d0d] pl-[18px] pt-2.5 tracking-extra-tight xl:rounded-lg xl:pl-4 lg:gap-x-3 md:gap-x-2.5 md:pl-[14px]">
              <span className="absolute left-0 top-1/2 h-[450px] w-px -translate-y-1/2" />
              <span
                className={clsx(
                  'relative mt-1.5 h-1.5 w-1.5 rounded-full shadow-[0px_0px_9px_0px_#4BFFC3] transition-[background-color,box-shadow] duration-300 xl:h-[5px] xl:w-[5px]',
                  formState.hasCreatedProject && 'bg-[#00E599]'
                )}
                aria-hidden="true"
              >
                <span className="absolute inset-px h-1 w-1 rounded-full bg-[#D9FDF1] opacity-70 blur-[1px]" />
              </span>

              {formState.hasCreatedProject ? (
                <span
                  ref={ref}
                  className="h-4 w-full overflow-clip bg-transparent font-mono text-xs text-white focus:outline-none"
                >
                  {formState.data.result.connectionUri}
                </span>
              ) : (
                <span className="h-4 w-full overflow-clip bg-transparent font-mono text-xs text-[#AFB1B6]/50 focus:outline-none">
                  postgresql://neondb_owner:v9wpX3xjEnKT@ep-misty-sound-a5169vmg.us-east-2.aws.neon.tech/neondb?sslmode=require
                </span>
              )}

              <div>
                {formState.hasCreatedProject && (
                  <div>
                    <button
                      className="absolute right-2 top-3 z-30 bg-[#0c0d0d]"
                      type="button"
                      aria-label={isCopied ? 'Copied' : 'Copy'}
                      disabled={isCopied}
                      onClick={() => handleCopy(formState.data.result.connectionUri)}
                    >
                      {isCopied ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {formState.hasCreatedProject && (
          <div className="flex items-center gap-1">
            <p className="animate-in fade-in fade-in-overlay slide-in-from-bottom font-mono text-xs leading-relaxed tracking-extra-tight text-white opacity-90">
              Provisioned in {formState.data.result.timeToProvision} ms in{' '}
              {regions[formState.data.result.project.region_id]?.name}. Instance will be
              automatically deleted after 5 minutes. Refreshing the page and clicking the button
              again will return the same connection string.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployPostgres;
