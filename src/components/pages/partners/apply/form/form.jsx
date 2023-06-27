'use client';

import { Combobox } from '@headlessui/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button/button';
import Link from 'components/shared/link/link';
import Tooltip from 'components/shared/tooltip';
import LINKS from 'constants/links';

import AddIcon from '../images/add.inline.svg';
import ChevronIcon from '../images/chevron.inline.svg';
import infoSvg from '../images/info.svg';

const Field = ({
  className = null,
  label,
  name,
  type = 'text',
  placeholder,
  tag: Tag = 'input',
  tooltipId = null,
  tooltipContent = null,
}) => (
  <div className={clsx('flex flex-col', className)}>
    <label className="flex items-center" htmlFor="firstName">
      {label}
      {tooltipId && tooltipContent && (
        <>
          <a
            className="ml-1.5 flex items-center"
            id={tooltipId}
            data-tooltip-content={tooltipContent}
          >
            <img src={infoSvg} width={14} height={14} alt="" loading="lazy" aria-hidden />
          </a>
          <Tooltip anchorSelect={`#${tooltipId}`} />
        </>
      )}
    </label>
    <Tag
      className={clsx(
        'mt-3 appearance-none rounded bg-white bg-opacity-[0.04] px-4 placeholder:text-gray-new-40 focus:outline-none',
        Tag === 'textarea' ? 'py-3' : 'h-10'
      )}
      id={name}
      name={name}
      type={Tag === 'textarea' ? undefined : type}
      placeholder={placeholder}
    />
  </div>
);

Field.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  tag: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltipContent: PropTypes.string,
};

const integrationTypeOptions = [
  { id: 'oauth', name: 'OAuth' },
  { id: 'api', name: 'API' },
];

const applicationScopeOptions = [
  { id: '100', name: '100' },
  { id: '200', name: '200' },
];

const Select = ({ label, options }) => {
  const [selected, setSelected] = useState(options[0]);
  const [query, setQuery] = useState('');

  const filteredItems =
    query === ''
      ? options
      : options.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Combobox className="relative" value={selected} as="div" onChange={setSelected}>
      <Combobox.Label>{label}</Combobox.Label>

      <div className="relative mt-3">
        <Combobox.Input
          className="h-10 w-full appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15"
          displayValue={(selected) => selected.name}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
        <Combobox.Button className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center">
          <ChevronIcon className="h-4 w-4" />
        </Combobox.Button>
      </div>

      <Combobox.Options className="absolute top-full mt-1.5 flex w-full flex-col gap-y-3 rounded border border-gray-new-15 bg-[#1c1d1e] p-4">
        {filteredItems.map((item) => (
          <Combobox.Option
            className="cursor-pointer text-sm leading-none transition-colors duration-200 hover:text-green-45 ui-active:text-green-45"
            key={item.id}
            value={item}
          >
            {item.name}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const Form = ({ className }) => (
  <form
    className={clsx(className, 'flex flex-col gap-y-6 rounded-[10px] bg-gray-new-8 px-9 py-11')}
  >
    <Select
      label="What type of integration do you need? *"
      id="integration"
      options={integrationTypeOptions}
    />

    <div className="grid grid-cols-2 gap-5">
      <Field label="First Name *" name="firstName" placeholder="Marques" />
      <Field label="Last Name *" name="lastName" placeholder="Hansen" />
    </div>
    <div className="grid grid-cols-2 gap-5">
      <Field label="Email *" name="email" type="email" placeholder="info@acme.com" />
      <Field label="Company Name *" name="companyName" placeholder="Acme" />
    </div>
    <Field
      label="App Name"
      name="appName"
      tooltipId="app-name-tooltip"
      tooltipContent="This is a tooltip!"
    />

    <fieldset className="flex flex-col">
      <legend className="items-centers flex" htmlFor="firstName">
        Callback URLs {/* TODO: add tooltip */}
        <a
          className="ml-1.5 flex items-center"
          id="callback-urls-tooltip"
          data-tooltip-content="This is a tooltip!"
        >
          <img src={infoSvg} width={14} height={14} alt="" loading="lazy" aria-hidden />
        </a>
        <Tooltip anchorSelect="#callback-urls-tooltip" />
      </legend>
      <input
        className="mt-3 h-10 appearance-none rounded bg-white bg-opacity-[0.04] px-4 placeholder:text-gray-new-40 focus:outline-none"
        id="callbackUrl"
        name="callbackUrl"
        data-label="callbackUrl"
        type="text"
      />
      <button
        className="mt-3 flex items-center gap-x-2 text-green-45"
        type="button"
        onClick={() => {
          const callbackUrls = document.querySelectorAll('[data-label="callbackUrl"]');
          const callbackUrlsCount = callbackUrls.length;

          const lastCallbackUrl = callbackUrls[callbackUrlsCount - 1];
          const newCallbackUrl = lastCallbackUrl.cloneNode(true);
          const newCallbackUrlNumber = callbackUrlsCount + 1;
          newCallbackUrl.id = `callbackUrl${newCallbackUrlNumber}`;
          newCallbackUrl.name = `callbackUrl${newCallbackUrlNumber}`;
          newCallbackUrl.value = '';

          // add new callback url after the last one
          lastCallbackUrl.after(newCallbackUrl);
        }}
      >
        <AddIcon />
        Add another URL
      </button>
    </fieldset>
    <fieldset>
      <legend>Will you be making API calls from a backend?</legend>
      <div className="mt-3 flex items-center gap-x-8">
        <label className="flex items-center gap-x-[9px]" htmlFor="apiCallsYes">
          <input
            className="h-2 w-2 appearance-none rounded-full bg-transparent outline outline-offset-2 outline-gray-new-40 checked:bg-primary-1"
            type="radio"
            name="apiCalls"
            id="apiCallsYes"
            value="yes"
          />
          Yes
        </label>

        <label className="flex items-center gap-x-[9px]" htmlFor="apiCallsNo">
          <input
            className="h-2 w-2 appearance-none rounded-full bg-transparent outline outline-offset-2 outline-gray-new-40 checked:bg-primary-1"
            type="radio"
            name="apiCalls"
            id="apiCallsNo"
            value="no"
          />
          No
        </label>
      </div>
    </fieldset>
    <Select
      label="What application scope would you need?"
      id="applicationScope"
      options={applicationScopeOptions}
    />
    <Field
      label="Link to logo"
      name="linkToLogo"
      tooltipId="link-to-logo-tooltip"
      tooltipContent="This is a tooltip!"
    />
    <Field
      label="Additional details"
      name="additionalDetails"
      tag="textarea"
      placeholder="Message"
    />
    <Button
      className="mt-3 h-[52px] py-[17px] text-lg font-medium leading-none tracking-[-0.02em]"
      theme="primary"
      type="submit"
    >
      Apply now
    </Button>
    <p className="text-[15px] font-light leading-snug">
      By submitting you agree to the{' '}
      <Link
        className="text-green-45 underline decoration-green-45/40 decoration-1 underline-offset-[3px] transition-colors duration-200 hover:decoration-transparent"
        to={LINKS.termsOfService}
      >
        Terms Service
      </Link>{' '}
      and acknowledge the{' '}
      <Link
        className="inline-block text-green-45 underline decoration-green-45/40 decoration-1 underline-offset-[3px] transition-colors hover:decoration-transparent"
        to={LINKS.privacyPolicy}
      >
        Privacy Policy
      </Link>
      .
    </p>
  </form>
);

Form.propTypes = {
  className: PropTypes.string,
};

export default Form;
