import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const BUTTON_CLASS_NAME =
  'flex h-10 min-w-10 items-center justify-center px-2 text-sm font-medium tracking-extra-tight transition-colors md:h-9 md:min-w-9';

const ELLIPSIS = 'ellipsis';

// Always shows the first, last, current, and adjacent pages; gaps collapse to an ellipsis.
const getVisiblePages = (currentPage, pageCount) => {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, pageCount])]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((a, b) => a - b);

  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? [ELLIPSIS, page] : [page]
  );
};

const Pagination = ({ currentPage, pageCount, onPageChange }) => {
  if (pageCount <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-between" aria-label="Template catalog pages">
      <button
        type="button"
        className={cn(BUTTON_CLASS_NAME, 'text-gray-new-60 hover:text-white disabled:invisible')}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <ul className="flex items-center">
        {getVisiblePages(currentPage, pageCount).map((page, index) => (
          <li key={page === ELLIPSIS ? `${ELLIPSIS}-${index}` : page}>
            {page === ELLIPSIS ? (
              <span className="px-2 text-gray-new-50" aria-hidden>
                …
              </span>
            ) : (
              <button
                type="button"
                className={cn(
                  BUTTON_CLASS_NAME,
                  page === currentPage
                    ? 'bg-white text-black-pure'
                    : 'text-gray-new-60 hover:text-white'
                )}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Page ${page}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={cn(BUTTON_CLASS_NAME, 'text-gray-new-60 hover:text-white disabled:invisible')}
        disabled={currentPage >= pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
