import { PropTypes } from 'prop-types';

import TopbarClient from './topbar-client';

// TODO: Change with the prod URL once API route is deployed
// const TOPBAR_API_URL = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/api/topbar`;
const TOPBAR_API_URL = 'https://neon-next-git-wp-topbar-api-neondatabase.vercel.app/api/topbar';

const Topbar = async ({ isDarkTheme }) => {
  try {
    const response = await fetch(TOPBAR_API_URL, {
      next: {
        revalidate: 3600,
      },
    });
    const topbar = await response.json();

    if (!topbar?.text || !topbar?.link) return null;

    return <TopbarClient {...topbar} isDarkTheme={isDarkTheme} />;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};

Topbar.propTypes = {
  isDarkTheme: PropTypes.bool,
};

export default Topbar;
