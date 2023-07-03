import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';

import AddIcon from 'components/pages/partners/apply/images/add.inline.svg';
import infoSvg from 'components/pages/partners/apply/images/info.svg';
import Tooltip from 'components/shared/tooltip';

const CALLBACK_URLS_LIMIT = 3;
const CallbackUrlFields = ({ register }) => {
  const [shouldAddCallbackUrl, setShouldAddCallbackUrl] = useState(true);
  const [visibleInputIndex, setVisibleInputIndex] = useState(0);

  return (
    <fieldset className="flex flex-col border-b border-gray-new-15 pb-9 xl:pb-7 lg:pb-6">
      <div className="flex items-center">
        <span className="text-sm leading-none text-gray-new-70">Callback URLs</span>
        <a
          className="relative ml-1.5 flex items-center after:absolute after:-inset-2"
          data-tooltip-id="callback-urls-tooltip"
          data-tooltip-html="May be plural, the port to use<br/> for your application"
        >
          <img src={infoSvg} width={14} height={14} alt="" loading="lazy" aria-hidden />
        </a>
        <Tooltip
          className="flat-breaks sm:flat-none"
          id="callback-urls-tooltip"
          place="top-start"
        />
      </div>
      {Array.from({ length: CALLBACK_URLS_LIMIT }).map((_, index) => {
        const name = `callback_url${index > 0 ? `_${index + 1}` : ''}`;
        return (
          <input
            className={clsx(
              'mt-2 h-10 appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15',
              index > visibleInputIndex && 'hidden'
            )}
            id={`callback_url_${index}`}
            name={name}
            type="text"
            {...register(name)}
            key={index}
          />
        );
      })}
      <button
        className={clsx(
          'mb-1 mt-2 inline-flex items-center gap-x-2',
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
        <AddIcon className="h-3.5 w-3.5" />
        <span className="text-sm leading-none">Add another URL</span>
      </button>
    </fieldset>
  );
};

CallbackUrlFields.propTypes = {
  register: PropTypes.func.isRequired,
};

export default CallbackUrlFields;
