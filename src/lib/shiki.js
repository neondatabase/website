import { getHighlighter, renderToHtml } from 'shiki';

let highlighter;

export default async function highlight(code, theme, lang) {
  if (!highlighter) {
    highlighter = await getHighlighter({
      langs: [lang],
      theme,
    });
  }

  const tokens = highlighter?.codeToThemedTokens(code, lang, theme, {
    includeExplanation: false,
  });
  const html = renderToHtml(tokens, { bg: 'transparent' });

  return html;
}
