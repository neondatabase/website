const normalize = (text) => text.replace(/\s+/g, ' ').trim();

// Docs headings start with the page H1 ("Glossary > LSN"); blog headings don't.
export function hitSections(heading, title) {
  const parts = heading.split(' > ').map(normalize).filter(Boolean);
  return parts[0] === normalize(title) ? parts.slice(1) : parts;
}

// `headings` are the page's rendered headings in document order, as { level, text }.
// Heading text repeats on a page ("Install packages" under both Next.js and React), so the
// heading whose parent chain matches more of `sections` wins, then the first one.
export function findSectionHeading(sections, headings) {
  const target = sections.map(normalize);
  if (target.length === 0) return -1;
  const stack = [];
  let best = -1;
  let bestDepth = 0;
  headings.forEach(({ level, text }, index) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= level) stack.pop();
    stack.push({ level, text: normalize(text) });
    let depth = 0;
    while (
      depth < target.length &&
      depth < stack.length &&
      stack[stack.length - 1 - depth].text === target[target.length - 1 - depth]
    ) {
      depth += 1;
    }
    if (depth > bestDepth) {
      best = index;
      bestDepth = depth;
    }
  });
  return best;
}
