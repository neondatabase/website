'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import InfoWarningIcon from 'icons/docs/sidebar/info-warning-icon.inline.svg';

import { useDocsVersionContext } from '../version-context';

const VersionFallbackNotice = ({
  className = null,
  effectiveVersion = null,
}) => {
  const context = useDocsVersionContext();
  const effective = effectiveVersion || context.effectiveVersion;
  const isDeprecatedView = !!effective?.isDeprecated;

  if (!isDeprecatedView) return null;

  return (
    <div
      className={clsx(
        'dark:border-orange-35/45 dark:bg-orange-35/10 dark:text-orange-35 mb-7 flex items-start gap-2 border border-[#F99D5180] px-4 py-3 text-sm leading-snug tracking-extra-tight text-[#F99D51]',
        className
      )}
    >
      <InfoWarningIcon className="mt-0.5 size-4 shrink-0" />
      <p>You are currently viewing documentation for {effective.label.toLowerCase()} of Neon.</p>
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
