import { PropTypes } from 'prop-types';

import { getTopbar } from 'utils/api-global-fields';

import TopbarClient from './topbar-client';

const Topbar = async ({ isDarkTheme }) => {
  const topbar = await getTopbar();

  if (!topbar?.text || !topbar?.link) return null;

  return <TopbarClient {...topbar} isDarkTheme={isDarkTheme} />;
};

Topbar.propTypes = {
  isDarkTheme: PropTypes.bool,
};

export default Topbar;
