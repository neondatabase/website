const { execSync } = require('child_process');
const fs = require('fs');

// Skip during a merge commit, matching update-frontmatter.js.
try {
  execSync('git rev-parse --verify MERGE_HEAD', { stdio: 'pipe' });
  process.exit(0);
} catch {
  // Not a merge; proceed.
}

const today = new Date().toISOString().slice(0, 10);

for (const filePath of process.argv.slice(2).filter(Boolean)) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const updated = content.replace(/^Last updated: \d{4}-\d{2}-\d{2}$/m, `Last updated: ${today}`);
  if (updated !== content) fs.writeFileSync(filePath, updated);
}
