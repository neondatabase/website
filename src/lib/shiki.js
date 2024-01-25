import { getHighlighter, codeToThemedTokens } from 'shikiji';

import customTheme from 'utils/custom-theme.json';

let highlighter;

function tokensToHTML(tokens, lang, highlightedLines) {
  let html = `<pre data-language="${lang}"><code data-language="${lang}" class="grid auto-rows-fr">`;

  tokens.forEach((line, index) => {
    const isHighlighted = highlightedLines.includes(index + 1);
    const lineAttr = isHighlighted ? ' data-highlighted-line' : '';
    html += `<span data-line ${lineAttr}>`; // Start of line span

    line.forEach((token) => {
      const style = `color: ${token.color}`;
      html += `<span style="${style}">${token.content}</span>`;
    });

    html += '</span>'; // End of line span and new line
  });

  html += '</code></pre>';
  return html;
}

export default async function highlight(code, lang = 'bash', meta = '', theme = customTheme) {
  if (!highlighter) {
    highlighter = await getHighlighter({
      langs: [lang],
      themes: [theme],
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

  const tokens = await codeToThemedTokens(code, {
    lang,
    theme,
  });

  await highlighter.loadLanguage(lang);

  const html = tokensToHTML(tokens, lang, highlightedLines);

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
