const { execSync } = require('child_process');
const fs = require('fs');

const { isUnusedOrSharedContent } = require('../constants/content');

// Skip updatedOn stamping during a merge commit. Files staged by the incoming
// merge were not authored in this branch; any genuinely edited files will be
// stamped on the next regular commit.
try {
  execSync('git rev-parse --verify MERGE_HEAD', { stdio: 'pipe' });
  process.exit(0);
} catch {
  // Not a merge; proceed.
}

const filePaths = process.argv.slice(2).filter(Boolean);
const updatedOn = new Date().toISOString();

for (const filePath of filePaths) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find the closing --- of the frontmatter block
  if (!content.startsWith('---\n')) continue;
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd === -1) continue;

  const frontmatter = content.slice(0, fmEnd);
  let updatedFrontmatter;
  if (/^updatedOn:/m.test(frontmatter)) {
    updatedFrontmatter = frontmatter.replace(/^updatedOn:.*$/m, `updatedOn: '${updatedOn}'`);
  } else if (!isUnusedOrSharedContent(filePath)) {
    // New pages get updatedOn on their first commit so the sitemap can report <lastmod>
    updatedFrontmatter = `${frontmatter}\nupdatedOn: '${updatedOn}'`;
  } else {
    continue;
  }

  fs.writeFileSync(filePath, updatedFrontmatter + content.slice(fmEnd));
}
