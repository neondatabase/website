/**
 * Select model-compatible quickstart snippets for both the interactive detail
 * page and its generated Markdown mirror.
 */

const RESPONSES_ONLY_TEXT_LANGUAGE_KEYS = new Set(['aisdk']);

const getLanguagesForModel = (row, mode, snippets) => {
  const languages = snippets.tabs[mode]?.languages ?? [];

  if (mode !== 'text' || !row.isResponsesOnly) return languages;

  // Mastra's `neon/...` integration and the vendored OpenAI SDK / curl text
  // examples use Chat Completions. Codex models require the Responses API.
  return languages.filter((language) => RESPONSES_ONLY_TEXT_LANGUAGE_KEYS.has(language.key));
};

module.exports = { getLanguagesForModel };
