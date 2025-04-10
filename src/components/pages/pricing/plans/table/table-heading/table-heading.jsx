import clsx from 'clsx';
import { usePostHog } from 'posthog-js/react';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';

const TableHeading = ({
  className,
  planId,
  label,
  price,
  buttonUrl,
  buttonText,
  isLabelsColumn,
  isFeaturedPlan,
}) => {
  const posthog = usePostHog();

  // placeholder for the labels column
  if (isLabelsColumn) {
    return <div className="invisible h-[120px]" aria-hidden />;
  }

  return (
    <div className={clsx('relative z-10 h-[120px] w-40 xl:w-[156px]', className)}>
      <h3
        className={clsx(
          isFeaturedPlan && 'text-green-45',
          'text-2xl font-medium leading-none tracking-extra-tight md:text-xl'
        )}
      >
        {label}
      </h3>
      <span
        className="mt-3 block leading-snug tracking-extra-tight [&_span]:tracking-extra-tight [&_span]:text-gray-new-70"
        dangerouslySetInnerHTML={{ __html: price }}
      />
      <Button
        className={clsx(
          'mt-5 h-10 w-full !font-medium tracking-tight md:h-8',
          isFeaturedPlan ? '!font-semibold' : 'bg-opacity-80 !font-medium'
        )}
        size="xs"
        theme={isFeaturedPlan ? 'primary' : 'gray-15'}
        to={buttonUrl}
        tagName={`Details Table Top > ${label}`}
        onClick={() => {
          posthog.capture('ui_interaction', {
            action: 'pricing_page_get_started_clicked',
            plan: planId,
            place: 'table_heading',
          });
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

TableHeading.propTypes = {
  className: PropTypes.string,
  planId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  isLabelsColumn: PropTypes.bool.isRequired,
  isFeaturedPlan: PropTypes.bool.isRequired,
};

export default TableHeading;
