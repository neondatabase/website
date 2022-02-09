import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from 'components/shared/button';

import CheckIcon from './images/subscription-form-check.inline.svg';
import SendIcon from './images/subscription-form-send.inline.svg';

const emailRegexp =
  // eslint-disable-next-line no-control-regex, no-useless-escape
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const SubscriptionForm = ({ className }) => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState('default');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => setEmail(event.currentTarget.value.trim());

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please valid email');
    } else {
      setErrorMessage('');
      setFormState('loading');

      setTimeout(() => {
        setFormState('success');
        setEmail('Thanks for subscribing!');

        setTimeout(() => {
          setFormState('default');
          setEmail('');
        }, 2000);

        // 2000 (loading animation duration) + 200 (loading animation delay) = 2200
      }, 2200);

      fetch('https://submit-form.com/nHIBlORO', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    }
  };

  return (
    <form
      className={clsx(
        'relative ml-[14px] before:absolute before:-bottom-3.5 before:-left-3.5 before:h-full before:w-full before:rounded-full before:bg-secondary-2 2xl:ml-2.5 2xl:before:-bottom-2.5 2xl:before:-left-2.5 xl:ml-2 xl:before:-bottom-2 xl:before:-left-2 lg:mx-auto lg:max-w-[584px] md:before:w-[calc(100%+8px)]',
        className
      )}
      noValidate
      onSubmit={handleSubmit}
    >
      {/* Input */}
      <input
        className={clsx(
          'remove-autocomplete-styles outline-none t-2xl relative block h-24 w-[696px] rounded-full border-4 border-black bg-white pl-7 pr-[218px] font-semibold text-black placeholder-black transition-colors duration-200 3xl:w-[576px] 2xl:h-20 2xl:w-[478px] 2xl:pr-[187px] xl:h-[72px] xl:w-[448px] xl:pr-[164px] lg:w-full lg:pl-5 md:pr-20',
          errorMessage && 'border-secondary-1'
        )}
        name="email"
        type="email"
        placeholder="Your email..."
        autoComplete="email"
        value={email}
        readOnly={formState !== 'default'}
        onChange={handleInputChange}
      />

      {/* Error message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.span
            className="t-base absolute left-1/2 -bottom-4 translate-y-full -translate-x-1/2 whitespace-nowrap font-semibold text-secondary-1 lg:-bottom-3"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={appearAndExitAnimationVariants}
          >
            {errorMessage}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Button */}
      <AnimatePresence>
        {formState === 'default' && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={appearAndExitAnimationVariants}
          >
            <Button
              className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2 md:h-14 md:w-14 md:rounded-full md:p-0"
              size="sm"
              type="submit"
              theme="primary"
            >
              <span className="md:sr-only">Subscribe</span>
              <SendIcon className="hidden md:ml-1.5 md:block" aria-hidden />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {formState === 'loading' && (
          <motion.div
            className="absolute right-3 top-1/2 flex h-[72px] w-[72px] -translate-y-1/2 items-center justify-center rounded-full bg-black 2xl:right-2.5 2xl:h-[60px] 2xl:w-[60px] xl:right-2 xl:h-[56px] xl:w-[56px]"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={appearAndExitAnimationVariants}
            aria-hidden
          >
            <div className="h-[58px] w-[58px] rounded-full border-[6px] border-gray-2 2xl:h-[48px] 2xl:w-[48px] xl:h-[42px] xl:w-[42px]" />
            <svg
              className="absolute top-1/2 left-1/2 2xl:h-[48px] 2xl:w-[48px] xl:h-[42px] xl:w-[42px]"
              width="58"
              height="58"
              viewBox="0 0 58 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
            >
              <motion.path
                d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
                strokeLinecap="round"
                stroke="#00e699"
                strokeWidth="6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success state */}
      <AnimatePresence>
        {formState === 'success' && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={appearAndExitAnimationVariants}
            aria-hidden
          >
            <CheckIcon className="2xl:w-[60px] xl:w-[56px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

SubscriptionForm.propTypes = {
  className: PropTypes.string,
};

SubscriptionForm.defaultProps = {
  className: null,
};

export default SubscriptionForm;
