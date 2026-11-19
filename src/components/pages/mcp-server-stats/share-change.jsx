import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const ShareChange = ({ change, className = null }) => {
  if (change === null) return null;

  if (change === 0) {
    return <span className={cn('text-gray-new-50', className)}>no change</span>;
  }

  const isUp = change > 0;
  return (
    <span className={cn(isUp ? 'text-green-45' : 'text-gray-new-60', className)}>
      <span aria-hidden="true">{isUp ? '▲' : '▼'}</span> {Math.abs(change).toFixed(1)} pts
      <span className="sr-only">{isUp ? ' up' : ' down'} from the week before</span>
    </span>
  );
};

ShareChange.propTypes = {
  change: PropTypes.number,
  className: PropTypes.string,
};

export default ShareChange;
