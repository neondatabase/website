import PropTypes from 'prop-types';

import { cn } from 'utils/cn';
import {
  REGISTRY_COMMUNITY_CATEGORY,
  REGISTRY_FIRST_PARTY_CATEGORY,
  REGISTRY_PARTNER_CATEGORY,
  registryCategoryLabel,
  registryTemplateSource,
} from 'utils/function-registry';

const SOURCE_COLOR_CLASS_NAMES = {
  [REGISTRY_FIRST_PARTY_CATEGORY]: 'border-green-45/40 text-green-45',
  [REGISTRY_PARTNER_CATEGORY]: 'border-blue-70/40 text-blue-70',
  [REGISTRY_COMMUNITY_CATEGORY]: 'border-gray-new-40 text-gray-new-80',
};

const FunctionRegistrySourceLabel = ({ template, className = null }) => {
  const source = registryTemplateSource(template);
  if (!source) return null;

  return (
    <span
      className={cn(
        'font-mono font-medium tracking-tight uppercase',
        SOURCE_COLOR_CLASS_NAMES[source],
        className,
        'leading-none'
      )}
    >
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
