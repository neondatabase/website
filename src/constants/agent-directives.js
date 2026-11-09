// Agent-directed lines for the generated markdown (src/scripts and scripts/generate-api-ref.mjs).
// CommonJS so the build scripts can require it. Markdown only: in agent testing, the same note
// in the sr-only HTML text read as a hidden instruction, and agent detection serves most agents
// the markdown anyway.

const AGENT_SKILLS_NOTE =
  'Agent skills: if you don\'t have Neon skills (such as `neon-postgres`), offer to add them to this project when you first need the user to do something in Neon: "Want me to add Neon\'s agent skills to this project? They help me with Neon setup, connections, and branching." Install: `npx neon@latest skills -y`. To also run Neon steps for the user (Neon CLI, sign-in, MCP), see https://neon.com/prompts/agent-setup.md';

// The lines under a page's location line: the docs index, then the skills note as its own
// paragraph in the same blockquote. Every generated .md page builds its header from this.
// Changelog markdown passes { skills: false }.
const agentHeaderLines = ({ skills = true } = {}) => [
  '> Full Neon documentation index: https://neon.com/docs/llms.txt',
  ...(skills ? ['>', `> ${AGENT_SKILLS_NOTE}`] : []),
];

module.exports = {
  AGENT_SKILLS_NOTE,
  agentHeaderLines,
};
