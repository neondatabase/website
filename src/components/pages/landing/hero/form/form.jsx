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
import { FORM_STATES } from 'constants/forms';
import LINKS from 'constants/links';
import { doNowOrAfterSomeTime, sendHubspotFormData } from 'utils/forms';

import ErrorMessage from './error-message';
import FormField from './field';
import FormFooter from './footer';
import FormSubmit from './submit';

const Form = ({
  simpleField,
  formFieldGroups,
  submitText,
  hasBusinessEmail,
  successMessage,
  hubspotFormId,
  items,
  greenMode = false,
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
  formFieldGroups.forEach((group) => {
    group.fields.forEach((field) => {
      if (field.required) {
        if (field.name === 'email') {
          yupObject[field.name] = yup
            .string()
            .email('Please enter a valid email')
            .required('Email address is a required field');
        } else {
          yupObject[field.name] = yup.string().required('Please complete this required field.');
        }
      }
    });
  });
  const yupSchema = yup.object(yupObject).required();

  const {
    register,
    // reset,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
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
      value,
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
          // reset();
        }, loadingAnimationStartedTime);
      } else {
        doNowOrAfterSomeTime(() => {
          setState(FORM_STATES.ERROR);
          setErrorMessage(
            // Different error messages depending on business email field
            hasBusinessEmail
              ? `Ooops! Only work emails allowed. If this account is for you, <a href="${LINKS.signup}">please sign up to Neon here</a>.`
              : 'Please reload the page and try again'
          );
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
            <FormSubmit formState={state} text={submitText} simpleMode />
            {errorMessage && <ErrorMessage text={errorMessage} />}
          </div>
          <LinesIllustration
            className="-top-8 z-10 h-[130px] !w-[125%]"
            color={state === FORM_STATES.ERROR ? '#FF4C79' : '#00E599'}
            bgColor="#000"
          />
        </form>
        <FormFooter formState={state} successMessage={successMessage} items={items} />
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
          <div className={clsx(!simpleField && 'rounded-[10px] bg-black-new p-9 sm:px-5 sm:py-6')}>
            <div className="space-y-6">
              {formFieldGroups &&
                formFieldGroups.map((fieldGroup, index) => (
                  <fieldset
                    key={index}
                    className={clsx(
                      fieldGroup.fields.length > 1 && 'flex gap-[30px] sm:flex-col sm:gap-6'
                    )}
                  >
                    {fieldGroup.fields.map((field, index) => (
                      <FormField
                        key={index}
                        {...field}
                        formState={state}
                        errors={errors}
                        register={register}
                      />
                    ))}
                  </fieldset>
                ))}
            </div>
            <FormSubmit formState={state} text={submitText} />
          </div>
          {errorMessage && <ErrorMessage text={errorMessage} />}
        </div>
        {greenMode && (
          <LinesIllustration
            className="-top-[25%] !h-[450px] !w-[145%]"
            color="#00E599"
            bgColor="#000"
          />
        )}
      </form>
      <FormFooter formState={state} successMessage={successMessage} items={items} />
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
  greenMode: PropTypes.bool,
  simpleField: PropTypes.shape(fieldPropTypes),
  formFieldGroups: PropTypes.arrayOf({
    fieldGroup: PropTypes.shape({
      fields: PropTypes.arrayOf(fieldPropTypes),
    }),
  }),
  hasBusinessEmail: PropTypes.bool,
  submitText: PropTypes.string,
  hubspotFormId: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ),
};

export default Form;
