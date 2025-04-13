'use client';

import clsx from 'clsx';
import { useState } from 'react';

import Button from 'components/shared/button';
import sendGtagEvent from 'utils/send-gtag-event';

const NON_POOLED_HOSTNAME_REGEX = /^ep-[a-z]+-[a-z]+-[a-z0-9]+\.us-east-2\.aws\.neon\.tech$/;
const POOLED_HOSTNAME_REGEX = /^ep-[a-z]+-[a-z]+-[a-z0-9]+-pooler\.us-east-2\.aws\.neon\.tech$/;

const DNSChecker = () => {
  const [hostname, setHostname] = useState('');
  const [isValidFormat, setIsValidFormat] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validateHostname = (value) =>
    NON_POOLED_HOSTNAME_REGEX.test(value) || POOLED_HOSTNAME_REGEX.test(value);

  const handleInputChange = (e) => {
    setHostname(e.target.value);
    setIsValidFormat(true);
    setResults(null);
    setError(null);
  };

  const checkLocalDNS = async (fullHostname) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      await fetch(`https://${fullHostname}/`, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors', // This allows the request to be sent even if CORS is not supported
      });

      clearTimeout(timeoutId);
      return { success: true };
    } catch (error) {
      if (
        error.name === 'TypeError' &&
        (error.message.includes('Failed to fetch') ||
          error.message.includes('Network request failed') ||
          error.message.includes('Network error'))
      ) {
        return { success: false, error: 'DNS resolution failed' };
      }

      return { success: true };
    }
  };

  const checkCloudflare = async (fullHostname) => {
    try {
      const response = await fetch(
        `https://1.1.1.1/dns-query?name=${encodeURIComponent(fullHostname)}&type=A`,
        {
          headers: {
            Accept: 'application/dns-json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`DNS query failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.Answer && data.Answer.length > 0,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateHostname(hostname)) {
      setIsValidFormat(false);
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        sendGtagEvent('Button Clicked', { text: 'Check DNS' });
      }

      setIsChecking(true);
      setResults(null);
      setError(null);

      const fullHostname = hostname;

      const localDNSResult = await checkLocalDNS(fullHostname);
      const cloudflareResult = await checkCloudflare(fullHostname);

      setResults({
        localDNS: localDNSResult,
        cloudflare: cloudflareResult,
      });
    } catch (err) {
      setError('An error occurred during DNS resolution checks');
      console.error('DNS check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    const { localDNS, cloudflare } = results;

    if (localDNS.success && cloudflare.success) {
      return (
        <div className="bg-green-900/20 border-green-700 mt-4 rounded-lg border p-4">
          <p className="text-green-400 font-medium">
            All looks good! No DNS name resolution issues detected.
          </p>
        </div>
      );
    }

    if (!localDNS.success && cloudflare.success) {
      return (
        <div className="bg-yellow-900/20 border-yellow-700 mt-4 rounded-lg border p-4">
          <p className="text-yellow-400 font-medium">
            Possible DNS resolution issue detected. Your local DNS settings may be preventing
            resolution.
          </p>
          <p className="mt-2 text-sm text-white">
            Please refer to our{' '}
            <a
              href="https://neon.tech/docs/connect/connection-errors#dns-resolution-issues"
              className="text-primary-1 hover:underline"
            >
              DNS troubleshooting guide
            </a>{' '}
            for help.
          </p>
        </div>
      );
    }

    if (!localDNS.success && !cloudflare.success) {
      return (
        <div className="mt-4 rounded-lg border border-secondary-1 bg-secondary-1/20 p-4">
          <p className="font-medium text-secondary-1">DNS resolution failed.</p>
          <p className="mt-2 text-sm text-white">
            Please verify your hostname or refer to our{' '}
            <a
              href="https://neon.tech/docs/connect/connection-errors#dns-resolution-issues"
              className="text-primary-1 hover:underline"
            >
              DNS troubleshooting guide
            </a>
            .
          </p>
        </div>
      );
    }

    if (localDNS.success && !cloudflare.success) {
      return (
        <div className="mt-4 rounded-lg border border-secondary-1 bg-secondary-1/20 p-4">
          <p className="font-medium text-secondary-1">Unexpected DNS resolution issue.</p>
          <p className="mt-2 text-sm text-white">
            Please verify your hostname or refer to our{' '}
            <a
              href="https://neon.tech/docs/connect/connection-errors#dns-resolution-issues"
              className="text-primary-1 hover:underline"
            >
              DNS troubleshooting guide
            </a>
            .
          </p>
        </div>
      );
    }
  };

  return (
    <div className="my-6 rounded-lg border border-gray-new-15 bg-gray-new-10 p-6">
      <form onSubmit={handleSubmit}>
        <label htmlFor="hostname-input" className="mb-2 block text-sm font-medium text-white">
          Enter your Neon hostname:
        </label>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <input
            id="hostname-input"
            type="text"
            placeholder="ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech"
            value={hostname}
            className={clsx(
              'block w-full flex-grow rounded-lg border bg-gray-new-15 p-2.5 text-sm focus:border-primary-1 focus:ring-primary-1',
              !isValidFormat ? 'border-secondary-1' : 'border-gray-new-20'
            )}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            theme="primary"
            size="md-new"
            className="flex-shrink-0 whitespace-nowrap px-8"
            disabled={isChecking || !hostname}
          >
            {isChecking ? (
              <>
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
                Checking...
              </>
            ) : (
              'Check DNS'
            )}
          </Button>
        </div>
        {!isValidFormat && (
          <p className="mt-2 text-sm text-secondary-1">
            Please enter a valid Neon hostname (e.g.,
            ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech or
            ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech)
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-secondary-1 bg-secondary-1/20 p-4">
            <p className="text-secondary-1">Error: {error}</p>
          </div>
        )}

        {renderResults()}

        <div className="mt-4 text-xs text-gray-new-60">
          <p>
            First check uses your default DNS settings, second check uses Cloudflare's public DNS
            resolver.
          </p>
        </div>
      </form>
    </div>
  );
};

export default DNSChecker;
