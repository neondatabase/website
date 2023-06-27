'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'components/shared/button/button';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import AddIcon from '../images/add.inline.svg';

const Field = ({
  className = null,
  label,
  name,
  type = 'text',
  placeholder,
  tag: Tag = 'input',
}) => (
  <div className={clsx('flex flex-col', className)}>
    <label htmlFor="firstName">{label}</label>
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
};

const Form = ({ className }) => (
  <form
    className={clsx(className, 'flex flex-col gap-y-6 rounded-[10px] bg-gray-new-8 px-9 py-11')}
  >
    <div className="flex flex-col">
      <label htmlFor="integrationType">What type of integration do you need? *</label>
      <select
        className="mt-3 h-10 appearance-none rounded bg-white bg-opacity-[0.04] px-4 focus:outline-none"
        name="integrationType"
        id="integrationType"
      >
        <option selected>OAuth</option>
        <option>API</option>
      </select>
    </div>
    <div className="grid grid-cols-2 gap-5">
      <Field label="First Name *" name="firstName" placeholder="Marques" />
      <Field label="Last Name *" name="lastName" placeholder="Hansen" />
    </div>
    <div className="grid grid-cols-2 gap-5">
      <Field label="Email *" name="email" type="email" placeholder="info@acme.com" />
      <Field label="Company Name *" name="companyName" placeholder="Acme" />
    </div>
    <Field label="App Name" name="appName" />

    <div className="flex flex-col">
      <label htmlFor="firstName">Callback URLs</label>
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
    </div>
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
    <Field label="Link to logo" name="linkToLogo" />
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
