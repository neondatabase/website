#!/usr/bin/env node
/**
 * Generate the committed AI Gateway quickstart snippets that back the
 * <AiGatewayModelIndex/> component's expandable per-model quickstart.
 *
 * Source of truth: the tested examples in the (internal) `neondatabase/
 * neon-console-code-examples` repo — the same snippets the Neon Console shows
 * in the Connect dialog's AI Gateway tab:
 *   examples/connection-dialog/ai-gateway/{ai-sdk,mastra,openai-typescript,
 *   openai-python,curl,*-image}.{ts,py,sh} + env.example
 *
 * Each example carries an annotation header (@tab / @label / @env / @install).
 * This script parses that header, strips it, and templatizes the sample model
 * id (claude-haiku-4-5 for text, gpt-5-nano for image) to `__MODEL_ID__` so the
 * component can substitute the selected row's model id at render.
 *
 * Because the examples repo is INTERNAL, the public website CI cannot fetch it.
 * We therefore VENDOR the parsed result: this script reads a LOCAL checkout and
 * writes a self-contained JSON (like the committed neonctl schema.json). Run it
 * whenever the examples change, then commit the regenerated JSON.
 *
 * Usage:
 *   node src/scripts/generate-ai-gateway-snippets.js            # write JSON
 *   node src/scripts/generate-ai-gateway-snippets.js --stdout   # print instead
 *   NEON_CONSOLE_EXAMPLES_DIR=/path/to/neon-console-code-examples \
 *     node src/scripts/generate-ai-gateway-snippets.js          # override source
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');

// Default to a sibling checkout: both repos live under .../neondatabase/.
const SOURCE_DIR =
  process.env.NEON_CONSOLE_EXAMPLES_DIR || path.resolve(REPO_ROOT, '../neon-console-code-examples');
const EXAMPLES_SUBDIR = 'examples/connection-dialog/ai-gateway';

const OUT_PATH = path.resolve(
  __dirname,
  '../components/pages/doc/ai-gateway-model-index/snippets.json'
);

const MODEL_ID_PLACEHOLDER = '__MODEL_ID__';

// The sample model id each tab's examples hard-code (kept runnable in the
// examples repo). Replaced with the placeholder here.
const SAMPLE_MODEL_ID = { text: 'claude-haiku-4-5', image: 'gpt-5-nano' };

// filename -> { tab, key, label, lang, order }. `key`/`label`/`lang` are also
// re-derived from the annotation header, but the tab + display order are an
// editorial decision that lives here (mirrors the console dropdown order).
const FILES = [
  { file: 'ai-sdk.ts', tab: 'text', key: 'aisdk', lang: 'typescript' },
  { file: 'mastra.ts', tab: 'text', key: 'mastra', lang: 'typescript' },
  { file: 'openai-typescript.ts', tab: 'text', key: 'ts', lang: 'typescript' },
  { file: 'openai-python.py', tab: 'text', key: 'python', lang: 'python' },
  { file: 'curl.sh', tab: 'text', key: 'curl', lang: 'bash' },
  { file: 'ai-sdk-image.ts', tab: 'image', key: 'aisdk', lang: 'typescript' },
  { file: 'openai-typescript-image.ts', tab: 'image', key: 'ts', lang: 'typescript' },
  { file: 'openai-python-image.py', tab: 'image', key: 'python', lang: 'python' },
];

// Extract "@key value" annotations regardless of comment style (JS block,
// Python docstring, shell #-comments).
function parseAnnotations(raw) {
  const annotations = {};
  const re = /@(\w+)\s+([^\n\r*]+)/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    annotations[match[1]] = match[2].trim();
  }
  return annotations;
}

// Strip the leading annotation header so only the runnable snippet body remains.
function stripHeader(raw, ext) {
  let body = raw;
  if (ext === '.ts' || ext === '.js') {
    body = body.replace(/^\s*\/\*\*[\s\S]*?\*\/\s*/, '');
  } else if (ext === '.py') {
    body = body.replace(/^\s*"""[\s\S]*?"""\s*/, '');
  } else if (ext === '.sh') {
    const lines = body.split('\n');
    let start = 0;
    while (
      start < lines.length &&
      (/^#!/.test(lines[start]) || /^#\s*@\w+/.test(lines[start]) || lines[start].trim() === '')
    ) {
      start += 1;
    }
    body = lines.slice(start).join('\n');
  }
  return body.replace(/^\n+/, '').replace(/\s+$/, '') + '\n';
}

function templatize(body, tab) {
  const sample = SAMPLE_MODEL_ID[tab];
  return body.split(sample).join(MODEL_ID_PLACEHOLDER);
}

function readExample({ file, tab, key, lang }) {
  const fullPath = path.join(SOURCE_DIR, EXAMPLES_SUBDIR, file);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const annotations = parseAnnotations(raw);
  const ext = path.extname(file);
  const body = templatize(stripHeader(raw, ext), tab);

  // Label: the annotation @label with any " — Image" suffix removed (the tab
  // already separates text vs image).
  const label = (annotations.label || key).replace(/\s*[—-]\s*Image\s*$/i, '').trim();
  const install =
    annotations.install && annotations.install !== 'none (uses curl)' ? annotations.install : null;
  const env = (annotations.env || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  return { key, label, lang, install, env, code: body };
}

function main() {
  const toStdout = process.argv.slice(2).includes('--stdout');

  const exampleDir = path.join(SOURCE_DIR, EXAMPLES_SUBDIR);
  if (!fs.existsSync(exampleDir)) {
    console.error(`AI Gateway examples not found at: ${exampleDir}`);
    console.error(
      'Clone neondatabase/neon-console-code-examples next to this repo, or set NEON_CONSOLE_EXAMPLES_DIR.'
    );
    process.exit(2);
  }

  const tabs = { text: { languages: [] }, image: { languages: [] } };
  for (const entry of FILES) {
    tabs[entry.tab].languages.push(readExample(entry));
  }

  const envExample = fs
    .readFileSync(path.join(exampleDir, 'env.example'), 'utf-8')
    .replace(/\s+$/, '')
    .concat('\n');

  const output = {
    $generatedBy: 'src/scripts/generate-ai-gateway-snippets.js',
    $source: 'neondatabase/neon-console-code-examples · examples/connection-dialog/ai-gateway',
    modelIdPlaceholder: MODEL_ID_PLACEHOLDER,
    tabs,
    envExample,
  };

  const json = `${JSON.stringify(output, null, 2)}\n`;
  if (toStdout) {
    process.stdout.write(json);
  } else {
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, json);
    const count = tabs.text.languages.length + tabs.image.languages.length;
    console.log(`Wrote ${path.relative(process.cwd(), OUT_PATH)} — ${count} snippets`);
  }
}

main();
