'use client';

import { useState } from 'react';

import FilterBar from 'components/pages/templates/filter-bar';
import TemplatesList from 'components/pages/templates/templates-list';
import templates from 'utils/data/templates';

const Content = () => {
  const [filteredTemplates, setFilteredTemplates] = useState({
    filters: {},
    items: templates,
  });
  return (
    <>
      <TemplatesList templates={filteredTemplates.items} />
      <aside className="col-span-1">
        <FilterBar
          templates={templates}
          filteredTemplates={filteredTemplates}
          setFilteredTemplates={setFilteredTemplates}
        />
      </aside>
    </>
  );
};

export default Content;
