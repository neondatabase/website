import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';

import { FORM_STATES } from 'constants/forms';
import FormCheckIcon from 'icons/subscription-form-check.inline.svg';

import SendIcon from './images/send.inline.svg';

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const SubmitButton = ({ formState, text, simpleMode = false, isAzurePage = false }) => (
  <LazyMotion features={domAnimation}>
    <AnimatePresence>
      {(formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) && (
        <m.button
          className={clsx(
            simpleMode
              ? 'absolute inset-y-2.5 right-3 h-11 rounded-[80px] md:inset-y-[6.5px] md:right-[9px] md:flex md:h-10 md:w-10 md:items-center md:justify-center md:px-0 '
              : 'block h-12 w-full rounded-[60px] text-lg',
            isAzurePage && 'mt-7',
            !simpleMode && !isAzurePage && 'mt-9',
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
              : 'flex h-12 w-full items-center justify-center rounded-[60px]',
            isAzurePage && 'mt-7',
            !simpleMode && !isAzurePage && 'mt-9',
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
              : 'flex h-12 w-full items-center justify-center rounded-[60px]',
            isAzurePage && 'mt-7',
            !simpleMode && !isAzurePage && 'mt-9',
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
  isAzurePage: PropTypes.bool,
};

export default SubmitButton;
