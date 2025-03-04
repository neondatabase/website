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
import { useState, useEffect, useMemo } from 'react';

import Button from 'components/shared/button';
import CheckIcon from 'icons/check.inline.svg';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import { emailRegexp } from 'utils/forms';

const REGIONS = {
  title: 'Request a new Provider / Region',
  description:
    "Looking for Neon in a different cloud provider or region? Select your preference below, and we'll notify you as soon as it's available.",
  placeholder: 'Select a region',
  buttonText: 'Request',
  options: [
    { id: 'af-south-1', name: 'AWS - Africa (Cape Town)' },
    { id: 'ap-east-1', name: 'AWS - Asia Pacific (Hong Kong)' },
    { id: 'ap-northeast-1', name: 'AWS - Asia Pacific (Tokyo)' },
    { id: 'ap-northeast-2', name: 'AWS - Asia Pacific (Seoul)' },
    { id: 'ap-northeast-3', name: 'AWS - Asia Pacific (Osaka)' },
    { id: 'ap-south-1', name: 'AWS - Asia Pacific (Mumbai)' },
    { id: 'ap-south-2', name: 'AWS - Asia Pacific (Hyderabad)' },
    { id: 'ap-southeast-3', name: 'AWS - Asia Pacific (Jakarta)' },
    { id: 'ap-southeast-4', name: 'AWS - Asia Pacific (Melbourne)' },
    { id: 'ca-central-1', name: 'AWS - Canada (Central)' },
    { id: 'ca-west-1', name: 'AWS - Canada West (Calgary)' },
    { id: 'cn-north-1', name: 'AWS - China (Beijing)' },
    { id: 'cn-northwest-1', name: 'AWS - China (Ningxia)' },
    { id: 'eu-central-2', name: 'AWS - Europe (Zurich)' },
    { id: 'eu-north-1', name: 'AWS - Europe (Stockholm)' },
    { id: 'eu-south-1', name: 'AWS - Europe (Milan)' },
    { id: 'eu-south-2', name: 'AWS - Europe (Spain)' },
    { id: 'eu-west-1', name: 'AWS - Europe (Ireland)' },
    { id: 'eu-west-2', name: 'AWS - Europe (London)' },
    { id: 'eu-west-3', name: 'AWS - Europe (Paris)' },
    { id: 'il-central-1', name: 'AWS - Israel (Tel Aviv)' },
    { id: 'me-central-1', name: 'AWS - Middle East (UAE)' },
    { id: 'me-south-1', name: 'AWS - Middle East (Bahrain)' },
    { id: 'sa-east-1', name: 'AWS - South America (Sao Paulo)' },
    { id: 'us-gov-east-1', name: 'AWS - AWS GovCloud (US-East)' },
    { id: 'us-gov-west-1', name: 'AWS - AWS GovCloud (US-West)' },
    { id: 'us-west-1', name: 'AWS - US West (N. California)' },
    { id: 'eastus', name: 'Azure - (US) East US' },
    { id: 'eastus2', name: 'Azure - (US) East US 2' },
    { id: 'southcentralus', name: 'Azure - (US) South Central US' },
    { id: 'westus2', name: 'Azure - (US) West US 2' },
    { id: 'westus3', name: 'Azure - (US) West US 3' },
    { id: 'australiaeast', name: 'Azure - (Asia Pacific) Australia East' },
    { id: 'southeastasia', name: 'Azure - (Asia Pacific) Southeast Asia' },
    { id: 'northeurope', name: 'Azure - (Europe) North Europe' },
    { id: 'swedencentral', name: 'Azure - (Europe) Sweden Central' },
    { id: 'uksouth', name: 'Azure - (Europe) UK South' },
    { id: 'westeurope', name: 'Azure - (Europe) West Europe' },
    { id: 'centralus', name: 'Azure - (US) Central US' },
    { id: 'southafricanorth', name: 'Azure - (Africa) South Africa North' },
    { id: 'centralindia', name: 'Azure - (Asia Pacific) Central India' },
    { id: 'eastasia', name: 'Azure - (Asia Pacific) East Asia' },
    { id: 'japaneast', name: 'Azure - (Asia Pacific) Japan East' },
    { id: 'koreacentral', name: 'Azure - (Asia Pacific) Korea Central' },
    { id: 'canadacentral', name: 'Azure - (Canada) Canada Central' },
    { id: 'francecentral', name: 'Azure - (Europe) France Central' },
    { id: 'germanywestcentral', name: 'Azure - (Europe) Germany West Central' },
    { id: 'italynorth', name: 'Azure - (Europe) Italy North' },
    { id: 'norwayeast', name: 'Azure - (Europe) Norway East' },
    { id: 'polandcentral', name: 'Azure - (Europe) Poland Central' },
    { id: 'spaincentral', name: 'Azure - (Europe) Spain Central' },
    { id: 'switzerlandnorth', name: 'Azure - (Europe) Switzerland North' },
    { id: 'mexicocentral', name: 'Azure - (Mexico) Mexico Central' },
    { id: 'uaenorth', name: 'Azure - (Middle East) UAE North' },
    { id: 'brazilsouth', name: 'Azure - (South America) Brazil South' },
    { id: 'israelcentral', name: 'Azure - (Middle East) Israel Central' },
    { id: 'qatarcentral', name: 'Azure - (Middle East) Qatar Central' },
    { id: 'centralusstage', name: 'Azure - (US) Central US (Stage)' },
    { id: 'eastusstage', name: 'Azure - (US) East US (Stage)' },
    { id: 'eastus2stage', name: 'Azure - (US) East US 2 (Stage)' },
    { id: 'northcentralusstage', name: 'Azure - (US) North Central US (Stage)' },
    { id: 'southcentralusstage', name: 'Azure - (US) South Central US (Stage)' },
    { id: 'westusstage', name: 'Azure - (US) West US (Stage)' },
    { id: 'westus2stage', name: 'Azure - (US) West US 2 (Stage)' },
    { id: 'asia', name: 'Azure - Asia' },
    { id: 'asiapacific', name: 'Azure - Asia Pacific' },
    { id: 'australia', name: 'Azure - Australia' },
    { id: 'brazil', name: 'Azure - Brazil' },
    { id: 'canada', name: 'Azure - Canada' },
    { id: 'europe', name: 'Azure - Europe' },
    { id: 'france', name: 'Azure - France' },
    { id: 'germany', name: 'Azure - Germany' },
    { id: 'global', name: 'Azure - Global' },
    { id: 'india', name: 'Azure - India' },
    { id: 'israel', name: 'Azure - Israel' },
    { id: 'italy', name: 'Azure - Italy' },
    { id: 'japan', name: 'Azure - Japan' },
    { id: 'korea', name: 'Azure - Korea' },
    { id: 'newzealand', name: 'Azure - New Zealand' },
    { id: 'norway', name: 'Azure - Norway' },
    { id: 'poland', name: 'Azure - Poland' },
    { id: 'qatar', name: 'Azure - Qatar' },
    { id: 'singapore', name: 'Azure - Singapore' },
    { id: 'southafrica', name: 'Azure - South Africa' },
    { id: 'sweden', name: 'Azure - Sweden' },
    { id: 'switzerland', name: 'Azure - Switzerland' },
    { id: 'uae', name: 'Azure - United Arab Emirates' },
    { id: 'uk', name: 'Azure - United Kingdom' },
    { id: 'unitedstates', name: 'Azure - United States' },
    { id: 'unitedstateseuap', name: 'Azure - United States EUAP' },
    { id: 'eastasiastage', name: 'Azure - (Asia Pacific) East Asia (Stage)' },
    { id: 'southeastasiastage', name: 'Azure - (Asia Pacific) Southeast Asia (Stage)' },
    { id: 'brazilus', name: 'Azure - (South America) Brazil US' },
    { id: 'eastusstg', name: 'Azure - (US) East US STG' },
    { id: 'northcentralus', name: 'Azure - (US) North Central US' },
    { id: 'westus', name: 'Azure - (US) West US' },
    { id: 'japanwest', name: 'Azure - (Asia Pacific) Japan West' },
    { id: 'jioindiawest', name: 'Azure - (Asia Pacific) Jio India West' },
    { id: 'centraluseuap', name: 'Azure - (US) Central US EUAP' },
    { id: 'eastus2euap', name: 'Azure - (US) East US 2 EUAP' },
    { id: 'westcentralus', name: 'Azure - (US) West Central US' },
    { id: 'southafricawest', name: 'Azure - (Africa) South Africa West' },
    { id: 'australiacentral', name: 'Azure - (Asia Pacific) Australia Central' },
    { id: 'australiacentral2', name: 'Azure - (Asia Pacific) Australia Central 2' },
    { id: 'australiasoutheast', name: 'Azure - (Asia Pacific) Australia Southeast' },
    { id: 'jioindiacentral', name: 'Azure - (Asia Pacific) Jio India Central' },
    { id: 'koreasouth', name: 'Azure - (Asia Pacific) Korea South' },
    { id: 'southindia', name: 'Azure - (Asia Pacific) South India' },
    { id: 'westindia', name: 'Azure - (Asia Pacific) West India' },
    { id: 'canadaeast', name: 'Azure - (Canada) Canada East' },
    { id: 'francesouth', name: 'Azure - (Europe) France South' },
    { id: 'germanynorth', name: 'Azure - (Europe) Germany North' },
    { id: 'norwaywest', name: 'Azure - (Europe) Norway West' },
    { id: 'switzerlandwest', name: 'Azure - (Europe) Switzerland West' },
    { id: 'ukwest', name: 'Azure - (Europe) UK West' },
    { id: 'uaecentral', name: 'Azure - (Middle East) UAE Central' },
    { id: 'brazilsoutheast', name: 'Azure - (South America) Brazil Southeast' },
    { id: 'asia-south1', name: 'GCP - Mumbai' },
    { id: 'asia-south2', name: 'GCP - Delhi' },
    { id: 'asia-east1', name: 'GCP - Changhua County' },
    { id: 'asia-east2', name: 'GCP - Hong Kong' },
    { id: 'asia-northeast1', name: 'GCP - Tokyo' },
    { id: 'asia-northeast2', name: 'GCP - Osaka' },
    { id: 'asia-northeast3', name: 'GCP - Seoul' },
    { id: 'asia-southeast1', name: 'GCP - Jurong West' },
    { id: 'australia-southeast1', name: 'GCP - Sydney' },
    { id: 'australia-southeast2', name: 'GCP - Melbourne' },
    { id: 'europe-central2', name: 'GCP - Warsaw' },
    { id: 'europe-north2', name: 'GCP - Hamina' },
    { id: 'europe-southwest1', name: 'GCP - Madrid' },
    { id: 'europe-west1', name: 'GCP - St. Ghislain' },
    { id: 'europe-west2', name: 'GCP - London' },
    { id: 'europe-west3', name: 'GCP - Frankfurt' },
    { id: 'europe-west4', name: 'GCP - Eemshaven' },
    { id: 'europe-west6', name: 'GCP - Zurich' },
    { id: 'europe-west8', name: 'GCP - Milan' },
    { id: 'europe-west9', name: 'GCP - Paris' },
    { id: 'northamerica-northeast1', name: 'GCP - Montréal' },
    { id: 'northamerica-northeast2', name: 'GCP - Toronto' },
    { id: 'southamerica-east1', name: 'GCP - Osasco' },
    { id: 'us-central1', name: 'GCP - Council Bluffs' },
    { id: 'us-east1', name: 'GCP - Moncks Corner' },
    { id: 'us-east4', name: 'GCP - Ashburn' },
    { id: 'us-west-1', name: 'GCP - Oregon' },
    { id: 'us-west2', name: 'GCP - Los Angeles' },
    { id: 'us-west3', name: 'GCP - Salt Lake City' },
  ],
  eventName: 'Region Requested',
  eventProps: {
    name: 'region_name',
    id: 'region_id',
  },
};

const EXTENSIONS = {
  title: 'Request a new extension',
  description: 'Looking for a specific extension in Neon? Suggest one using this form.',
  placeholder: 'Select an extension',
  buttonText: 'Request',
  options: [
    { name: 'aiven_extras' },
    { name: 'adminpack' },
    { name: 'amcheck' },
    { name: 'auth_delay' },
    { name: 'auto_explain' },
    { name: 'aws_commons' },
    { name: 'aws_lambda' },
    { name: 'aws_s3' },
    { name: 'basebackup_to_shell' },
    { name: 'basic_archive' },
    { name: 'bool_plperl' },
    { name: 'bool_plperlu' },
    { name: 'cstore_fdw' },
    { name: 'Citus' },
    { name: 'dblink' },
    { name: 'dict_xsyn' },
    { name: 'file_fdw' },
    { name: 'flow_control' },
    { name: 'hstore_plperl' },
    { name: 'hstore_plperlu' },
    { name: 'http' },
    { name: 'jsonb_plperl' },
    { name: 'jsonb_plperlu' },
    { name: 'log_fdw' },
    { name: 'mongo_fdw' },
    { name: 'Multicorn' },
    { name: 'mysql_fdw' },
    { name: 'old_snapshot' },
    { name: 'oracle_fdw' },
    { name: 'orafce' },
    { name: 'pageinspect' },
    { name: 'passwordcheck' },
    { name: 'pg_anon' },
    { name: 'pg_bigm' },
    { name: 'pg_buffercache' },
    { name: 'pg_freespacemap' },
    { name: 'pg_parquet' },
    { name: 'pg_proctab' },
    { name: 'pg_similarity' },
    { name: 'pgSphere' },
    { name: 'pg_surgery' },
    { name: 'pg_transport' },
    { name: 'pg_visibility' },
    { name: 'pg_walinspect' },
    { name: 'pg_bulkload' },
    { name: 'pg_prometheus' },
    { name: 'pglogical' },
    { name: 'pldebugger' },
    { name: 'pljava' },
    { name: 'plperl' },
    { name: 'plperlu' },
    { name: 'plprofiler' },
    { name: 'pltcl' },
    { name: 'PL/Proxy' },
    { name: 'PostPic' },
    { name: 'Postgres_fdw' },
    { name: 'postgis_legacy' },
    { name: 'pgaudit' },
    { name: 'PgMemcache' },
    { name: 'rds_tools' },
    { name: 'sepgsql' },
    { name: 'sslinfo' },
    { name: 'tds_fdw' },
    { name: 'test_decoding' },
    { name: 'test_parser' },
    { name: 'Texcaller' },
    { name: 'timetravel' },
    { name: 'uuid' },
    { name: 'ZomboDB' },
  ],
  extendedOptions: true,
  eventName: 'Extension Requested',
  eventProps: {
    name: 'extension_name',
  },
};

const DATA = {
  region: REGIONS,
  extension: EXTENSIONS,
};

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const RequestForm = ({ type }) => {
  const { title, description, placeholder, buttonText, options, extendedOptions } = DATA[type];

  const isRecognized = !!getCookie('ajs_user_id');
  const [selected, setSelected] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const filteredOptions = useMemo(() => {
    if (query === '') return options;
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(query.toLowerCase()) ||
        option.id?.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  const matchingOption = useMemo(
    () => filteredOptions.find((option) => option.name.toLowerCase() === query.toLowerCase()),
    [filteredOptions, query]
  );

  useEffect(() => {
    // Form is valid if an option is selected and either user is recognized or valid email is given
    setIsValid(!!selected && (isRecognized || emailRegexp.test(email)));
  }, [selected, email, isRecognized]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid) {
      if (window.zaraz) {
        const { eventName, eventProps } = DATA[type];
        const eventData = {
          [eventProps.name]: selected.name,
        };
        if (eventProps.id && selected.id) {
          eventData[eventProps.id] = selected.id;
        }
        if (!isRecognized && email) {
          window.zaraz.track('identify', { email });
        }
        window.zaraz.track(eventName, eventData);
      }
      setIsSent(true);
    }
  };

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
      {!isSent ? (
        <form
          className="mt-6 flex items-end gap-4 md:flex-col md:items-start"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 md:w-full">
            <Combobox
              value={selected}
              immediate
              onChange={(value) => {
                console.log('Selected:', value);
                setSelected(value);
              }}
              onClose={() => setQuery('')}
            >
              <div className="relative">
                <ComboboxInput
                  className={clsx(
                    'h-10 w-full rounded border-none bg-gray-new-94 py-3 pl-4 pr-8 xl:text-sm',
                    'focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-1 data-[focus]:outline-gray-new-70',
                    'dark:bg-gray-new-15 dark:data-[focus]:outline-gray-new-30'
                  )}
                  displayValue={(option) => option?.name}
                  autoComplete="off"
                  placeholder={placeholder}
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
                {filteredOptions.map((option, index) => (
                  <ComboboxOption
                    key={index}
                    value={option}
                    className={clsx(
                      'group flex min-h-10 cursor-pointer select-none flex-wrap items-center gap-1.5 px-4 py-2 text-sm data-[focus]:bg-gray-new-94',
                      'dark:data-[focus]:bg-gray-new-15'
                    )}
                  >
                    {option.name}
                    {option.id && (
                      <code
                        className={clsx(
                          'whitespace-nowrap rounded-sm bg-gray-new-90 px-1.5 py-1 text-xs leading-none',
                          'dark:bg-gray-new-20'
                        )}
                      >
                        {option.id}
                      </code>
                    )}
                  </ComboboxOption>
                ))}
                {extendedOptions && query !== '' && !matchingOption && (
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
                'focus:outline focus:-outline-offset-1 focus:outline-gray-new-70',
                'dark:bg-gray-new-15 dark:focus:outline-gray-new-30'
              )}
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <Button
            className={clsx(
              'px-6 py-3 font-semibold leading-none md:w-full',
              !isValid && 'pointer-events-none select-none opacity-70'
            )}
            type="submit"
            theme="primary"
            disabled={!isValid}
          >
            {buttonText}
          </Button>
        </form>
      ) : (
        <div className="mt-6 flex min-h-10 items-center gap-2 sm:min-h-0 sm:items-start">
          <CheckIcon className="-mt-1 size-4 shrink-0 text-green-45 sm:mt-1" aria-hidden />
          <p className="text-[17px] font-light">Request logged. We appreciate your feedback!</p>
        </div>
      )}
    </figure>
  );
};

RequestForm.propTypes = {
  type: PropTypes.oneOf(Object.keys(DATA)).isRequired,
};

export default RequestForm;
