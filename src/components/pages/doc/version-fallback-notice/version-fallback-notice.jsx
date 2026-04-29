'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import InfoWarningIcon from 'icons/docs/sidebar/info-warning-icon.inline.svg';

const VersionFallbackNotice = ({ className = null, effectiveVersion = null }) => {
  const isDeprecatedView = !!effectiveVersion?.isDeprecated;

  if (!isDeprecatedView) return null;

  return (
    <div
      className={clsx(
        'mb-7 flex items-start gap-2 border border-[#EC6F0980] bg-[#FEF6F0] px-4 py-3 text-sm leading-snug tracking-extra-tight text-[#EC6F09] dark:border-[#F99D5180] dark:bg-[#0F0905] dark:text-[#F99D51]',
        className
      )}
    >
      <InfoWarningIcon className="mt-0.5 size-4 shrink-0" />
      <p>You are currently viewing documentation for {effectiveVersion.label.toLowerCase()} of Neon.</p>
    </div>
  );
};

VersionFallbackNotice.propTypes = {
  className: PropTypes.string,
  effectiveVersion: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isDeprecated: PropTypes.bool,
  }),
};

export default VersionFallbackNotice;
