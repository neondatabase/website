const BASE_TABLE_OF_CONTENTS = [
  { title: 'About', id: 'about' },
  { title: 'Command', id: 'command' },
];

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const getLabDescription = (row) =>
  row.isDecision
    ? `${row.labName} makes ${row.name}, a System One decision model. It answers questions about a given state with a choice, a probability, or a score; it does not generate text.`
    : row.isEmbedding
      ? `${row.labName} makes ${row.name}. Access it through the Neon AI Gateway's \`POST /v1/embeddings\` endpoint.`
      : row.endpoints.length > 0
        ? `${row.labName} makes ${row.name}. Access the model through the Neon AI Gateway using ${row.endpoints.join(' and ')}.`
        : `${row.labName} makes ${row.name}. Verified AI Gateway code examples are not currently available for this model.`;

// Embeddings has no inputs/context/output-cost to report — a fixed vector length replaces them,
// and there is no completion to charge for.
// A decision model reports the same minus `dimensions`: it has no vector length either.
const getSections = (row) =>
  row.isDecision
    ? [
        { title: 'Model ID', id: 'model-id', value: row.id },
        { title: 'Lab', id: 'lab', value: getLabDescription(row) },
        { title: 'Provider', id: 'provider', value: row.providerName },
        { title: 'Released', id: 'released', value: row.releaseLabel },
        { title: 'Input /M', id: 'input-m', value: row.costInputLabel },
      ]
    : row.isEmbedding
      ? [
          { title: 'Model ID', id: 'model-id', value: row.id },
          { title: 'Lab', id: 'lab', value: getLabDescription(row) },
          { title: 'Provider', id: 'provider', value: row.providerName },
          { title: 'Dimensions', id: 'dimensions', value: String(row.dimensions) },
          { title: 'Released', id: 'released', value: row.releaseLabel },
          { title: 'Input /M', id: 'input-m', value: row.costInputLabel },
        ]
      : [
          { title: 'Model ID', id: 'model-id', value: row.id },
          { title: 'Lab', id: 'lab', value: getLabDescription(row) },
          { title: 'Provider', id: 'provider', value: row.providerName },
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
