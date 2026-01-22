const fs = require('fs');

const slugify = require('slugify');

/**
 * Get a glossary item preview by heading ID.
 * @param {string} href - The href of the glossary item.
 * @returns {Object} item - The glossary item preview.
 * @returns {string} item.title - The title of the glossary item.
 * @returns {string} item.preview - The preview text of the glossary item.
 */
const getGlossaryItem = (href) => {
  const glossaryFilePath = 'content/docs/reference/glossary.md';

  if (!fs.existsSync(glossaryFilePath)) {
    return null;
  }

  const glossaryContent = fs.readFileSync(glossaryFilePath, 'utf8');
  const id = href.split('#')[1];

  // Split the glossary content into sections
  const sections = glossaryContent.split('## ').slice(1);

  // Find the matching section by heading ID and return title and preview
  let result = null;
  sections.some((section) => {
    const lines = section.split('\n');
    const title = lines[0].trim();
    const titleId = slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    }).replace(/_/g, '');

    if (titleId === id) {
      const text = lines.slice(1).join('\n').trim();

      // Remove markdown formatting
      const formattedText = text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Handle links
        .replace(/(\*\*|__|\*|_)(.*?)\1/g, '$2') // Handle bold and italic
        .replace(/^[-*+]\s+/gm, '') // Handle list items
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`([^`]+)`/g, '$1') // Handle inline code
        .replace(/\|[^\n]*\|/g, '') // Remove tables
        .replace(/\n+/g, ' ') // Replace line breaks
        .replace(/\s{2,}/g, ' ') // Remove multiple spaces
        .trim(); // Clean up whitespace

      // Truncate the text text to 160 characters
      const preview = formattedText.slice(0, 160);
      result = { title, preview };
      return true;
    }
    return false;
  });

  return result;
};

export default getGlossaryItem;
