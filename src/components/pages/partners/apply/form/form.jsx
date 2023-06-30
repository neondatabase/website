'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';
import * as yup from 'yup';

import Button from 'components/shared/button/button';
import Link from 'components/shared/link/link';
import { FORM_STATES, HUBSPOT_PARTNERS_FORM_ID } from 'constants/forms';
import LINKS from 'constants/links';
import { doNowOrAfterSomeTime, sendHubspotFormData } from 'utils/forms';

import LoadingIcon from '../images/loading.inline.svg';

import CallbackUrlFields from './callback-url-fields';
import Field from './field';
import MultiSelect from './multi-select';
import Select from './select';

const integrationTypeOptions = [
  { id: 'oauth', name: 'OAuth' },
  { id: 'api', name: 'API' },
];

const projectNumberOptions = [
  { id: '1000', name: '1000 projects' },
  { id: '5000', name: '5000 projects' },
  { id: '5000+', name: '5000+ projects' },
];

const schema = yup
  .object({
    integration_type: yup.object().required('This is a required field'),
    firstname: yup.string().required('This is a required field'),
    lastname: yup.string().required('This is a required field'),
    email: yup.string().email('Please enter a valid email').required('This is a required field'),
    company: yup.string().required('This is a required field'),
  })
  .required();

const Form = ({ className }) => {
  const [integrationType, setIntegrationType] = useState(integrationTypeOptions[0]);
  const [projectNumber, setProjectNumber] = useState(projectNumberOptions[0]);
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      application_scope: [],
      integration_type: integrationTypeOptions[0],
      are_api_calls_from_backend: 'No',
      number_of_projects: '',
    },
  });

  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const [formError, setFormError] = useState('');

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const onSubmit = async (formData, e) => {
    e.preventDefault();

    const data = { ...formData };

    data.application_scope = data.application_scope?.map(({ id }) => id).join(';');
    data.integration_type = data.integration_type.name;
    data.number_of_projects = data.number_of_projects.name || '';

    const dataToSend = Object.entries(data).map(([name, value]) => ({ name, value }));

    const loadingAnimationStartedTime = Date.now();

    setFormError('');
    setFormState(FORM_STATES.LOADING);

    try {
      const response = await sendHubspotFormData({
        formId: HUBSPOT_PARTNERS_FORM_ID,
        context,
        values: dataToSend,
      });

      if (response.ok) {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.SUCCESS);
          setFormError('');
          setTimeout(() => {
            setFormState(FORM_STATES.DEFAULT);
          }, 2000);
        }, loadingAnimationStartedTime);
      } else {
        throw new Error('Something went wrong. Please reload the page and try again.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.ERROR);
          setFormError(error?.message ?? error);
        }, 2000);
      }
    } finally {
      reset();
    }
  };

  return (
    <form
      className={clsx(
        className,
        'flex flex-col gap-y-6 rounded-[10px] bg-gray-new-8 px-9 py-11 leading-none xl:px-7 xl:py-8 md:px-5 md:py-6'
      )}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Select
        control={control}
        label="What type of integration do you need? *"
        selected={integrationType}
        setSelected={setIntegrationType}
        options={integrationTypeOptions}
        name="integration_type"
      />

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
        <Field
          label="First Name *"
          name="firstname"
          placeholder="Marques"
          {...register('firstname')}
          error={errors.firstname?.message}
        />
        <Field
          label="Last Name *"
          name="lastname"
          placeholder="Hansen"
          {...register('lastname')}
          error={errors.lastname?.message}
        />
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
        <Field
          label="Email *"
          type="email"
          name="email"
          placeholder="info@acme.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Field
          label="Company Name *"
          name="company"
          placeholder="Acme"
          {...register('company')}
          error={errors.company?.message}
        />
      </div>
      {integrationType.id === 'oauth' && (
        <>
          <Field
            label="App Name"
            tooltipId="app-name-tooltip"
            tooltipContent="Your app name to be shown on<br/> the consent page"
            {...register('app_name')}
          />

          <CallbackUrlFields register={register} />

          <fieldset>
            <legend>Will you be making API calls from a backend?</legend>
            <div className="ml-1 mt-5 flex items-center gap-x-8">
              <label className="flex items-center gap-x-[9px]" htmlFor="apiCallsYes">
                <input
                  className="h-2 w-2 appearance-none rounded-full bg-transparent outline outline-1 outline-offset-2 outline-gray-new-40 checked:bg-primary-1"
                  type="radio"
                  name="are_api_calls_from_backend"
                  id="apiCallsYes"
                  value="Yes"
                  {...register('are_api_calls_from_backend')}
                />
                Yes
              </label>

              <label className="flex items-center gap-x-[9px]" htmlFor="apiCallsNo">
                <input
                  className="h-2 w-2 appearance-none rounded-full bg-transparent outline outline-1 outline-offset-2 outline-gray-new-40 checked:bg-primary-1"
                  type="radio"
                  name="are_api_calls_from_backend"
                  id="apiCallsNo"
                  value="No"
                  {...register('are_api_calls_from_backend')}
                />
                No
              </label>
            </div>
          </fieldset>

          <MultiSelect control={control} setValue={setValue} />

          <Field
            label="Link to logo"
            tooltipId="link-to-logo-tooltip"
            tooltipContent="Please paste a link to<br/> your company logo here"
            name="link_to_logo"
            {...register('link_to_logo')}
          />
        </>
      )}

      {integrationType.id === 'api' && (
        <Select
          label="Number of projects you need"
          control={control}
          selected={projectNumber}
          setSelected={setProjectNumber}
          options={projectNumberOptions}
          name="number_of_projects"
          placeholder="Select an option"
        />
      )}

      <Field
        label="Additional details"
        tag="textarea"
        placeholder="Message"
        name="message"
        {...register('message')}
      />
      <div className="relative flex flex-col gap-y-6 lg:mt-3 lg:flex-row lg:items-center lg:gap-x-5 md:mt-2 md:flex-col md:items-stretch md:gap-y-4">
        <Button
          className="mt-3 h-[52px] py-[17px] text-lg font-medium leading-none tracking-[-0.02em] disabled:hover:bg-primary-1 lg:order-1 lg:ml-auto lg:mt-0 lg:basis-[316px] md:order-none md:ml-0 md:w-full md:basis-full"
          theme="primary"
          type="submit"
          disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
        >
          {formState === FORM_STATES.LOADING && (
            <LoadingIcon className="h-8 w-8 animate-spin text-black-new" />
          )}
          {(formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) && 'Apply now'}
          {formState === FORM_STATES.SUCCESS && 'Applied!'}
        </Button>
        <p className="text-[15px] font-light leading-snug lg:max-w-[450px] lg:flex-1">
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
        {formError && (
          <span className="absolute left-1/2 top-[calc(100%+1rem)] w-full -translate-x-1/2 text-sm leading-none text-secondary-1 xl:static xl:translate-x-0 lg:absolute lg:top-[calc(100%+0.25rem)] lg:-translate-x-1/2 md:static md:translate-x-0">
            {formError}
          </span>
        )}
      </div>
    </form>
  );
};

Form.propTypes = {
  className: PropTypes.string,
};

export default Form;
