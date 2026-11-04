export const CLIENT_LABELS = {
  chatgpt: 'ChatGPT',
  'claude-code': 'Claude Code',
  'claude-desktop': 'Claude Desktop',
  codex: 'Codex',
  cursor: 'Cursor',
  v0: 'v0',
  perplexity: 'Perplexity',
  opencode: 'OpenCode',
  devin: 'Devin',
  replit: 'Replit',
  manus: 'Manus',
  grok: 'Grok',
  other: 'Other',
};

// Clients that never reach this share in any week are drawn as part of Other in
// the chart; the table still lists them.
export const CHART_MIN_SHARE = 1;

export const CHART_COLORS = [
  '#00E599',
  '#4C97FF',
  '#F0A04B',
  '#B57EDC',
  '#FF6B6B',
  '#3DD6D0',
  '#E5D55B',
];

export const OTHER_COLOR = '#5E6066';

export const getClientLabel = (client) => {
  const label = CLIENT_LABELS[client];
  if (!label) throw new Error(`No label for MCP client "${client}"`);
  return label;
};
