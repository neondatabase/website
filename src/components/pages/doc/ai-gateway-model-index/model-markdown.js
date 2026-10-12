const capabilities = require('../../../../app/models/capabilities.json');
const modelsData = require('../../../../app/models.json/data.json');

const modelRows = require('./model-rows');

const BASE_URL = 'https://neon.com';
const MODEL_TABLE_HEADER =
  '| Model | Model ID | Inputs | Context | Released | Reasoning | Input /M | Output /M | Endpoints | License |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |';

const escapeTableCell = (value) =>
  String(value)
    .replace(/\r?\n|\r/g, '<br>')
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|');

const escapeLinkLabel = (value) =>
  String(value)
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\[/g, '\\[')
    .replace(/]/g, '\\]')
    .replace(/\|/g, '\\|');

const renderCodeCell = (value) => {
  const text = String(value);

  if (!/[|`\r\n]/.test(text)) return `\`${text}\``;

  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;')
    .replace(/`/g, '&#96;')
    .replace(/\r?\n|\r/g, '&#10;');

  return `<code>${escaped}</code>`;
};

const renderModelTableRows = (rows) =>
  rows
    .map((row) =>
      [
        `[${escapeLinkLabel(row.name)}](${BASE_URL}/docs/ai-gateway/models/${encodeURIComponent(
          row.id
        )}.md)`,
        renderCodeCell(row.id),
        escapeTableCell(row.inputsLabel),
        escapeTableCell(row.contextLabel),
        escapeTableCell(row.releaseLabel),
        row.reasoning ? 'Yes' : '—',
        escapeTableCell(row.costInputLabel),
        escapeTableCell(row.costOutputLabel),
        escapeTableCell(row.endpoints.join(' · ') || '—'),
        row.openWeights ? 'Open weights' : '—',
      ].join(' | ')
    )
    .map((line) => `| ${line} |`)
    .join('\n');

const renderProviderTables = (rows, headingDepth) =>
  modelRows
    .groupByProvider(rows)
    .map(
      (group) =>
        `${headingDepth} ${group.label}\n\n${MODEL_TABLE_HEADER}\n${renderModelTableRows(group.rows)}`
    )
    .join('\n\n');

const EMBEDDING_TABLE_HEADER =
  '| Model | Model ID | Dimensions | Released | Input /M | Endpoints | License |\n' +
  '| --- | --- | --- | --- | --- | --- | --- |';

const renderEmbeddingTableRows = (rows) =>
  rows
    .map((row) =>
      [
        `[${escapeLinkLabel(row.name)}](${BASE_URL}/docs/ai-gateway/models/${encodeURIComponent(
          row.id
        )}.md)`,
        renderCodeCell(row.id),
        escapeTableCell(row.dimensions),
        escapeTableCell(row.releaseLabel),
        escapeTableCell(row.costInputLabel),
        escapeTableCell(row.endpoints.join(' · ') || '—'),
        row.openWeights ? 'Open weights' : '—',
      ].join(' | ')
    )
    .map((line) => `| ${line} |`)
    .join('\n');

const renderAiGatewayModelIndex = (rows = modelRows.buildRows(modelsData.neon, capabilities)) => {
  const embeddingRows = rows.filter((row) => row.isEmbedding);
  const textRows = rows.filter((row) => row.inputs.includes('text') && !row.isEmbedding);
  const imageRows = rows.filter((row) => row.isImageCapable);
  const otherRows = rows.filter(
    (row) => !row.inputs.includes('text') && !row.isImageCapable && !row.isEmbedding
  );
  const unavailableRows = rows.filter((row) => !row.hasMeasuredCapabilities);
  const sections = ['### Text models', renderProviderTables(textRows, '####')];

  sections.push(
    'Select a linked model for code examples matched to its measured AI Gateway capabilities.'
  );

  if (unavailableRows.length > 0) {
    sections.push(
      `Verified code examples are not currently available for: ${unavailableRows
        .map((row) => renderCodeCell(row.id))
        .join(', ')}.`
    );
  }

  if (imageRows.length > 0) {
    sections.push('### Image models');
    sections.push(
      'These models support image generation through the Responses API (base URL `/openai/v1`):'
    );
    sections.push(renderProviderTables(imageRows, '####'));
    sections.push('Select a linked model for image-generation examples matched to that model.');
  }

  if (otherRows.length > 0) {
    sections.push('### Other models');
    sections.push('These models use other input modalities supported by AI Gateway:');
    sections.push(renderProviderTables(otherRows, '####'));
  }

  if (embeddingRows.length > 0) {
    sections.push('### Embedding models');
    sections.push(
      'These models return a fixed-length vector on `POST /v1/embeddings` rather than generating text — a different endpoint from every model above:'
    );
    sections.push(`${EMBEDDING_TABLE_HEADER}\n${renderEmbeddingTableRows(embeddingRows)}`);
    sections.push('Select a linked model for embeddings-specific code examples.');
  }

  sections.push(modelRows.MODEL_CATALOG_NOTE);

  return sections.join('\n\n');
};

module.exports = {
  MODEL_TABLE_HEADER,
  EMBEDDING_TABLE_HEADER,
  escapeTableCell,
  escapeLinkLabel,
  renderCodeCell,
  renderModelTableRows,
  renderEmbeddingTableRows,
  renderProviderTables,
  renderAiGatewayModelIndex,
};
