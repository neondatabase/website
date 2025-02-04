function parseMDXHeading(line) {
  if (typeof line !== 'string') {
    console.error('Invalid input to parseMDXHeading:', line);
    return [];
  }

  const match = line.match(/^#+\s*\[(.*?)\]\((.*?)\)$/);
  const matchWithoutLink = line.match(/^#+\s*(.*?)$/);

  if (match) {
    const len = match[0]?.match(/^#+/)?.[0]?.length;
    const depth = len ? len - 1 : null;
    const title = match[1];

    return [depth, title];
  }

  if (matchWithoutLink) {
    const len = matchWithoutLink[0]?.match(/^#+/)?.[0]?.length;
    const depth = len ? len - 1 : null;
    const title = matchWithoutLink[1];

    return [depth, title];
  }

  return [];
}

module.exports = parseMDXHeading;
