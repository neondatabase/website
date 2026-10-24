const WORD = /[\p{L}\p{M}\p{N}]+/gu;

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
  const seen = new Set();
  const terms = [];
  for (const term of query.match(WORD) ?? []) {
    const folded = term.toLowerCase();
    if (STOPWORDS.has(folded) || seen.has(folded)) continue;
    seen.add(folded);
    terms.push({ folded, length: term.length, single: [...term].length === 1 });
  }
  return terms;
}

export function siteSearchHighlightRanges(text, query) {
  const terms = highlightTerms(query);
  if (terms.length === 0) {
    return [];
  }
  const ranges = [];
  for (const match of text.matchAll(WORD)) {
    const word = match[0];
    const singleWord = [...word].length === 1;
    let length = 0;
    for (const term of terms) {
      if (term.length <= length || term.length > word.length) continue;
      if (term.single && !singleWord) continue;
      if (word.slice(0, term.length).toLowerCase() === term.folded) {
        length = term.length;
      }
    }
    if (length > 0) {
      ranges.push({ start: match.index, end: match.index + length });
    }
  }
  return ranges;
}
