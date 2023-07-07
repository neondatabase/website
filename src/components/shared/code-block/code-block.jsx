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
  theme = 'dark',
  language = null,
  children,
  showLineNumbers = false,
  shouldWrap = false,
  isTrimmed = true,
  ...otherProps
}) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const match = /language-(\w+)/.exec(className || '');
  const snippetLanguage = (match ? match[1] : language) || DEFAULT_LANGUAGE;

  const code = typeof children === 'string' ? children : children?.props?.children.props.children;

  const content = isTrimmed ? code?.trim() : code;

  return (
    <figure
      className={clsx('group relative', { 'code-wrap': shouldWrap }, className)}
      {...otherProps}
    >
      <SyntaxHighlighter
        language={snippetLanguage}
        useInlineStyles={false}
        showLineNumbers={showLineNumbers}
        className="no-scrollbars"
      >
        {content}
      </SyntaxHighlighter>
      <button
        className={clsx(
          'invisible absolute right-2 top-2 rounded border p-1.5 opacity-0 transition-[background-color,opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-black dark:text-gray-8 lg:visible lg:opacity-100',
          theme === 'dark'
            ? 'border-transparent bg-gray-new-15 text-white'
            : 'border-gray-6 bg-white text-gray-2 hover:bg-gray-7'
        )}
        type="button"
        aria-label={isCopied ? 'Copied' : 'Copy'}
        disabled={isCopied}
        onClick={() => handleCopy(content)}
      >
        {isCopied ? (
          <CheckIcon className="h-4 w-4 text-current" />
        ) : (
          <CopyIcon className="text-current" />
        )}
      </button>
    </figure>
  );
};

CodeBlock.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  language: PropTypes.string,
  children: PropTypes.node,
  showLineNumbers: PropTypes.bool,
  shouldWrap: PropTypes.bool,
  isTrimmed: PropTypes.bool,
};

export default CodeBlock;
