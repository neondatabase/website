import PropTypes from 'prop-types';

const FilterBar = ({ className, filters, filteredTemplates, handleSearch, handleFilterChange }) => (
  <form className={className}>
    <input
      className="h-9 rounded border border-gray-new-80/80 bg-transparent bg-[url('/images/templates/search-light-mode.svg')] bg-[left_0.625rem_center] bg-no-repeat p-2.5 pl-[34px] text-sm leading-none tracking-extra-tight text-gray-new-70 focus:outline-none dark:border-gray-new-20 dark:bg-[url('/images/templates/search-dark-mode.svg')]"
      type="search"
      placeholder="Search"
      onChange={handleSearch}
    />
    <ul className="mt-8 flex flex-col divide-y divide-gray-new-80/80 dark:divide-gray-new-15/80">
      {filters.map(({ type, items }) => (
        <li className="flex flex-col pb-6 pt-6 first:pt-0 last:pb-0" key={type}>
          <fieldset>
            <legend className="block font-semibold leading-tight tracking-extra-tight">
              {type}
            </legend>
            <div className="mt-4 flex flex-col gap-y-3">
              {items.map(({ name, value }) => (
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
          </fieldset>
        </li>
      ))}
    </ul>
  </form>
);

FilterBar.propTypes = {
  className: PropTypes.string,
  filters: PropTypes.array.isRequired,
  handleSearch: PropTypes.func.isRequired,
  filteredTemplates: PropTypes.shape({
    filters: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
  }).isRequired,

  handleFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;
