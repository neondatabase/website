import {
  getHighlighter,
  codeToThemedTokens,
  createCssVariablesTheme,
  bundledLanguages,
} from 'shiki';

const customTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

let highlighter;

// parse meta string to get highlighted lines
const parseHighlightLines = (meta) => {
  const metaArray = meta.split(' ');
  let highlightLines = [];

  if (metaArray[0].includes('{')) {
    const highlightString = metaArray[0];
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

// convert shiki tokens to html
function tokensToHTML(tokens, lang, highlightedLines) {
  let html = `<pre data-language="${lang}"><code data-language="${lang}" class="grid">`;

  tokens.forEach((line, index) => {
    const isHighlighted = highlightedLines.includes(index + 1);
    const lineAttr = isHighlighted ? ' data-highlighted-line' : '';
    html += `<span data-line ${lineAttr}>`; // Start of line span

    line.forEach((token) => {
      const style = `color: ${token.color}`;
      // Escape special characters
      const content = token.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      html += `<span style="${style}">${content}</span>`;
    });

    html += '</span>'; // End of line span
  });

  html += '</code></pre>';
  return html;
}

export default async function highlight(code, lang = 'bash', meta = '', theme = customTheme) {
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

  const highlightedLines = parseHighlightLines(meta);

  const tokens = await codeToThemedTokens(code, {
    lang: language,
    theme,
  });

  await highlighter.loadLanguage(language);

  return tokensToHTML(tokens, language, highlightedLines);
}

// used to highlight code block in code tabs
export const getHighlightedCodeArray = async (items) => {
  let highlightedItems = [];

  try {
    highlightedItems = await Promise.all(
      items.map(async (item) => {
        const highlightedCode = await highlight(item.code, item.language);

        return highlightedCode;
      })
    );
  } catch (error) {
    console.error('Error highlighting code:', error);
  }

  return highlightedItems;
};
