import { getClient } from './clients';

export const SURFACES = [
  { value: 'cli_only', label: 'CLI only' },
  { value: 'cli_and_mcp', label: 'CLI and MCP' },
  { value: 'mcp_only', label: 'MCP only' },
];

export function buildAgentSurfaces(rows) {
  const byAgent = new Map();
  rows.forEach(({ agent, surface, share }) => {
    if (!SURFACES.some(({ value }) => value === surface)) {
      throw new Error(`Unknown agent surface "${agent}:${surface}"`);
    }
    if (!byAgent.has(agent)) byAgent.set(agent, new Map());
    byAgent.get(agent).set(surface, share);
  });

  return [...byAgent]
    .map(([agent, shares]) => {
      const segments = SURFACES.map(({ value, label }) => {
        const share = shares.get(value);
        if (share === undefined) throw new Error(`Missing agent surface "${agent}:${value}"`);
        return { key: value, label, share };
      });
      return {
        key: agent,
        label: getClient(agent).label,
        segments,
        cliShare: segments[0].share + segments[1].share,
      };
    })
    .sort((a, b) => b.cliShare - a.cliShare || a.label.localeCompare(b.label));
}
