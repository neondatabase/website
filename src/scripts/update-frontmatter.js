/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs').promises;

const { Octokit } = require('@octokit/core');
const { glob } = require('glob');
const matter = require('gray-matter');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
async function getLastUpdateDate(filePath) {
  const repoOwner = 'neondatabase';
  const repoName = 'website';
  const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: repoOwner,
    repo: repoName,
    path: filePath,
  });

  return res.data[0].commit.author.date;
}

const updateFrontmatter = async () => {
  const files = await glob.sync(`content/docs/**/*.md`, {
    ignore: ['**/RELEASE_NOTES_TEMPLATE.md', '**/README.md', '**/unused/**'],
  });

  const firstFiles = files.slice(55, 57);
  firstFiles.forEach(async (path) => {
    const file = matter.read(path);
    const { data: currentFrontmatter } = file;

    const date = await getLastUpdateDate(path);

    const updatedFrontmatter = {
      ...currentFrontmatter,
      updatedOn: date,
    };
    file.data = updatedFrontmatter;
    const updatedFileContent = matter.stringify(file);

    await fs.writeFile(path, updatedFileContent);
  });
};

updateFrontmatter();

console.log('Frontmatter updated');
