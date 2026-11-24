import { describe, expect, it } from 'vitest';

import { buildAgentSurfaces } from './surfaces';

const agent = (name, cliOnly, both, mcpOnly) => [
  { agent: name, surface: 'mcp_only', share: mcpOnly },
  { agent: name, surface: 'cli_only', share: cliOnly },
  { agent: name, surface: 'cli_and_mcp', share: both },
];

const rows = [
  ...agent('chatgpt', 0, 0, 100),
  ...agent('codex', 24.1, 7.2, 68.7),
  ...agent('claude-code', 61.1, 9.6, 29.3),
];

describe('buildAgentSurfaces', () => {
  it('ranks agents by CLI use with segments in a fixed order', () => {
    const agents = buildAgentSurfaces(rows);

    expect(agents.map(({ label }) => label)).toEqual(['Claude Code', 'Codex', 'ChatGPT']);
    expect(agents[0].segments.map(({ label, share }) => [label, share])).toEqual([
      ['CLI only', 61.1],
      ['CLI and MCP', 9.6],
      ['MCP only', 29.3],
    ]);
  });

  it('rejects an unlabeled agent, an unknown surface, or a missing one', () => {
    expect(() => buildAgentSurfaces(agent('internal-bot', 50, 0, 50))).toThrow(
      'No label for MCP client "internal-bot"'
    );
    expect(() =>
      buildAgentSurfaces([...rows, { agent: 'codex', surface: 'api', share: 1 }])
    ).toThrow('Unknown agent surface "codex:api"');
    expect(() =>
      buildAgentSurfaces(
        rows.filter(({ agent: name, surface }) => !(name === 'codex' && surface === 'cli_only'))
      )
    ).toThrow('Missing agent surface "codex:cli_only"');
  });
});
