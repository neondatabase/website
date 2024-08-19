'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';
import * as yup from 'yup';

import Field from 'components/shared/field';
import LinesIllustration from 'components/shared/lines-illustration';
import Link from 'components/shared/link/link';
import { FORM_STATES } from 'constants/forms';
import { checkBlacklistEmails } from 'utils/check-blacklist-emails';
import { doNowOrAfterSomeTime, sendHubspotFormData } from 'utils/forms';

import ErrorMessage from './error-message';
import FormField from './form-field';
import FormFooter from './form-footer';
import SubmitButton from './submit-button';

const Form = ({
  simpleField,
  fieldGroups,
  submitText,
  successMessage,
  hubspotFormId,
  items,
  greenMode = false,
  isAzurePage = false,
}) => {
  const [state, setState] = useState(FORM_STATES.DEFAULT);
  const [errorMessage, setErrorMessage] = useState('');
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const yupObject = {};
  const defaultValues = {};
  fieldGroups.forEach((group) => {
    group.fields.forEach((field) => {
      if (field.required || field.name.includes('email')) {
        let yupField = yup;

        if (field.fieldType === 'text') {
          yupField = yupField.string();

          if (field.name.includes('email')) {
            yupField = yupField.email('Please enter a valid email');

            // Business email checking
            if (field.validation.useDefaultBlockList || field.validation.data) {
              yupField = yupField.test(checkBlacklistEmails(field));
            }
          }
        }

        if (field.required) {
          if (field.name.includes('email'))
            yupField = yupField.required('Email address is a required field');
          else if (field.fieldType === 'radio')
            yupField = yupField.string().notOneOf(['hidden'], 'Please choose an option');
          else if (field.fieldType === 'checkbox') {
            defaultValues[field.name] = [];
            yupField = yupField
              .array()
              .min(1, 'Please choose at least one option')
              .required('This field is required');
          } else yupField = yupField.required('Please complete this required field.');
        }

        yupObject[field.name] = yupField;
      }
    });
  });
  const yupSchema = yup.object(yupObject).required();

  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    if (state !== FORM_STATES.LOADING && state !== FORM_STATES.SUCCESS) {
      if (hasErrors) setState(FORM_STATES.ERROR);
      else setState(FORM_STATES.DEFAULT);
    }
  }, [errors, isValid, state]);

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const values = Object.entries(data).map(([key, value]) => ({
      name: key,
      value: Array.isArray(value) ? value.join(', ') : value,
    }));

    setErrorMessage('');
    setState(FORM_STATES.LOADING);

    const loadingAnimationStartedTime = Date.now();

    try {
      const response = await sendHubspotFormData({
        formId: hubspotFormId,
        context,
        values,
      });

      if (response.ok) {
        doNowOrAfterSomeTime(() => {
          setState(FORM_STATES.SUCCESS);
          reset();
        }, loadingAnimationStartedTime);
      } else {
        doNowOrAfterSomeTime(() => {
          setState(FORM_STATES.ERROR);
          setErrorMessage('Please reload the page and try again');
        }, loadingAnimationStartedTime);
      }
    } catch (error) {
      doNowOrAfterSomeTime(() => {
        setState(FORM_STATES.ERROR);
        setErrorMessage('Please reload the page and try again');
      }, loadingAnimationStartedTime);
    }
  };

  if (simpleField)
    return (
      <>
        <form className="relative w-full" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative z-20">
            <Field
              labelClassName="hidden"
              inputClassName={clsx(
                '!bg-black-pure remove-autocomplete-styles !m-0 h-16 w-full appearance-none rounded-[50px] !border-[1px] bg-black-new pl-7 pr-48 text-base text-white placeholder:tracking-tight placeholder:text-gray-new-50 focus:outline-none disabled:opacity-100 md:h-14 md:pl-6 md:pr-16 md:placeholder:text-sm',
                state === FORM_STATES.ERROR ? '!border-secondary-1' : '!border-green-45',
                state === FORM_STATES.SUCCESS ? '!pr-14 text-green-45' : 'text-white'
              )}
              name={simpleField.name}
              label={`${simpleField.label} *`}
              type={simpleField.fieldType}
              autoComplete={simpleField.name}
              placeholder={simpleField.placeholder}
              isDisabled={state === FORM_STATES.LOADING || state === FORM_STATES.SUCCESS}
              error={errors[simpleField.name]?.message}
              errorClassName="ml-7"
              {...register(simpleField.name)}
            />
            <SubmitButton formState={state} text={submitText} simpleMode />
            {errorMessage && <ErrorMessage text={errorMessage} />}
          </div>
          <LinesIllustration
            className="-!top-8 z-10 h-[150px] !w-[125%]"
            color={state === FORM_STATES.ERROR ? '#FF4C79' : '#00E599'}
            bgColor="#000"
          />
        </form>
        <FormFooter formState={state} successMessage={successMessage} items={items} greenMode />
      </>
    );

  return (
    <>
      <form className="relative w-full" method="POST" onSubmit={handleSubmit(onSubmit)}>
        <div
          className={clsx(
            'relative z-20 rounded-[10px]',
            greenMode && 'bg-[linear-gradient(155deg,#00E59980,#00E5990D_50%,#00E59980_100%)] p-px'
          )}
        >
          <div
            className={clsx(
              isAzurePage ? 'p-8 lg:p-6' : 'bg-black-new p-9 sm:px-5 sm:py-6',
              'rounded-[10px]'
            )}
          >
            <div className="space-y-6">
              {fieldGroups &&
                fieldGroups.map((fieldGroup, index) => (
                  <fieldset
                    key={index}
                    className={clsx(
                      fieldGroup.fields.length > 1 && 'flex gap-[30px] sm:flex-col sm:gap-6'
                    )}
                  >
                    {fieldGroup.fields.map((field, fieldIndex) => (
                      <FormField
                        key={fieldIndex}
                        index={index}
                        formState={state}
                        errors={errors}
                        register={register}
                        isAzurePage={isAzurePage}
                        {...field}
                      />
                    ))}
                  </fieldset>
                ))}
            </div>
            <SubmitButton formState={state} text={submitText} isAzurePage={isAzurePage} />
          </div>
          {isAzurePage && (
            <span
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit] bg-azure-form-bg"
              aria-hidden
            >
              <span className="absolute inset-0 bg-[url('/images/noise.png')] bg-cover" />
              <span className="absolute inset-0 rounded-[inherit] border-image-azure-form-border" />
              <span className="absolute -left-10 -top-12 z-10 size-[85px] rounded-full bg-white mix-blend-overlay blur-[30px]" />
              <span className="absolute -left-24 -top-24 h-[220px] w-[410px] -rotate-[17deg] rounded-[100%] bg-azure-form-bg-top opacity-40 blur-[65px]" />
              <span className="absolute -right-9 bottom-9 h-36 w-[120px] translate-x-full rounded-[100%] bg-[#CF9FFF] blur-[52px]" />
              <span className="absolute -bottom-6 -right-10 z-10 size-[85px] rounded-full bg-white mix-blend-overlay blur-[30px]" />
              <span className="absolute -bottom-20 -right-32 h-[170px] w-[316px] rotate-[163deg] rounded-[100%] bg-azure-form-bg-bottom opacity-40 blur-[65px]" />
            </span>
          )}
          {errorMessage && <ErrorMessage text={errorMessage} />}
        </div>
        {isAzurePage && (
          <p className="mt-4 px-8 text-[13px] font-light text-gray-new-60 lg:px-1">
            Neon will contact you at the information above with relevant content, products, and
            services. You may unsubscribe at any time. For more info, see our{' '}
            <Link className="whitespace-nowrap" to="/privacy-policy" theme="green-underlined">
              Privacy Policy
            </Link>
            .
          </p>
        )}
        {greenMode && (
          <LinesIllustration
            className="-top-[25%] !h-[450px] !w-[145%]"
            color="#00E599"
            bgColor="#000"
          />
        )}
      </form>
      <FormFooter
        formState={state}
        successMessage={successMessage}
        items={items}
        greenMode={greenMode}
        isAzurePage={isAzurePage}
      />
    </>
  );
};

const fieldPropTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

Form.propTypes = {
  simpleField: PropTypes.shape(fieldPropTypes),
  fieldGroups: PropTypes.arrayOf({
    fieldGroup: PropTypes.shape({
      fields: PropTypes.arrayOf(fieldPropTypes),
    }),
  }),
  submitText: PropTypes.string,
  hubspotFormId: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ),
  greenMode: PropTypes.bool,
  isAzurePage: PropTypes.bool,
};

export default Form;
