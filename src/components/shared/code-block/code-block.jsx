'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vsDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import CheckIcon from './images/check.inline.svg';
import CopyIcon from './images/copy.inline.svg';

const DEFAULT_LANGUAGE = 'bash';

function parseHighlightRanges(highlight) {
  const ranges = highlight.split(',');
  let highlightedLines = [];

  ranges.forEach((range) => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      const rangeLines = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      highlightedLines = [...highlightedLines, ...rangeLines];
    } else {
      highlightedLines.push(Number(range));
    }
  });

  return highlightedLines;
}

const CodeBlock = ({
  className = null,
  theme = 'dark',
  language = null,
  children,
  showLineNumbers = false,
  shouldWrap = false,
  isTrimmed = true,
  highlight = '',
  ...otherProps
}) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const match = /language-(\w+)/.exec(className || '');
  const snippetLanguage = (match ? match[1] : language) || DEFAULT_LANGUAGE;

  const code = typeof children === 'string' ? children : children?.props?.children.props.children;

  const content = isTrimmed ? code?.trim() : code;

  const highlightedLines = parseHighlightRanges(highlight);

  return (
    <figure
      className={clsx('group relative', { 'code-wrap': shouldWrap }, className)}
      {...otherProps}
    >
      <SyntaxHighlighter
        language={snippetLanguage}
        useInlineStyles={false}
        style={vsDark}
        showLineNumbers={showLineNumbers || highlight !== ''}
        className="no-scrollbars"
        lineProps={(lineNumber) => ({
          // class: `relative block -mx-4 pl-4 py-[5px] pr-4 ${highlightedLines.includes(lineNumber) ? 'dark:bg-green-45 bg-opacity-[0.08] dark:bg-opacity-[0.08] after:absolute after:w-[3px] after:h-full after:top-0 after:left-0 after:bg-secondary-8 dark:after:bg-green-45 bg-secondary-8' : ''}`,
          class: clsx(
            'relative block -mx-4 pl-4 py-[2px] pr-4',
            highlightedLines.includes(lineNumber)
              ? 'dark:bg-green-45 bg-opacity-[0.08] dark:bg-opacity-[0.08] after:absolute after:w-[3px] after:h-full after:top-0 after:left-0 after:bg-secondary-8 dark:after:bg-green-45 bg-secondary-8'
              : ''
          ),
        })}
        wrapLines={highlight !== ''}
      >
        {content}
      </SyntaxHighlighter>
      <button
        className={clsx(
          'invisible absolute right-2 top-2 rounded border bg-white p-1.5 text-gray-2 opacity-0 transition-[background-color,opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 dark:border-gray-3 dark:bg-black dark:text-gray-8 lg:visible lg:opacity-100',
          theme === 'dark'
            ? 'border-gray-6 bg-gray-new-15 text-gray-2'
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
  highlight: PropTypes.string,
};

export default CodeBlock;
