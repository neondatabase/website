'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';

import Container from 'components/shared/container';
import LinesIllustration from 'components/shared/lines-illustration';
import { FORM_STATES } from 'constants/forms';
import CheckIcon from 'icons/check.inline.svg';
import FormCheckIcon from 'icons/subscription-form-check.inline.svg';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';

import SendIcon from './images/send.inline.svg';

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const Hero = ({
  title,
  description,
  hubspotFormId,
  inputPlaceholder,
  buttonText,
  successMessage,
  items = [],
}) => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
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
    } else {
      setErrorMessage('');
      setFormState(FORM_STATES.LOADING);

      const loadingAnimationStartedTime = Date.now();

      try {
        const response = await sendHubspotFormData({
          formId: hubspotFormId,
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
    <section className="safe-paddings pt-[152px] xl:pt-[120px] lg:pt-11 md:pt-7">
      <Container className="flex flex-col items-center" size="medium">
        <h1 className="text-center font-title text-[72px] font-medium leading-none tracking-extra-tight 2xl:text-6xl xl:text-[56px] lg:text-[44px] md:text-[40px]">
          {title}
        </h1>
        <p
          className="mx-auto mt-4 max-w-[760px] text-center text-2xl font-light leading-snug lg:text-lg md:max-w-[85%] md:text-base [&>a]:text-green-45"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div className="mx-auto my-[75px] w-[504px] max-w-full md:my-16 md:max-w-[90%] sm:my-14">
          <form className="relative w-full" method="POST" noValidate onSubmit={handleSubmit}>
            <div className="relative z-20">
              <input
                className={clsx(
                  'remove-autocomplete-styles h-16 w-full appearance-none rounded-[50px] border bg-black-new pl-7 pr-48 text-white placeholder:tracking-tight placeholder:text-gray-new-50 focus:outline-none disabled:opacity-100 sm:h-14 sm:pl-6 sm:pr-16 sm:placeholder:text-sm',
                  formState === FORM_STATES.ERROR ? 'border-secondary-1' : 'border-green-45',
                  formState === FORM_STATES.SUCCESS ? '!pr-14 text-green-45' : 'text-white'
                )}
                type="email"
                name="email"
                value={email}
                placeholder={inputPlaceholder}
                disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
                onChange={handleInputChange}
              />
              <LazyMotion features={domAnimation}>
                <AnimatePresence>
                  {(formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) && (
                    <m.button
                      className={clsx(
                        'absolute inset-y-2.5 right-3 h-11 rounded-[80px] px-7 py-3 font-bold leading-none tracking-tight text-black transition-colors duration-200 sm:inset-y-[6.5px] sm:right-[9px] sm:flex sm:h-10 sm:w-10 sm:items-center sm:justify-center sm:px-0',
                        formState === FORM_STATES.ERROR
                          ? 'bg-secondary-1/50'
                          : 'bg-green-45 hover:bg-[#00FFAA]'
                      )}
                      type="submit"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      aria-label={buttonText}
                      variants={appearAndExitAnimationVariants}
                    >
                      <span className="sm:hidden">{buttonText}</span>
                      <SendIcon className="hidden h-6 w-6 sm:block" />
                    </m.button>
                  )}
                  {formState === FORM_STATES.LOADING && (
                    <m.div
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-green-45"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={appearAndExitAnimationVariants}
                      aria-hidden
                    >
                      <svg
                        className="absolute left-1/2 top-1/2 h-[22px] w-[22px]"
                        width="58"
                        height="58"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-green-45 text-black"
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
              {formState === FORM_STATES.ERROR && errorMessage && (
                <span className="absolute left-7 top-full mt-2.5 text-sm leading-none tracking-[-0.02em] text-secondary-1 sm:text-xs sm:leading-tight">
                  {errorMessage}
                </span>
              )}
            </div>
            <LinesIllustration
              className="z-10 !w-[125%]"
              color={formState === FORM_STATES.ERROR ? '#FF4C79' : '#00E599'}
              size="sm"
            />
          </form>
          {formState === FORM_STATES.SUCCESS && (
            <p className="relative z-20 mx-auto mt-12 text-center text-base leading-snug text-gray-new-80">
              {successMessage}
            </p>
          )}
          {formState !== FORM_STATES.SUCCESS && items.length > 0 && (
            <ul className="relative z-20 mx-3.5 mt-[52px] flex justify-between gap-x-7 sm:mx-0.5 sm:mt-11 sm:flex-col sm:gap-y-4">
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
      </Container>
    </section>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  hubspotFormId: PropTypes.string.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ),
};

export default Hero;
