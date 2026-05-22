import PropTypes from 'prop-types';

import { getStatusStyle } from 'utils/api-style';
import { cn } from 'utils/cn';

const ApiResponse = ({ status, description, descriptionHtml, children, className }) => (
  <div className={cn('api-response my-4', className)}>
    <div className="mb-3 flex items-start gap-3">
      <span
        className={cn(
          'mt-0.5 shrink-0 rounded border px-2 py-0.5 font-mono text-[11px] leading-normal font-semibold',
          getStatusStyle(status)
        )}
      >
        {status}
      </span>
      {descriptionHtml ? (
        <div
          className="text-sm text-gray-new-30 dark:text-gray-new-70 [&_code]:rounded [&_code]:bg-gray-new-95 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:dark:bg-gray-new-15 [&_li]:mt-1 [&_p+p]:mt-2 [&_strong]:font-semibold [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-4"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ) : (
        description && (
          <span className="text-sm text-gray-new-30 dark:text-gray-new-70">{description}</span>
        )
      )}
    </div>
    {children && <div className="[&_.code-block]:mt-0 [&_.code-block]:mb-0">{children}</div>}
  </div>
);

ApiResponse.propTypes = {
  status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  description: PropTypes.string,
  descriptionHtml: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ApiResponse;
