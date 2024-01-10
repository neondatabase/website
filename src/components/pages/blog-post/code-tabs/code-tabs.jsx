import PropTypes from 'prop-types';

import highlight from 'lib/shiki';

import CodeTabsNavigation from './code-tabs-navigation';

const CodeTabs = async ({ items }) => {
  let highlightedItems = [];

  try {
    highlightedItems = await Promise.all(
      items.map(async (item) => {
        const highlightedCode = await highlight(item.code, item.language, 'github-dark');

        return highlightedCode;
      })
    );
  } catch (error) {
    console.error('Error highlighting code:', error);
  }

  return (
    <figure className="my-5 max-w-full overflow-hidden rounded-md bg-black-new">
      <CodeTabsNavigation items={items} highlightedItems={highlightedItems} />
    </figure>
  );
};

CodeTabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      language: PropTypes.string,
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CodeTabs;
