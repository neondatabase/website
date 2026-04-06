import slugify from 'slugify';

const CUSTOM_ID_PATTERN = /\s*(?:\(#([^)]+)\)|\{#([^}]+)\})$/;

const extractCustomId = (text) => {
  const match = text.match(CUSTOM_ID_PATTERN);
  return match?.[1] || match?.[2] || null;
};

const stripCustomId = (text) => text.replace(CUSTOM_ID_PATTERN, '').trim();

const getMarkdownTableOfContents = (markdown) => {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length - 1; // ## → 1, ### → 2
    const rawText = match[2].trim();

    // Support explicit custom IDs in both `(#custom-id)` and `{#custom-id}` forms.
    const customId = extractCustomId(rawText);
    const cleanText = stripCustomId(rawText);

    // Preserve inline code for display, strip for slug
    const title = cleanText.replace(/`([^`]+)`/g, '<code>$1</code>');
    const textForSlug = cleanText.replace(/`/g, '');

    const id =
      customId ||
      slugify(textForSlug, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      }).replace(/_/g, '');

    headings.push({ title, id, level });
  }

  // Build nested structure: h2 items can contain h3 sub-items
  const toc = [];
  let index = 0;

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];

    if (heading.level === 1) {
      const tocItem = { title: heading.title, id: heading.id, level: 1, index: index++ };

      const children = [];
      while (i + 1 < headings.length && headings[i + 1].level === 2) {
        i++;
        children.push({
          title: headings[i].title,
          id: headings[i].id,
          level: 2,
          index: index++,
        });
      }

      if (children.length > 0) tocItem.items = children;
      toc.push(tocItem);
    }
  }

  return toc;
};

export default getMarkdownTableOfContents;
