import clsx from 'clsx';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import useClickOutside from 'hooks/use-click-outside';

import ChevronDownIcon from './images/chevron.inline.svg';
import CloseIcon from './images/close.inline.svg';

const variants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.2,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
  },
};

function getButtonText(filter, filteredTemplates) {
  if (filter.items.length === 0) return filter.type;

  const selectedFilters = filteredTemplates.filters[filter.type.toLowerCase()];
  if (!selectedFilters || selectedFilters.length === 0) return filter.type;

  return selectedFilters
    .map((value) => filter.items.find((item) => item.value.toLowerCase() === value)?.name)
    .filter(Boolean)
    .join(', ');
}

const DropdownFilter = ({
  filter,
  filteredTemplates,
  setFilteredTemplates,
  handleFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useClickOutside([dropdownRef], handleClickOutside);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const clearFilters = () => {
    setFilteredTemplates({
      filters: {
        ...filteredTemplates.filters,
        [filter.type.toLowerCase()]: [],
      },
      items: filteredTemplates.items,
    });
  };

  return (
    <div className="relative flex" ref={dropdownRef}>
      <button
        className="relative line-clamp-1 inline-flex h-10 w-full items-center rounded border border-gray-new-80/80 pl-3 pr-[52px] text-sm leading-none tracking-extra-tight dark:border-gray-new-20"
        type="button"
        onClick={toggleDropdown}
      >
        <span className="h-full content-center truncate">
          {getButtonText(filter, filteredTemplates)}
        </span>
      </button>

      {filteredTemplates.filters[filter.type.toLowerCase()]?.length > 0 && (
        <button className="absolute bottom-3 right-9 top-3" type="button" onClick={clearFilters}>
          <CloseIcon className="h-4 w-4 text-black-new dark:text-white" />
          <span className="sr-only">Clear filter</span>
        </button>
      )}

      <ChevronDownIcon className="absolute bottom-3 right-3 top-3 h-4 w-4 text-black-new dark:text-white" />

      <LazyMotion features={domAnimation}>
        <AnimatePresence initial={false}>
          {isOpen && (
            <m.div
              className="absolute left-0 right-0 top-full z-10 mt-1.5 rounded border border-gray-new-94 bg-white p-4 dark:border-gray-new-15 dark:bg-black-new dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,0.50)]"
              initial="closed"
              animate="open"
              exit="closed"
              variants={variants}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div
                className="flex flex-col gap-y-3"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {filter.items.map(({ name, value }) => (
                  <label
                    className="flex items-center gap-2.5 text-sm leading-tight text-gray-new-10 dark:text-gray-new-90"
                    key={value}
                  >
                    <input
                      className={`
                        h-4 w-4 appearance-none rounded-sm border
                        border-gray-new-70 bg-center bg-no-repeat
                        transition-colors duration-100
                        checked:border-black-new checked:bg-black-new
                        checked:bg-[url('/images/templates/check-light-mode.svg')]
                        dark:border-gray-new-30 dark:checked:border-white dark:checked:bg-white
                        dark:checked:bg-[url('/images/templates/check-dark-mode.svg')]
                      `}
                      key={value}
                      type="checkbox"
                      value={value}
                      checked={
                        filteredTemplates.filters[filter.type.toLowerCase()]?.includes(
                          value.toLowerCase()
                        ) || false
                      }
                      onChange={handleFilterChange(filter.type, value)}
                    />
                    {name}
                  </label>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-x-2.5">
                <button
                  className="inline-flex h-7 items-center justify-center rounded-full border border-gray-new-70 bg-gray-new-98 px-4 text-[13px] font-medium leading-none tracking-tighter dark:border-gray-new-30 dark:bg-gray-new-10 dark:text-gray-new-80"
                  type="button"
                  onClick={clearFilters}
                >
                  Clear
                </button>
                <button
                  className="inline-flex h-7 items-center justify-center rounded-full border border-gray-new-98 bg-gray-new-98 px-4 text-[13px] font-medium leading-none tracking-tighter dark:border-gray-new-15 dark:bg-gray-new-15 dark:text-gray-new-80"
                  type="button"
                  onClick={toggleDropdown}
                >
                  Done
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
};

DropdownFilter.propTypes = {
  filter: PropTypes.object.isRequired,
  filteredTemplates: PropTypes.object.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  setFilteredTemplates: PropTypes.func.isRequired,
};

const DropdownFilterBar = ({
  className,
  filters,
  filteredTemplates,
  setFilteredTemplates,
  handleFilterChange,
}) => (
  <div className={clsx(className, 'md: grid grid-cols-3 gap-x-4 md:grid-cols-1 md:gap-y-3.5')}>
    {filters.map((filter) => (
      <DropdownFilter
        key={filter.type}
        filter={filter}
        filteredTemplates={filteredTemplates}
        handleFilterChange={handleFilterChange}
        setFilteredTemplates={setFilteredTemplates}
      />
    ))}
  </div>
);

DropdownFilterBar.propTypes = {
  className: PropTypes.string,
  filters: PropTypes.array.isRequired,
  filteredTemplates: PropTypes.object.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  setFilteredTemplates: PropTypes.func.isRequired,
};

export default DropdownFilterBar;
