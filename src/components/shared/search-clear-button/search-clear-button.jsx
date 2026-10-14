import PropTypes from 'prop-types';

import CloseIcon from 'icons/close-small.inline.svg';
import { cn } from 'utils/cn';

const SearchClearButton = ({ className, onClick }) => (
  <button
    className={cn(
      'absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center text-gray-new-60 transition-colors hover:text-white',
      className
    )}
    type="button"
    aria-label="Clear search"
    onClick={onClick}
  >
    <CloseIcon className="size-4" aria-hidden />
  </button>
);

SearchClearButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default SearchClearButton;
