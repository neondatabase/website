'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import CheckIcon from './images/check.inline.svg';
import CopyIcon from './images/copy.inline.svg';

function extractTextFromNode(node) {
  // Base case: if the node is a string, return it.
  if (typeof node === 'string') return node;

  // Check if the node is an object and has the required properties.
  if (typeof node !== 'object' || !node.props || !node.props.children) return '';

  // Skip removed lines of code from differences
  if (node.props.className?.includes('remove')) return '__line_removed_in_code__';

  // If the children are in an array, loop through them.
  if (Array.isArray(node.props.children)) {
    let text = '';
    node.props.children.forEach((child) => {
      text += extractTextFromNode(child);
    });
    return text;
  }

  // If there's only one child, process that child directly.
  return extractTextFromNode(node.props.children);
}

const CodeBlockWrapper = ({
  className = '',
  copyButtonClassName = '',
  children,
  as: Tag = 'figure',
  ...otherProps
}) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const code = extractTextFromNode(children).replace(/(\n)?__line_removed_in_code__(\n)?/g, '');

  return (
    <Tag
      className={clsx('code-block group relative flex [&_pre]:min-w-full', className)}
      {...otherProps}
    >
      {children}
      <button
        className={clsx(
          'invisible absolute right-2 top-2 rounded border border-gray-7 bg-gray-9 p-1.5  text-gray-new-80 opacity-0 transition-[background-color,opacity,visibility] duration-200 hover:bg-white group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-gray-new-10 dark:text-gray-8 dark:hover:bg-gray-new-8 lg:visible lg:opacity-100',
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
