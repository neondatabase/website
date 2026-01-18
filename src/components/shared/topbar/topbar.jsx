import TopbarClient from './topbar-client';

const TOPBAR_API_URL = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/api/topbar`;

const Topbar = async () => {
  // Skip topbar fetch during static generation (build time)
  // In production, Vercel will use ISR to regenerate pages with fresh data
  const isBuildTime = !process.env.VERCEL && process.env.NODE_ENV === 'production';

  if (isBuildTime) {
    return null;
  }

  try {
    const response = await fetch(TOPBAR_API_URL, {
      next: {
        revalidate: 600, // 10 minutes
      },
      signal: AbortSignal.timeout(2000), // 2 second timeout to avoid hanging during build
    });

    if (!response.ok) {
      return null;
    }

    const topbar = await response.json();

    if (!topbar?.text || !topbar?.link) return null;

    return <TopbarClient {...topbar} />;
  } catch (error) {
    return null;
  }
};

export default Topbar;
