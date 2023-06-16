function parseMDXHeading(line) {
  const match = line.match(/^#+\s*\[(.*?)\]\((.*?)\)$/);
  const matchWithoutLink = line.match(/^#+\s*(.*?)$/);

  if (match) {
    const len = match[0]?.match(/^#+/)?.[0]?.length;
    const depth = len ? len - 1 : null;
    const title = match[1];
    const url = match[2];

    return [depth, title, url];
  }

  if (matchWithoutLink) {
    const len = matchWithoutLink[0]?.match(/^#+/)?.[0]?.length;
    const depth = len ? len - 1 : null;
    const title = matchWithoutLink[1];

    return [depth, title, null];
  }
  return [null, null, null];
}

module.exports = parseMDXHeading;
