const WORD = /[\p{L}\p{N}]+/gu;

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'can',
  'do',
  'does',
  'for',
  'from',
  'has',
  'have',
  'how',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'me',
  'my',
  'of',
  'on',
  'or',
  'our',
  'so',
  'that',
  'the',
  'this',
  'to',
  'was',
  'we',
  'what',
  'when',
  'where',
  'which',
  'who',
  'why',
  'will',
  'with',
  'you',
  'your',
]);

function highlightTerms(query) {
  const terms = new Set(query.toLowerCase().match(WORD) ?? []);
  return [...terms].filter((term) => !STOPWORDS.has(term));
}

// A term matches at the start of a word, never inside one; one-letter terms match whole words only.
export function siteSearchHighlightRanges(text, query) {
  const terms = highlightTerms(query);
  if (terms.length === 0) {
    return [];
  }
  const ranges = [];
  for (const match of text.matchAll(WORD)) {
    const word = match[0];
    let length = 0;
    for (const term of terms) {
      if (term.length <= length || term.length > word.length) continue;
      if (term.length === 1 && word.length !== 1) continue;
      if (word.slice(0, term.length).toLowerCase() === term) {
        length = term.length;
      }
    }
    if (length > 0) {
      ranges.push({ start: match.index, end: match.index + length });
    }
  }
  return ranges;
}
