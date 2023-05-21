'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import CheckIcon from './images/check.inline.svg';
import CopyIcon from './images/copy.inline.svg';

const DEFAULT_LANGUAGE = 'bash';

const CodeBlock = ({
  className = null,
  children,
  showLineNumbers = false,
  shouldWrap = false,
  ...otherProps
}) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : DEFAULT_LANGUAGE;
  const code =
    typeof children === 'string' ? children?.trim() : children.props?.children.props.children;

  return (
    <div className={clsx('group relative', { 'code-wrap': shouldWrap }, className)} {...otherProps}>
      <SyntaxHighlighter
        language={language}
        useInlineStyles={false}
        showLineNumbers={showLineNumbers}
        className="no-scrollbars"
      >
        {code}
      </SyntaxHighlighter>
      <button
        className="invisible absolute right-2 top-2 rounded border border-gray-6 bg-white p-1.5 text-gray-2 opacity-0 transition-[background-color,opacity,visibility] duration-200 hover:bg-gray-7 group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-black dark:text-gray-8 lg:visible lg:opacity-100"
        type="button"
        disabled={isCopied}
        onClick={() => handleCopy(code)}
      >
        {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon />}
      </button>
    </div>
  );
};

CodeBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  showLineNumbers: PropTypes.bool,
  shouldWrap: PropTypes.bool,
};

export default CodeBlock;
