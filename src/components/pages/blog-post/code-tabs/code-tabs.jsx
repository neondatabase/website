import PropTypes from 'prop-types';
import { Children, isValidElement } from 'react';

import { getHighlightedCodeArray } from 'lib/shiki';

import CodeTabsNavigation from './code-tabs-navigation';

const getNormalizedLabels = (labels) => {
  if (Array.isArray(labels)) {
    return labels;
  }

  if (typeof labels === 'string') {
    try {
      const parsedLabels = JSON.parse(labels);
      if (Array.isArray(parsedLabels)) {
        return parsedLabels;
      }
    } catch {
      // Fall back to comma-separated labels below.
    }

    return labels
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean);
  }

  if (labels && typeof labels === 'object') {
    return Object.values(labels).filter((label) => typeof label === 'string');
  }

  return [];
};

const getCodeBlockProps = (child) => {
  if (!isValidElement(child)) {
    return {};
  }

  const codeElement = isValidElement(child.props?.children) ? child.props.children : null;
  const code = codeElement?.props?.children ?? child.props?.children ?? '';
  const className =
    codeElement?.props?.className ||
    codeElement?.props?.class ||
    child.props?.className ||
    child.props?.class ||
    '';
  const languageMatch = className.match(/language-([a-z0-9-]+)/i);

  return {
    code: typeof code === 'string' ? code.replace(/\n+$/u, '') : code,
    language: languageMatch ? languageMatch[1] : 'bash',
  };
};

const getItemsFromChildren = ({ labels = [], children }) => {
  const normalizedLabels = getNormalizedLabels(labels);

  return Children.toArray(children)
    .filter(isValidElement)
    .map((child) => getCodeBlockProps(child))
    .filter((item) => item.code !== '')
    .map((item, index) => ({
      label: normalizedLabels[index] || `Tab ${index + 1}`,
      ...item,
    }));
};

const CodeTabs = async ({ items = null, labels = [], reverse = false, children = null }) => {
  const normalizedItems = items?.length ? items : getItemsFromChildren({ labels, children });
  const displayedItems = reverse ? [...normalizedItems].reverse() : normalizedItems;
  const highlightedItems = await getHighlightedCodeArray(displayedItems);

  if (!displayedItems.length) {
    return null;
  }

  return (
    <figure className="my-5 max-w-full overflow-hidden bg-black-pure">
      <CodeTabsNavigation items={displayedItems} highlightedItems={highlightedItems} />
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
  ),
  labels: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.object,
  ]),
  reverse: PropTypes.bool,
  children: PropTypes.node,
};

export default CodeTabs;
