import slugify from 'slugify';

const stripHtmlTags = (html) => html.replace(/<[^>]*>/g, '');

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
  '&laquo;': '«',
  '&raquo;': '»',
};

const decodeHtmlEntities = (text) =>
  text.replace(/&(?:#(\d+)|#x([0-9a-f]+)|(\w+));/gi, (match, dec, hex) => {
    if (dec) return String.fromCharCode(parseInt(dec, 10));
    if (hex) return String.fromCharCode(parseInt(hex, 16));
    return ENTITIES[match] || match;
  });

const extractCustomId = (text) => {
  const match = text.match(/\(#([^)]+)\)$/);
  return match ? match[1] : null;
};

const getHtmlTableOfContents = (html) => {
  const headingRegex = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10) - 1; // h2 -> 1, h3 -> 2
    const rawTitle = match[2];
    const plainText = decodeHtmlEntities(stripHtmlTags(rawTitle)).trim();
    const customId = extractCustomId(plainText);
    const cleanedText = plainText.replace(/\(#[^)]+\)$/, '').trim();

    const id =
      customId ||
      slugify(cleanedText, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      }).replace(/_/g, '');

    // Preserve inline <code> tags for display
    const title = rawTitle.replace(/\(#[^)]+\)$/, '').trim();

    headings.push({ title, id, level });
  }

  // Build nested structure: h2 items can contain h3 sub-items
  const toc = [];
  let index = 0;

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];

    if (heading.level === 1) {
      const tocItem = {
        title: heading.title,
        id: heading.id,
        level: heading.level,
        index: index++,
      };

      const children = [];
      while (i + 1 < headings.length && headings[i + 1].level === 2) {
        i++;
        children.push({
          title: headings[i].title,
          id: headings[i].id,
          level: headings[i].level,
          index: index++,
        });
      }

      if (children.length > 0) {
        tocItem.items = children;
      }

      toc.push(tocItem);
    }
  }

  return toc;
};

export default getHtmlTableOfContents;
