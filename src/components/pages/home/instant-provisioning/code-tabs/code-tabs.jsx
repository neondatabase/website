import clsx from 'clsx';
import PropTypes from 'prop-types';

import { getHighlightedCodeArray } from 'lib/shiki';

import Navigation from './navigation';

const CODE = `// app.js
const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: \`project=\${ENDPOINT_ID}\`,
  },
});

async function getPgVersion() {
  const result = await sql\`select version()\`;
  console.log(result);
}

getPgVersion();`;

const codeSnippets = [
  {
    name: 'Ruby',
    iconName: 'ruby',
    language: 'ruby',
    code: CODE,
  },
  {
    name: 'Python',
    iconName: 'python',
    language: 'python',
    code: CODE,
  },
  {
    name: 'Go',
    iconName: 'go',
    language: 'go',
    code: CODE,
  },
  {
    name: 'Java',
    iconName: 'java',
    language: 'java',
    code: CODE,
  },
  {
    name: 'Node',
    iconName: 'nodejs',
    language: 'javascript',
    code: CODE,
  },
  {
    name: 'Prisma',
    iconName: 'prisma',
    language: 'javascript',
    code: CODE,
  },
];

const CodeTabs = async ({ className = null }) => {
  const highlightedCodeSnippets = await getHighlightedCodeArray(codeSnippets);

  return (
    <div className={clsx(className, 'rounded-[10px] bg-black-new')}>
      <Navigation codeSnippets={codeSnippets} highlightedCodeSnippets={highlightedCodeSnippets} />
    </div>
  );
};

CodeTabs.propTypes = {
  className: PropTypes.string,
};

export default CodeTabs;
