import parse from 'html-react-parser';

import highlight from 'lib/shiki';

import Animation from './animation';
import { SQL_CODE } from './data';

const ManageFleet = async () => {
  const highlightedCode = await highlight(SQL_CODE, 'sql');

  return <Animation code={parse(highlightedCode)} />;
};

export default ManageFleet;
