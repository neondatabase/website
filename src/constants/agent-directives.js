// Agent-directed lines for the generated markdown (src/scripts and scripts/generate-api-ref.mjs).
// CommonJS so the build scripts can require it. Markdown only: in agent testing, the same note
// in the sr-only HTML text read as a hidden instruction, and agent detection serves most agents
// the markdown anyway.

const { render, toText } = require('@copybook/core');

// The note is defined in agent-prompts.mjs, which Node.js 22.12+ can require.
const { skillsNote } = require('./agent-prompts.mjs');

const AGENT_SKILLS_NOTE = toText(render(skillsNote));

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
