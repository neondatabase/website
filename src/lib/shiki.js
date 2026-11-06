import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { getHighlighter, createCssVariablesTheme, bundledLanguages } from 'shiki';

const customTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

let highlighter;
let _initPromise = null;

// parse meta string to get highlighted lines
const parseHighlightLines = (meta) => {
  const metaArray = meta.split(' ').filter(Boolean);
  let highlightLines = [];

  // Support "{1,3-5}" anywhere in the meta string (not only as the first token)
  const highlightToken = metaArray.find((token) => token.includes('{') && token.includes('}'));

  if (highlightToken) {
    const highlightString = highlightToken;
    const highlightStringArray = highlightString.split('{')[1].split('}')[0].split(',');
    highlightLines = highlightStringArray.reduce((result, item) => {
      if (item.includes('-')) {
        const range = item.split('-');
        const start = parseInt(range[0], 10);
        const end = parseInt(range[1], 10);
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
      } else {
        result.push(parseInt(item, 10));
      }
      return result;
    }, []);
  }

  return highlightLines;
};

// Support "collapse={1-5, 12-14}" (same syntax as Expressive Code's collapsible sections)
const COLLAPSE_RE = /\bcollapse=\{([^}]*)\}/;

const parseCollapseRanges = (meta) => {
  const match = meta.match(COLLAPSE_RE);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((range) => range.split('-').map((n) => parseInt(n, 10)))
    .filter(([start]) => start > 0)
    .map(([start, end]) => [start, end || start]);
};

// Wraps each collapsed line range in a native <details>, so its <summary>
// ("N collapsed lines") expands the hidden lines on click without client JS.
const transformerCollapsibleSections = (ranges) => ({
  name: 'collapsible-sections',
  code(node) {
    if (ranges.length === 0) return;
    const children = [];
    let section = null;
    let lineNumber = 0;

    node.children.forEach((child) => {
      // Drop the newline text nodes between collapsed lines
      if (child.type !== 'element') {
        if (!section) children.push(child);
        return;
      }
      lineNumber += 1;
      const range = ranges.find(([start, end]) => lineNumber >= start && lineNumber <= end);
      if (!range) {
        section = null;
        children.push(child);
        return;
      }
      if (!section) {
        section = {
          type: 'element',
          tagName: 'details',
          properties: { class: 'collapsed-lines' },
          children: [{ type: 'element', tagName: 'summary', properties: {}, children: [] }],
        };
        children.push(section);
      }
      section.children.push(child);
      if (lineNumber === range[1]) section = null;
    });

    children
      .filter((child) => child.properties?.class === 'collapsed-lines')
      .forEach(({ children: [summary, ...lines] }) => {
        const count = lines.length;
        // Keep `showLineNumbers` counting the hidden lines while collapsed
        summary.properties.style = `counter-increment: line ${count}`;
        summary.children.push({
          type: 'text',
          value: `${count} collapsed line${count === 1 ? '' : 's'}`,
        });
      });

    node.children = children;
  },
});

// Shell grammars tokenize the `>` in placeholders like `<slug>` as an
// output redirection, splitting the placeholder's coloring mid-word
// (`<slu` one color, `g>` another). This transformer rebuilds each line's
// tokens so a `<placeholder>` renders as a single token with one color.
// Applies to shell languages only; placeholders are the man-page
// convention used across the CLI docs.
const SHELL_LANGS = new Set(['bash', 'sh', 'shell', 'shellscript', 'zsh']);
const PLACEHOLDER_RE = /<[a-zA-Z0-9_|.-]+(?:\.\.\.)?>/g;

const transformerShellPlaceholders = () => ({
  name: 'shell-placeholders',
  tokens(lines) {
    if (!SHELL_LANGS.has(this.options.lang)) return lines;
    return lines.map((tokens) => {
      const lineText = tokens.map((token) => token.content).join('');
      const matches = [...lineText.matchAll(PLACEHOLDER_RE)];
      if (matches.length === 0) return tokens;

      // Boundaries of placeholder ranges within the line.
      const ranges = matches.map((m) => [m.index, m.index + m[0].length]);
      const inRange = (pos) => ranges.find(([start, end]) => pos >= start && pos < end);

      const result = [];
      let pos = 0;
      for (const token of tokens) {
        let local = 0;
        while (local < token.content.length) {
          const range = inRange(pos + local);
          if (range) {
            // Emit the whole placeholder once (when we hit its start),
            // then skip past whatever part of it this token covers.
            if (pos + local === range[0]) {
              result.push({
                content: lineText.slice(range[0], range[1]),
                color: 'var(--shiki-token-constant)',
              });
            }
            const consumed = Math.min(range[1] - (pos + local), token.content.length - local);
            local += consumed;
          } else {
            const nextBoundary = ranges
              .map(([start]) => start)
              .filter((start) => start > pos + local)
              .reduce((min, start) => Math.min(min, start), Infinity);
            const sliceEnd = Math.min(token.content.length, nextBoundary - pos);
            result.push({ ...token, content: token.content.slice(local, sliceEnd) });
            local = sliceEnd;
          }
        }
        pos += token.content.length;
      }
      return result;
    });
  },
});

// Lines of a shell block that start a command, so the docs can draw a `$`
// prompt before them. Comments, `\` continuations, indented lines, heredoc
// bodies and multi-line quoted strings stay unmarked, and so do scripts.
const HEREDOC_RE = /<<-?\s*['"]?([A-Za-z_][A-Za-z0-9_]*)['"]?/;
const BLOCK_END_RE = /^(\}|\)|fi\b|done\b|esac\b|else\b|elif\b|then\b|do\b)/;
// A block that writes its own prompt (`$ ls`, `~/app$ ls`, `root@host:~# ls`)
// mixes commands with output, so it gets no extra prompts.
const OWN_PROMPT_RE = /^(\$|\S+[$#%>]) \S/m;

export const getShellPromptLines = (code, lang) => {
  const lines = new Set();
  if (!SHELL_LANGS.has(lang) || code.startsWith('#!') || OWN_PROMPT_RE.test(code)) return lines;

  let heredocEnd = null;
  let continued = false;
  let inQuote = false;

  code.split('\n').forEach((raw, index) => {
    const text = raw.trimEnd();

    if (heredocEnd) {
      if (text.trim() === heredocEnd) heredocEnd = null;
      return;
    }

    const isCommand =
      !continued &&
      !inQuote &&
      text !== '' &&
      !/^\s/.test(text) &&
      !text.startsWith('#') &&
      !text.startsWith('$') &&
      !BLOCK_END_RE.test(text);
    if (isCommand) lines.add(index + 1);

    continued = text.endsWith('\\');
    // An odd number of single quotes leaves a string open on the next line.
    if ((text.replace(/\\'/g, '').match(/'/g) || []).length % 2 === 1) inQuote = !inQuote;
    const heredoc = text.match(HEREDOC_RE);
    if (heredoc && !inQuote) heredocEnd = heredoc[1];
  });

  return lines;
};

export default async function highlight(code, lang = 'bash', meta = '', theme = customTheme) {
  let language = lang.toLocaleLowerCase();

  // check if language is supported
  if (!Object.keys(bundledLanguages).includes(language) && language !== 'text') {
    language = 'bash';
  }

  // _initPromise is set synchronously, so concurrent callers all await the
  // same promise instead of each creating a separate highlighter instance.
  if (!_initPromise) {
    _initPromise = getHighlighter({ langs: [language], themes: [theme] });
  }
  highlighter = await _initPromise;
  await highlighter.loadLanguage(language);

  const collapseRanges = parseCollapseRanges(meta);
  const promptLines = getShellPromptLines(code, lang.toLocaleLowerCase());
  // Keep collapse={...} out of the "{1,3-5}" highlight parsing below
  const highlightMeta = meta.replace(COLLAPSE_RE, '');

  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme,
    transformers: [
      {
        pre(node) {
          node.properties['data-language'] = language;
        },
        code(node) {
          node.properties.class = 'grid';
        },
        line(node, line) {
          node.properties['data-line'] = line;
          if (promptLines.has(line)) node.properties['data-prompt'] = true;

          if (highlightMeta) {
            const highlightedLines = parseHighlightLines(highlightMeta);

            highlightedLines.forEach((item) => {
              if (item === line) {
                node.properties['data-highlighted-line'] = true;
              }
            });
          }
        },
      },
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerShellPlaceholders(),
      transformerCollapsibleSections(collapseRanges),
    ],
  });

  return html;
}

// used to highlight code block in code tabs
export const getHighlightedCodeArray = async (items) => {
  let highlightedItems = [];

  try {
    highlightedItems = await Promise.all(
      items.map(async (item) => {
        let codeContent = item?.code;

        if (typeof codeContent === 'object') {
          codeContent = JSON.stringify(codeContent, null, 2);
        }
        // item.highlight in blog post component CodeTabs
        const highlightedCode = await highlight(codeContent, item.language, `{${item.highlight}}`);

        return highlightedCode;
      })
    );
  } catch (error) {
    console.error('Error highlighting code:', error);
  }

  return highlightedItems;
};
