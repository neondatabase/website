import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { getHighlighter, createCssVariablesTheme, bundledLanguages, codeToHtml } from 'shiki';

const customTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

let highlighter;

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

export default async function highlight(code, lang = 'bash', meta = '', theme = customTheme) {
  let language = lang.toLocaleLowerCase();

  // check if language is supported
  if (!Object.keys(bundledLanguages).includes(lang) && lang !== 'text') {
    language = 'bash';
  }

  if (!highlighter) {
    highlighter = await getHighlighter({
      langs: [language],
      themes: [theme],
    });
  }

  const html = codeToHtml(code, {
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

          if (meta) {
            const highlightedLines = parseHighlightLines(meta);

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
    ],
  });

  await highlighter.loadLanguage(language);

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
