import PropTypes from 'prop-types';

import { getHighlightedCodeArray } from 'lib/shiki';

import CodeTabsNavigation from './code-tabs-navigation';

const CodeTabs = async ({ items }) => {
  const highlightedItems = await getHighlightedCodeArray(items);

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
      code: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    })
  ).isRequired,
};

export default CodeTabs;
