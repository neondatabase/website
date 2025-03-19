import { PropTypes } from 'prop-types';

import TopbarClient from './topbar-client';

const TOPBAR_API_URL = '/api/topbar';

const Topbar = async ({ isDarkTheme }) => {
  try {
    const response = await fetch(TOPBAR_API_URL);
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
