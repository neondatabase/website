'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import { cn } from 'utils/cn';

const COLLAPSED_FEATURE_COUNT = 4;

const FeatureLink = ({ feature, className }) =>
  feature.href ? (
    <Link className={cn('transition-colors duration-200', className)} to={feature.href}>
      {feature.label}
    </Link>
  ) : (
    <span className={className}>{feature.label}</span>
  );

FeatureLink.propTypes = {
  feature: PropTypes.shape({ label: PropTypes.string, href: PropTypes.string }).isRequired,
  className: PropTypes.string,
};

const BuiltWithList = ({ features }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hiddenCount = Math.max(features.length - COLLAPSED_FEATURE_COUNT, 0);

  return (
    <>
      <ul className="flex flex-col gap-3">
        {features.map((feature, index) => (
          <li
            key={feature.id}
            className={cn(
              'group/feature',
              !isExpanded && index >= COLLAPSED_FEATURE_COUNT && 'hidden'
            )}
          >
            <FeatureLink
              feature={feature}
              className="text-white group-has-[ul_a:focus-visible]/feature:text-green-45 group-has-[ul_a:hover]/feature:text-green-45 hover:text-green-45"
            />
            {feature.types.length > 0 && (
              <ul className="mt-1.5 ml-1 flex flex-col" aria-label={`${feature.label} types`}>
                {feature.types.map((type) => (
                  <li
                    key={type.id}
                    className="relative py-1 pl-4 before:absolute before:top-0 before:left-0 before:h-full before:w-px before:bg-gray-new-30 after:absolute after:top-1/2 after:left-0 after:h-px after:w-2.5 after:bg-gray-new-30 last:before:h-1/2"
                  >
                    <FeatureLink
                      feature={type}
                      className="text-sm text-gray-new-60 hover:text-white"
                    />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={isExpanded}
          className="mt-3 w-fit font-mono text-xs leading-none tracking-tight text-gray-new-50 uppercase underline-offset-4 transition-colors hover:text-white hover:underline"
          onClick={() => setIsExpanded((value) => !value)}
        >
          {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </>
  );
};

const featureLinkShape = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
};

BuiltWithList.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      ...featureLinkShape,
      types: PropTypes.arrayOf(PropTypes.shape(featureLinkShape)).isRequired,
    })
  ).isRequired,
};

export default BuiltWithList;
