const BASE_TABLE_OF_CONTENTS = [
  { title: 'About', id: 'about' },
  { title: 'Command', id: 'command' },
];

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const getProviderDescription = (row) =>
  row.isEmbedding
    ? `${row.providerName} provides ${row.name}. Access it through the Neon AI Gateway's \`POST /v1/embeddings\` endpoint.`
    : row.endpoints.length > 0
      ? `${row.providerName} provides ${row.name}. Access the model through the Neon AI Gateway using ${row.endpoints.join(' and ')}.`
      : `${row.providerName} provides ${row.name}. Verified AI Gateway code examples are not currently available for this model.`;

// Embeddings has no inputs/context/output-cost to report — a fixed vector length replaces them,
// and there is no completion to charge for.
const getSections = (row) =>
  row.isEmbedding
    ? [
        { title: 'Model ID', id: 'model-id', value: row.id },
        { title: 'Provider', id: 'provider', value: getProviderDescription(row) },
        { title: 'Dimensions', id: 'dimensions', value: String(row.dimensions) },
        { title: 'Released', id: 'released', value: row.releaseLabel },
        { title: 'Input /M', id: 'input-m', value: row.costInputLabel },
      ]
    : [
        { title: 'Model ID', id: 'model-id', value: row.id },
        { title: 'Provider', id: 'provider', value: getProviderDescription(row) },
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

module.exports = getModelDetailPageData;
