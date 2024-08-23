/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs').promises;

// const { Octokit } = require('@octokit/core');
// const { glob } = require('glob');
const matter = require('gray-matter');

// The function below is for getting the last update date from GitHub,
// as Github has the rate limit for unauthenticated requests (60 requests per hour),
// the script was run manually and the date was hardcoded in the frontmatter of the docs.

// const octokit = new Octokit({
//   auth: process.env.GITHUB_TOKEN,
// });
// async function getLastUpdateDate(filePath) {
//   const repoOwner = 'neondatabase';
//   const repoName = 'website';
//   const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
//     owner: repoOwner,
//     repo: repoName,
//     path: filePath,
//   });

//   return res.data[0].commit.author.date;
// }

const updateFrontmatter = async () => {
  // const files = await glob.sync(`content/docs/**/*.md`, {
  //   ignore: ['**/RELEASE_NOTES_TEMPLATE.md', '**/README.md', '**/unused/**'],
  // });

  // NOTE: to fetch the last update date from GitHub, uncomment the code above,
  // and slice the files array to 60 items

  const mdFilePaths = process.argv.slice(2).filter(Boolean);

  const docsMdFilePaths = mdFilePaths.filter(
    (path) =>
      (path.includes('content/docs') || path.includes('content/cases')) &&
      (!path.includes('RELEASE_NOTES_TEMPLATE.md') ||
        !path.includes('README.md') ||
        !path.includes('unused'))
  );

  docsMdFilePaths.forEach(async (path) => {
    const file = matter.read(path);
    const { data: currentFrontmatter } = file;

    // const date = await getLastUpdateDate(path);

    const updatedFrontmatter = {
      ...currentFrontmatter,
      // updatedOn: date,
      updatedOn: new Date().toISOString(),
    };

    file.data = updatedFrontmatter;

    const updatedFileContentRaw = matter.stringify(file);
    const updatedFileContent = updatedFileContentRaw.replace(
      /\nsubtitle: >-\n\s+/g,
      '\nsubtitle: '
    );

    await fs.writeFile(path, updatedFileContent);
  });
};

updateFrontmatter();

console.log('Frontmatter updated');
