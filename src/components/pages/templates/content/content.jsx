'use client';

import { useCallback, useState } from 'react';

import FilterBar from 'components/pages/templates/filter-bar';
import TemplatesList from 'components/pages/templates/templates-list';
import templates from 'utils/data/templates';
import { generateFilters } from 'utils/generate-filters';

const filters = generateFilters(templates);

const updateFilters = (prevFilters, type, value, isChecked) => ({
  ...prevFilters,
  [type]: isChecked
    ? [...(prevFilters[type] || []), value]
    : (prevFilters[type] || []).filter((v) => v !== value),
});

export const filterTemplates = (templates, filters) =>
  templates.filter((template) =>
    Object.entries(filters).every(
      ([type, values]) =>
        values.length === 0 ||
        values.some((value) => template[type].some((t) => t.toLowerCase().includes(value)))
    )
  );

const Content = () => {
  const [filteredTemplates, setFilteredTemplates] = useState({
    filters: {},
    items: templates,
  });

  const handleSearch = useCallback(
    (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredItems = templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm) ||
          template.description.toLowerCase().includes(searchTerm) ||
          template.type.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          template.framework.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          template.css.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
      setFilteredTemplates((prevState) => ({ ...prevState, items: filteredItems }));
    },
    [setFilteredTemplates]
  );

  const handleFilterChange = useCallback(
    (type, value) => (e) => {
      const isChecked = e.target.checked;
      const filterType = type.toLowerCase();
      const filterValue = value.toLowerCase();

      setFilteredTemplates((prevState) => {
        const updatedFilters = updateFilters(prevState.filters, filterType, filterValue, isChecked);
        const filteredItems = filterTemplates(templates, updatedFilters);
        return { filters: updatedFilters, items: filteredItems };
      });
    },
    [setFilteredTemplates]
  );

  const handleClearAll = () => {
    setFilteredTemplates((prevState) => ({ ...prevState, filters: {}, items: templates }));
  };

  return (
    <>
      <TemplatesList
        className="col-span-4 max-w-[703px] lg:order-1 lg:mt-8 lg:max-w-full"
        templates={filteredTemplates.items}
      />
      <aside className="col-span-1">
        <FilterBar
          filters={filters}
          filteredTemplates={filteredTemplates}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
          handleClearAll={handleClearAll}
        />
      </aside>
    </>
  );
};

export default Content;
