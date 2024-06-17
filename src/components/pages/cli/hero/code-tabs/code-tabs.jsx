import clsx from 'clsx';
import PropTypes from 'prop-types';

import { getHighlightedCodeArray } from 'lib/shiki';

import CodeTabsNavigation from './code-tabs-navigation';

const codeSnippets = [
  {
    name: 'macOS',
    iconName: 'macos',
    language: 'text',
    code: `brew install neonctl`,
  },
  {
    name: 'Windows',
    iconName: 'windows',
    language: 'text',
    code: `npm install -g neonctl`,
  },
  {
    name: 'Linux',
    iconName: 'linux',
    language: 'text',
    code: `npm install -g neonctl`,
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
