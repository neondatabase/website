import PropTypes from 'prop-types';

import { TYPE_STYLES } from 'utils/api-style';
import { cn } from 'utils/cn';

const ApiParam = ({
  name,
  type,
  in: location,
  required = false,
  deprecated = false,
  default: defaultValue,
  children,
  className,
}) => {
  const typeStyle = TYPE_STYLES[type] ?? TYPE_STYLES.string;

  return (
    <div
      className={cn(
        'api-param border-b border-gray-new-90 py-4 first:border-t dark:border-gray-new-20',
        className
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
        <code
          className={cn(
            'font-mono text-[13px] font-semibold',
            deprecated
              ? 'text-gray-new-50 line-through dark:text-gray-new-50'
              : 'text-black-pure dark:text-white'
          )}
        >
          {name}
        </code>
        {deprecated && (
          <span className="bg-yellow-400/15 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400 rounded px-1.5 py-0.5 font-mono text-[10px] leading-normal font-medium">
            deprecated
          </span>
        )}
        {type && (
          <span
            className={cn(
              'rounded px-1.5 py-0.5 font-mono text-[10px] leading-normal font-medium',
              typeStyle
            )}
          >
            {type}
          </span>
        )}
        {location && (
          <span className="text-[11px] leading-normal font-medium text-gray-new-50 dark:text-gray-new-60">
            {location}
          </span>
        )}
        <span
          className={cn(
            'ml-auto rounded px-1.5 py-0.5 text-[10px] leading-normal font-semibold uppercase',
            required
              ? 'bg-[#E2301D]/10 text-[#E2301D] dark:bg-[#FF5645]/10 dark:text-[#FF5645]'
              : 'bg-gray-new-50/10 text-gray-new-50 dark:bg-gray-new-60/10 dark:text-gray-new-60'
          )}
        >
          {required ? 'required' : 'optional'}
        </span>
      </div>
      {children && (
        <div className="mt-2 text-sm leading-relaxed text-gray-new-20 dark:text-gray-new-85 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {children}
        </div>
      )}
      {defaultValue !== undefined && defaultValue !== null && (
        <p className="mt-1.5 font-mono text-[11px] text-gray-new-50 dark:text-gray-new-60">
          Default:{' '}
          <span className="text-gray-new-30 dark:text-gray-new-80">{String(defaultValue)}</span>
        </p>
      )}
    </div>
  );
};

ApiParam.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([null, 'string', 'integer', 'number', 'boolean', 'object', 'array']),
  in: PropTypes.oneOf(['path', 'query', 'body', 'header']),
  required: PropTypes.bool,
  deprecated: PropTypes.bool,
  default: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ApiParam;
