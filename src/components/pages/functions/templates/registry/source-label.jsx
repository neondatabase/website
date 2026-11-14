import PropTypes from 'prop-types';

import { cn } from 'utils/cn';
import {
  REGISTRY_COMMUNITY_CATEGORY,
  REGISTRY_FIRST_PARTY_CATEGORY,
  REGISTRY_PARTNER_CATEGORY,
  registryCategoryLabel,
  registryTemplateSource,
} from 'utils/function-registry';

const SOURCE_MARKER_CLASS_NAMES = {
  [REGISTRY_FIRST_PARTY_CATEGORY]: 'bg-[#00e599]',
  [REGISTRY_PARTNER_CATEGORY]: 'bg-blue-70',
  [REGISTRY_COMMUNITY_CATEGORY]: 'bg-gray-new-80',
};

const FunctionRegistrySourceLabel = ({ template, className = null }) => {
  const source = registryTemplateSource(template);
  if (!source) return null;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-[7px] border border-[#303236] bg-white/[0.03] px-2 py-1 font-mono text-[11px] leading-[14px] font-medium tracking-[0.04em] whitespace-nowrap text-[#e4e5e7] uppercase',
        className
      )}
    >
      <span className={cn('size-[5px] shrink-0', SOURCE_MARKER_CLASS_NAMES[source])} aria-hidden />
      {registryCategoryLabel(source)}
    </span>
  );
};

FunctionRegistrySourceLabel.propTypes = {
  template: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  className: PropTypes.string,
};

export default FunctionRegistrySourceLabel;
