const { execSync } = require('child_process');
const fs = require('fs');

const filePaths = process.argv.slice(2).filter(Boolean);
const updatedOn = new Date().toISOString();

// During a merge commit, only stamp files the current branch actually modified.
// Files staged purely because of incoming changes from main should not get a new updatedOn.
let mergeBase = null;
try {
  const mergeHead = fs.readFileSync('.git/MERGE_HEAD', 'utf-8').trim();
  mergeBase = execSync(`git merge-base HEAD ${mergeHead}`, { encoding: 'utf-8' }).trim();
} catch {
  // Not in a merge; stamp all staged files as usual.
}

for (const filePath of filePaths) {
  if (mergeBase) {
    try {
      execSync(`git diff --quiet ${mergeBase}..HEAD -- ${filePath}`, { stdio: 'pipe' });
      // Exit 0 = no diff = file not modified in this branch; skip it.
      continue;
    } catch {
      // Non-zero exit = file was modified in this branch; proceed.
    }
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Find the closing --- of the frontmatter block
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd === -1) continue;

  const frontmatter = content.slice(0, fmEnd);
  if (!/^updatedOn:/m.test(frontmatter)) continue;

  const updatedFrontmatter = frontmatter.replace(/^updatedOn:.*$/m, `updatedOn: '${updatedOn}'`);
  fs.writeFileSync(filePath, updatedFrontmatter + content.slice(fmEnd));
}
