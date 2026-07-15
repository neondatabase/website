/**
 * Pure derivation + formatting helpers for the AI Gateway model catalog.
 *
 * Shared (CommonJS) so BOTH the interactive component (model-index-client.jsx)
 * and the llms markdown mirror (src/scripts/process-md-for-llms.js) build rows
 * the same way — the web table and the agent-facing markdown can never disagree.
 *
 * Input is the `neon` provider object from /models.json (models.dev-shaped);
 * each model already carries its underlying maker in `provider`.
 */

const PROVIDER_ORDER = ['anthropic', 'openai', 'google', 'meta', 'alibaba'];

const PROVIDER_LABELS = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  google: 'Google',
  meta: 'Meta',
  alibaba: 'Alibaba',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const providerLabel = (id) => PROVIDER_LABELS[id] || (id ? id[0].toUpperCase() + id.slice(1) : '—');

// e.g. 200000 -> "200K", 1000000 -> "1M".
const formatContextWindow = (tokens) => {
  if (!tokens) return '—';
  if (tokens >= 1000000) {
    const millions = Math.round((tokens / 1000000) * 10) / 10;
    return `${millions}M`;
  }
  return `${Math.round(tokens / 1000)}K`;
};

// Price per million tokens: 0.4 -> "$0.40", 15 -> "$15", 0 -> "Free".
const formatPrice = (pricePerMillion) => {
  if (pricePerMillion === undefined || pricePerMillion === null) return '—';
  if (pricePerMillion === 0) return 'Free';
  const fixed = pricePerMillion.toFixed(2);
  const trimmed = fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed;
  return `$${trimmed}`;
};

// "2026-02-17" -> "Feb 2026". Stable across server/client (no Intl locale drift).
const formatDate = (iso) => {
  if (!iso) return '—';
  const [year, month] = iso.split('-');
  const monthIndex = Number(month) - 1;
  if (!year || Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${MONTHS[monthIndex]} ${year}`;
};

const isResponsesOnly = (model) => model.id.toLowerCase().includes('codex');

// Image tab: OpenAI GPT models that support the Responses image_generation
// tool. Only open-weight gpt-oss is excluded (routes to MLflow, no Responses
// tools); Codex models ARE image-capable (verified live against the gateway).
const isImageCapable = (model) =>
  model.provider === 'openai' && !model.id.toLowerCase().startsWith('gpt-oss');

// The gateway routes a model reaches. Conveyed to users mainly through the
// quickstart snippet's base URL; surfaced here for the markdown mirror.
const deriveEndpoints = (model) => {
  const { provider, id } = model;
  if (provider === 'openai') {
    if (isResponsesOnly(model)) return ['openai/responses'];
    if (id.toLowerCase().startsWith('gpt-oss')) return ['chat/completions'];
    return ['chat/completions', 'openai/responses'];
  }
  if (provider === 'anthropic') return ['chat/completions', 'anthropic/messages'];
  if (provider === 'google') {
    return id.toLowerCase().startsWith('gemma')
      ? ['chat/completions']
      : ['chat/completions', 'gemini'];
  }
  return ['chat/completions'];
};

const toRow = (model) => {
  const inputs = model.modalities?.input ?? [];
  const contextWindow = model.limit?.context;
  const costInput = model.cost?.input;
  const costOutput = model.cost?.output;
  return {
    id: model.id,
    name: model.name,
    provider: model.provider,
    providerName: providerLabel(model.provider),
    inputs,
    inputsLabel: inputs.length ? inputs.join(', ') : '—',
    contextWindow,
    contextLabel: formatContextWindow(contextWindow),
    reasoning: Boolean(model.reasoning),
    costInput,
    costOutput,
    costInputLabel: formatPrice(costInput),
    costOutputLabel: formatPrice(costOutput),
    knowledge: model.knowledge || null,
    releaseDate: model.release_date || null,
    releaseLabel: formatDate(model.release_date),
    openWeights: Boolean(model.open_weights),
    license: model.open_weights ? 'Open weights' : 'Proprietary',
    endpoints: deriveEndpoints(model),
    isImageCapable: isImageCapable(model),
    isResponsesOnly: isResponsesOnly(model),
  };
};

// All rows, sorted by provider order then release date (newest first).
const buildRows = (neonProvider) => {
  const models = neonProvider?.models ?? {};
  return Object.values(models)
    .map(toRow)
    .sort((a, b) => {
      const pa = PROVIDER_ORDER.indexOf(a.provider);
      const pb = PROVIDER_ORDER.indexOf(b.provider);
      const oa = pa === -1 ? 99 : pa;
      const ob = pb === -1 ? 99 : pb;
      if (oa !== ob) return oa - ob;
      return (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '');
    });
};

// Rows grouped into ordered provider sections (used by the markdown mirror).
const groupByProvider = (rows) => {
  const byProvider = new Map();
  for (const row of rows) {
    if (!byProvider.has(row.provider)) byProvider.set(row.provider, []);
    byProvider.get(row.provider).push(row);
  }
  const present = [...byProvider.keys()];
  const ordered = [
    ...PROVIDER_ORDER.filter((p) => byProvider.has(p)),
    ...present.filter((p) => !PROVIDER_ORDER.includes(p)),
  ];
  return ordered.map((providerId) => ({
    providerId,
    label: providerLabel(providerId),
    rows: byProvider.get(providerId),
  }));
};

module.exports = {
  PROVIDER_ORDER,
  PROVIDER_LABELS,
  providerLabel,
  formatContextWindow,
  formatPrice,
  formatDate,
  isResponsesOnly,
  isImageCapable,
  deriveEndpoints,
  toRow,
  buildRows,
  groupByProvider,
};
