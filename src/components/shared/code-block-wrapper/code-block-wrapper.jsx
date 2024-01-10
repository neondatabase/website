'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import CheckIcon from './images/check.inline.svg';
import CopyIcon from './images/copy.inline.svg';

function extractTextFromNode(node) {
  // Base case: if the node is a string, return it.
  if (typeof node === 'string') {
    return node;
  }

  // If the node has a 'props' and 'children' property, delve deeper.
  if (node.props && node.props.children) {
    if (Array.isArray(node.props.children)) {
      // If the children are in an array, loop through them and recursively extract their text.
      return node.props.children.map(extractTextFromNode).join('');
    }
    // If there's only one child, process that child directly.
    return extractTextFromNode(node.props.children);
  }

  if (node.props && node.props.dangerouslySetInnerHTML) {
    const html = node.props.dangerouslySetInnerHTML.__html;

    const convertedHtml = html
      .replace(/<[^>]*>?/gm, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    return convertedHtml;
  }

  // If the node doesn't have children or isn't a string, return an empty string.
  return '';
}

const CodeBlockWrapper = ({ className = '', copyButtonClassName = '', children }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const code = extractTextFromNode(children);

  return (
    <div className={clsx('group relative overflow-x-auto', className)}>
      {children}
      <button
        className={clsx(
          'invisible absolute right-2 top-2 rounded border border-gray-6 bg-white p-1.5 text-gray-2 opacity-0 transition-[background-color,opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-black dark:text-gray-8 lg:visible lg:opacity-100',
          copyButtonClassName
        )}
        type="button"
        aria-label={isCopied ? 'Copied' : 'Copy'}
        disabled={isCopied}
        onClick={() => handleCopy(code)}
      >
        {isCopied ? (
          <CheckIcon className="h-4 w-4 text-current" />
        ) : (
          <CopyIcon className="text-current" />
        )}
      </button>
    </div>
  );
};

export default CodeBlockWrapper;

CodeBlockWrapper.propTypes = {
  className: PropTypes.string,
  copyButtonClassName: PropTypes.string,
  children: PropTypes.node,
};
