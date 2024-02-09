import {
  transformerMetaHighlight,
  transformerNotationHighlight,
  transformerMetaWordHighlight,
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

export default async function highlight(code, lang = 'bash', highlight = '', theme = customTheme) {
  let language = lang.toLocaleLowerCase();

  // check if language is supported
  if (!Object.keys(bundledLanguages).includes(lang)) {
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

          // used for code tabs in blog post
          if (highlight) {
            const lines = highlight.split(',').map((x) => x.split('-').map((y) => parseInt(y, 10)));

            if (lines.some((x) => x.length === 1 && x[0] === line)) {
              node.properties['data-highlighted-line'] = true;
            } else if (lines.some((x) => x.length === 2 && line >= x[0] && line <= x[1])) {
              node.properties['data-highlighted-line'] = true;
            }
          }
        },
      },
      transformerMetaHighlight(),
      transformerNotationHighlight(),
      transformerMetaWordHighlight(),
      transformerNotationWordHighlight(),
    ],
  });

  await highlighter.loadLanguage(language);

  // return tokensToHTML(tokens, language, highlightedLines);
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
        const highlightedCode = await highlight(codeContent, item.language, item.highlight);

        return highlightedCode;
      })
    );
  } catch (error) {
    console.error('Error highlighting code:', error);
  }

  return highlightedItems;
};
