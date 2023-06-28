'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';
import * as yup from 'yup';

import infoSvg from 'components/pages/partners/apply/images/info.svg';
import Button from 'components/shared/button/button';
import Link from 'components/shared/link/link';
import Tooltip from 'components/shared/tooltip';
import { FORM_STATES, HUBSPOT_PARTNERS_FORM_ID } from 'constants/forms';
import LINKS from 'constants/links';
import { doNowOrAfterSomeTime, sendHubspotFormData } from 'utils/forms';

import AddIcon from '../images/add.inline.svg';

import Field from './field';
import Select from './select';

const CALLBACK_URLS_LIMIT = 3;

const integrationTypeOptions = [
  { id: 'oauth', name: 'OAuth' },
  { id: 'api', name: 'API' },
];

// const applicationScopeOptions = [
//   { id: 'create', name: 'Create projects' },
//   { id: 'read', name: 'Read projects' },
//   { id: 'modify', name: 'Modify projects' },
//   { id: 'delete', name: 'Delete projects' },
// ];

// const projectNumberOptions = [
//   { id: '1000', name: '1000 projects' },
//   { id: '5000', name: '5000 projects' },
//   { id: '5000+', name: '5000+ projects' },
// ];

// const useFilteredItems = (items, query) =>
//   useMemo(
//     () =>
//       query === ''
//         ? items
//         : items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
//     [items, query]
//   );

const CallbackURLs = ({ register }) => {
  const [shouldAddCallbackUrl, setShouldAddCallbackUrl] = useState(true);
  const [visibleInputIndex, setVisibleInputIndex] = useState(0);

  return (
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
      {Array.from({ length: CALLBACK_URLS_LIMIT }).map((_, index) => (
        <input
          className={clsx(
            'mt-3 h-10 appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15',
            index > visibleInputIndex && 'hidden'
          )}
          id={`callback_url_${index}`}
          name={`callback_url${index > 0 ? `_${index + 1}` : ''}`}
          type="text"
          {...register(`callback_url${index > 0 ? `_${index + 1}` : ''}`)}
          key={index}
        />
      ))}
      <button
        className={clsx(
          'mt-3 flex items-center gap-x-2',
          shouldAddCallbackUrl ? 'text-green-45' : 'cursor-not-allowed text-gray-new-40'
        )}
        type="button"
        onClick={() => {
          if (visibleInputIndex < CALLBACK_URLS_LIMIT - 1) {
            setVisibleInputIndex((prevIndex) => prevIndex + 1);

            if (visibleInputIndex === CALLBACK_URLS_LIMIT - 2) {
              setShouldAddCallbackUrl(false);
            }
          }
        }}
      >
        <AddIcon />
        Add another URL
      </button>
    </fieldset>
  );
};

CallbackURLs.propTypes = {
  register: PropTypes.func.isRequired,
};

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
  const [, setFormState] = useState(FORM_STATES.DEFAULT);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const integrationType1 = watch('integration_type');
  console.log({ integrationType1 });

  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const [, setFormError] = useState('');

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  console.log(errors, 'errors');

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const {
      integration_type,
      firstname,
      lastname,
      email,
      company,
      app_name,
      callback_url,
      callback_url_2,
      callback_url_3,
      application_scope,
      are_api_calls_from_backend,
      link_to_logo,
      number_of_projects,
      message,
    } = data;

    console.log(data);

    const loadingAnimationStartedTime = Date.now();

    setFormError('');
    setFormState(FORM_STATES.LOADING);

    try {
      const response = await sendHubspotFormData({
        formId: HUBSPOT_PARTNERS_FORM_ID,
        context,
        values: [
          {
            name: 'integration_type',
            value: integration_type.id,
          },
          {
            name: 'firstname',
            value: firstname,
          },
          {
            name: 'lastname',
            value: lastname,
          },
          {
            name: 'email',
            value: email,
          },
          {
            name: 'company',
            value: company,
          },
          {
            name: 'app_name',
            value: app_name,
          },
          {
            name: 'callback_url',
            value: callback_url,
          },
          {
            name: 'callback_url_2',
            value: callback_url_2,
          },
          {
            name: 'callback_url_3',
            value: callback_url_3,
          },
          {
            name: 'application_scope',
            value: application_scope,
          },
          {
            name: 'are_api_calls_from_backend',
            value: are_api_calls_from_backend,
          },
          {
            name: 'link_to_logo',
            value: link_to_logo,
          },
          {
            name: 'number_of_projects',
            value: number_of_projects,
          },
          {
            name: 'message',
            value: message,
          },
        ],
      });

      if (response.ok) {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.SUCCESS);
          setFormError('');
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
    }
  };

  const [integrationType, setIntegrationType] = useState(integrationTypeOptions[0]);
  // const [integrationQuery, setIntegrationQuery] = useState('');

  // const [projectNumber, setProjectNumber] = useState(projectNumberOptions[0]);
  // const [projectNumberQuery, setProjectNumberQuery] = useState('');

  // const [applicationScopes, setApplicationScopes] = useState([]);

  // const filteredIntegrationItems = useFilteredItems(integrationTypeOptions, integrationQuery);
  // const filteredProjectNumberItems = useFilteredItems(projectNumberOptions, projectNumberQuery);

  console.log(integrationType);
  return (
    <form
      className={clsx(className, 'flex flex-col gap-y-6 rounded-[10px] bg-gray-new-8 px-9 py-11')}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Select
        control={control}
        label="What type of integration do you need? *"
        selected={integrationType}
        setSelected={setIntegrationType}
        // setQuery={setIntegrationQuery}
        items={integrationTypeOptions}
        // defaultValue={integrationTypeOptions[0]}
        name="integration_type"
      />

      <div className="grid grid-cols-2 gap-5">
        <Field
          label="First Name *"
          name="firstname"
          placeholder="Marques"
          {...register('firstname')}
        />
        <Field label="Last Name *" name="lastname" placeholder="Hansen" {...register('lastname')} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Field
          label="Email *"
          type="email"
          name="email"
          placeholder="info@acme.com"
          {...register('email')}
        />
        <Field label="Company Name *" name="company" placeholder="Acme" {...register('company')} />
      </div>
      {integrationType.id === 'oauth' && (
        <>
          <Field
            label="App Name"
            tooltipId="app-name-tooltip"
            tooltipContent="This is a tooltip!"
            {...register('app_name')}
          />
          <CallbackURLs register={register} />
          <fieldset>
            <legend>Will you be making API calls from a backend?</legend>
            <div className="mt-3 flex items-center gap-x-8">
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
          {/* <Select
            label="What application scope would you need?"
            items={applicationScopeOptions}
            selected={applicationScopes}
            setSelected={setApplicationScopes}
            name="application_scope"
            register={register}
            multiple
          /> */}

          <Field
            label="Link to logo"
            tooltipId="link-to-logo-tooltip"
            tooltipContent="This is a tooltip!"
            name="link_to_logo"
            {...register('link_to_logo')}
          />
        </>
      )}

      {/* {integrationType.id === 'api' &&
        <Select
          label="Number of projects you need"
          selected={projectNumber}
          setSelected={setProjectNumber}
          setQuery={setProjectNumberQuery}
          items={filteredProjectNumberItems}
          name="number_of_projects"
          {...register('number_of_projects')}
        /> 
        } */}

      <Field
        label="Additional details"
        tag="textarea"
        placeholder="Message"
        name="message"
        {...register('message')}
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
};

Form.propTypes = {
  className: PropTypes.string,
};

export default Form;
