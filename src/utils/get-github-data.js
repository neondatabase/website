const API_URL = 'https://api.github.com/repos/neondatabase/neon';
const DEFAULT_GITHUB_STARS_COUNT = 21500;

const readGitHubStarsSnapshot = async () => {
  try {
    // This helper sits under a shared header import graph that Next/Turbopack may
    // still analyze for client traces, so keep Node-only modules out of the top level.
    const [{ default: fs }, { default: path }] = await Promise.all([
      import('node:fs/promises'),
      import('node:path'),
    ]);
    const snapshotPath = path.join(process.cwd(), 'src/utils/data/github-stars.generated.json');
    const rawSnapshot = await fs.readFile(snapshotPath, 'utf8');
    const snapshot = JSON.parse(rawSnapshot);

    if (!Number.isFinite(snapshot?.stargazers_count)) {
      return null;
    }

    return snapshot;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    console.warn(`GitHub stars: failed to read snapshot: ${error.message}`);
    return null;
  }
};

const getGitHubStars = async () => {
  const githubStarsSnapshot = await readGitHubStarsSnapshot();

  if (githubStarsSnapshot) {
    return githubStarsSnapshot.stargazers_count;
  }

  return DEFAULT_GITHUB_STARS_COUNT;
};

const getGitHubContributors = async () => {
  const response = await fetch(`${API_URL}/contributors?per_page=1`, {
    next: { revalidate: 60 * 60 * 12 },
  });
  if (response.status >= 400) {
    throw new Error('Error fetching GitHub contributors');
  }
  const linkHeader = response.headers.get('Link');
  if (!linkHeader) {
    throw new Error('No Link header found in the response');
  }
  const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
  if (!match) {
    throw new Error('Unable to parse contributors count from Link header');
  }

  return parseInt(match[1], 10);
};

export { getGitHubStars, getGitHubContributors };
