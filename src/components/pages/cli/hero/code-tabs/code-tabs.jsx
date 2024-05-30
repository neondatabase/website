import clsx from 'clsx';
import PropTypes from 'prop-types';

import { getHighlightedCodeArray } from 'lib/shiki';

import CodeTabsNavigation from './code-tabs-navigation';

const codeSnippets = [
  {
    name: 'macOS',
    iconName: 'ruby',
    language: 'bash',
    code: `
      brew install neonctl
      neonctl auth
      neonctl branches create --name dev/daniel
      neonctl branches list
    `,
  },
  {
    name: 'Windows',
    iconName: 'php',
    language: 'bash',
    code: `
      npm install -g neonctl
      neonctl auth
      neonctl branches create --name dev/daniel
      neonctl branches list
    `,
  },
  {
    name: 'Linux',
    iconName: 'javascript',
    language: 'bash',
    code: `
      npm install -g neonctl
      neonctl auth
      neonctl branches create --name dev/daniel
      neonctl branches list
    `,
  },
];

const CodeTabs = async ({ className = null }) => {
  const highlightedCodeSnippets = await getHighlightedCodeArray(codeSnippets);

  return (
    <div className={clsx(className, 'rounded-[10px] bg-black-new')}>
      <CodeTabsNavigation
        codeSnippets={codeSnippets}
        highlightedCodeSnippets={highlightedCodeSnippets}
      />
    </div>
  );
};

CodeTabs.propTypes = {
  className: PropTypes.string,
};

export default CodeTabs;
