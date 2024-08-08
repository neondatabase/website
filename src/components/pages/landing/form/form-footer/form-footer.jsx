import clsx from 'clsx';
import PropTypes from 'prop-types';

import { FORM_STATES } from 'constants/forms';
import CheckIcon from 'icons/check.inline.svg';

const FormFooter = ({ formState, successMessage, items, isAzurePage = false }) => {
  if (!(formState === FORM_STATES.SUCCESS || items?.length > 0)) return null;

  return (
    <div
      className={clsx(
        isAzurePage ? 'absolute inset-x-0 top-full pt-5' : 'relative z-20 mt-10 sm:px-4'
      )}
    >
      {formState === FORM_STATES.SUCCESS && (
        <p
          className="px-2 text-center text-base leading-snug text-gray-new-80 sm:px-0 [&_a:hover]:underline [&_a]:text-green-45 [&_a]:underline-offset-2"
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}
      {!(formState === FORM_STATES.SUCCESS) && items?.length > 0 && (
        <ul className="mx-auto  flex w-fit max-w-[492px] justify-between gap-x-7 sm:flex-col sm:gap-y-4">
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
};

FormFooter.propTypes = {
  formState: PropTypes.string.isRequired,
  successMessage: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ),
  isAzurePage: PropTypes.bool,
};

export default FormFooter;
