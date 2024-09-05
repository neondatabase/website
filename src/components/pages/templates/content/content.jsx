'use client';

import { useCallback, useState } from 'react';

import DropdownFilterBar from 'components/pages/templates/dropdown-filter-bar';
import FilterBar from 'components/pages/templates/filter-bar';
import TemplatesList from 'components/pages/templates/templates-list';
import templates from 'utils/data/templates';

const filters = [
  {
    type: 'Type',
    items: [
      { name: 'Starter', value: 'starter' },
      { name: 'Chatbot', value: 'chatbot' },
      { name: 'Engine', value: 'engine' },
    ],
  },
  {
    type: 'Framework',
    items: [
      { name: 'Next.js', value: 'next.js' },
      { name: 'LlamaIndex', value: 'llamaindex' },
      { name: 'LangChain', value: 'langchain' },
      { name: 'Astro', value: 'astro' },
      { name: 'Express', value: 'express' },
      { name: 'Fastify', value: 'fastify' },
      { name: 'Hono', value: 'hono' },
      { name: 'Nest.js', value: 'nestjs' },
      { name: 'Node.js', value: 'nodejs' },
      { name: 'Python', value: 'python' },
      { name: 'Remix', value: 'remix' },
      { name: 'Solid Start', value: 'solidstart' },
      { name: 'SvelteKit', value: 'sveltekit' },
      { name: 'Waku', value: 'waku' },
      { name: 'Angular', value: 'angular' },
      { name: 'Wasp', value: 'wasp' },
      { name: 'Analog', value: 'analog' },
    ],
  },
  {
    type: 'CSS',
    items: [{ name: 'TailwindCSS', value: 'tailwindcss' }],
  },
];

const updateFilters = (prevFilters, type, value, isChecked) => ({
  ...prevFilters,
  [type]: isChecked
    ? [...(prevFilters[type] || []), value]
    : (prevFilters[type] || []).filter((v) => v !== value),
});

const filterTemplates = (templates, filters) =>
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

  return (
    <>
      <TemplatesList
        className="col-span-4 max-w-[703px] lg:order-1 lg:mt-8 lg:max-w-full sm:mt-6"
        templates={filteredTemplates.items}
      />
      <aside className="col-span-1">
        <DropdownFilterBar
          className="hidden lg:grid"
          filters={filters}
          filteredTemplates={filteredTemplates}
          setFilteredTemplates={setFilteredTemplates}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
        />
        <FilterBar
          className="lg:hidden"
          filters={filters}
          filteredTemplates={filteredTemplates}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
        />
      </aside>
    </>
  );
};

export default Content;
