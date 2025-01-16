function parseMDXHeading(line) {
  const match = line.match(/^#+\s*\[(.*?)\]\((.*?)\)$/);
  const matchWithoutLink = line.match(/^#+\s*(.*?)$/);
  const matchStep = line.match(/^#+\s*(Step\s\d+:\s*.*?)$/);

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

    return [depth, title, matchStep];
  }

  if (matchStep) {
    const title = matchStep[1];
    const depth = parseInt(matchStep[2], 10) - 1 || 1;
    const isNumberedStep = true;

    return [depth, title, isNumberedStep];
  }

  return [];
}

module.exports = parseMDXHeading;
