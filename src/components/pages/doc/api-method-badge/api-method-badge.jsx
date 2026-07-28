import PropTypes from 'prop-types';

import { METHOD_FALLBACK_STYLE, METHOD_STYLES } from 'utils/api-style';
import { cn } from 'utils/cn';

const ApiMethodBadge = ({ method, className }) => {
  const normalized = method.toUpperCase();

  return (
    <span
      className={cn(
        'inline-block rounded border px-2 py-0.5 font-mono text-[11px] leading-normal font-semibold uppercase',
        METHOD_STYLES[normalized] ?? METHOD_FALLBACK_STYLE,
        className
      )}
    >
      {normalized}
    </span>
  );
};

ApiMethodBadge.propTypes = {
  method: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ApiMethodBadge;
