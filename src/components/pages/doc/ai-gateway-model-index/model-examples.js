/**
 * Adapt the measured examples returned by the /models resolver to the compact
 * shape used by the model-detail UI and Markdown renderer.
 *
 * The runnable code remains owned by src/app/models/examples.js. This module
 * only supplies presentation details such as install commands and the shared
 * environment example.
 */

const ENV_EXAMPLE = `# Injected by \`neon env pull\` when AI Gateway is enabled on the branch (neon.ts preview.aiGateway).
# Neon injects ONLY the NEON_AI_GATEWAY_* vars (not OPENAI_*). Build the OpenAI SDK / curl
# apiKey + baseURL from them: apiKey = NEON_AI_GATEWAY_TOKEN (the bearer, nt_live_...).
#
# NEON_AI_GATEWAY_BASE_URL is the bare gateway host (no path). Append the route you need:
#   - \`/v1\`        - unified Chat Completions
#   - \`/openai/v1\` - OpenAI Responses API
# @neondatabase/ai-sdk-provider and Mastra route requests automatically.

NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://<branch-id>-api.ai.<cell>.<region>.<cloud>.neon.tech
`;

const EXAMPLE_KEYS = {
  'ai-sdk': 'aisdk',
  typescript: 'ts',
};
const MODEL_MODES = ['text', 'image'];

const getInstallCommand = ({ dependencies = [], language }) => {
  if (dependencies.length === 0) return null;
  if (language === 'python') return `pip install ${dependencies.join(' ')}`;
  if (language === 'typescript' || language === 'javascript') {
    return `npm i ${dependencies.join(' ')}`;
  }
  return null;
};

const toLanguageOption = (example) => {
  const file = example.files?.[0];
  if (!file?.content) return null;

  return {
    key: EXAMPLE_KEYS[example.id] ?? example.id,
    label: example.title,
    lang: example.language,
    filename: file.path,
    install: getInstallCommand(example),
    code: file.content,
  };
};

const getLanguagesForMode = (examplesByMode, mode) =>
  (examplesByMode[mode] ?? []).map(toLanguageOption).filter(Boolean);

const getAvailableModes = (languagesByMode) =>
  MODEL_MODES.filter((mode) => (languagesByMode[mode]?.length ?? 0) > 0);

const getInitialMode = (languagesByMode, requestedMode) => {
  const availableModes = getAvailableModes(languagesByMode);
  return availableModes.includes(requestedMode) ? requestedMode : (availableModes[0] ?? 'text');
};

module.exports = {
  ENV_EXAMPLE,
  MODEL_MODES,
  getAvailableModes,
  getInstallCommand,
  getInitialMode,
  getLanguagesForMode,
  toLanguageOption,
};
