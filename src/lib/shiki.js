import { BUNDLED_LANGUAGES, getHighlighter, renderToHtml } from 'shiki';

let highlighter;

const getOptions = (highlightedLines) => {
  if (highlightedLines.length > 0) {
    return {
      bg: 'transparent',
      lineOptions: highlightedLines.map((line) => ({
        line,
        classes: ['highlighted-line'],
      })),
    };
  }

  return {
    bg: 'transparent',
  };
};

export default async function highlight(code, lang = 'bash', meta = '', theme = 'css-variables') {
  if (!highlighter) {
    highlighter = await getHighlighter({
      langs: [lang],
      theme,
    });
  }

  let highlightedLines = [];

  if (meta !== '') {
    highlightedLines = meta.split(',').reduce((acc, line) => {
      if (line.includes('-')) {
        const [start, end] = line.split('-');
        const range = Array.from({ length: end - start + 1 }, (_, i) => Number(start) + i);
        return [...acc, ...range];
      }
      return [...acc, Number(line)];
    }, []);
  }

  // Check for the loaded languages, and load the language if it's not loaded yet.
  if (!highlighter.getLoadedLanguages().includes(lang)) {
    // Check if the language is supported by Shiki
    const bundles = BUNDLED_LANGUAGES.filter(
      (bundle) =>
        // Languages are specified by their id, they can also have aliases (i. e. "js" and "javascript")
        bundle.id === lang || bundle.aliases?.includes(lang)
    );
    if (bundles.length > 0) {
      await highlighter.loadLanguage(lang);
    } else {
      // If the language is not supported, fallback to bash
      lang = 'bash';
    }
  }

  const tokens = highlighter.codeToThemedTokens(code, lang, theme, {
    includeExplanation: false,
  });

  const html = renderToHtml(tokens, getOptions(highlightedLines));

  return html;
}

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
