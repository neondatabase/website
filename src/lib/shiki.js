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
