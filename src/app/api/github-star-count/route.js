let cachedStarCount = null;
let lastUpdated = 0;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const API_URL = 'https://api.github.com/repos/neondatabase/neon';

async function fetchGithubStarCount() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const updatedStarsCount = json.stargazers_count;

    if (updatedStarsCount !== undefined) {
      cachedStarCount = updatedStarsCount;
      lastUpdated = new Date().getTime();
    } else {
      console.log('Unable to find stargazers_count in response:', json);
    }
  } catch (error) {
    console.error('Error fetching GitHub star count:', error);
  }
}

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const now = new Date().getTime();
  if (!cachedStarCount || now - lastUpdated > ONE_DAY_IN_MS) {
    await fetchGithubStarCount();
  }

  return new Response(JSON.stringify({ starCount: cachedStarCount }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
