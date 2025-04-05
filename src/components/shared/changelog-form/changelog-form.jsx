'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';

import GradientBorder from 'components/shared/gradient-border';
import { HUBSPOT_NEWSLETTERS_FORM_ID, FORM_STATES } from 'constants/forms';
import useLocalStorage from 'hooks/use-local-storage';
import SendIcon from 'icons/send.inline.svg';
import CheckIcon from 'icons/subscription-form-check.inline.svg';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const themeClassNames = {
  sidebar: {
    block: 'mt-12 max-w-[228px] flex-col gap-3 p-3.5',
    title: 'text-[15px] font-medium leading-snug tracking-tighter',
    input: 'pr-20',
    sendText: 'hidden',
    errorMessage: 'mt-5',
  },
  default: {
    block:
      'mb-5 hidden items-center gap-[72px] px-6 py-[18px] xl:flex md:gap-10 sm:flex-col sm:gap-2.5 sm:p-[18px] sm:pt-3.5 sm:items-start',
    title: 'shrink-0 text-lg font-medium leading-snug tracking-tighter',
    input: 'pr-32 xs:pr-20',
    sendText: 'text-[13px] font-semibold tracking-extra-tight xs:hidden',
    sendIcon: 'hidden xs:block',
    errorMessage: 'mt-1.5 sm:mt-6',
  },
};

const ChangelogForm = ({ isSidebar = false }) => {
  const theme = isSidebar ? 'sidebar' : 'default';
  const classNames = themeClassNames[theme];

  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const [submittedEmail, setSubmittedEmail] = useLocalStorage('submittedEmailNewsletterForm', []);
  const [errorMessage, setErrorMessage] = useState('');
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const handleInputChange = (event) => {
    setEmail(event.currentTarget.value.trim());
    setFormState(FORM_STATES.DEFAULT);
    setErrorMessage('');
  };

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
      setFormState(FORM_STATES.ERROR);
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please enter a valid email');
      setFormState(FORM_STATES.ERROR);
    } else if (submittedEmail.includes(email)) {
      setErrorMessage('You have already submitted this email');
      setFormState(FORM_STATES.ERROR);
    } else {
      setSubmittedEmail([...submittedEmail, email]);
      setErrorMessage('');
      setFormState(FORM_STATES.LOADING);

      const loadingAnimationStartedTime = Date.now();

      try {
        const response = await sendHubspotFormData({
          formId: HUBSPOT_NEWSLETTERS_FORM_ID,
          context,
          values: [
            {
              name: 'email',
              value: email,
            },
          ],
        });

        if (response.ok) {
          doNowOrAfterSomeTime(() => {
            setFormState(FORM_STATES.SUCCESS);
            setEmail('Thank you!');
          }, loadingAnimationStartedTime);
          doNowOrAfterSomeTime(() => {
            setFormState(FORM_STATES.DEFAULT);
            setEmail('');
          }, loadingAnimationStartedTime + 3000);
        } else {
          doNowOrAfterSomeTime(() => {
            setFormState(FORM_STATES.ERROR);
            setErrorMessage('Please reload the page and try again');
          }, loadingAnimationStartedTime);
        }
      } catch (error) {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.ERROR);
          setErrorMessage('Please reload the page and try again');
        }, loadingAnimationStartedTime);
      }
    }
  };

  return (
    <section
      className={clsx(
        'changelog-form safe-paddings relative flex scroll-mt-20 rounded-lg bg-gray-new-94',
        'dark:bg-subscribe-form-dark dark:shadow-[0px_2px_10px_0px_rgba(0,0,0,.4),0px_2px_30px_0px_rgba(0,0,0,.5)]',
        'lg:scroll-mt-10',
        classNames.block
      )}
      id="changelog-form"
    >
      <h2 className={classNames.title}>
        Subscribe to our changelog.
        <br /> No spam, guaranteed.
      </h2>
      <form className="relative w-full flex-1" method="POST" noValidate onSubmit={handleSubmit}>
        <input
          className={clsx(
            'remove-autocomplete-styles h-[38px] w-full appearance-none pl-4 tracking-extra-tight',
            'rounded-full border bg-white text-[13px] focus:outline-none dark:bg-black-new lg:text-base',
            'placeholder:text-gray-new-50/60 dark:placeholder:text-gray-new-70/60',
            (formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) &&
              classNames.input,
            formState === FORM_STATES.ERROR
              ? 'border-secondary-1'
              : 'border-gray-new-90 dark:border-gray-new-15',
            formState === FORM_STATES.SUCCESS && 'dark:text-green-45'
          )}
          type="email"
          name="email"
          value={email}
          placeholder="Your email..."
          disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
          onChange={handleInputChange}
        />
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            {(formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) && (
              <m.button
                className={clsx(
                  'absolute inset-y-1 right-1 rounded-full outline-none',
                  'h-[30px] min-w-16 px-6',
                  'text-black-new transition-colors duration-200',
                  formState === FORM_STATES.ERROR
                    ? 'bg-secondary-1/50'
                    : 'bg-green-45 hover:bg-[#00FFAA]'
                )}
                type="submit"
                initial="initial"
                animate="animate"
                exit="exit"
                aria-label="Subscribe"
                disabled={formState !== FORM_STATES.DEFAULT}
                variants={appearAndExitAnimationVariants}
              >
                <span className={classNames.sendText}>Subscribe</span>
                <SendIcon className={classNames.sendIcon} />
              </m.button>
            )}
            {formState === FORM_STATES.LOADING && (
              <m.div
                className="absolute inset-y-1 right-1 size-[30px] rounded-full bg-green-45"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={appearAndExitAnimationVariants}
                aria-hidden
              >
                <svg
                  className="absolute left-1/2 top-1/2 size-5"
                  width="20"
                  height="20"
                  viewBox="0 0 58 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
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
                className="absolute inset-y-1 right-1 rounded-full bg-green-45 text-black"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={appearAndExitAnimationVariants}
                data-test="success-message"
              >
                <CheckIcon className="size-[30px]" />
              </m.div>
            )}
          </AnimatePresence>
        </LazyMotion>

        {formState === FORM_STATES.ERROR && errorMessage && (
          <span
            className={clsx(
              'absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap',
              'text-xs leading-none tracking-extra-tight text-secondary-1',
              'xl:left-4 xl:translate-x-0 sm:left-1/2 sm:-translate-x-1/2',
              classNames.errorMessage
            )}
            data-test="error-message"
          >
            {errorMessage}
          </span>
        )}
      </form>
      <GradientBorder className="hidden !rounded-[10px] dark:block" withBlend />
    </section>
  );
};

ChangelogForm.propTypes = {
  isSidebar: PropTypes.bool,
};

export default ChangelogForm;
