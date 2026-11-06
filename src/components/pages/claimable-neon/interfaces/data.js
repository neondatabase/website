export const CODE_EXAMPLES = {
  agent: `GET https://neon.com/auth.md

POST https://claimable.neon.tech/v1/agent/identity
Content-Type: application/json

{
  "type": "anonymous",
  "capabilities": ["postgres", "data_api", "auth"]
}`,
  cli: `npm i -g neon@latest
neon claim create \\
  --service data-api \\
  --service auth \\
  --env-pull

neon branches list
neon claim accept --no-open`,
  config: `import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  auth: true,
  dataApi: true,
});`,
};

export const INTERFACES = [
  {
    id: 'agent',
    label: 'auth.md',
    language: 'http',
    title: 'Discover and register',
    description:
      'Start from one text document, request capabilities, and exchange the identity assertion for short-lived access tokens.',
  },
  {
    id: 'cli',
    label: 'Neon CLI',
    language: 'bash',
    title: 'Use existing commands',
    description:
      'Create a claimable project, then branch, query, and configure it with the same CLI commands used for regular projects.',
  },
  {
    id: 'config',
    label: 'neon.ts',
    language: 'typescript',
    title: 'Declare services',
    description:
      'If neon.ts is present, Neon requests the declared services and keeps unavailable ones denied until the project is claimed.',
  },
];
