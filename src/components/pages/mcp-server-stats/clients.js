// Products from the same company share a hue.
export const CLIENTS = {
  codex: { label: 'Codex', color: '#4C97FF' },
  chatgpt: { label: 'ChatGPT', color: '#9BC2FF' },
  'claude-code': { label: 'Claude Code', color: '#F0A04B' },
  'claude-desktop': { label: 'Claude Desktop', color: '#F5C78E' },
  cursor: { label: 'Cursor', color: '#B57EDC' },
  v0: { label: 'v0', color: '#00E599' },
  replit: { label: 'Replit', color: '#FF6B6B' },
  opencode: { label: 'OpenCode', color: '#3DD6D0' },
  'custom-code': { label: 'Custom code', color: '#E5D55B' },
  other: { label: 'Other', color: '#5E6066' },
};

// Buckets the publisher computes rather than a named product; they rank last.
export const GROUPED_CLIENTS = new Set(['custom-code', 'other']);

export const getClient = (client) => {
  const entry = CLIENTS[client];
  if (!entry) throw new Error(`No label for MCP client "${client}"`);
  return entry;
};
