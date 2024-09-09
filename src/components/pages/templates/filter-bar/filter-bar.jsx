import clsx from 'clsx';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import ChevronRightIcon from './images/chevron-right.inline.svg';

const FilterGroup = ({
  type,
  items,
  filteredTemplates,
  handleFilterChange,
  toggleDropdown,
  isOpen,
}) => {
  const [filterCount, setFilterCount] = useState(0);

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

  useEffect(() => {
    const count = filteredTemplates.filters[type.toLowerCase()]?.length || 0;
    setFilterCount(count);
  }, [filteredTemplates.filters, type]);

  return (
    <li
      className="flex flex-col border-b border-gray-new-80/80 pb-5 pt-5 first:pt-0 last:border-b-0 last:pb-0 dark:border-gray-new-15/80 lg:pb-4 lg:pt-4 lg:last:border-b last:lg:pb-4"
      key={type}
    >
      <fieldset>
        <button
          className="flex w-full items-center justify-between"
          type="button"
          onClick={() => toggleDropdown(type)}
        >
          <div className="flex items-center gap-3">
            <ChevronRightIcon
              className={clsx('h-5 w-5 transition-transform duration-200', isOpen && 'rotate-90')}
            />
            <legend className="block font-medium leading-tight tracking-extra-tight lg:text-sm">
              {type}
            </legend>
          </div>
          {filterCount > 0 && (
            <span className="inline-flex h-5 w-6 items-center justify-center rounded-full bg-gray-new-90 text-[10px] leading-none tracking-extra-tight dark:bg-gray-new-15">
              {filterCount}
            </span>
          )}
        </button>
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            {isOpen && (
              <m.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={variants}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-y-3 pt-4">
                  {items.map(({ name, value }) => (
                    <label
                      className="flex cursor-pointer items-center gap-2.5 text-sm leading-tight text-gray-new-10 dark:text-gray-new-90"
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
                        type="checkbox"
                        name={value}
                        checked={
                          filteredTemplates.filters[type.toLowerCase()]?.includes(
                            value.toLowerCase()
                          ) || false
                        }
                        onChange={handleFilterChange(type, value)}
                      />
                      {name}
                    </label>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </LazyMotion>
      </fieldset>
    </li>
  );
};

FilterGroup.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  filteredTemplates: PropTypes.shape({
    filters: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const FilterBar = ({
  className,
  filters,
  filteredTemplates,
  handleSearch,
  handleFilterChange,
  handleClearAll,
}) => {
  const [openGroup, setOpenGroup] = useState(null);

  const toggleDropdown = (type) => {
    setOpenGroup(openGroup === type ? null : type);
  };

  return (
    <form className={className}>
      <input
        className="h-9 rounded border border-gray-new-80/80 bg-transparent bg-[url('/images/templates/search-light-mode.svg')] bg-[left_0.625rem_center] bg-no-repeat p-2.5 pl-[34px] text-sm leading-none tracking-extra-tight text-gray-new-70 focus:outline-none dark:border-gray-new-20 dark:bg-[url('/images/templates/search-dark-mode.svg')] lg:w-full"
        type="search"
        placeholder="Search"
        onChange={handleSearch}
      />
      <div className="mt-[26px] flex items-center justify-between">
        <span className="font-semibold leading-tight tracking-extra-tight">Filters</span>
        {Object.keys(filteredTemplates.filters).length > 0 && (
          <button
            className="text-sm leading-none tracking-tighter text-gray-new-30 dark:text-gray-new-70"
            type="button"
            onClick={handleClearAll}
          >
            Clear all
          </button>
        )}
      </div>
      <ul className="mt-5 flex flex-col lg:mt-4">
        {filters.map(({ type, items }) => (
          <FilterGroup
            key={type}
            type={type}
            items={items}
            filteredTemplates={filteredTemplates}
            handleFilterChange={handleFilterChange}
            toggleDropdown={toggleDropdown}
            isOpen={openGroup === type}
          />
        ))}
      </ul>
    </form>
  );
};

FilterBar.propTypes = {
  className: PropTypes.string,
  filters: PropTypes.array.isRequired,
  handleSearch: PropTypes.func.isRequired,
  filteredTemplates: PropTypes.shape({
    filters: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  handleClearAll: PropTypes.func.isRequired,
};

export default FilterBar;
