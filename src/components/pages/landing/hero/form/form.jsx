'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
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
import CheckIcon from 'icons/check.inline.svg';
import FormCheckIcon from 'icons/subscription-form-check.inline.svg';
import { doNowOrAfterSomeTime, sendHubspotFormData } from 'utils/forms';

import SendIcon from './images/send.inline.svg';

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const Footer = ({ formState, successMessage, items }) => (
  <div className="relative z-20 mt-6 sm:px-4">
    {formState === FORM_STATES.SUCCESS && (
      <p
        className="px-2 text-center text-base leading-snug text-gray-new-80 sm:px-0 [&_a:hover]:underline [&_a]:text-green-45 [&_a]:underline-offset-2"
        dangerouslySetInnerHTML={{ __html: successMessage }}
      />
    )}
    {!(formState === FORM_STATES.SUCCESS) && items?.length > 0 && (
      <ul className="mx-auto mt-12 flex w-fit max-w-[492px] justify-between gap-x-7 sm:mt-14 sm:flex-col sm:gap-y-4">
        {items.map(({ text }, idx) => (
          <li
            className="flex items-start gap-x-2 text-sm leading-dense tracking-extra-tight text-gray-new-70"
            key={idx}
          >
            <CheckIcon className="h-[14px] w-[14px] shrink-0 text-gray-new-90" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    )}
  </div>
);

Footer.propTypes = {
  formState: PropTypes.string,
  successMessage: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ),
};

const ErrorMessage = ({ text }) => (
  <span
    className="absolute left-7 right-7 top-full mt-2.5 text-sm leading-none tracking-[-0.02em] text-secondary-1 sm:left-4 sm:right-4 sm:text-xs sm:leading-tight [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:no-underline"
    dangerouslySetInnerHTML={{ __html: text }}
  />
);

ErrorMessage.propTypes = {
  text: PropTypes.string,
};

const SubmitButton = ({ formState, text, simpleMode = false }) => (
  <LazyMotion features={domAnimation}>
    <AnimatePresence>
      {(formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) && (
        <m.button
          className={clsx(
            simpleMode
              ? 'absolute inset-y-2.5 right-3 h-11 rounded-[80px] md:inset-y-[6.5px] md:right-[9px] md:flex md:h-10 md:w-10 md:items-center md:justify-center md:px-0 '
              : 'mt-9 block h-12 w-full rounded-[60px] text-lg',
            'bg-green-45 px-7 py-3 font-semibold leading-none tracking-tight text-black transition-colors duration-200 hover:bg-[#00FFAA] sm:text-base',
            formState === FORM_STATES.ERROR && '!bg-secondary-1/50'
          )}
          type="submit"
          initial="initial"
          animate="animate"
          exit="exit"
          aria-label={text}
          variants={appearAndExitAnimationVariants}
        >
          {simpleMode && <SendIcon className="hidden h-6 w-6 md:block" />}
          <span className={clsx(simpleMode && 'md:hidden')}>{text}</span>
        </m.button>
      )}
      {formState === FORM_STATES.LOADING && (
        <m.div
          className={clsx(
            simpleMode
              ? 'absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full'
              : 'mt-9 flex h-12 w-full items-center justify-center rounded-[60px]',
            'bg-green-45'
          )}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={appearAndExitAnimationVariants}
          aria-hidden
        >
          <svg
            className="h-[22px] w-[22px]"
            width="58"
            height="58"
            viewBox="0 0 58 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: 'scale(1, -1) rotate(-90deg)',
            }}
          >
            <m.path
              d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
              strokeLinecap="round"
              stroke="#0c0d0d"
              strokeWidth="6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
            />
          </svg>
        </m.div>
      )}
      {formState === FORM_STATES.SUCCESS && (
        <m.div
          className={clsx(
            simpleMode
              ? 'absolute right-3 top-1/2 -translate-y-1/2 rounded-full'
              : 'mt-9 flex h-12 w-full items-center justify-center rounded-[60px]',
            'bg-green-45 text-black'
          )}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={appearAndExitAnimationVariants}
        >
          <FormCheckIcon className="h-10 w-10" />
        </m.div>
      )}
    </AnimatePresence>
  </LazyMotion>
);

SubmitButton.propTypes = {
  formState: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  simpleMode: PropTypes.bool,
};

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
            <SubmitButton formState={state} text={submitText} simpleMode />
            {errorMessage && <ErrorMessage text={errorMessage} />}
          </div>
          <LinesIllustration
            className="-!top-8 z-10 h-[150px] !w-[125%]"
            color={state === FORM_STATES.ERROR ? '#FF4C79' : '#00E599'}
            bgColor="#000"
          />
        </form>
        <Footer formState={state} successMessage={successMessage} items={items} />
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
                      <Field
                        key={index}
                        className="w-full"
                        name={field.name}
                        label={`${field.label}${field.required ? ' *' : ''}`}
                        labelClassName="mb-0 block w-fit text-sm text-gray-new-70"
                        inputClassName="remove-autocomplete-styles m-0 !h-10 !border-[1px] !bg-white/[0.04] !text-base text-white placeholder:tracking-tight placeholder:text-gray-new-40 focus:outline-none disabled:opacity-100 sm:placeholder:text-sm"
                        type={field.fieldType}
                        tag={field.type === 'enumeration' ? 'select' : 'input'}
                        defaultValue={field.type === 'enumeration' ? 'hidden' : ''}
                        autoComplete={field.name}
                        placeholder={field.placeholder}
                        isDisabled={state === FORM_STATES.LOADING || state === FORM_STATES.SUCCESS}
                        error={errors[field.name]?.message}
                        errorClassName="w-full text-right text-xs leading-none"
                        {...register(field.name)}
                      >
                        {field.type === 'enumeration' && field.options && (
                          <>
                            <option value="hidden" disabled hidden />
                            {field.options.map((option, index) => (
                              <option value={option.value} key={index}>
                                {option.label}
                              </option>
                            ))}
                          </>
                        )}
                      </Field>
                    ))}
                  </fieldset>
                ))}
            </div>
            <SubmitButton formState={state} text={submitText} />
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
      <Footer formState={state} successMessage={successMessage} items={items} />
    </>
  );
};

const filedPropTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

Form.propTypes = {
  greenMode: PropTypes.bool,
  simpleField: PropTypes.shape(filedPropTypes),
  formFieldGroups: PropTypes.arrayOf({
    fieldGroup: PropTypes.shape({
      fields: PropTypes.arrayOf(filedPropTypes),
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
