import { getTopbarData } from 'utils/api-local-data';

import TopbarClient from './topbar-client';

const Topbar = () => {
  const topbar = getTopbarData();

  if (!topbar?.text || !topbar?.link?.url) return null;

  return <TopbarClient {...topbar} />;
};

export default Topbar;
