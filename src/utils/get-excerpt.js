const getExcerpt = (content, length = 5000) => {
  const excerpt = content
    .replace(/```(.|\n)*?```/g, '') // remove code blocks
    .replace(/<(.|\n)*?>/g, '') // remove html tags
    .replace(/(\r\n|\n|\r)/gm, ' ') // replace new lines with spaces
    .replace(/\s+/g, ' ') // replace multiple spaces with single space
    .replace(/!\[[^\]]+\]\([^\)]+\)/g, '') // remove markdown images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // replace markdown links with link text
    .replace(/([*~`#])/g, '') // remove markdown formatting
    .replace(/\s*[-:|]+\s*/g, ' ') // replace markdown table delimiters with spaces
    .replace(/Up\s+Home\s+/g, '') // specifically target and remove the 'Up Home' text
    .replace(/\s+/g, ' ') // consolidate multiple spaces into a single space
    .trim();

  return excerpt.length > length ? `${excerpt.substring(0, length)}...` : excerpt;
};

module.exports = getExcerpt;
