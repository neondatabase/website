import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const StatBlock = ({ value, children, className }) => (
  <figure
    className={cn('stat-block not-prose my-8 flex max-w-[580px] flex-col gap-y-1.5', className)}
  >
    <strong className="text-[48px] leading-none font-medium tracking-tighter text-black-pure dark:text-white sm:text-[40px]">
      {value}
    </strong>
    <figcaption className="text-base leading-normal tracking-extra-tight text-gray-new-40 dark:text-gray-new-60">
      {children}
    </figcaption>
  </figure>
);

StatBlock.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default StatBlock;
