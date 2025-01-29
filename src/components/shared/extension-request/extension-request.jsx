'use client';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';

import CheckIcon from 'icons/check.inline.svg';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import Button from '../button';

const DEFAULT_DATA = {
  title: 'Request a new extension',
  description: 'Looking for a specific extension in Neon? Suggest one using this form.',
  buttonText: 'Request',
  extensions: [
    'aiven_extras',
    'adminpack',
    'amcheck',
    'auth_delay',
    'auto_explain',
    'aws_commons',
    'aws_lambda',
    'aws_s3',
    'basebackup_to_shell',
    'basic_archive',
    'bool_plperl',
    'bool_plperlu',
    'cstore_fdw',
    'Citus',
    'dblink',
    'dict_xsyn',
    'file_fdw',
    'flow_control',
    'hstore_plperl',
    'hstore_plperlu',
    'http',
    'jsonb_plperl',
    'jsonb_plperlu',
    'log_fdw',
    'mongo_fdw',
    'Multicorn',
    'mysql_fdw',
    'old_snapshot',
    'oracle_fdw',
    'orafce',
    'pageinspect',
    'passwordcheck',
    'pg_anon',
    'pg_bigm',
    'pg_buffercache',
    'pg_freespacemap',
    'pg_proctab',
    'pg_similarity',
    'pgSphere',
    'pg_surgery',
    'pg_transport',
    'pg_visibility',
    'pg_walinspect',
    'pg_bulkload',
    'pg_prometheus',
    'pglogical',
    'pldebugger',
    'pljava',
    'plperl',
    'plperlu',
    'plprofiler',
    'pltcl',
    'PL/Proxy',
    'PostPic',
    'Postgres_fdw',
    'postgis_legacy',
    'pgaudit',
    'PgMemcache',
    'rds_tools',
    'sepgsql',
    'sslinfo',
    'tds_fdw',
    'test_decoding',
    'test_parser',
    'Texcaller',
    'timetravel',
    'uuid',
    'ZomboDB',
  ],
};

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const ExtensionRequest = ({
  title = DEFAULT_DATA.title,
  description = DEFAULT_DATA.description,
  buttonText = DEFAULT_DATA.buttonText,
  options = DEFAULT_DATA.extensions,
}) => {
  const isRecognized = !!getCookie('ajs_user_id');

  const [selected, setSelected] = useState();
  const [email, setEmail] = useState();
  const [requestComplete, setRequestComplete] = useState(false);
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));

  const matchingOption = filteredOptions.find(
    (option) => option.toLowerCase() === query.toLowerCase()
  );

  return (
    <figure
      className={clsx(
        'doc-cta not-prose my-5 rounded-[10px] border border-gray-new-94 bg-gray-new-98 px-7 py-6 sm:p-6',
        'dark:border-gray-new-15 dark:bg-gray-new-10'
      )}
    >
      <h2 className="!my-0 font-title text-2xl font-medium leading-dense tracking-extra-tight">
        {title}
      </h2>
      <p className="mt-2.5 font-light leading-tight text-gray-new-30 dark:text-gray-new-70">
        {description}
      </p>
      {requestComplete ? (
        <div className="mt-6 flex min-h-10 items-center gap-2 sm:min-h-0 sm:items-start">
          <CheckIcon className="-mt-1 size-4 shrink-0 text-green-45 sm:mt-1" aria-hidden />
          <p className="text-[17px] font-light">Request logged. We appreciate your feedback!</p>
        </div>
      ) : (
        <div className="mt-6 flex items-end gap-4 md:flex-col md:items-start">
          <div className="flex-1 md:w-full">
            <Combobox
              value={selected}
              immediate
              onChange={(value) => setSelected(value)}
              onClose={() => setQuery('')}
            >
              <div className="relative">
                <ComboboxInput
                  className={clsx(
                    'h-10 w-full rounded border-none bg-gray-new-94 py-3 pl-4 pr-8 xl:text-sm',
                    'focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-1 data-[focus]:outline-gray-new-70',
                    'dark:bg-gray-new-15 dark:data-[focus]:outline-gray-new-30'
                  )}
                  autoComplete="off"
                  placeholder="Select an extension"
                  onChange={(event) => setQuery(event.target.value)}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                  <ChevronIcon className="size-4 stroke-black-new dark:stroke-white" />
                </ComboboxButton>
              </div>
              <ComboboxOptions
                anchor="bottom"
                className={clsx(
                  'z-50 !max-h-[200px] w-[var(--input-width)] rounded border border-gray-new-94 bg-gray-new-98',
                  '[--anchor-gap:var(--spacing-1)] [--anchor-max-height:50vh] empty:invisible',
                  'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
                  'dark:border-gray-new-15 dark:bg-gray-new-10 dark:text-white'
                )}
                modal={false}
                transition
              >
                {filteredOptions.map((option) => (
                  <ComboboxOption
                    key={option}
                    value={option}
                    className={clsx(
                      'group flex min-h-10 cursor-pointer select-none flex-wrap items-center gap-1.5 px-4 py-2 text-sm data-[focus]:bg-gray-new-94',
                      'dark:data-[focus]:bg-gray-new-15'
                    )}
                  >
                    {option}
                  </ComboboxOption>
                ))}
                {query !== '' && !matchingOption && (
                  <ComboboxOption
                    value={query}
                    className={clsx(
                      'group flex min-h-10 cursor-pointer select-none flex-wrap items-center gap-1.5 px-4 py-2 text-sm data-[focus]:bg-gray-new-94',
                      'dark:data-[focus]:bg-gray-new-15'
                    )}
                  >
                    Other: {query}
                  </ComboboxOption>
                )}
              </ComboboxOptions>
            </Combobox>
          </div>
          {!isRecognized && (
            <input
              type="email"
              name="email"
              value={email}
              className={clsx(
                'remove-autocomplete-styles h-10 min-w-64 rounded border-none bg-gray-new-94 px-4 py-3 md:w-full',
                '2xl:min-w-52 xl:min-w-40 xl:text-sm',
                'focus:outline-1 focus:-outline-offset-1 focus:outline-gray-new-70',
                'dark:bg-gray-new-15 dark:focus:outline-gray-new-30'
              )}
              placeholder="Email (optional)"
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <Button
            className={clsx(
              'px-6 py-3 font-semibold leading-none md:w-full',
              !selected && 'pointer-events-none opacity-70'
            )}
            theme="primary"
            disabled={!selected}
            onClick={() => {
              if (selected) {
                if (window.zaraz) {
                  if (!isRecognized && email) {
                    window.zaraz.track('identify', { email });
                  }
                  window.zaraz.track('Extension Requested', { extension_name: selected });
                }
                setRequestComplete(true);
              }
            }}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </figure>
  );
};

ExtensionRequest.propTypes = {
  title: PropTypes.string,
  description: PropTypes.node,
  buttonText: PropTypes.string,
  options: PropTypes.array,
};

export default ExtensionRequest;
