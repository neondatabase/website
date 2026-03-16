import clsx from 'clsx';
import PropTypes from 'prop-types';

import CalloutIcon from 'icons/arrow-label.inline.svg';

const Callout = ({ children = null, title = 'Good to know' }) => (
  <figure
    className={clsx(
      'callout not-prose my-8 flex flex-col gap-3.5 border px-5 pb-5 pt-4',
      'border-gray-new-80 bg-[rgba(228,241,235,0.4)]',
      'dark:border-gray-new-20 dark:bg-gray-new-8'
    )}
  >
    <div className="flex items-center gap-1.5 text-[#FF3621]">
      <CalloutIcon className="h-auto w-2.5 shrink-0" width={12} height={14} />
      <span className="font-mono text-xs font-medium uppercase leading-none tracking-normal text-gray-new-30 dark:text-gray-new-80">
        {title}
      </span>
    </div>
    <hr className="m-0 border-0 border-t border-gray-new-80 dark:border-gray-new-20" />
    <div className="callout-content flex flex-col gap-2.5 text-base font-normal leading-snug tracking-extra-tight text-gray-new-30 dark:text-gray-new-80">
      {children}
    </div>
  </figure>
);

Callout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Callout;
