import parse from 'html-react-parser';

import highlight from 'lib/shiki';

import Animation from './animation';
import { API_CALL_CODE, SQL_CODE } from './data';

const ManageFleet = async () => {
  const highlightedSqlCode = await highlight(SQL_CODE, 'sql');

  return <Animation apiCode={parse(API_CALL_CODE)} sqlCode={parse(highlightedSqlCode)} />;
};

export default ManageFleet;
