// Line-based scanner that pulls `neonctl`/`neon` CLI invocations out of
// `content/docs/**/*.md`. No Markdown AST — tracks fence state and frontmatter
// with simple regexes, same style as other scripts in this repo.
//
// Output: [{ file, line, raw, binary, argv, source: 'fenced' | 'inline' }]
//
// Each argv is the tokenized command minus the leading binary name. Tokens
// like `--key=value` are split into `--key`, `value`. Placeholder tokens
// (`<project-id>`, `${VAR}`, etc.) are preserved verbatim.

const fs = require('fs');
const path = require('path');

const { globSync } = require('glob');

// Entire `content/` tree: docs, guides, changelog, postgresql tutorials, etc.
// Anything the site ships to users is fair game for validation.
const DEFAULT_ROOT = path.join(__dirname, '..', '..', '..', 'content');

const FENCE_RE = /^(\s*)(```+|~~~+)\s*([\w.-]*)/;
const CLI_LINE_RE = /^\s*(?:\$\s+)?(neon(?:ctl)?)\s+(.+?)\s*$/;
const INLINE_RE = /`(neon(?:ctl)?\s+[^`]+)`/g;

// Fenced blocks we scan for commands. Empty string = no language tag.
const SHELL_LANGS = new Set(['', 'bash', 'shell', 'sh', 'console', 'text', 'shouldwrap']);

// Exclude obvious non-command tokens that happen to start with `neon`.
const NON_COMMAND_PREFIX = /^(neon[-.]|neondatabase|neon\+|neon_)/i;

// Top-level command + alias set used by the strict (inline-prose) filter.
// Derived from the committed schema so we never drift as neonctl evolves.
// `completion` is appended because yargs injects it at runtime but the
// source tree doesn't declare it.
function buildTopLevelCommands(schema) {
  const set = new Set(['completion']);
  for (const [name, node] of Object.entries(schema.commands || {})) {
    set.add(name);
    for (const a of node.aliases || []) set.add(a);
  }
  return set;
}

let cachedTopLevel;
function getTopLevelCommands() {
  if (cachedTopLevel) return cachedTopLevel;
  // Lazy require to avoid an import cycle with schema.js consumers that
  // only need the extractor helpers (tokenize, stripFrontmatter, …).
  const { loadSchema } = require('./schema.js');
  cachedTopLevel = buildTopLevelCommands(loadSchema());
  return cachedTopLevel;
}

function stripFrontmatter(content) {
  // Remove the leading --- ... --- block (if any) and return the body plus
  // the number of leading lines we stripped, so reported line numbers stay
  // accurate.
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) {
    return { body: content, offset: 0 };
  }
  const lines = content.split(/\r?\n/);
  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) return { body: content, offset: 0 };
  return {
    body: lines.slice(end + 1).join('\n'),
    offset: end + 1,
  };
}

function joinBackslashContinuations(lines) {
  // Returns an array of { text, line } where consecutive backslash-
  // continued lines are collapsed into a single logical line, and the
  // reported line is the first physical line of the run.
  const out = [];
  let buf = null;
  let startLine = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.replace(/\s+$/, '');
    const cont = trimmed.endsWith('\\');
    const core = cont ? trimmed.slice(0, -1) : line;
    if (buf === null) {
      if (cont) {
        buf = core;
        startLine = i;
      } else {
        out.push({ text: line, line: i });
      }
    } else {
      buf += ` ${core.trim()}`;
      if (!cont) {
        out.push({ text: buf, line: startLine });
        buf = null;
        startLine = -1;
      }
    }
  }
  if (buf !== null) out.push({ text: buf, line: startLine });
  return out;
}

function tokenize(input) {
  // Minimal POSIX-ish tokenizer: splits on whitespace, respects single
  // and double quotes, strips surrounding quotes from the resulting
  // tokens, and splits `--key=value` into two tokens. Keeps `<foo>`
  // / `${FOO}` placeholders intact.
  const tokens = [];
  let cur = '';
  let inSingle = false;
  let inDouble = false;
  let hasContent = false;
  const push = () => {
    if (hasContent) tokens.push(cur);
    cur = '';
    hasContent = false;
  };
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (inSingle) {
      if (ch === "'") inSingle = false;
      else {
        cur += ch;
        hasContent = true;
      }
    } else if (inDouble) {
      if (ch === '"') inDouble = false;
      else {
        cur += ch;
        hasContent = true;
      }
    } else if (ch === "'") {
      inSingle = true;
      hasContent = true;
    } else if (ch === '"') {
      inDouble = true;
      hasContent = true;
    } else if (/\s/.test(ch)) {
      push();
    } else if (ch === '\\' && i + 1 < input.length) {
      cur += input[i + 1];
      hasContent = true;
      i += 1;
    } else {
      cur += ch;
      hasContent = true;
    }
  }
  push();
  const expanded = [];
  for (const tok of tokens) {
    if (tok.startsWith('--') && tok.includes('=')) {
      const eq = tok.indexOf('=');
      expanded.push(tok.slice(0, eq), tok.slice(eq + 1));
    } else {
      expanded.push(tok);
    }
  }
  return expanded;
}

function isLikelyCommand(argv, { strict = false, topLevel } = {}) {
  if (argv.length === 0) return false;
  const first = argv[0];
  if (first.startsWith('-')) return true;
  // Inline prose is prone to false positives (e.g. `neon.new`, `neon_foo`)
  // so we require the first token to look like a real top-level command
  // name. Fenced code blocks get a softer filter: any kebab-case word is
  // accepted, which lets the validator catch misspellings.
  if (strict) return (topLevel || getTopLevelCommands()).has(first);
  return /^[a-z][a-z0-9-]*$/.test(first);
}

function extractFromFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { body, offset } = stripFrontmatter(raw);
  const lines = body.split(/\r?\n/);
  const results = [];

  // Fenced code blocks.
  let inFence = false;
  let fenceMarker = null;
  let fenceLang = null;
  let fenceLines = [];
  let fenceStartIndex = 0;

  const flushFence = () => {
    if (!SHELL_LANGS.has(fenceLang)) return;
    const joined = joinBackslashContinuations(fenceLines);
    for (const { text, line } of joined) {
      const m = CLI_LINE_RE.exec(text);
      if (!m) continue;
      const binary = m[1];
      const rest = m[2];
      // Skip output-ish lines: table border chars, JSON, etc.
      if (/^[│┌└├─┬┴┤┼┐┘]/u.test(rest)) continue;
      // Skip lines where the token right after `neon(ctl)` is actually a
      // hostname/URL continuation (`neon.tech/docs`).
      if (NON_COMMAND_PREFIX.test(`${binary}${rest[0] || ''}`)) continue;
      const argv = tokenize(rest);
      if (!isLikelyCommand(argv, { strict: false })) continue;
      results.push({
        file,
        line: offset + fenceStartIndex + line + 2,
        raw: `${binary} ${rest}`,
        binary,
        argv,
        source: 'fenced',
      });
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fence = FENCE_RE.exec(line);
    if (fence) {
      const marker = fence[2][0].repeat(3); // ``` or ~~~
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
        fenceLang = (fence[3] || '').toLowerCase();
        fenceLines = [];
        fenceStartIndex = i;
      } else if (marker === fenceMarker && fence[2].length >= 3) {
        flushFence();
        inFence = false;
        fenceMarker = null;
        fenceLang = null;
        fenceLines = [];
      }
      continue;
    }
    if (inFence) {
      fenceLines.push(line);
    } else {
      // Inline backticks in prose.
      let m;
      // Reset lastIndex for safety in case of previous calls on same string.
      INLINE_RE.lastIndex = 0;

      while ((m = INLINE_RE.exec(line)) !== null) {
        const snippet = m[1];
        const headMatch = CLI_LINE_RE.exec(snippet);
        if (!headMatch) continue;
        const binary = headMatch[1];
        const rest = headMatch[2];
        if (NON_COMMAND_PREFIX.test(`${binary}${rest[0] || ''}`)) continue;
        const argv = tokenize(rest);
        if (!isLikelyCommand(argv, { strict: true })) continue;
        results.push({
          file,
          line: offset + i + 1,
          raw: `${binary} ${rest}`,
          binary,
          argv,
          source: 'inline',
        });
      }
    }
  }
  if (inFence) flushFence();
  return results;
}

function extract({ root = DEFAULT_ROOT } = {}) {
  const files = globSync('**/*.md', { cwd: root, absolute: true });
  const all = [];
  for (const file of files) {
    all.push(...extractFromFile(file));
  }
  return all;
}

module.exports = {
  extract,
  extractFromFile,
  tokenize,
  stripFrontmatter,
  joinBackslashContinuations,
  isLikelyCommand,
  buildTopLevelCommands,
  DEFAULT_ROOT,
  SHELL_LANGS,
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const root = args[0] || DEFAULT_ROOT;
  const results = extract({ root });
  for (const r of results) {
    const rel = path.relative(process.cwd(), r.file);
    console.log(`${rel}:${r.line}\t${r.binary} ${r.argv.join(' ')}`);
  }
  console.log(`\nExtracted ${results.length} invocations from ${root}`);
}
