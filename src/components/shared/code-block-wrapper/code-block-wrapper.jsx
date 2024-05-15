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

  // Check if the node is an object and has the required properties.
  if (typeof node === 'object' && node.props && node.props.children) {
    let text = '';

    // If the children are in an array, loop through them.
    if (Array.isArray(node.props.children)) {
      node.props.children.forEach((child) => {
        text += extractTextFromNode(child);
      });
    } else {
      // If there's only one child, process that child directly.
      text = extractTextFromNode(node.props.children);
    }

    return text;
  }

  // If the node doesn't match the expected structure, return an empty string.
  return '';
}

const CodeBlockWrapper = ({
  className = '',
  copyButtonClassName = '',
  children,
  as: Tag = 'figure',
  ...otherProps
}) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const code = extractTextFromNode(children);

  return (
    <Tag className={clsx('code-block group relative', className)} {...otherProps}>
      {children}
      <button
        className={clsx(
          'invisible absolute right-2 top-2 rounded p-1.5 text-gray-new-80 opacity-0 transition-[background-color,opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-gray-new-10 dark:text-gray-8 lg:visible lg:opacity-100',
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
    </Tag>
  );
};

export default CodeBlockWrapper;

CodeBlockWrapper.propTypes = {
  className: PropTypes.string,
  copyButtonClassName: PropTypes.string,
  children: PropTypes.node,
  as: PropTypes.string,
};
