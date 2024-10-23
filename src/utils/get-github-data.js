const API_URL = 'https://api.github.com/repos/neondatabase/neon';

const getGithubStars = async () => {
  if (process.env.NODE_ENV === 'production') {
    const response = await fetch(API_URL, { next: { revalidate: 60 * 60 * 12 } });
    const json = await response.json();
    if (response.status >= 400) {
      throw new Error('Error fetching GitHub stars');
    }
    return json.stargazers_count;
  } 
    return 9000;
  
};

const getGithubContributors = async () => {
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

export { getGithubStars, getGithubContributors };
