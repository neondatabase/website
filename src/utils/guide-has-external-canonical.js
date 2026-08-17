const fs = require('fs');
const path = require('path');

const matter = require('gray-matter');

const guideHasExternalCanonical = (routePath) => {
  const pathname = /^https?:\/\//.test(routePath) ? new URL(routePath).pathname : routePath;
  const match = /^\/guides\/([^/]+)\/?$/.exec(pathname);

  if (!match) return false;

  const filePath = path.join(process.cwd(), 'content/guides', `${match[1]}.md`);
  if (!fs.existsSync(filePath)) return false;

  const { data } = matter(fs.readFileSync(filePath, 'utf8'));
  return typeof data.canonical === 'string' && data.canonical.length > 0;
};

module.exports = { guideHasExternalCanonical };
