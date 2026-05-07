const fs = require('fs');

const filePaths = process.argv.slice(2).filter(Boolean);
const updatedOn = new Date().toISOString();

for (const filePath of filePaths) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find the closing --- of the frontmatter block
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd === -1) continue;

  const frontmatter = content.slice(0, fmEnd);
  if (!/^updatedOn:/m.test(frontmatter)) continue;

  const updatedFrontmatter = frontmatter.replace(/^updatedOn:.*$/m, `updatedOn: '${updatedOn}'`);
  fs.writeFileSync(filePath, updatedFrontmatter + content.slice(fmEnd));
}
