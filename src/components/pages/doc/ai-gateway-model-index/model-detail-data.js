const BASE_TABLE_OF_CONTENTS = [
  { title: 'About', id: 'about' },
  { title: 'Command', id: 'command' },
];

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const getSections = (row) => [
  { title: 'Model ID', id: 'model-id', value: row.id },
  {
    title: 'Provider',
    id: 'provider',
    value: `${row.providerName} provides ${row.name}. Access the model through the Neon AI Gateway using ${row.endpoints.join(' and ')}.`,
  },
  { title: 'Inputs', id: 'inputs', value: capitalize(row.inputsLabel) },
  { title: 'Context', id: 'context', value: row.contextLabel },
  { title: 'Released', id: 'released', value: row.releaseLabel },
  { title: 'Input /M', id: 'input-m', value: row.costInputLabel },
  { title: 'Output /M', id: 'output-m', value: row.costOutputLabel },
];

const getModelDetailPageData = (row) => {
  const sections = getSections(row);

  return {
    content: sections.map(({ title, value }) => `## ${title}\n\n${value}`).join('\n\n'),
    tableOfContents: [...BASE_TABLE_OF_CONTENTS, ...sections].map(({ title, id }, index) => ({
      title,
      id,
      level: 1,
      index,
    })),
  };
};

export default getModelDetailPageData;
